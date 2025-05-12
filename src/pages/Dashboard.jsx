import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WeightChart from "../components/weights/WeightChart";
import AuthContext from "../context/AuthContext";
import { getWeightEntries } from "../api/weights"; // Import your API function
import { Plus } from "lucide-react"; // For + icon
// import "./Dashboard.css";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchWeightEntries = async () => {
      try {
        const data = await getWeightEntries(token);
        setEntries(data);
      } catch (err) {
        console.error("Failed to fetch weight entries:", err);
        setError("Failed to load weight data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeightEntries();
  }, [token]); // Re-fetch when token changes

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.username}!</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>
            Quick Actions{" "}
            <button className="plus-btn" onClick={() => setShowModal(true)}>
              <Plus size={18} />
            </button>
          </h3>
        </div>
        <div className="card chart-container">
          {isLoading ? (
            <p>Loading chart data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : entries.length > 0 ? (
            <WeightChart entries={entries} />
          ) : (
            <p>No weight entries found. Add your first entry!</p>
          )}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Quick Actions</h3>
            <ul>
              <li>
                <Link to="/weights/add" className="modal-link">
                  ➕ Add Weight Entry
                </Link>
              </li>
              <li>
                <Link to="/weights" className="modal-link">
                  📋 View All Entries
                </Link>
              </li>
            </ul>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
