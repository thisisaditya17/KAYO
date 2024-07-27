
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
    pip install faiss-cpu==1.8.0 flask==3.0.3 flask_cors==4.0.1 google-generativeai==0.7.2 langchain==0.2.11 langchain-community==0.2.10 langchainhub==0.1.20 langchain_core==0.2.24 langchain_google_genai==1.0.8 numpy==1.26.4 protobuf==4.25.4 pymongo==4.8.0 python-dotenv==1.0.1 sentence_transformers==3.0.1 textract==1.6.5
    ```

### 3. Set Up Node.js Environment
1. Navigate to the frontend directory:
    ```bash
    cd OrbitalKAYO
    ```
2. Install the required Node.js packages:
    ```bash
    npm install cors flask axios chakra vite --save-dev jest @testing-library/react @testing-library/jest-dom @emailjs/browser
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
    # Ensure you're in the OrbitalKAYO directory
    npm run dev
    ```

## Running the RAG Check
1. **Run the RAG_1.py file** to check if Retrieval-Augmented Generation (RAG) works fine:
    ```bash
    python RAG_1.py
    ```
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


