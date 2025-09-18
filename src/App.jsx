import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarthQuakes } from "./reducers/earthquakeReducer";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.earthquake);

  const [starttime, setStarttime] = useState("");
  const [endtime, setEndtime] = useState("");
  const [magnitude, setMagnitude] = useState("");

  const [selectedEq, setSelectedEq] = useState(null);

  const getMagnitudeColor = (mag) => {
    if (mag >= 7) return "red";
    if (mag >= 5) return "orange";
    if (mag >= 3) return "gold";
    return "green";
  };

  const handleClick = () => {
    dispatch(fetchEarthQuakes({ starttime, endtime, magnitude }));
    console.log(data);
  };

  const handleViewMap = (eq) => {
    setSelectedEq(eq);
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🌍 Earthquake Data Explorer
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={starttime}
              onChange={(e) => setStarttime(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endtime}
              onChange={(e) => setEndtime(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Magnitude */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Minimum Magnitude
            </label>
            <input
              type="number"
              value={magnitude}
              onChange={(e) => setMagnitude(e.target.value)}
              placeholder="e.g. 4"
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Fetch Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            Fetch Data
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && data.length > 0 && (
        <div className="max-w-5xl mx-auto mt-8 bg-white shadow-md rounded-2xl overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 px-6 py-4 border-b">
            📊 Earthquake Results
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Magnitude</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3 text-center">Map</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 divide-y">
                {data.map((eq) => (
                  <tr key={eq.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-mono text-sm">{eq.id}</td>
                    <td
                      className={`px-6 py-3 font-semibold ${
                        eq.properties.mag >= 6
                          ? "text-red-600"
                          : eq.properties.mag >= 4
                          ? "text-orange-500"
                          : "text-green-600"
                      }`}
                    >
                      {eq.properties.mag}
                    </td>
                    <td className="px-6 py-3">{eq.properties.place}</td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(eq.properties.time).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleViewMap(eq)} // opens modal with map
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm shadow-md transition"
                      >
                        View Map
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Map */}
      {selectedEq && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedEq(null)} // close when clicking backdrop
        >
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              width: "600px",
              height: "400px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              style={{ position: "absolute", top: 10, right: 10 }}
              onClick={() => setSelectedEq(null)}
            >
              Close
            </button>

            <h3>
              {selectedEq.properties.place} (Mag: {selectedEq.properties.mag})
            </h3>

            <MapContainer
              center={[
                selectedEq.geometry.coordinates[1],
                selectedEq.geometry.coordinates[0],
              ]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker
                position={[
                  selectedEq.geometry.coordinates[1],
                  selectedEq.geometry.coordinates[0],
                ]}
              >
                <Popup>
                  {selectedEq.properties.place} <br />
                  Magnitude: {selectedEq.properties.mag}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
