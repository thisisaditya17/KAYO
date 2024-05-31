from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Process the file (edit it)
    #edited_filepath = process_file(filepath)
    #just take the data from the uploads/ whatever thing and use it 
    #then put processed data here
    return jsonify({"processed_content":"put processed data here"})

def process_file(filepath):
    # Dummy function to simulate file processing
    # In practice, you would edit the file as needed
    edited_filepath = filepath.replace('uploads', 'processed')
    os.makedirs(os.path.dirname(edited_filepath), exist_ok=True)
    with open(filepath, 'r') as f:
        content = f.read()
        print("hello")
        print(content)
    with open(edited_filepath, 'w') as f:
        f.write(content.upper())  # Example modification: converting content to uppercase
    return edited_filepath

if __name__ == '__main__':
    app.run(debug=True)