

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

load_dotenv()
api_key = "AIzaSyADAsholuvCPecxj8W9zj-TkZ431vtSMTc"
llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash', google_api_key=api_key)
text = textract.process("test.txt")
text = text.decode('utf-8')
obj = hub.pull("wfh/proposal-indexing")

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

from sentence_transformers import SentenceTransformer
import numpy


embedding_model = SentenceTransformer('Snowflake/snowflake-arctic-embed-l')
embeddings = embedding_model.encode(text_propositions, show_progress_bar=True)
embeddings_np = numpy.array(embeddings).astype('float32')

query = "Relations between India and Singapore"

def retrieve(query, nearest_neighbours=5):

    dimension = embeddings_np.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings_np)

    query_embedding = embedding_model.encode(query, show_progress_bar=True)
    query_embedding_np = numpy.array([query_embedding]).astype('float32')
    distance, indices = index.search(query_embedding_np, nearest_neighbours)

    contexts = []
    for i in range(len(indices[0])):
        chunk_index = indices[0][i]
        similarity = 1 / (1 + distance[0][i])
        chunk_text = text_propositions[chunk_index]
        contexts.append(f"Rank {i+1}: {chunk_text} | Similarity: {similarity:.4f}")

    return "\n\n".join(contexts)

retrieved_context = retrieve(query)

prompt_template = ChatPromptTemplate.from_template("""
Answer the following question based on the provided context:

Question: {question}

Context: {context}

Provide relevant answers to the question based on the context.
Don’t justify your answers.
Don’t give information not mentioned in the CONTEXT INFORMATION.
Do not say "according to the context" or "mentioned in the context" or similar.
""")

prompt = prompt_template.format(context=retrieved_context, question=query)
print(prompt)

api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found in environment variables.")

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
print(response.text)



