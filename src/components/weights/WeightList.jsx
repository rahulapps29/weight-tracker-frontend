import { format } from "date-fns";

const WeightList = ({ entries, onDelete }) => {
  return (
    <div className="weight-list">
      <h3>Your Weight History</h3>
      {entries.length === 0 ? (
        <p>No weight entries yet. Add your first entry above!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight (kg)</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>{format(new Date(entry.date), "MMM dd, yyyy")}</td>
                <td>{entry.weight}</td>
                <td>{entry.notes || "-"}</td>
                <td>
                  <button
                    onClick={() => onDelete(entry._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeightList;
