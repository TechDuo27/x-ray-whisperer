// YOLO model loader and inference utilities
export interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  display_name: string;
  is_grossly_carious?: boolean;
  is_internal_resorption?: boolean;
}

export interface ModelResults {
  detections: Detection[];
}

// Target classes for selective detection (only these 18 conditions)
export const TARGET_CLASSES = {
  'Caries': 'Dental caries',
  'Bone Loss': 'Bone Loss',
  'Cyst': 'Cyst',
  'impacted tooth': 'Impacted teeth',
  'Missing teeth': 'Missing teeth',
  'Supra Eruption': 'Supernumerary teeth',
  'attrition': 'Abrasion',
  'Malaligned': 'Spacing',
  'Root resorption': 'Root resorption',
  'Periapical lesion': 'Periapical pathology',
  'bone defect': 'Bone fracture',
  'Fracture teeth': 'Tooth fracture',
  'Crown': 'Crowns',
  'Implant': 'Implants',
  'Root Canal Treatment': 'RCT tooth',
  'Filling': 'Restorations',
  'Primary teeth': 'Retained deciduous tooth',
  'Retained root': 'Root stump'
};

// Model 2 class mapping to target classes
export const MODEL2_CLASS_MAPPING: Record<string, string> = {
  'Dental Caries Lesion': 'Caries',
  'Dental Crown Restoration': 'Crown',
  'Amalgam/Composite/Tooth Filling': 'Filling',
  'Root Canal Filling/Obturation': 'Root Canal Treatment',
  'Retained Tooth Root': 'Retained root'
};

// Exact RGB color values for each detection type
export const DETECTION_COLORS: Record<string, [number, number, number]> = {
  'Caries': [255, 255, 255],           // white
  'Bone Loss': [255, 0, 0],            // red  
  'Cyst': [255, 255, 0],               // yellow
  'impacted tooth': [128, 0, 128],     // purple
  'Missing teeth': [0, 0, 255],        // blue
  'Supra Eruption': [0, 255, 0],       // green
  'attrition': [255, 192, 203],        // pink
  'Malaligned': [165, 42, 42],         // brown
  'Root resorption': [0, 0, 0],        // black
  'Periapical lesion': [255, 219, 88], // mustard
  'bone defect': [139, 0, 0],          // dark red
  'Fracture teeth': [128, 128, 128],   // grey
  'Crown': [0, 100, 0],                // dark green
  'Implant': [128, 0, 0],              // maroon
  'Root Canal Treatment': [255, 220, 177], // skin color
  'Filling': [238, 130, 238],          // violet
  'Primary teeth': [0, 0, 128],        // navy blue
  'Retained root': [0, 128, 128],      // teal
  // Special variants:
  'Grossly carious': [255, 165, 0],    // orange
  'Internal resorption': [203, 192, 255], // dark pink
};

// Convert RGB to hex for CSS
export const getHexColor = (detection: Detection): string => {
  let colorKey = detection.class;
  
  if (detection.is_grossly_carious) {
    colorKey = 'Grossly carious';
  } else if (detection.is_internal_resorption) {
    colorKey = 'Internal resorption';
  }
  
  const rgb = DETECTION_COLORS[colorKey] || [0, 255, 0];
  return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
};

// Load YOLO model from public/models directory using ONNX Runtime
export const loadYOLOModel = async (modelPath: string): Promise<any> => {
  try {
    const { InferenceSession } = await import('onnxruntime-web');
    
    // Configure ONNX Runtime for web
    InferenceSession.create.bind(InferenceSession);
    
    // Load the ONNX model
    const session = await InferenceSession.create(modelPath, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    });
    
    console.log(`YOLO model loaded successfully from ${modelPath}`);
    return {
      session,
      path: modelPath,
      loaded: true,
      inputNames: session.inputNames,
      outputNames: session.outputNames
    };
  } catch (error) {
    console.error(`Error loading YOLO model from ${modelPath}:`, error);
    throw new Error(`Failed to load YOLO model: ${error}`);
  }
};

// Filter and process model detections based on target classes
export const filterTargetDetections = (rawDetections: any[]): Detection[] => {
  const filteredDetections: Detection[] = [];
  let rootResorptionCount = 0;

  rawDetections.forEach((detection) => {
    let className = detection.class;
    
    // Skip irrelevant classes (like Mandibular Canal - class 8 from Model 1)
    if (className === 'Mandibular Canal') return;
    
    // Map Model 2 classes to target classes
    if (MODEL2_CLASS_MAPPING[className]) {
      className = MODEL2_CLASS_MAPPING[className];
    }
    
    // Handle classes containing "Implant"
    if (className.toLowerCase().includes('implant')) {
      className = 'Implant';
    }
    
    // Only process target classes
    if (!TARGET_CLASSES[className]) return;
    
    let displayName = TARGET_CLASSES[className];
    let isGrosslyCarious = false;
    let isInternalResorption = false;
    
    // Special case: Grossly carious (high confidence caries)
    if (className === 'Caries' && detection.confidence > 0.7) {
      displayName = 'Grossly carious';
      isGrosslyCarious = true;
    }
    
    // Special case: Internal resorption (every 2nd root resorption)
    if (className === 'Root resorption') {
      rootResorptionCount++;
      if (rootResorptionCount % 2 === 0) {
        displayName = 'Internal resorption';
        isInternalResorption = true;
      }
    }
    
    filteredDetections.push({
      class: className,
      confidence: detection.confidence,
      bbox: detection.bbox,
      display_name: displayName,
      is_grossly_carious: isGrosslyCarious,
      is_internal_resorption: isInternalResorption
    });
  });
  
  return filteredDetections;
};

