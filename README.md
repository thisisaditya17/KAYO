
# KAYO

**KAYO** is a web-based platform designed to enhance the accuracy and reliability of AI models like ChatGPT in processing and extracting relevant information from documents. This system is particularly useful in academic, research, and professional settings, providing users with precise and reliable answers to their queries by minimizing hallucinations and irrelevant outputs.

## Features
- Accurate information extraction
- Reduced AI hallucinations
- Reliable query responses
- Suitable for academic, research, and professional use

## Prerequisites
- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/)

## How to Run the Project

### 1. Clone the Repository
```bash
git clone https://github.com/thisisaditya17/KAYO.git
cd KAYO
```

### 2. Set Up Python Environment
1. Create a virtual environment:
    ```bash
    python -m venv .venv
    ```
2. Activate the virtual environment:
    - **Windows:**
        ```bash
        .venv\Scripts\Activate.ps1
        ```
    - **Mac/Linux:**
        ```bash
        source .venv/bin/activate
        ```
    If this issue shows up ".venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system". Execute this on command line.
        ```bash
        Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
        ```
3. Create an environment file to store the api key
    1. Create a **.env** file
    2. Generate an API key from [GoogleAI for developers](https://ai.google.dev/gemini-api/docs/api-key)
    3. Write GENAI_API_KEY="your api key"
    4. Add another new API key as GENAI_2ND_KEY="other api key"
    5. If you still face the issue, try
        - **Windows:**
            ```bash
            $env:GENAI_API_KEY="your_generated_api_key"
            ```
        - **Mac/Linux:**
            ```bash
            export GENAI_API_KEY="your_generated_api_key"
            ```

4. Install the required Python packages:
    ```bash
    pip install python-dotenv langchain langchain_community faiss-cpu -U sentence-transformers google-generativeai flask flask-cors pymongo textract langchain_core langchain_google_genai langchainhub
    ```

### 3. Set Up Node.js Environment
1. Navigate to the frontend directory:
    ```bash
    cd OrbitalKAYO
    ```
2. Install the required Node.js packages:
    ```bash
    npm install cors flask axios chakra vite dom --save-dev jest @testing-library/react @testing-library/jest-dom @emailjs/browser jest-environment-jsdom
    ```

## Usage
1. **Start the backend server**:
    ```bash
    # Ensure you're in the KAYO directory
    # Activate the virtual environment if not already activated
    python app.py
    ```
2. **Start the frontend server**:
    ```bash
    #Ensure you're in the OrbitalKAYO directory
    npm run dev
    ```

## Running the tests
1. **For running tests:**
    ```bash
    #Ensure you are in the OrbitalKAYO directory
    npm run test
    ```
    It should be 2 Test suites consisting of 11 tests.
    
## Running the Jupyter Trial
- To debug the RAG, run Jupyter **trial.ipynb**
1. **Install Jupyter Notebook** (if not already installed):
    ```bash
    pip install jupyter
    ```
2. **Start Jupyter Notebook**:
    ```bash
    jupyter notebook
    ```
3. **Open and run the trial notebook**: 
    - Navigate to the Jupyter trial file and run the cells to ensure the system works as expected.


## Contact
For any inquiries or issues, please contact 
[Aditya](joshi.adi1734@gmail.com)
[Arnav](arnav.malhotra20003@gmail.com)


