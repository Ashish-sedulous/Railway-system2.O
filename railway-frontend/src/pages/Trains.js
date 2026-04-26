import { useEffect, useState } from "react";
import { getTrains } from "../services/api";

export default function Trains() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    getTrains()
      .then(res => {
        if (res && res.success) {
          setTrains(res.data || []);
        } else {
          setTrains([]);
        }
      })
      .catch(err => {
        console.error("Error fetching trains:", err);
        setTrains([]);
      });
  }, []);

  return (
    <div>
      <h2>Trains</h2>

      {(trains || []).length === 0 ? (
        <p>No trains available</p>
      ) : (
        (trains || []).map(t => (
          <div key={t.train_id}>
            Train {t.train_id} → {t.source_name} to {t.destination_name}
          </div>
        ))
      )}

    </div>
  );
}