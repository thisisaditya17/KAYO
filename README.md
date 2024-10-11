# KAYO

**KAYO** is a web-based platform designed to enhance the accuracy and reliability of AI models like ChatGPT in processing and extracting relevant information from documents. This system is particularly useful in academic, research, and professional settings, providing users with precise and reliable answers to their queries by minimizing hallucinations and irrelevant outputs.

## Features
- Accurate information extraction
- Reduced AI hallucinations
- Reliable query responses
- Suitable for academic, research, and professional use

Documentation link for KAYO: [Documentation](https://docs.google.com/document/d/1yDoQwExPGX44d3oOyRDdck30Ket5GX5nVnifOyqAVz0/edit?tab=t.0)

## Prerequisites
- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Note
Currently, KAYO is not fully functional because the MongoDB server URI has been removed. You will need to provide your own MongoDB URI in the `.env` file.

### MongoDB URI Setup
1. Create a **.env** file in the project root.
2. Add your MongoDB URI to the **.env** file as follows:
    ```bash
    MONGO_URI="your_mongodb_uri"
    ```

Make sure your MongoDB instance is accessible and running properly.

## How to Run the Project

### 1. Clone the Repository
```bash
git clone https://github.com/thisisaditya17/KAYO.git
cd KAYO
```

### 2. Set Up Python Environment
1. **Create a virtual environment**:
    ```bash
    python -m venv .venv
    ```
2. **Activate the virtual environment**:
    - **Windows**:
        ```bash
        .venv\Scripts\Activate.ps1
        ```
    - **Mac/Linux**:
        ```bash
        source .venv/bin/activate
        ```
    If you encounter the issue ".venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system", execute the following command:
        ```bash
        Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
        ```
3. **Set up environment variables**:
    1. Create a **.env** file.
    2. Generate an API key from [GoogleAI for developers](https://ai.google.dev/gemini-api/docs/api-key).
    3. Add the following to your **.env** file:
        ```bash
        GENAI_API_KEY="your api key"
        GENAI_2ND_KEY="other api key"
        MONGO_URI="your_mongodb_uri"
        ```
    4. If you still face issues, try:
        - **Windows**:
            ```bash
            $env:GENAI_API_KEY="your_generated_api_key"
            ```
        - **Mac/Linux**:
            ```bash
            export GENAI_API_KEY="your_generated_api_key"
            ```

4. **Install the required Python packages**:
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

### 4. MongoDB Connection Issue (Port 27017)
If you're encountering a `Server Selection Timeout Error` while connecting to MongoDB, it might be due to port 27017 being blocked by your ISP or network (e.g., NUS WiFi).

#### Steps to Troubleshoot:
1. **Check if port 27017 is blocked**:
   - Visit [this website](https://portquiz.net:27017/) to see if port 27017 is accessible.
   - If the port is blocked, you may need to change your ISP or connect to a different network that doesn't block port 27017.
2. **Alternative Solutions**:
   - Use a VPN to bypass network restrictions.
   - Contact your network administrator to allow access to the required port.

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

## Running the Tests
1. **Run the tests**:
    ```bash
    # Ensure you're in the OrbitalKAYO directory
    npm run test
    ```
    There should be 2 test suites consisting of 11 tests.

## Running the Jupyter Trial
- To debug the RAG, run the Jupyter **trial.ipynb** notebook.

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
For any inquiries or issues, please contact:
- [Aditya](mailto:joshi.adi1734@gmail.com)
- [Arnav](mailto:arnav.malhotra20003@gmail.com)

--- 
