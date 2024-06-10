from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for particular route
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configuration for the Google Generative AI API
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found in environment variables.")
genai.configure(api_key=api_key)
llm = genai.GenerativeModel('gemini-1.5-pro')

# Embedding model
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    prompt = request.form.get('prompt')
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    processed_data = process_file(filepath,prompt)
    return jsonify({"processed_content":processed_data})
    
    # Process the file (edit it)
    #edited_filepath = process_file(filepath)
    #just take the data from the uploads/ whatever thing and use it 
    #then put processed data here


def process_file(filepath, query):
    # Dummy function to simulate file processing
    # In practice, you would edit the file as needed

    #Load the document
    loader = PyPDFLoader(filepath)
    documents = loader.load()

    # Split the text into chunks with overlap
    text_splitting = RecursiveCharacterTextSplitter(
        chunk_size=800, chunk_overlap=100, 
        length_function=len, is_separator_regex=False
    )
    chunks = text_splitting.split_documents(documents)

    # Embed the chunks
    chunk_texts = [chunk.page_content for chunk in chunks]
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
    prompt = " Please answer the following question in context of the provided text:\n"
    prompt += "Question: " + query + "\n"
    for i in range(len(indices)) :
        for rank in range(nearest_neighbours):
            chunk_index = indices[i][rank]
            similarity = similarity_scores[rank]
            chunk_text = chunks[chunk_index]
            prompt += "Context: " + chunk_text.page_content + "\n"
    
    reponse = llm.generate_content(prompt)
    edited_filepath = filepath.replace('uploads', 'processed')
    os.makedirs(os.path.dirname(edited_filepath), exist_ok=True)
    with open(edited_filepath, 'w') as f:
        f.write(str(reponse))  # Example modification: converting content to uppercase
    return str(reponse._result.candidates[0].content.parts[0].text)

if __name__ == '__main__':
    app.run(port=5001, debug=True)