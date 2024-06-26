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

   #return client['user_shopping_list']
uri = "mongodb+srv://arnavmalhotra:LO22V321DrzXu3L9@trialserver.ynfu9nv.mongodb.net/?appName=TrialServer"
def getDatabase():
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))
    
    print("made database")
    return client['userUploadedData']

dbname = getDatabase()
collection_name = dbname["userItems"]
    # Send a ping to confirm a successful connection
app = Flask(__name__)
CORS(app)  # Enable CORS for particular route
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configuration for the Google Generative AI API
api_key = "AIzaSyADAsholuvCPecxj8W9zj-TkZ431vtSMTc"
if not api_key:
    raise ValueError("API key not found in environment variables.")
genai.configure(api_key=api_key)
llm = genai.GenerativeModel('gemini-1.5-pro')

# Embedding model
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


@app.route('/upload', methods=['POST'])
def askQuestion_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    prompt = request.form.get('prompt')
    if file.filename == '':
        return 'No selected file', 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    loader = PyPDFLoader(filepath)
    documents = loader.load()

    # Split the text into chunks with overlap
    text_splitting = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=100, 
        length_function=len, is_separator_regex=False
    )
    chunks = text_splitting.split_documents(documents)
    chunk_texts = [chunk.page_content for chunk in chunks]
    newList = []
    for i in chunk_texts:
        newList.append({"content":i})
    collection_name.insert_many(newList)


    return jsonify({"processed_content":"sent content"})

@app.route('/askQuestion', methods=['POST'])
def process_file():
    data = request.get_json()
    query= data.get('stringData')

    # Access the prompt part
    chunk_textQueried = collection_name.find()
    chunk_texts = []
    for i in chunk_textQueried:
        chunk_texts.append(i["content"])
    embeddings = embedding_model.encode(chunk_texts, show_progress_bar=False)
    embeddings_np = np.array(embeddings).astype('float32')

    # Indexing using FAISS
    dimension = embeddings_np.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings_np)

    #query embedding
    query_embedding = embedding_model.encode(query, show_progress_bar=False)
    query_embedding_np = np.array([query_embedding]).astype('float32')
    nearest_neighbours = 5
    distance, indices = index.search(query_embedding_np, nearest_neighbours)
    similarity_scores = [1 / (1 + dist) for dist in distance[0]]

    #reposnse 
    print(query)
    prompt = " Please answer the following question in context of the provided text:\n"
    prompt += "Question: " + query + "\n"
    for i in range(len(indices)) :
        for rank in range(nearest_neighbours):
            chunk_index = indices[i][rank]
            similarity = similarity_scores[rank]
            chunk_text = chunk_texts[chunk_index]
            prompt += "Context: " + chunk_text + "\n"
    
    reponse = llm.generate_content(prompt)
    
    return str(reponse._result.candidates[0].content.parts[0].text)
dbname = getDatabase()
if __name__ == '__main__':
    app.run(port=5000, debug=True)
