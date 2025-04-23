
import React from "react";

// You may want to add more airline logo paths as needed.
const logoMap: Record<string, string> = {
  "SkyHigh Airways": "/logos/skyhigh.png",
  "Oceanic Air": "/logos/oceanic.png",
  "Global Express": "/logos/globalexpress.png",
  "Mountain Air": "/logos/mountainair.png",
  "QuickFly": "/logos/quickfly.png",
  "MetroJet": "/logos/metrojet.png",
};

interface AirlineLogoProps {
  airline: string;
}

export const AirlineLogo: React.FC<AirlineLogoProps> = ({ airline }) => {
  const src = logoMap[airline] || "/logos/default-airline.png";
  return (
    <img
      src={src}
      alt={airline + " logo"}
      className="h-8 w-8 rounded-full shadow border bg-white object-contain"
      style={{ background: "#fff" }}
      loading="lazy"
      onError={(e) => (e.currentTarget.src = "/logos/default-airline.png")}
    />
  );
};
