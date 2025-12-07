import { MapContainer, TileLayer } from 'react-leaflet';
import './map.scss';
import "leaflet/dist/leaflet.css";
import Pin from '../pin/Pin';
import { useEffect, useState } from 'react';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
    html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

L.Marker.prototype.options.icon = DefaultIcon;

function Map({ items }) {
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); 
    const [validItems, setValidItems] = useState([]);

    useEffect(() => {
 const itemsWithValidCoords = items.filter(item => {
            const hasValidCoords = item.latitude && item.longitude && 
                                 !isNaN(parseFloat(item.latitude)) && 
                                 !isNaN(parseFloat(item.longitude));
            
            if (!hasValidCoords) {
                console.warn('Property missing valid coordinates:', {
                    id: item._id || item.id,
                    title: item.title,
                    latitude: item.latitude,
                    longitude: item.longitude
                });
            }
            
            return hasValidCoords;
        });

        setValidItems(itemsWithValidCoords);

       if (itemsWithValidCoords.length > 0) {
            const latitudes = itemsWithValidCoords.map(item => parseFloat(item.latitude));
            const longitudes = itemsWithValidCoords.map(item => parseFloat(item.longitude));
            
            const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
            const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
            
            setMapCenter([avgLat, avgLng]);
        }
    }, [items]);

    if (validItems.length === 0) {
        return (
            <div className="mapContainer">
                <div className="noMapData">
                    <img src="/map-empty.svg" alt="No map data" />
                    <h3>No Properties with Location Data</h3>
                    <p>Properties need latitude and longitude coordinates to appear on the map.</p>
                    <div className="mapStats">
                        <p>Total properties: {items.length}</p>
                        <p>Properties with coordinates: {validItems.length}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <MapContainer 
            center={mapCenter} 
            zoom={10} 
            scrollWheelZoom={true} 
            className='map'
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validItems.map(item => (
                <Pin item={item} key={item._id || item.id} />
            ))}
        </MapContainer>
    );
}

export default Map;