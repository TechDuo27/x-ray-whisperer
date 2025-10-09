// YOLO model loader and inference utilities
export interface Detection {
  class: string;
  confidence: number;
  bbox?: [number, number, number, number]; // [x1, y1, x2, y2] - for bounding box detections
  segmentation?: number[][] | number[]; // For segmentation detections - array of [x, y] points or flattened array
  display_name: string;
  is_grossly_carious?: boolean;
  is_internal_resorption?: boolean;
  type?: 'bbox' | 'segmentation'; // Detection type
}

export interface ModelResults {
  detections: Detection[];
}

// Target classes for selective detection (only these 20 conditions)
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
  'Retained root': 'Root stump',
  'Mandibular Canal': 'Mandibular canal',
  'Mandibular canal': 'Mandibular canal'
};

// Model 2 class mapping to target classes
export const MODEL2_CLASS_MAPPING: Record<string, string> = {
  'Dental Caries Lesion': 'Caries',
  'Dental Crown Restoration': 'Crown',
  'Amalgam/Composite/Tooth Filling': 'Filling',
  'Root Canal Filling/Obturation': 'Root Canal Treatment',
  'Retained Tooth Root': 'Retained root'
};

// Canonical detection colors - using only the proper medical terminology
export const DETECTION_COLORS: Record<string, [number, number, number]> = {
  // Primary detection classes with correct medical terminology
  'Dental caries': [255, 255, 255],        // white
  'Bone Loss': [255, 0, 0],                // red  
  'Cyst': [255, 255, 0],                   // yellow
  'Impacted teeth': [128, 0, 128],         // purple
  'Missing teeth': [0, 0, 255],            // blue
  'Supernumerary teeth': [0, 255, 0],      // green
  'Abrasion': [255, 192, 203],             // pink
  'Spacing': [165, 42, 42],                // brown
  'Root resorption': [0, 0, 0],            // black
  'Periapical pathology': [255, 219, 88],  // mustard
  'Bone fracture': [139, 0, 0],            // dark red
  'Tooth fracture': [128, 128, 128],       // grey
  'Crowns': [0, 100, 0],                   // dark green
  'Implants': [128, 0, 0],                 // maroon
  'RCT tooth': [255, 220, 177],            // skin color (beige/cream)
  'Restorations': [238, 130, 238],         // violet
  'Retained deciduous tooth': [0, 0, 128], // navy blue
  'Root stump': [0, 128, 128],             // teal
  'Mandibular canal': [0, 255, 0],         // green
  
  // Special variants
  'Grossly carious': [255, 165, 0],        // orange
  'Internal resorption': [203, 192, 255]   // dark pink
};

