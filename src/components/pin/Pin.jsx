import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import "./pin.scss";

function Pin({ item }) {
    // Validate coordinates before rendering
    const isValidLocation = item.latitude && item.longitude && 
                           !isNaN(parseFloat(item.latitude)) && 
                           !isNaN(parseFloat(item.longitude));

    // If no valid coordinates, don't render the marker
    if (!isValidLocation) {
        console.warn('Invalid coordinates for property:', item._id || item.id, item.latitude, item.longitude);
        return null;
    }

    const position = [parseFloat(item.latitude), parseFloat(item.longitude)];

    return (
        <Marker position={position}>
            <Popup>
                <div className="popupContainer">
                    <img 
                        src={item.images && item.images.length > 0 ? item.images[0] : "/no-image.jpg"} 
                        alt={item.title}
                        className="popupImage"
                    />
                    <div className="popupText">
                        <h3>{item.title}</h3>
                        <p className="price">${item.price}</p>
                        <p className="address">{item.address}, {item.city}</p>
                        <p className="details">{item.bedroom} bed • {item.bathroom} bath</p>
                        <Link to={`/${item._id || item.id}`} className="viewDetails">
                            View Details
                        </Link>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

export default Pin;