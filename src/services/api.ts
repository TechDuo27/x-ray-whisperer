// API service for backend integration

export interface BBox {
  0: number; // x1
  1: number; // y1
  2: number; // x2
  3: number; // y2
}

export interface Detection {
  class_: string;
  display_name: string;
  confidence: number;
  bbox: BBox;
  is_grossly_carious: boolean;
  is_internal_resorption: boolean;
}

export interface AnalyzeResponse {
  width: number;
  height: number;
  detections: Detection[];
}

export interface ReportResponse extends AnalyzeResponse {
  annotated_image_base64_png: string;
  report_html: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-service-cp46.onrender.com';
    if (!this.baseUrl) {
      throw new Error('VITE_API_BASE_URL environment variable is not set');
    }
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  async analyzeImage(file: File): Promise<AnalyzeResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  async generateReport(file: File): Promise<ReportResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/report`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Report generation failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();