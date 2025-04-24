
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CSVUploader from '@/components/CSVUploader';
import { Flight } from '@/data/flightData';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminTabProps {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  parseCSVData: (csvText: string) => Flight[];
  onCSVUploaded: (data: Flight[]) => void;
}

const AdminTab: React.FC<AdminTabProps> = ({
  flights,
  loading,
  error,
  parseCSVData,
  onCSVUploaded,
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setUploadStatus('processing');
      const text = await file.text();
      const parsedData = parseCSVData(text);
      
      if (parsedData && parsedData.length > 0) {
        onCSVUploaded(parsedData);
        setUploadStatus('success');
      } else {
        setErrorMessage('No valid flight data found in the CSV file.');
        setUploadStatus('error');
      }
    } catch (err) {
      console.error('Error processing CSV file:', err);
      setErrorMessage('Failed to process the CSV file. Please check the format and try again.');
      setUploadStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Upload Flight Data</h2>
        <p className="text-gray-600 mb-6">
          Upload a CSV file containing flight information to update the database.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <CSVUploader onFileUpload={handleFileUpload} />
        </div>

        {uploadStatus === 'processing' && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing file...</span>
          </div>
        )}

        {uploadStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
            <AlertDescription>
              Successfully uploaded flight data ({flights.length} flights).
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">CSV File Format</h3>
        <p className="text-gray-600 mb-2">
          The CSV file should contain the following columns:
        </p>
        <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm overflow-x-auto">
          id,flightNumber,origin,destination,departureTime,arrivalTime,bookingReference,passengerName,passengerEmail,status
        </pre>
      </div>
    </div>
  );
};

export default AdminTab;
