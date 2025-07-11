import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient.js";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});
function LocationPicker({ onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng);
    },
  });
  return null;
}

const AddBranch = () => {
  const [formData, setFormData] = useState({});
  const [position, setPosition] = useState({ lat: null, lng: null });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleLocationChange = (latlng) => {
    setPosition(latlng);
    setFormData((prevData) => ({
      ...prevData,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert("Please select a location on the map.");
      return;
    }
    try {
      const { error } = await supabase.from("branches").insert([formData]);

      if (error) {
        console.error("Insert error:", error);
        alert("Failed to submit branches.");
      } else {
        alert("Branches created!");
        navigate("/admin-dashboard/branches"); // or wherever you want to go next
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Branch</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Insert Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="location"
              onChange={handleChange}
              placeholder="Insert Address"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* Map Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pick Location on Map
            </label>
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onLocationChange={handleLocationChange} />
              {position.lat && (
                <Marker position={[position.lat, position.lng]} />
              )}
            </MapContainer>
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                value={position.lat || ""}
                disabled
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                value={position.lng || ""}
                disabled
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Branch
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBranch;
