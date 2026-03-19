// src/App.js
import React, { useState, useEffect } from "react";

function App() {
  const [index, setIndex] = useState("");
  const [allValues, setAllValues] = useState([]);
  const [currentValues, setCurrentValues] = useState({});

  // Fetch all submitted indices
  const fetchAllValues = async () => {
    try {
      const res = await fetch("/api/values/all");
      const data = await res.json();
      setAllValues(data);
    } catch (err) {
      console.error("Error fetching all values:", err);
    }
  };

  // Fetch current computed Fibonacci values
  const fetchCurrentValues = async () => {
    try {
      const res = await fetch("/api/values/current");
      const data = await res.json();
      setCurrentValues(data);
    } catch (err) {
      console.error("Error fetching current values:", err);
    }
  };

  // Submit a new index
  const handleSubmit = async () => {
    if (!index) return alert("Enter an index!");
    if (parseInt(index) > 30) return alert("Index too high!");
    try {
      await fetch("/api/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      setIndex("");
      fetchAllValues();
      fetchCurrentValues();
    } catch (err) {
      console.error("Error submitting index:", err);
    }
  };
  const [hi, sethi] = useState("")
  async function fetch_hi() {
    try {
      const res = await fetch("/");
      const data = await res.json();
      sethi(data)
    } catch (err) {
      console.error("Error submitting index:", err);
    }
  }
  useEffect(() => {
    // Fetch data every 2 seconds
    fetchAllValues();
    fetchCurrentValues();
    fetch_hi()
    const interval = setInterval(() => {
      fetchAllValues();
      fetchCurrentValues();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {hi && <h1>{hi}</h1>}
      <h1>Fibonacci Tester</h1>
      <input
        type="number"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        placeholder="Enter index"
        min="0"
        max="30"
        style={{ padding: "5px", width: "100px" }}
      />
      <button onClick={handleSubmit} style={{ padding: "5px 10px", marginLeft: "10px" }}>
        Submit
      </button>

      <h2>Submitted Indices</h2>
      <ul>
        {allValues.map((item) => (
          <li key={item.number}>{item.number}</li>
        ))}
      </ul>

      <h2>Computed Fib Values</h2>
      <ul>
        {Object.keys(currentValues).map((key) => (
          <li key={key}>
            Index {key}: {currentValues[key]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;