import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./newPostPage.scss";

function NewPostPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Safely parse room counts
    const parsedBedrooms = parseInt(inputs.bedroom) || 1;
    const parsedBathrooms = parseInt(inputs.bathroom) || 1;

    // Build a safe, flat payload containing all keys expected by common backend schemas
    const finalPayload = {
      title: inputs.title,
      price: parseInt(inputs.price) || 0,
      address: inputs.address,
      city: inputs.city,
      // Supply both singular and plural fields to prevent schema validation crashes
      bedroom: parsedBedrooms,
      bedrooms: parsedBedrooms,
      bathroom: parsedBathrooms,
      bathrooms: parsedBathrooms,
      latitude: inputs.latitude || "0",
      longitude: inputs.longitude || "0",
      type: inputs.type,
      // Supply both variations for property type mapping
      property: inputs.property,
      propertyType: inputs.property, 
      desc: inputs.desc,
      utilities: inputs.utilities,
      pet: inputs.pet,
      income: inputs.income || "",
      size: parseInt(inputs.size) || 0,
      school: parseInt(inputs.school) || 0,
      bus: parseInt(inputs.bus) || 0,
      restaurant: parseInt(inputs.restaurant) || 0,
    };

    try {
      // Trying the standard flat object structure first
      const res = await axios.post(
        "https://backend-dewgates-consults.onrender.com/posts", 
        finalPayload, 
        { withCredentials: true }
      ); 
      
      navigate("/profile"); 
    } catch (err) {
      console.error(err);
      
      // FALLBACK: If your specific controller strictly demands the nested format, retry automatically:
      try {
        const nestedPayload = {
          postData: {
            title: finalPayload.title,
            price: finalPayload.price,
            address: finalPayload.address,
            city: finalPayload.city,
            bedroom: finalPayload.bedroom,
            bedrooms: finalPayload.bedrooms,
            bathroom: finalPayload.bathroom,
            bathrooms: finalPayload.bathrooms,
            latitude: finalPayload.latitude,
            longitude: finalPayload.longitude,
            type: finalPayload.type,
            property: finalPayload.property,
            propertyType: finalPayload.propertyType
          },
          postDetail: {
            desc: finalPayload.desc,
            utilities: finalPayload.utilities,
            pet: finalPayload.pet,
            income: finalPayload.income,
            size: finalPayload.size,
            school: finalPayload.school,
            bus: finalPayload.bus,
            restaurant: finalPayload.restaurant
          }
        };
        const res = await axios.post(
          "https://backend-dewgates-consults.onrender.com/posts", 
          nestedPayload, 
          { withCredentials: true }
        );
        navigate("/profile");
      } catch (nestedErr) {
        setError(nestedErr.response?.data?.message || "Fields validation failed. Check your database model names.");
      }
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>

            <div className="item description">
              <label htmlFor="desc">Description</label>
              <textarea id="desc" name="desc" required />
            </div>

            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input id="income" name="income" type="text" placeholder="Income Policy" />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            
            {error && <span className="error" style={{color: "red", display: "block", marginTop: "10px"}}>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer"></div>
    </div>
  );
}

export default NewPostPage;