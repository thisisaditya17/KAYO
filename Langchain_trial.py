from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import numpy
import faiss

loader = PyPDFLoader("Research essay A0284714Y.pdf")
documents = loader.load()

#print(documents)

textSplitting = RecursiveCharacterTextSplitter(
    chunk_size = 500, chunk_overlap = 0, 
    length_function = len, is_separator_regex = False
)

chunks = textSplitting.split_documents(documents)

print(chunks[3])

#chunks_texts = [chunk['text'] for chunk in chunks]

'''
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

embeddings = embedding_model.encode(chunks_texts, show_progress_bar=True)

embeddings_np = numpy.array(embeddings).astype('float32')

query = "Tell me about tourism in Singapore"

query_embedding = model.encode(query, show_progress_bar=True)

query_embedding_np = numpy.array(query_embedding).astype('float32')

nearest_neighbours = 5

dimension = embeddings_np.shape[1]

index = faiss.IndexFlatL2(dim)

index.add(embeddings_np)

distance, indices = index.search(query_embedding_np, nearest_neighbours)

print(distance)

print("Indices: ", indices)

'''