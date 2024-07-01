
print("#### Proposition-Based Chunking ####")

from langchain.output_parsers import PydanticOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from typing import List
from langchain_core.pydantic_v1 import BaseModel
from langchain import hub
from langchain.document_loaders import PyPDFLoader
import time

obj = hub.pull("wfh/proposal-indexing")
llm = ChatGoogleGenerativeAI(model='gemini-1.5-pro', google_api_key='AIzaSyADAsholuvCPecxj8W9zj-TkZ431vtSMTc')

loader = PyPDFLoader("Research essay A0284714Y.pdf")
documents = loader.load()
text = "\n\n".join([doc.page_content for doc in documents])

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
print(text_propositions)
print(len(text_propositions))

