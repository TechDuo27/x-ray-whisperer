export class DentalAnalysisService {
  baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || 'https://srv-d2kai9re5dus7391b03g.onrender.com';
  }

  /**
   * Analyze a dental image
   * @param {File} imageFile - The dental image file to analyze
   * @returns {Promise<Object>} - The analysis results
   */
  async analyzeImage(imageFile: File) {
    if (!imageFile) {
      throw new Error('Image file is required');
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', imageFile);
    
    try {
      console.log(`Calling API at ${this.baseUrl}/analyze`);
      
      // Make API call
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      // Handle non-200 responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`);
      }
      
      // Parse and return the response
      return await response.json();
    } catch (error) {
      console.error('Error analyzing dental image:', error);
      throw error;
    }
  }
  
  /**
   * Get health status of the API
   * @returns {Promise<Object>} - The health status
   */
  async getHealthStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`API Health Check Failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Health Check Error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const dentalService = new DentalAnalysisService();