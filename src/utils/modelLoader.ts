// YOLO model loader and inference utilities
export interface Detection {
  class_: string; // Note: API returns class_ (with underscore)
  confidence: number;
  bbox?: [number, number, number, number]; // [x1, y1, x2, y2] - for bounding box detections
  mask_contours?: number[][] | number[] | null; // For segmentation detections - array of [x, y] points or flattened array
  display_name: string;
  description?: string;
  color?: string;
  is_grossly_carious?: boolean;
  is_internal_resorption?: boolean;
  num_merged?: number;
  source_models?: string[];
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

// Get color from detection (API provides hex color)
export const getHexColor = (detection: Detection): string => {
  // Use color from API if available, otherwise default to green
  return detection.color || '#00ff00';
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
      console.log("All detections:", detections.map(d => `${d.display_name} (class_: ${d.class_})`));
      
      // Draw bounding boxes, segmentation masks, and labels
      detections.forEach((detection) => {
        // Skip if neither bbox nor mask_contours data exists
        if (!detection.bbox && !detection.mask_contours) {
          console.warn('Detection missing both bbox and mask_contours:', detection);
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
        // Use color from API detection
        const color = detection.color || '#00ff00';
        
        console.log(`Drawing ${detection.display_name} with color: ${color}`);
        
        // Check if this is a segmentation detection
        if (detection.mask_contours && (detection.type === 'segmentation' || detection.class_ === 'Mandibular Canal' || detection.display_name === 'Mandibular canal' || detection.display_name === 'Mandibular Canal')) {
          // Draw segmentation outline only (no fill)
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          
          // Parse mask_contours data
          let points: number[][];
          if (Array.isArray(detection.mask_contours[0])) {
            // Already in [[x, y], [x, y], ...] format
            points = detection.mask_contours as number[][];
          } else {
            // Flattened format [x1, y1, x2, y2, ...] - convert to [[x, y], [x, y], ...]
            const flatArray = detection.mask_contours as number[];
            points = [];
            for (let i = 0; i < flatArray.length; i += 2) {
              points.push([flatArray[i], flatArray[i + 1]]);
            }
          }
          
          if (points.length > 0) {
            // Draw outline only
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.stroke();
          }
        } else if (detection.bbox) {
          // Draw bounding box detection
          const [x1, y1, x2, y2] = detection.bbox;
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          
          // Draw circle for Dental caries, rectangle for everything else
          if (detection.display_name === 'Dental caries' || detection.class_ === 'Caries') {
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