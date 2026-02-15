"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

type Hospital = {
  name: string;
  lat: number;
  lng: number;
  rating: number;
  mspb?: number;
};

export default function HospitalMap() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/hospitals")
      .then((res) => res.json())
      .then((data) => setHospitals(data));
  }, []);

  const getColor = (rating: number) => {
    if (rating > 4.5) return "green";
    if (rating > 3.5) return "orange";
    return "red";
  };

  const icon = (rating: number) =>
    L.divIcon({
      className: "",
      html: `<div style="
        background:${getColor(rating)};
        width:18px;
        height:18px;
        border-radius:50%;
      "></div>`
    });

  return (
    <MapContainer
      center={[40.7306, -73.9352]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hospitals.map((hospital, index) => (
        <Marker
          key={index}
          position={[hospital.lat, hospital.lng]}
          icon={icon(hospital.rating)}
        >
          <Popup>
            <strong>{hospital.name}</strong>
            <br />
            Rating: {hospital.rating}
            <br />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