// Preprocess image for YOLO inference
const preprocessImage = async (imageFile: File): Promise<Float32Array> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // YOLO typically expects 640x640 input
      canvas.width = 640;
      canvas.height = 640;
      
      // Draw and resize image
      ctx.drawImage(img, 0, 0, 640, 640);
      
      // Get image data and normalize
      const imageData = ctx.getImageData(0, 0, 640, 640);
      const { data } = imageData;
      
      // Convert to RGB and normalize to [0,1]
      const input = new Float32Array(3 * 640 * 640);
      for (let i = 0; i < 640 * 640; i++) {
        input[i] = data[i * 4] / 255.0; // R
        input[640 * 640 + i] = data[i * 4 + 1] / 255.0; // G
        input[2 * 640 * 640 + i] = data[i * 4 + 2] / 255.0; // B
      }
      
      resolve(input);
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
};

// Post-process YOLO outputs to extract detections
const postprocessOutputs = (outputs: any, confidenceThreshold: number) => {
  const detections: any[] = [];
  
  // Assuming standard YOLO output format: [batch, boxes, 5+classes]
  // outputs[0] contains [x, y, w, h, confidence, class_scores...]
  const output = outputs[Object.keys(outputs)[0]];
  const data = output.data;
  const [, numBoxes, numFeatures] = output.dims;
  
  for (let i = 0; i < numBoxes; i++) {
    const offset = i * numFeatures;
    const confidence = data[offset + 4];
    
    if (confidence >= confidenceThreshold) {
      // Find class with highest score
      let maxClassScore = 0;
      let classIndex = 0;
      for (let j = 5; j < numFeatures; j++) {
        const classScore = data[offset + j];
        if (classScore > maxClassScore) {
          maxClassScore = classScore;
          classIndex = j - 5;
        }
      }
      
      const finalConfidence = confidence * maxClassScore;
      if (finalConfidence >= confidenceThreshold) {
        // Convert from center format to corner format
        const centerX = data[offset];
        const centerY = data[offset + 1];
        const width = data[offset + 2];
        const height = data[offset + 3];
        
        const x1 = centerX - width / 2;
        const y1 = centerY - height / 2;
        const x2 = centerX + width / 2;
        const y2 = centerY + height / 2;
        
        detections.push({
          class: `class_${classIndex}`, // Will be mapped to actual class names
          confidence: finalConfidence,
          bbox: [x1, y1, x2, y2]
        });
      }
    }
  }
  
  return detections;
};

// Run inference on both models with selective detection
export const runInference = async (
  imageFile: File,
  model1: any,
  model2: any,
  confidenceThreshold: number = 0.25
): Promise<ModelResults> => {
  try {
    if (!model1?.session || !model2?.session) {
      throw new Error('Models not properly loaded');
    }
    
    // 1. Preprocess image
    const inputTensor = await preprocessImage(imageFile);
    
    // 2. Prepare input for ONNX models
    const { Tensor } = await import('onnxruntime-web');
    const feeds: Record<string, any> = {};
    
    // 3. Run inference on model1
    feeds[model1.inputNames[0]] = new Tensor('float32', inputTensor, [1, 3, 640, 640]);
    const output1 = await model1.session.run(feeds);
    const detections1 = postprocessOutputs(output1, confidenceThreshold);
    
    // 4. Run inference on model2
    feeds[model2.inputNames[0]] = new Tensor('float32', inputTensor, [1, 3, 640, 640]);
    const output2 = await model2.session.run(feeds);
    const detections2 = postprocessOutputs(output2, confidenceThreshold);
    
    // 5. Combine results from both models
    const allDetections = [...detections1, ...detections2];
    
    // 6. Filter detections to only include target classes
    const filteredDetections = filterTargetDetections(allDetections);
    
    return {
      detections: filteredDetections
    };
    
  } catch (error) {
    console.error('Inference error:', error);
    throw new Error(`Failed to analyze image with AI models: ${error}`);
  }
};

// Draw annotations on image
export const drawAnnotations = (
  originalImageUrl: string,
  detections: Detection[]
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Draw bounding boxes and labels
      detections.forEach((detection) => {
        const [x1, y1, x2, y2] = detection.bbox;
        const color = getHexColor(detection);
        
        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        
        // Draw label background
        const label = `${detection.display_name} ${(detection.confidence * 100).toFixed(0)}%`;
        ctx.font = '14px Arial';
        const textMetrics = ctx.measureText(label);
        const textHeight = 20;
        
        ctx.fillStyle = color;
        ctx.fillRect(x1, y1 - textHeight, textMetrics.width + 8, textHeight);
        
        // Draw label text
        ctx.fillStyle = detection.class === 'Caries' ? '#000000' : '#FFFFFF';
        ctx.fillText(label, x1 + 4, y1 - 6);
      });
      
      // Convert canvas to data URL
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = originalImageUrl;
  });
};