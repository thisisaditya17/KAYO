from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

loader = PyPDFLoader("Research essay A0284714Y.pdf")
documents = loader.load()

#print(documents)

textSplitting = RecursiveCharacterTextSplitter(
    chunk_size = 500, chunk_overlap = 0, 
    length_function = len, is_separator_regex = False
)

chunks = textSplitting.split_documents(documents)
#for chunk in chunks: 
print(chunks[3].page_content + "\n")

from sentence_transformers import SentenceTransformer

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

embeddings = model.encode(chunks[3].page_content, show_progress_bar=True)

print(embeddings)


