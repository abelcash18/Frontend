import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item, onEdit, onDelete, showActions = false }) {
    const mainImage = item.images && item.images.length > 0 
        ? item.images[0] 
        : "/no-image.jpg";

    return (
        <div className="card">
            {showActions && (
                <div className="cardActions">
                    <button 
                        className="editBtn" 
                        onClick={() => onEdit(item)}
                        title="Edit post"
                    >
                        ✏️
                    </button>
                    <button 
                        className="deleteBtn" 
                        onClick={() => onDelete(item._id || item.id)}
                        title="Delete post"
                    >
                        🗑️
                    </button>
                </div>
            )}
            
            <Link to={`/${item._id || item.id}`} className="imageContainer">
                <img src={mainImage} alt={item.title} />
                <div className="imageCount">
                    {item.images && item.images.length > 1 && `+${item.images.length - 1}`}
                </div>
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/${item._id || item.id}`}>{item.title}</Link>
                </h2>
                <p className="address">
                    <img src="/pin.png" alt="" />
                    <span>{item.address}, {item.city}</span>
                </p>
                <p className="price">N{item.price.toLocaleString()}</p>
                <div className="bottom">
                    <div className="features">
                        <div className="feature">
                            <img src="/bed.png" alt="" />
                            <span>{item.bedroom} bedroom{item.bedroom !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="feature">
                            <img src="/bath.png" alt="" />
                            <span>{item.bathroom} bathroom{item.bathroom !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div className="icons">
                        <div className="icon">
                            <img src="/save.png" alt="Save" />
                        </div>
                        <div className="icon">
                            <img src="/chat.png" alt="Chat" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;