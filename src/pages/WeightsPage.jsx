import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import {
  getWeightEntries,
  addWeightEntry,
  deleteWeightEntry,
} from "../api/weights";
import AddWeight from "../components/weights/AddWeight";
import WeightList from "../components/weights/WeightList";
import WeightChart from "../components/weights/WeightChart";
import AuthContext from "../context/AuthContext";

const WeightsPage = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getWeightEntries(token);
        setEntries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchEntries();
    }
  }, [token, isAuthenticated]);

  const handleAddEntry = async (entry) => {
    try {
      const newEntry = await addWeightEntry(entry, token);
      setEntries([newEntry, ...entries]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await deleteWeightEntry(id, token);
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="weights-page">
      <h1>Wellness Tracker</h1>
      <div className="weights-container">
        <div className="weights-chart">
          <WeightChart entries={entries} />
        </div>
        <AddWeight onAdd={handleAddEntry} />
        <WeightList entries={entries} onDelete={handleDeleteEntry} />
      </div>
    </div>
  );
};

export default WeightsPage;
