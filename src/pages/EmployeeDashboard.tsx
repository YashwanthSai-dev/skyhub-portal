
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useFlightData, Flight, BookingDetails } from '@/data/flightData';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import FlightForm from '@/components/employee/FlightForm';
import { Badge } from '@/components/ui/badge';

const EmployeeDashboard = () => {
  const { isEmployee, user } = useUserAuth();
  const { flights, bookings, loading, addFlight, updateFlight } = useFlightData();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(new Date());
  const [showAddFlightForm, setShowAddFlightForm] = useState(false);

  // Redirect if not an employee
  if (!isEmployee) {
    return <Navigate to="/login" />;
  }

  // Filter flights by date and search term
  const filteredFlights = flights.filter(flight => {
    const flightDate = new Date(flight.departureTime).toDateString();
    const filterDate = dateFilter ? dateFilter.toDateString() : null;
    
    // Apply date filter if set
    if (dateFilter && flightDate !== filterDate) {
      return false;
    }
    
    // Apply search filter if set
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        flight.flightNumber.toLowerCase().includes(searchLower) ||
        flight.origin.toLowerCase().includes(searchLower) ||
        flight.destination.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
  };
  
  const handleAddFlight = () => {
    setShowAddFlightForm(true);
    setSelectedFlight(null);
  };

  const handleFormSubmit = async (flightData: Partial<Flight>) => {
    if (selectedFlight) {
      // Update existing flight
      const success = updateFlight(selectedFlight.id, flightData);
      if (success) {
        toast.success("Flight updated successfully");
        setSelectedFlight(null);
      } else {
        toast.error("Failed to update flight");
      }
    } else {
      // Add new flight
      if (!flightData.flightNumber || !flightData.origin || !flightData.destination || 
          !flightData.departureTime || !flightData.arrivalTime) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      try {
        const newFlight = addFlight(flightData as Omit<Flight, 'id'>);
        toast.success(`Flight ${newFlight.flightNumber} added successfully`);
        setShowAddFlightForm(false);
      } catch (error) {
        console.error("Error adding flight:", error);
        toast.error("Failed to add flight");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <div>
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium">{user?.name}</span> ({user?.role})
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="flights" className="space-y-6">
          <TabsList>
            <TabsTrigger value="flights">Flights Management</TabsTrigger>
            <TabsTrigger value="checkins">Check-ins</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flights" className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between">
              {/* Date filter */}
              <div className="flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Search */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input
                  placeholder="Search flights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-[300px]"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Add flight button */}
              <Button onClick={handleAddFlight} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Flight
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Flights list */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Flights</CardTitle>
                    <CardDescription>
                      {dateFilter ? `Flights scheduled for ${format(dateFilter, "MMMM d, yyyy")}` : "All scheduled flights"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-center py-4">Loading flights...</p>
                    ) : filteredFlights.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Flight</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Departure</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFlights.map((flight) => (
                            <TableRow key={flight.id}>
                              <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                              <TableCell>{flight.origin} → {flight.destination}</TableCell>
                              <TableCell>{format(new Date(flight.departureTime), "MMM d, h:mm a")}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    flight.status === 'SCHEDULED' ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : 
                                    flight.status === 'BOARDING' ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                                    flight.status === 'DEPARTED' ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                                    flight.status === 'ARRIVED' ? "bg-green-100 text-green-800 hover:bg-green-100" :
                                    "bg-red-100 text-red-800 hover:bg-red-100"
                                  }
                                >
                                  {flight.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleFlightSelect(flight)}>
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No flights found for the selected criteria</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Flight details / Form */}
              <div>
                {(selectedFlight || showAddFlightForm) ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {selectedFlight ? `Edit Flight: ${selectedFlight.flightNumber}` : 'Add New Flight'}
                      </CardTitle>
                      <CardDescription>
                        {selectedFlight 
                          ? `Update details for flight from ${selectedFlight.origin} to ${selectedFlight.destination}`
                          : 'Enter details for the new flight'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FlightForm 
                        flight={selectedFlight || undefined}
                        onSubmit={handleFormSubmit} 
                        onCancel={() => {
                          setSelectedFlight(null);
                          setShowAddFlightForm(false);
                        }} 
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Flight Information</CardTitle>
                      <CardDescription>
                        Select a flight to view or edit its details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="rounded-full bg-muted p-6 mb-4">
                        <PlusCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No flight selected</h3>
                      <p className="text-sm text-muted-foreground max-w-[200px] mt-2">
                        Select a flight from the list or add a new one
                      </p>
                      <Button className="mt-6" onClick={handleAddFlight}>
                        Add New Flight
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="checkins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Check-ins</CardTitle>
                <CardDescription>
                  View and manage passenger check-in status for all flights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-between mb-6">
                  {/* Date filter */}
                  <div className="flex items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !dateFilter && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFilter}
                          onSelect={setDateFilter}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Search */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Input
                      placeholder="Search by flight number or passenger name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-[300px]"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flight</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Checked In</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlights.map((flight) => {
                      // Get all bookings for this flight
                      const flightBookings = bookings.filter(b => b.flightId === flight.id);
                      const checkedInCount = flightBookings.filter(b => b.hasCheckedIn).length;
                      const pendingCount = flightBookings.length - checkedInCount;
                      
                      return (
                        <TableRow key={flight.id}>
                          <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                          <TableCell>{flight.origin} → {flight.destination}</TableCell>
                          <TableCell>{format(new Date(flight.departureTime), "MMM d, h:mm a")}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {checkedInCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              {pendingCount}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleFlightSelect(flight)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {selectedFlight && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Check-in Status for Flight {selectedFlight.flightNumber}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Passenger</TableHead>
                          <TableHead>Booking Reference</TableHead>
                          <TableHead>Seat</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Check-in Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings
                          .filter(booking => booking.flightId === selectedFlight.id)
                          .map(booking => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.passengerName}</TableCell>
                              <TableCell>{booking.bookingReference}</TableCell>
                              <TableCell>{booking.seatNumber || 'Not assigned'}</TableCell>
                              <TableCell>
                                {booking.hasCheckedIn ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    Checked In
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {booking.checkInTime 
                                  ? format(new Date(booking.checkInTime), "MMM d, h:mm a") 
                                  : '-'
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Passenger Bookings</CardTitle>
                <CardDescription>
                  View and manage all passenger bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-between mb-6">
                  <Input
                    placeholder="Search by passenger name or booking reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-[400px]"
                  />
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking Ref</TableHead>
                      <TableHead>Passenger</TableHead>
                      <TableHead>Flight</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings
                      .filter(booking => {
                        if (!searchTerm) return true;
                        
                        const search = searchTerm.toLowerCase();
                        return (
                          booking.passengerName.toLowerCase().includes(search) ||
                          booking.bookingReference.toLowerCase().includes(search) ||
                          booking.passengerEmail.toLowerCase().includes(search)
                        );
                      })
                      .map(booking => {
                        const flight = flights.find(f => f.id === booking.flightId);
                        if (!flight) return null;
                        
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.bookingReference}</TableCell>
                            <TableCell>{booking.passengerName}</TableCell>
                            <TableCell>{flight.flightNumber}</TableCell>
                            <TableCell>{flight.origin} → {flight.destination}</TableCell>
                            <TableCell>{format(new Date(flight.departureTime), "MMM d, h:mm a")}</TableCell>
                            <TableCell>
                              {booking.hasCheckedIn ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Checked In
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  Not Checked In
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
