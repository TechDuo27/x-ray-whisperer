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
  'Internal resorption': [203, 192, 255] // dark pink
};

// Convert RGB to hex for CSS
export const getHexColor = (detection: Detection): string => {
  // First, determine the appropriate color key based on detection class or special cases
  let colorKey = detection.class;
  
  // Handle special cases
  if (detection.is_grossly_carious) {
    colorKey = 'Grossly carious';
  } else if (detection.is_internal_resorption) {
    colorKey = 'Internal resorption';
  } 
  // Handle specific mappings for common detections
  else if (detection.display_name === 'Impacted teeth' || 
           detection.class === 'impacted tooth' || 
           detection.display_name.toLowerCase().includes('impact')) {
    colorKey = 'impacted tooth';
  } 
  else if (detection.display_name === 'Crowns' || 
           detection.class === 'Crown' || 
           detection.display_name.toLowerCase().includes('crown')) {
    colorKey = 'Crown';
  }
  else if (detection.display_name === 'Restorations' || 
           detection.class === 'Filling' || 
           detection.display_name.toLowerCase().includes('restoration') ||
           detection.display_name.toLowerCase().includes('filling')) {
    colorKey = 'Filling';
  }
  
  // Log for debugging
  console.log(`Getting color for ${detection.display_name} (class: ${detection.class}), using key: ${colorKey}`);
  
  // Get RGB color from the mapping
  const rgb = DETECTION_COLORS[colorKey];
  
  // Convert RGB to hex or use green if no matching color found
  if (rgb) {
    return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  } else {
    console.warn(`No color found for key: ${colorKey}`);
    return '#00ff00'; // Default to green
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
      canvas.className = 'annotation-canvas';
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Log all detection classes for debugging
      console.log("All detections:", detections.map(d => `${d.display_name} (class: ${d.class})`));
      
      // Draw bounding boxes and labels
      detections.forEach((detection) => {
        const [x1, y1, x2, y2] = detection.bbox;
        
        // Determine the correct color key based on the detection
        let colorKey = detection.class;
        
        // Handle special cases
        if (detection.is_grossly_carious) {
          colorKey = 'Grossly carious';
        } else if (detection.is_internal_resorption) {
          colorKey = 'Internal resorption';
        } 
        // Handle specific mappings for common detections
        else if (detection.display_name === 'Impacted teeth' || 
                detection.class === 'impacted tooth' || 
                detection.display_name.toLowerCase().includes('impact')) {
          colorKey = 'impacted tooth';
        } 
        else if (detection.display_name === 'Crowns' || 
                detection.class === 'Crown' || 
                detection.display_name.toLowerCase().includes('crown')) {
          colorKey = 'Crown';
        }
        else if (detection.display_name === 'Restorations' || 
                detection.class === 'Filling' || 
                detection.display_name.toLowerCase().includes('restoration') ||
                detection.display_name.toLowerCase().includes('filling')) {
          colorKey = 'Filling';
        }
        
        // Get RGB color or default to green
        const rgb = DETECTION_COLORS[colorKey];
        
        if (!rgb) {
          console.warn(`No color found for key: ${colorKey} (display_name: ${detection.display_name}, class: ${detection.class})`);
        }
        
        const rgbArray = rgb || [0, 255, 0]; // Default to green if not found
        const colorStr = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
        
        // Log color assignment for debugging
        console.log(`Drawing ${detection.display_name} with color ${colorKey}: ${colorStr}`);
        
        // Draw bounding box only (no labels)
        ctx.strokeStyle = colorStr;
        ctx.lineWidth = 3;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      });
      
      // Convert canvas to data URL
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = originalImageUrl;
  });
};