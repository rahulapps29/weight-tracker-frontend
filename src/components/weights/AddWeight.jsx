import { useState, useContext, useEffect } from "react";
import { addWeightEntry } from "../../api/weights";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddWeight = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);

  const [formData, setFormData] = useState({
    weight: "",
    notes: "",
    datetime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const localISO = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setFormData((prev) => ({
      ...prev,
      datetime: localISO,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.weight || isNaN(formData.weight)) {
      setError("Please enter a valid weight");
      return;
    }

    const numericWeight = parseFloat(formData.weight);
    if (numericWeight < 0 || numericWeight > 300) {
      setError("Weight must be between 30 and 300 kg");
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setError("");

    try {
      const numericWeight = parseFloat(formData.weight);
      const dateTime = new Date(formData.datetime);
      const isoString = dateTime.toISOString();

      const payload = {
        weight: numericWeight,
        notes: formData.notes,
        date: isoString,
      };

      await addWeightEntry(payload, token);

      const now = new Date();
      const localISO = now.toISOString().slice(0, 16);
      setFormData({
        weight: "",
        notes: "",
        datetime: localISO,
      });

      setTimeout(() => {
        navigate("/weights");
      }, 100);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add weight entry. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-weight">
      <h3>Add New Weight Entry</h3>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            min="0"
            max="300"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="datetime">Date & Time</label>
          <input
            id="datetime"
            name="datetime"
            type="datetime-local"
            value={formData.datetime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span> Adding...
            </>
          ) : (
            "Add Entry"
          )}
        </button>
      </form>

      {showConfirmModal && (
        <div className="custom-modal">
          <div className="modal-content">
            <h4>Do you want to create a weight entry?</h4>
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={confirmSubmit}
                style={{ marginRight: "10px", padding: "6px 16px" }}
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ padding: "6px 16px", backgroundColor: "#ccc" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWeight;
