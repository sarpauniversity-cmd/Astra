import { useEffect, useState } from "react";

const API =
"https://script.google.com/macros/s/AKfycbzFCJGZtLgziL_4OyyI6kCXYmaXwBELf72E0W1_QSCBlAmwo05jG7U1MutdN1OKIVBlwg/exec";

export default function App() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  async function load() {
    const r = await fetch(API);
    const j = await r.json();
    setRows(j);
  }

  if (!rows.length) return <h2>Loading...</h2>;

  const last = rows[rows.length - 1];

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>ASTRA LIVE DASHBOARD</h1>

      <h2>Robot Status</h2>

      <p>Robot ID : {last["Robot ID"]}</p>
      <p>Shelf ID : {last["Shelf ID"]}</p>
      <p>Status : {last["Shelf Status"]}</p>
      <p>Stock % : {last["Stock %"]}</p>
      <p>Battery % : {last["Battery %"]}</p>
      <p>Alert : {last["Alert T"]}</p>

      <hr />

      <h2>History</h2>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Time</th>
            <th>Robot</th>
            <th>Shelf</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Battery</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.Timestamp}</td>
              <td>{r["Robot ID"]}</td>
              <td>{r["Shelf ID"]}</td>
              <td>{r["Shelf Status"]}</td>
              <td>{r["Stock %"]}</td>
              <td>{r["Battery %"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2>Live Camera</h2>

      <img src="http://192.168.4.1/stream" width="480" />
    </div>
  );
}
