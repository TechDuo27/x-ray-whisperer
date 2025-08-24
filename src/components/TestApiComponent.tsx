import { useState } from 'react';
import { DentalAnalysisService } from '@/services/api';

// Create a new service instance directly in the component
const dentalService = new DentalAnalysisService('https://srv-d2kai9re5dus7391b03g.onrender.com');

export function TestApiComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResults(null);
      setError(null);
    }
  };

  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(e.target.value);
  };

  // Check API health
  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use fetch directly to test connection
      const response = await fetch(`${apiUrl}/health`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Health check failed: ${response.status} - ${errorText || response.statusText}`);
      }
      
      const result = await response.json();
      setResults({
        type: 'health',
        data: result
      });
    } catch (err: any) {
      console.error('Health check error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a custom service instance with the current API URL
      const service = new DentalAnalysisService(apiUrl);
      const result = await service.analyzeImage(selectedFile);
      console.log('API Response:', result);
      setResults({
        type: 'analysis',
        data: result
      });
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Test Component</h2>
      
      <div className="mb-4">
        <label className="block mb-2">API URL:</label>
        <input 
          type="text" 
          value={apiUrl} 
          onChange={handleApiUrlChange}
          className="border p-2 w-full"
        />
      </div>
      
      <button 
        onClick={checkHealth}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 mr-2"
        disabled={isLoading}
      >
        Test API Connection
      </button>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block mb-2">Select Dental X-Ray Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {results && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Results ({results.type}):</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(results.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}