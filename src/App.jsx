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
      <h1>Earthquake Data</h1>
      <div>
        <input
          type="date"
          value={starttime}
          onChange={(e) => setStarttime(e.target.value)}
        />
        <input
          type="date"
          value={endtime}
          onChange={(e) => setEndtime(e.target.value)}
        />
        <input
          type="number"
          value={magnitude}
          onChange={(e) => setMagnitude(e.target.value)}
        />

        <button onClick={handleClick}>Fetch</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && data.length > 0 && (
        <table
          border="1"
          cellPadding="6"
          style={{ marginTop: "1rem", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Magnitude</th>
              <th>Place</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((eq) => (
              <tr key={eq.id}>
                <td>{eq.id}</td>
                <td
                  style={{
                    color: getMagnitudeColor(eq.properties.mag),
                    fontWeight: "bold",
                  }}
                >
                  {eq.properties.mag}
                </td>
                <td>{eq.properties.place}</td>
                <td>{new Date(eq.properties.time).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleViewMap(eq)}>View on Map</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              style={{ height: "80%", width: "80%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
