
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Coffee, Utensils, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import BreadcrumbNav from '@/components/facilities/BreadcrumbNav';

// Sample airport data
const airports = [
  { id: "1", name: "JFK International Airport", code: "JFK", city: "New York" },
  { id: "2", name: "Heathrow Airport", code: "LHR", city: "London" },
  { id: "3", name: "Changi Airport", code: "SIN", city: "Singapore" },
  { id: "4", name: "Dubai International Airport", code: "DXB", city: "Dubai" },
  { id: "5", name: "Los Angeles International Airport", code: "LAX", city: "Los Angeles" },
  { id: "6", name: "Incheon International Airport", code: "ICN", city: "Seoul" }
];

// Sample lounge and restaurant data
const lounges = [
  { id: "l1", airportId: "1", name: "American Airlines Admirals Club", description: "Exclusive lounge for American Airlines premium passengers", rating: 4.5, price: "$59", hours: "5:00 AM - 10:30 PM", location: "Terminal 8, Concourse B" },
  { id: "l2", airportId: "1", name: "Delta Sky Club", description: "Premium lounge experience with complimentary food and beverages", rating: 4.3, price: "$39", hours: "5:30 AM - 11:00 PM", location: "Terminal 4, Concourse B" },
  { id: "l3", airportId: "2", name: "British Airways Galleries First", description: "Luxurious lounge for First Class passengers", rating: 4.7, price: "First Class Only", hours: "5:00 AM - 10:00 PM", location: "Terminal 5" },
  { id: "l4", airportId: "3", name: "Singapore Airlines SilverKris Lounge", description: "World-class lounge experience", rating: 4.8, price: "Business Class+", hours: "24 hours", location: "Terminal 3" },
  { id: "l5", airportId: "4", name: "Emirates First Class Lounge", description: "Ultimate luxury with premium dining", rating: 4.9, price: "First Class Only", hours: "24 hours", location: "Terminal 3, Concourse A" },
  { id: "l6", airportId: "5", name: "Star Alliance Lounge", description: "Shared lounge for Star Alliance members", rating: 4.1, price: "$45", hours: "6:00 AM - 11:00 PM", location: "Tom Bradley International Terminal" }
];

const restaurants = [
  { id: "r1", airportId: "1", name: "Shake Shack", description: "Popular burger restaurant", rating: 4.2, priceRange: "$$", cuisine: "American", hours: "5:00 AM - 10:00 PM", location: "Terminal 4" },
  { id: "r2", airportId: "1", name: "Uptown Brasserie", description: "Upscale dining experience by Marcus Samuelsson", rating: 4.4, priceRange: "$$$", cuisine: "American", hours: "6:00 AM - 10:00 PM", location: "Terminal 4" },
  { id: "r3", airportId: "2", name: "Gordon Ramsay Plane Food", description: "Modern European cuisine by celebrity chef", rating: 4.3, priceRange: "$$$", cuisine: "European", hours: "5:30 AM - 9:00 PM", location: "Terminal 5" },
  { id: "r4", airportId: "3", name: "Crystal Jade", description: "Authentic Chinese cuisine", rating: 4.5, priceRange: "$$", cuisine: "Chinese", hours: "10:00 AM - 10:00 PM", location: "Terminal 1" },
  { id: "r5", airportId: "4", name: "The Rupee Room", description: "Contemporary Indian cuisine", rating: 4.2, priceRange: "$$", cuisine: "Indian", hours: "24 hours", location: "Terminal 3" },
  { id: "r6", airportId: "5", name: "Urth Caffé", description: "Organic coffee and health-conscious food", rating: 4.6, priceRange: "$$", cuisine: "Cafe", hours: "5:00 AM - 11:00 PM", location: "Terminal 1" }
];

const AirportFacilities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [filteredLounges, setFilteredLounges] = useState<typeof lounges>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<typeof restaurants>([]);

  // Filter airports based on search query
  const filteredAirports = airports.filter(airport => 
    airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    airport.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update lounges and restaurants when airport is selected
  useEffect(() => {
    if (selectedAirport) {
      const airportLounges = lounges.filter(lounge => lounge.airportId === selectedAirport);
      const airportRestaurants = restaurants.filter(restaurant => restaurant.airportId === selectedAirport);
      
      setFilteredLounges(airportLounges);
      setFilteredRestaurants(airportRestaurants);
    } else {
      setFilteredLounges([]);
      setFilteredRestaurants([]);
    }
  }, [selectedAirport]);

  return (
    <Layout>
      <div className="space-y-6">
        <BreadcrumbNav />
        
        <h1 className="text-3xl font-bold text-airport-text">Airport Lounges & Restaurants</h1>
        <p className="text-gray-500">Find the best lounges and restaurants at airports around the world</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Airports</CardTitle>
            <CardDescription>Find facilities by airport name, code, or city</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search airports (e.g. JFK, Heathrow, Singapore)"
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            {searchQuery && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">
                  {filteredAirports.length} {filteredAirports.length === 1 ? 'result' : 'results'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredAirports.map(airport => (
                    <motion.div
                      key={airport.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedAirport === airport.id ? 'border-airport-primary bg-airport-primary/5' : ''}`}
                        onClick={() => setSelectedAirport(airport.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{airport.name}</h3>
                              <p className="text-sm text-gray-500">{airport.city}</p>
                            </div>
                            <div className="bg-gray-100 text-airport-primary font-mono px-2 py-1 rounded text-sm">
                              {airport.code}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {selectedAirport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mt-8">
              {airports.find(a => a.id === selectedAirport)?.name} Facilities
            </h2>
            
            <Tabs defaultValue="lounges">
              <TabsList>
                <TabsTrigger value="lounges">
                  <Coffee className="h-4 w-4 mr-2" /> Lounges
                </TabsTrigger>
                <TabsTrigger value="restaurants">
                  <Utensils className="h-4 w-4 mr-2" /> Restaurants
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lounges" className="mt-6">
                {filteredLounges.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredLounges.map(lounge => (
                      <FacilityCard 
                        key={lounge.id}
                        title={lounge.name}
                        description={lounge.description}
                        rating={lounge.rating}
                        details={[
                          { label: "Price", value: lounge.price },
                          { label: "Hours", value: lounge.hours },
                          { label: "Location", value: lounge.location }
                        ]}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No lounges found for this airport.</p>
                )}
              </TabsContent>
              
              <TabsContent value="restaurants" className="mt-6">
                {filteredRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredRestaurants.map(restaurant => (
                      <FacilityCard 
                        key={restaurant.id}
                        title={restaurant.name}
                        description={restaurant.description}
                        rating={restaurant.rating}
                        details={[
                          { label: "Cuisine", value: restaurant.cuisine },
                          { label: "Price Range", value: restaurant.priceRange },
                          { label: "Hours", value: restaurant.hours },
                          { label: "Location", value: restaurant.location }
                        ]}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No restaurants found for this airport.</p>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

interface FacilityCardProps {
  title: string;
  description: string;
  rating: number;
  details: Array<{label: string, value: string}>;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ title, description, rating, details }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center text-yellow-500">
              <Star className="fill-yellow-500 h-4 w-4" />
              <span className="ml-1 text-sm">{rating}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <div className="bg-gray-50 p-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {details.map((detail, index) => (
              <div key={index} className="col-span-2 sm:col-span-1">
                <dt className="text-gray-500">{detail.label}</dt>
                <dd className="font-medium text-gray-900">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirportFacilities;
