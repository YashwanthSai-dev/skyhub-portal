
import React from 'react';
import { Flight } from '@/data/flightData';
import CSVUploader from '@/components/CSVUploader';
import { toast } from 'sonner';

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
  onCSVUploaded 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Flight Data</h2>
      <p className="text-lg mb-6">
        Upload a CSV file containing flight and passenger information. The CSV should include columns for 
        flightNumber, origin, destination, departureTime, arrivalTime, bookingReference, passengerName, 
        passengerEmail, and status.
      </p>
      
      <CSVUploader 
        onCSVParsed={(data) => {
          onCSVUploaded(data);
          toast.success(`Successfully processed ${data.length} flight records`);
        }}
        parseCSVData={parseCSVData} 
      />
      
      {loading && <p className="text-center my-4">Loading flight data...</p>}
      {error && <p className="text-red-500 my-4">{error}</p>}
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Current Flight Data ({flights.length} records)</h3>
        {flights.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Flight</th>
                  <th className="border p-2 text-left">Route</th>
                  <th className="border p-2 text-left">Departure</th>
                  <th className="border p-2 text-left">Booking Ref</th>
                  <th className="border p-2 text-left">Passenger</th>
                  <th className="border p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {flights.slice(0, 10).map((flight) => (
                  <tr key={flight.id} className="hover:bg-gray-50">
                    <td className="border p-2">{flight.flightNumber}</td>
                    <td className="border p-2">{flight.origin} → {flight.destination}</td>
                    <td className="border p-2">{new Date(flight.departureTime).toLocaleString()}</td>
                    <td className="border p-2">{flight.bookingReference}</td>
                    <td className="border p-2">{flight.passengerName}</td>
                    <td className="border p-2">{flight.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {flights.length > 10 && (
              <p className="text-sm text-gray-500 mt-2">Showing 10 of {flights.length} records</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No flight data available. Please upload a CSV file.</p>
        )}
      </div>
    </div>
  );
};

export default AdminTab;
