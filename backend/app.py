# backend/app.py

# SECTION 1: Imports
from flask import Flask, request, jsonify
import numpy as np
from PIL import Image
from io import BytesIO
from ultralytics import YOLO
from flask_cors import CORS

# SECTION 2: Master Configuration
TARGET_CLASSES = {
    'Caries': (255, 255, 255), 'Bone Loss': (255, 0, 0), 'Cyst': (255, 255, 0),
    'impacted tooth': (128, 0, 128), 'Missing teeth': (0, 0, 255), 'Supra Eruption': (0, 255, 0),
    'attrition': (255, 192, 203), 'Malaligned': (165, 42, 42), 'Root resorption': (0, 0, 0),
    'Periapical lesion': (255, 219, 88), 'bone defect': (139, 0, 0), 'Fracture teeth': (128, 128, 128),
    'Crown': (0, 100, 0), 'Implant': (128, 0, 0), 'Root Canal Treatment': (255, 220, 177),
    'Filling': (238, 130, 238), 'Primary teeth': (0, 0, 128), 'Retained root': (0, 128, 128)
}
DISPLAY_NAMES = {
    'Caries': 'Dental caries', 'Bone Loss': 'Bone Loss', 'Cyst': 'Cyst', 'impacted tooth': 'Impacted teeth',
    'Missing teeth': 'Missing teeth', 'Supra Eruption': 'Supernumerary teeth', 'attrition': 'Abrasion',
    'Malaligned': 'Spacing', 'Root resorption': 'Root resorption', 'Periapical lesion': 'Periapical pathology',
    'bone defect': 'Bone fracture', 'Fracture teeth': 'Tooth fracture', 'Crown': 'Crowns',
    'Implant': 'Implants', 'Root Canal Treatment': 'RCT tooth', 'Filling': 'Restorations',
    'Primary teeth': 'Retained deciduous tooth', 'Retained root': 'Root stump'
}
CLASS_NAMES_MODEL2 = [
    "AGS Medikal Implant Fixture", "AMerOss Bone Graft Material", "Amalgam Tooth Filling",
    "Anthogyr Implant Fixture", "Bicon Implant Fixture", "BioHorizons Titanium Implant",
    "BioLife Bone Graft Material", "Biomet 3i Implant System", "Blue Sky Bio Implant",
    "Camlog Implant System", "Dental Caries Lesion", "Composite Tooth Filling",
    "Cowellmedi Implant System", "Dental Crown Restoration", "Dentsply Implant Component",
    "Dentatus Narrow Implants", "Dentis Implant Fixture", "Dentium Implant System",
    "Euroteknika Implant System", "Tooth Filling", "Frontier Dental Implant",
    "Hiossen Implant Fixture", "Implant Direct System", "Keystone Dental Implant",
    "Leone Implant Fixture", "Mandibular Region", "Maxillary Region", "Megagen Implant System",
    "Neodent Implant System", "Neoss Implant Fixture", "Nobel Biocare Dental Implant",
    "Novodent Implant Fixture", "NucleOSS Implant Fixture", "Osseolink Implant Fixture",
    "Osstem Dental Implant", "Prefabricated Dental Post", "Retained Tooth Root",
    "Root Canal Filling", "Root Canal Obturation", "Sterngold Mini Implants",
    "Straumann Tissue-Level Implant", "Titan Implant Fixture", "Zimmer Dental Implant"
]

# SECTION 3: Initialize Flask App and Load Model
app = Flask(__name__)
CORS(app)

# Load model once when the server starts for efficiency
try:
    model2 = YOLO('best2.pt')
except Exception as e:
    print(f"CRITICAL ERROR: Could not load model. {e}")
    model2 = None

# SECTION 4: The Core Inference Logic
def run_real_inference(image_np, model2):
    detection_info = []
    
    # Process Model2 results
    results2 = model2(image_np)[0]
    for box in results2.boxes.cpu().numpy():
        cls = int(box.cls[0])
        class_name = CLASS_NAMES_MODEL2[cls] if cls < len(CLASS_NAMES_MODEL2) else f"Unknown {cls}"
        confidence = float(box.conf[0])
        
        mapped_name = None
        if 'Dental Caries Lesion' in class_name: mapped_name = 'Caries'
        elif 'Dental Crown Restoration' in class_name: mapped_name = 'Crown'
        elif any(word in class_name for word in ['Implant', 'implant']): mapped_name = 'Implant'
        elif class_name in ['Amalgam Tooth Filling', 'Composite Tooth Filling', 'Tooth Filling']: mapped_name = 'Filling'
        elif class_name in ['Root Canal Filling', 'Root Canal Obturation']: mapped_name = 'Root Canal Treatment'
        elif 'Retained Tooth Root' in class_name: mapped_name = 'Retained root'
        
        if mapped_name and mapped_name in TARGET_CLASSES:
            detection_info.append({
                'class': mapped_name,
                'confidence': confidence,
                'bbox': [int(coord) for coord in box.xyxy[0]],
                'display_name': DISPLAY_NAMES.get(mapped_name, mapped_name)
            })
            
    return detection_info

# SECTION 5: Create the API Endpoint
# SECTION 5: Create the API Endpoint
@app.route('/predict', methods=['POST'])
def predict():
    print("\n--- NEW REQUEST RECEIVED ---") # New
    if not model2:
        print("ERROR: Model is not loaded.") # New
        return jsonify({"error": "Model is not loaded, check server logs."}), 500
        
    if 'file' not in request.files:
        print("ERROR: No file found in request.") # New
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    print(f"Received file: {file.filename}") # New
    
    # Convert file to the format needed by the model
    image_bytes = file.read()
    pil_image = Image.open(BytesIO(image_bytes)).convert("RGB")
    numpy_image = np.array(pil_image)

    # Run the inference function
    print("Running inference...") # New
    detections = run_real_inference(numpy_image, model2)
    
    # --- THIS IS THE MOST IMPORTANT PART ---
    # We will check if the 'detections' list is empty.
    if not detections:
        print("RESULT: The run_real_inference function returned an EMPTY list. No findings to send.") # New
    else:
        print(f"RESULT: Found {len(detections)} findings. Sending to frontend.") # New
    
    # Return the results as JSON
    return jsonify(detections)

# SECTION 6: Make the Server Runnable
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)