"use client";

import Link from "next/link";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 40px",
      background: "#111",
      color: "white"
    }}>
      <h3>⛳ Golf Charity</h3>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/">Dashboard</Link>
        <Link href="/history">History</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}