
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
        .\venv\Scripts\Activate.ps1
        ```
    - **Mac/Linux:**
        ```bash
        source .venv/bin/activate
        ```
3. Install the required Python packages:
    ```bash
    pip install python-dotenv langchain langchain_community faiss-cpu -U sentence-transformers google-generativeai flask flask-cors
    ```

### 3. Set Up Node.js Environment
1. Navigate to the frontend directory:
    ```bash
    cd OrbitalKAYO
    ```
2. Install the required Node.js packages:
    ```bash
    npm install cors flask axios chakra vite
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

## Contact
For any inquiries or issues, please contact 
[Aditya](joshi.adi1734@gmail.com)
[Arnav](arnav.malhotra20003@gmail.com)


