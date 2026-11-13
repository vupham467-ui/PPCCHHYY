import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon path for Next.js
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ lat, lon, zoom = 18 }) => {
  return (
    <MapContainer center={[lat, lon]} zoom={zoom} style={{ height: 300, width: "100%", borderRadius: 8 }} attributionControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution="" // để trống hoặc tuỳ chỉnh
      />
      <Marker position={[lat, lon]}>
        <Popup>
          Vị trí chụp ảnh
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
