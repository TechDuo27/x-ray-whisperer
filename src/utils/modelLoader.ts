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

// Detection color mappings
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

// Load YOLO model from public/models directory
export const loadYOLOModel = async (modelPath: string): Promise<any> => {
  try {
    // TODO: Implement actual YOLO model loading
    // This will depend on the specific framework used (ONNX.js, TensorFlow.js, etc.)
    const response = await fetch(modelPath);
    if (!response.ok) {
      throw new Error(`Failed to load model from ${modelPath}`);
    }
    
    // Placeholder for model loading logic
    console.log(`Model loaded from ${modelPath}`);
    return { path: modelPath, loaded: true };
  } catch (error) {
    console.error(`Error loading model from ${modelPath}:`, error);
    throw error;
  }
};

// Run inference on both models
export const runInference = async (
  imageFile: File,
  model1: any,
  model2: any,
  confidenceThreshold: number = 0.25
): Promise<ModelResults> => {
  try {
    // TODO: Implement actual model inference
    // This will process the image through both YOLO models
    
    // For now, return empty results until models are integrated
    return {
      detections: []
    };
    
    // Future implementation will include:
    // 1. Preprocess image (resize, normalize)
    // 2. Run inference on model1 (general conditions)
    // 3. Run inference on model2 (implants/materials)
    // 4. Combine and filter results by confidence threshold
    // 5. Apply NMS (Non-Maximum Suppression) to remove duplicates
    
  } catch (error) {
    console.error('Inference error:', error);
    throw new Error('Failed to analyze image with AI models');
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