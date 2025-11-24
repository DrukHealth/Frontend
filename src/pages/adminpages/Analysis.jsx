import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function Analysis() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analysis")
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  const dates = data.predictions.map((d) => d.date);
  const N = data.predictions.map((d) => d.N);
  const S = data.predictions.map((d) => d.S);
  const P = data.predictions.map((d) => d.P);

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "auto" }}>
      <h2>Fetal Health Predictions</h2>
      <div>
        Total Patients: {data.patients} | Pathological: {data.positive_cases} | Accuracy: {data.accuracy}%
      </div>
      <Plot
        data={[
          { x: dates, y: N, type: "scatter", mode: "lines+markers", name: "Normal (N)", line: { color: "green" } },
          { x: dates, y: S, type: "scatter", mode: "lines+markers", name: "Suspect (S)", line: { color: "orange" } },
          { x: dates, y: P, type: "scatter", mode: "lines+markers", name: "Pathological (P)", line: { color: "red" } },
        ]}
        layout={{
          title: "NSP Predictions Over Time",
          xaxis: { title: "Date", type: "category" },
          yaxis: { title: "Number of Cases", dtick: 1, rangemode: "tozero", range: [0, 6] },
          hovermode: "x unified",
        }}
        style={{ width: "100%", height: "500px" }}
        config={{ responsive: true }}
      />
    </div>
  );
}
