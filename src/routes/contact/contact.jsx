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

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '/contact';
const MARKERS_ENDPOINT = import.meta.env.VITE_MARKERS_ENDPOINT || '/users';

function Contact() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    subject: "",
    message: "" 
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        const normalized = (Array.isArray(data) ? data : []).map((item, idx) => ({
          id: item.id ?? item._id ?? idx,
          name: item.username || item.name || item.agentName || item.title || 'Office',
          lat: Number(item.lat ?? item.latitude ?? item.location?.lat) || 6.3382,
          lng: Number(item.lng ?? item.longitude ?? item.location?.lng) || 5.6258,
          phone: item.phone || item.contact || '+234 905 642 4816',
          email: item.email || 'info@dewgatesconsults.com',
          address: item.address || item.locationText || 'Benin City, Edo State',
        })).filter(m => m.lat && m.lng);

        if (!cancelled) setMarkers(normalized);
        
         setTimeout(() => {
          try {
            if (mapRef.current && normalized.length > 0) {
              const bounds = normalized.map(m => [m.lat, m.lng]);
              mapRef.current.fitBounds(bounds, { padding: [20, 20] });
            }
          } catch (e) {
            console.warn('Could not fit map bounds:', e);
          }
        }, 500);
      } catch (err) {
        console.warn('Failed to load markers for contact map:', err);
         setMarkers([{
          id: 1,
          name: 'Dewgates Consults',
          lat: 6.3382,
          lng: 5.6258,
          phone: '+234 905 642 4816',
          email: 'info@dewgatesconsults.com',
          address: 'Benin City, Edo State, Nigeria'
        }]);
      }
    };

    loadMarkers();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));

    try {
      const endpoint = CONTACT_ENDPOINT;
      const isAbsolute = /^https?:\/\//i.test(endpoint);

      let res;
      if (isAbsolute) {
        res = await axios.post(endpoint, form, { withCredentials: true });
      } else {
        res = await apiRequest.post(endpoint, form);
      }

      const successMsg = res?.data?.message || "Thank you for your message! We'll get back to you within 24 hours.";
      setSuccess(successMsg);
      setShowModal(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      
    } catch (err) {
      console.error('Contact form submission error:', err);
      
      const errorMsg = err?.response?.data?.message || 
                      err?.message || 
                      "Sorry, we couldn't send your message. Please try again later.";
      
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }
  };

  const getCurrentDay = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">
        {/* Contact Information Section */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Ready to find your dream property? Our expert team is here to help you 
            every step of the way. Reach out to us through any of the channels below.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <div className="icon">
                <img src="/phone.png" alt="Phone" />
              </div>
              <div className="content">
                <h3>Call Us</h3>
                <a href="tel:+2349056424816">(+234) 905-642-4816 </a>
                <p>Mon-Fri from 8am to 6pm</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon">
                <img src="/mail.png" alt="Email" />
              </div>
              <div className="content">
                <h3>Email Us</h3>
                <a href="mailto:info@dewgatesconsults.com">info@dewgatesconsults.com</a>
                <p>We will respond within 24 hours</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon">
                <img src="/pin.png" alt="Location" />
              </div>
              <div className="content">
                <h3>Visit Us</h3>
                <p>Benin City, Edo State</p>
                <p>Nigeria</p>
              </div>
            </div>
          </div>

          <div className="business-hours">
            <h3>Business Hours</h3>
            <div className="hours-list">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <div 
                  key={day} 
                  className={`hour-item ${getCurrentDay() === day ? 'today' : ''}`}
                >
                  <span className="day">{day}</span>
                  <span className="time">
                    {day === 'Sunday' ? 'Closed' : '8:00 AM - 6:00 PM'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-map">
            <div className="map-container">
              <MapContainer
                center={[6.3382, 5.6258]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((m) => (
                  <Marker key={m.id} position={[m.lat, m.lng]}>
                    <Popup>
                      <div style={{ minWidth: '200px' }}>
                        <strong>{m.name}</strong>
                        {m.address && <div style={{ margin: '8px 0' }}>{m.address}</div>}
                        {m.phone && (
                          <div style={{ margin: '4px 0' }}>
                            📞 <a href={`tel:${m.phone}`}>{m.phone}</a>
                          </div>
                        )}
                        {m.email && (
                          <div style={{ margin: '4px 0' }}>
                            ✉️ <a href={`mailto:${m.email}`}>{m.email}</a>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-header">
            <h3>Send us a Message</h3>
            <p>Fill out the form below and we will get back to you as soon as possible.</p>
          </div>

          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name">Full Name *</label>
            <div className="input-wrapper">
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              <img src="/user.png" alt="Name" className="input-icon" />
            </div>
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email Address *</label>
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
              <img src="/mail.png" alt="Email" className="input-icon" />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (optional)"
              />
              <img src="/phone.png" alt="Phone" className="input-icon" />
            </div>
          </div>

          <div className={`form-group ${errors.subject ? 'has-error' : ''}`}>
            <label htmlFor="subject">Subject *</label>
            <div className="input-wrapper">
              <input
                id="subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
              />
              <img src="/subject.png" alt="Subject" className="input-icon" />
            </div>
            {errors.subject && <div className="error-message">{errors.subject}</div>}
          </div>

          <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
            <label htmlFor="message">Message *</label>
            <div className="input-wrapper">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                required
                rows={6}
              />
            </div>
            {errors.message && <div className="error-message">{errors.message}</div>}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="button-loader"></span>
                  Sending Message...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>

          {errors.submit && <div className="form-error">{errors.submit}</div>}
          {success && <div className="form-success">{success}</div>}
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="contact-success-modal" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
          <div className="modal-body">
            <div className="success-icon" aria-hidden="true"></div>
            <h3 id="success-modal-title">Message Sent Successfully!</h3>
            <p>{success}</p>
            <button onClick={() => setShowModal(false)}>Continue Browsing</button>
          </div>
        </div>
      )};
    </div>
  );
}

export default Contact;