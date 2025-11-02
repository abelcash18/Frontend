import "./contact.scss";
import { useState, useEffect, useRef } from "react";
import apiRequest from "../../lib/apiRequest";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || 'contact';

const MARKERS_ENDPOINT = import.meta.env.VITE_MARKERS_ENDPOINT || 'agents';

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Fetch markers (agents/offices) to display on the map
  useEffect(() => {
    let cancelled = false;
    const loadMarkers = async () => {
      try {
        let res;
        if (/^https?:\/\//i.test(MARKERS_ENDPOINT)) {
          res = await axios.get(MARKERS_ENDPOINT, { withCredentials: true });
        } else {
          res = await apiRequest.get(MARKERS_ENDPOINT);
        }

        const data = res?.data?.agents || res?.data?.offices || res?.data || [];
        // Normalize markers to { id, name, lat, lng, phone, email, address }
        const normalized = (Array.isArray(data) ? data : []).map((item, idx) => ({
          id: item.id ?? item._id ?? idx,
          name: item.name || item.agentName || item.title || 'Office',
          lat: Number(item.lat ?? item.latitude ?? item.location?.lat) || null,
          lng: Number(item.lng ?? item.longitude ?? item.location?.lng) || null,
          phone: item.phone || item.contact || null,
          email: item.email || null,
          address: item.address || item.locationText || null,
        })).filter(m => m.lat && m.lng);

        if (!cancelled) setMarkers(normalized);
        // Fit map bounds to markers if map is ready
        setTimeout(() => {
          try {
            if (mapRef.current && normalized.length > 0) {
              const bounds = normalized.map(m => [m.lat, m.lng]);
              mapRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
          } catch (e) {
            // ignore
          }
        }, 300);
      } catch (err) {
        // If markers endpoint fails, keep default marker (handled below)
        console.warn('Failed to load markers for contact map:', err);
      }
    };

    loadMarkers();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    // show global overlay
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));
    try {
      // send to backend; endpoint is configurable via VITE_CONTACT_ENDPOINT or defaults to /contact
      // We log the endpoint and payload to aid debugging when axios/network errors occur.
      const endpoint = CONTACT_ENDPOINT;
      const isAbsolute = /^https?:\/\//i.test(endpoint);
      console.debug("Contact submit -> endpoint:", endpoint, "payload:", form);

      let res;
      if (isAbsolute) {
        try {
          // Try direct axios POST for absolute endpoints
          res = await axios.post(endpoint, form, { withCredentials: true });
        } catch (err) {
          // Log detailed axios error shape for debugging
          try {
            console.error('Axios contact error (detailed):', err.toJSON ? err.toJSON() : err);
          } catch (e) {
            console.error('Axios contact error (raw):', err);
          }

          // If there's no response (network/CORS) or a 404 from the external service,
          // attempt a conservative fallback to the relative path via our apiRequest instance.
          const status = err?.response?.status;
          const noResponse = !err?.response;
          if (noResponse || status === 404) {
            const relative = endpoint.replace(/^https?:\/\//i, '').replace(/^[^/]+/, '') || '/contact';
            console.info('Attempting fallback POST via apiRequest to relative endpoint:', relative);
            try {
              res = await apiRequest.post(relative, form);
            } catch (fallbackErr) {
              // If fallback also fails, attach both errors to logs and rethrow to outer catch
              console.error('Fallback apiRequest POST failed:', fallbackErr);
              throw err;
            }
          } else {
            // For other statuses, rethrow and let outer catch handle messaging
            throw err;
          }
        }
      } else {
        // use the apiRequest axios instance (baseURL applies)
        res = await apiRequest.post(endpoint, form);
      }

      const successMsg = (res?.data && res.data.message) || "Message sent. We will get back to you soon.";
      setSuccess(successMsg);
      setShowModal(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      // Build a helpful error message including the endpoint used and any status/response data
      const status = err?.response?.status;
      const respData = err?.response?.data;
      const baseMsg = (respData && (respData.message || JSON.stringify(respData))) || err?.message || "Failed to send message";
      const endpointNote = `Endpoint: ${CONTACT_ENDPOINT}${status ? ` (status ${status})` : ""}`;
      const finalMsg = `${baseMsg}. ${endpointNote}`;
      setError(finalMsg);

      // If using an absolute endpoint and it returned 404, give an immediate alert to the user
      if (/^https?:\/\//i.test(CONTACT_ENDPOINT) && status === 404) {
        alert('Contact service not found. Please try again later.');
      }

      // Emit detailed console logs for developer debugging (network tab + err.response recommended)
      console.error('Contact submit final error:', err, { endpoint: CONTACT_ENDPOINT, status, respData });
    } finally {
      setIsLoading(false);
      // hide global overlay
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p>
            Have questions about a listing or want to talk to an agent? Send us a
            message and we will respond within 24 hours.
          </p>
          <ul>
            <li><strong>Phone:</strong> <a href="tel:+1234567890">+1 234 567 890</a></li>
            <li><strong>Email:</strong> <a href="mailto:info@example.com">info@example.com</a></li>
            <li><strong>Office:</strong> Benin City, Edo State, NG</li>
          </ul>

          <div className="contact-map">
            {/* Default coordinates: Benin City (latitude, longitude) */}
            <MapContainer
              center={markers.length ? [markers[0].lat, markers[0].lng] : [6.3382, 5.6258]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: 220, width: '100%' }}
              whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.length > 0 ? (
                markers.map((m) => (
                  <Marker key={m.id} position={[m.lat, m.lng]}>
                    <Popup>
                      <div>
                        <strong>{m.name}</strong>
                        {m.address && <div>{m.address}</div>}
                        {m.phone && <div>Phone: <a href={`tel:${m.phone}`}>{m.phone}</a></div>}
                        {m.email && <div>Email: <a href={`mailto:${m.email}`}>{m.email}</a></div>}
                      </div>
                    </Popup>
                  </Marker>
                ))
              ) : (
                <Marker position={[6.3382, 5.6258]}>
                  <Popup>
                    Dewgates Consults office<br />Benin City, Edo State
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Message
            <textarea name="message" value={form.message} onChange={handleChange} required rows={6} />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send Message'}</button>
          </div>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
        </form>
      </div>
      {showModal && (
        <div className="contact-success-modal" role="dialog" aria-modal="true">
          <div className="modal-body">
            <h3>Message Sent</h3>
            <p>{success}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