// Convert RGB to hex for CSS
export const getHexColor = (detection: Detection): string => {
  // Mapping for backward compatibility - convert old class names to canonical display names
  const canonicalNameMap: Record<string, string> = {
    'Caries': 'Dental caries',
    'impacted tooth': 'Impacted teeth',
    'Supra Eruption': 'Supernumerary teeth',
    'attrition': 'Abrasion',
    'Malaligned': 'Spacing',
    'Periapical lesion': 'Periapical pathology',
    'bone defect': 'Bone fracture',
    'Fracture teeth': 'Tooth fracture',
    'Crown': 'Crowns',
    'Implant': 'Implants',
    'Root Canal Treatment': 'RCT tooth',
    'Filling': 'Restorations',
    'Primary teeth': 'Retained deciduous tooth',
    'Retained root': 'Root stump',
    'Mandibular Canal': 'Mandibular canal',
    'mandibular canal': 'Mandibular canal'
  };

  // First, determine the appropriate color key based on detection display_name or special cases
  let colorKey = detection.display_name;
  
  // Handle special cases first
  if (detection.is_grossly_carious) {
    colorKey = 'Grossly carious';
  } else if (detection.is_internal_resorption) {
    colorKey = 'Internal resorption';
  }
  
  // Try to get RGB color from the mapping using display_name first
  let rgb = DETECTION_COLORS[colorKey];
  
  // If not found, try using canonical mapping from class name
  if (!rgb) {
    const canonicalName = canonicalNameMap[detection.class];
    if (canonicalName) {
      rgb = DETECTION_COLORS[canonicalName];
      colorKey = canonicalName;
    }
  }
  
  // If still not found, try using the class name directly
  if (!rgb) {
    rgb = DETECTION_COLORS[detection.class];
    colorKey = detection.class;
  }
  
  // Log for debugging
  console.log(`Getting color for ${detection.display_name} (class: ${detection.class}), using key: ${colorKey}`);
  
  // Convert RGB to hex or use green if no matching color found
  if (rgb) {
    return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  } else {
    console.warn(`No color found for display_name: ${detection.display_name} or class: ${detection.class}`);
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
      
      // Draw bounding boxes, segmentation masks, and labels
      detections.forEach((detection) => {
        // Skip if neither bbox nor segmentation data exists
        if (!detection.bbox && !detection.segmentation) {
          console.warn('Detection missing both bbox and segmentation:', detection);
          return;
        }
        
        // Mapping for backward compatibility - convert old class names to canonical display names
        const canonicalNameMap: Record<string, string> = {
          'Caries': 'Dental caries',
          'impacted tooth': 'Impacted teeth',
          'Supra Eruption': 'Supernumerary teeth',
          'attrition': 'Abrasion',
          'Malaligned': 'Spacing',
          'Periapical lesion': 'Periapical pathology',
          'bone defect': 'Bone fracture',
          'Fracture teeth': 'Tooth fracture',
          'Crown': 'Crowns',
          'Implant': 'Implants',
          'Root Canal Treatment': 'RCT tooth',
          'Filling': 'Restorations',
          'Primary teeth': 'Retained deciduous tooth',
          'Retained root': 'Root stump',
          'Mandibular Canal': 'Mandibular canal',
          'mandibular canal': 'Mandibular canal'
        };
        
        // Determine the correct color key based on detection display_name or special cases
        let colorKey = detection.display_name;
        
        // Handle special cases first
        if (detection.is_grossly_carious) {
          colorKey = 'Grossly carious';
        } else if (detection.is_internal_resorption) {
          colorKey = 'Internal resorption';
        }
        
        // Try to get RGB color from the mapping using display_name first
        let rgb = DETECTION_COLORS[colorKey];
        
        // If not found, try using canonical mapping from class name
        if (!rgb) {
          const canonicalName = canonicalNameMap[detection.class];
          if (canonicalName) {
            rgb = DETECTION_COLORS[canonicalName];
            colorKey = canonicalName;
          }
        }
        
        // If still not found, try using the class name directly
        if (!rgb) {
          rgb = DETECTION_COLORS[detection.class];
          colorKey = detection.class;
        }
        
        if (!rgb) {
          console.warn(`No color found for display_name: ${detection.display_name} or class: ${detection.class}`);
        }
        
        const rgbArray = rgb || [0, 255, 0]; // Default to green if not found
        const colorStr = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
        
        // Log color assignment for debugging
        console.log(`Drawing ${detection.display_name} with color ${colorKey}: ${colorStr}`);
        
        // Check if this is a segmentation detection
        if (detection.segmentation && (detection.type === 'segmentation' || detection.class === 'Mandibular Canal' || detection.display_name === 'Mandibular canal' || detection.display_name === 'Mandibular Canal')) {
          // Draw segmentation mask
          ctx.fillStyle = `rgba(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}, 0.4)`; // Semi-transparent fill
          ctx.strokeStyle = colorStr;
          ctx.lineWidth = 2;
          
          // Parse segmentation data
          let points: number[][];
          if (Array.isArray(detection.segmentation[0])) {
            // Already in [[x, y], [x, y], ...] format
            points = detection.segmentation as number[][];
          } else {
            // Flattened format [x1, y1, x2, y2, ...] - convert to [[x, y], [x, y], ...]
            const flatArray = detection.segmentation as number[];
            points = [];
            for (let i = 0; i < flatArray.length; i += 2) {
              points.push([flatArray[i], flatArray[i + 1]]);
            }
          }
          
          if (points.length > 0) {
            // Draw filled polygon
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        } else if (detection.bbox) {
          // Draw bounding box detection
          const [x1, y1, x2, y2] = detection.bbox;
          ctx.strokeStyle = colorStr;
          ctx.lineWidth = 3;
          
          // Draw circle for Dental caries, rectangle for everything else
          if (detection.display_name === 'Dental caries' || detection.class === 'Caries') {
            // Calculate center and radius for circle
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;
            const width = x2 - x1;
            const height = y2 - y1;
            const radius = Math.sqrt(width * width + height * height) / 2;
            
            // Draw circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
          } else {
            // Draw rectangle for all other detections
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          }
        }
      });
      
      // Convert canvas to data URL
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = originalImageUrl;
  });
};