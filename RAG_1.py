# %%
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("Research essay A0284714Y.pdf")

documents = loader.load()


# %%
from langchain.text_splitter import RecursiveCharacterTextSplitter

textSplitting = RecursiveCharacterTextSplitter(
    chunk_size = 800, chunk_overlap = 0, 
    length_function = len, is_separator_regex = False
)

chunks = textSplitting.split_documents(documents)

print(len(chunks))

# %%
from sentence_transformers import SentenceTransformer
import numpy


embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

chunk_texts = [chunk.page_content for chunk in chunks]

embeddings = embedding_model.encode(chunk_texts, show_progress_bar=True)



embeddings_np = numpy.array(embeddings).astype('float32') #fass takes in 




# %%
import faiss #facebook ai similarity search 

query = "Relations between India and Singapore"

query_embedding = embedding_model.encode(query, show_progress_bar=True)

query_embedding_np = numpy.array([query_embedding]).astype('float32')

nearest_neighbours = 5

dimension = embeddings_np.shape[1]

index = faiss.IndexFlatL2(dimension)
 
index.add(embeddings_np)

distance, indices = index.search(query_embedding_np, nearest_neighbours)

#The lower the distance, the more similar the chunk is to your query.
#hese are the positions of the most similar chunks within your original chunks list

print("Distance: ", distance)


print("Indices: ", indices)

similarity_scores = [ 1 / (1 + dist) for dist in distance[0] ]

print("Similarity scores: ", similarity_scores)


# %%
#Retrieving the chunks using distance and indices

for i in range(len(indices)) :
    for rank in range(nearest_neighbours):
        chunk_index = indices[i][rank]
        similarity = similarity_scores[rank]
        chunk_text = chunks[chunk_index]
        print(f"Rank {rank+1}: {chunk_text.page_content} with similarity {similarity}")
        

# %%
#LLM 
import os
import google.generativeai as genai

api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found in environment variables.")

genai.configure(api_key=api_key)

llm = genai.GenerativeModel('gemini-1.5-pro')



# %%
for i in range(len(indices)) :
    for rank in range(nearest_neighbours):
        chunk_index = indices[i][rank]
        similarity = similarity_scores[rank]
        chunk_text = chunks[chunk_index]

        prompt = f""" Please answer the following question in context of the provided text:
        Question: {query} 

        Text: Rank {rank+1}: {chunk_text.page_content} | with similarity score = {similarity}
        """
response = llm.generate_content(prompt)

print(response)

