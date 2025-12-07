import "./alertModal.scss";

function AlertModal({ message, isOpen, type = "success", onClose }) {
  if (!isOpen) return null;

  return (
    <div className="alertModal-overlay" onClick={onClose}>
      <div className="alertModal-container" onClick={(e) => e.stopPropagation()}>
        <div className={`alertModal-content ${type}`}>
          <div className="alertModal-icon">
            {type === "success" && <span>✓</span>}
            {type === "error" && <span>✕</span>}
            {type === "info" && <span>ℹ</span>}
          </div>
          <p className="alertModal-message">{message}</p>
          <button className="alertModal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
