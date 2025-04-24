import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserAuthProvider } from "@/hooks/useUserAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CheckIn from "./pages/CheckIn";
import Report from "./pages/Report";
import FlightPricePrediction from "./pages/FlightPricePrediction";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import LiveFlightTracker from "./pages/LiveFlightTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/report" element={<Report />} />
            <Route path="/reports" element={<Navigate to="/report" replace />} />
            <Route path="/price-prediction" element={<FlightPricePrediction />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/flight-tracker" element={<LiveFlightTracker />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserAuthProvider>
  </QueryClientProvider>
);

export default App;
