from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import google.generativeai as genai
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import MongoClient
from langchain.output_parsers import PydanticOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from typing import List
from langchain_core.pydantic_v1 import BaseModel
from langchain import hub
import textract
import time
from dotenv import load_dotenv
import os
import google.generativeai as genai
import faiss 

# return client['user_shopping_list']
uri = "mongodb+srv://arnavmalhotra:LO22V321DrzXu3L9@trialserver.ynfu9nv.mongodb.net/?appName=TrialServer"


def getDatabase():
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi("1"))

    print("made database")
    return client["userUploadedData"]


dbname = getDatabase()
collection_name = dbname["userItems"]
# Send a ping to confirm a successful connection
app = Flask(__name__)
CORS(app, resources={"/upload": {"origins": "http://localhost:5001"}, "/askQuestion": {"origins": "http://localhost:5001"}})
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configuration for the Google Generative AI API
load_dotenv()
api_key = os.getenv('GENAI_2ND_KEY')
llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash', google_api_key=api_key)
obj = hub.pull("wfh/proposal-indexing")


# Embedding model
embedding_model = SentenceTransformer('Snowflake/snowflake-arctic-embed-l')



@app.route("/upload", methods=["POST"])
def askQuestion_file():
    if "file" not in request.files:
        return "No file part", 400
    file = request.files["file"]
    prompt = request.form.get("prompt")
    if file.filename == "":
        return "No selected file", 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    text = textract.process(filepath)
    text = text.decode('utf-8')


    # Split the text into chunks with overlap
    #Proposition Confirguration and Prompts
    class Sentences(BaseModel):
        sentences: List[str]
    parser = PydanticOutputParser(pydantic_object=Sentences)

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an AI assistant that extracts key propositions from text."),
        ("human", "Extract key propositions from the following text:\n\n{text}"),
        ("human", "Format your response as a JSON object with a 'sentences' key containing a list of proposition strings.")
        ])
    chain = LLMChain(llm=llm, prompt=prompt, output_parser=parser)

    def get_propositions(text):
        try:
            result = chain.run(text=text)
            return result.sentences
        except Exception as e:
            print(f"Error in extraction: {e}")
            return []


    paragraphs = text.split("\n\n")
    text_propositions = []

    for i, para in enumerate(paragraphs):
        propositions = get_propositions(para)
        text_propositions.extend(propositions)
        print(f"Done with {i}")
        time.sleep(8)   

    print(f"You have {len(text_propositions)} propositions")
    collection_name.insert_many(text_propositions)

    return jsonify({"processed_content": "sent content"})


@app.route("/askQuestion", methods=["POST"])
def process_file():
    data = request.get_json()
    query = data.get("stringData")

    # Access the prompt part
    chunk_textQueried = collection_name.find()
    chunk_texts = []
    for i in chunk_textQueried:
        chunk_texts.append(i["content"])
    embeddings = embedding_model.encode(chunk_text, show_progress_bar=True)
    embeddings_np = numpy.array(embeddings).astype('float32')

    # Indexing using FAISS
    dimension = embeddings_np.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings_np)

    # query embedding
    query_embedding = embedding_model.encode(query, show_progress_bar=True)
    query_embedding_np = numpy.array([query_embedding]).astype('float32')
    distance, indices = index.search(query_embedding_np, nearest_neighbours)

    contexts = []
    for i in range(len(indices[0])):
        chunk_index = indices[0][i]
        similarity = 1 / (1 + distance[0][i])
        chunk_text = text_propositions[chunk_index]
        contexts.append(f"Rank {i+1}: {chunk_text} | Similarity: {similarity:.4f}")

    context = "\n\n".join(contexts)

    #prompt
    prompt_template = ChatPromptTemplate.from_template("""
    Answer the following question based on the provided context:

    Question: {question}

    Context: {context}

    Provide relevant answers to the question based on the context.
    Don’t justify your answers.
    Don’t give information not mentioned in the CONTEXT INFORMATION.
    Do not say "according to the context" or "mentioned in the context" or similar.
        """)
    prompt = prompt_template.format(context=context, question=query)

    api_key = os.getenv("GENAI_API_KEY")
    genai.configure(api_key=api_key)
    llm = genai.GenerativeModel('gemini-1.5-pro')
    response = llm.generate_content(prompt)

    refined_prompt_template = ChatPromptTemplate.from_template("""The original query is as follows: {query}
    We have provided an existing answer: {existing_answer}
    We have the opportunity to refine the existing answer (only if needed) with some more context below.
    ------------
    {context}
    ------------
    Given the new context, refine the original answer to better answer the query. If the context isn't useful, return the original answer.
    Don't mention Refined Answer
    """)


    refined_prompt = refined_prompt_template.format(query=query, existing_answer=response.text, context=retrieved_context)

    response = llm.generate_content(refined_prompt)

    return str(reponse.text)


dbname = getDatabase()
if __name__ == "__main__":
    app.run(port=5001, debug=True)
