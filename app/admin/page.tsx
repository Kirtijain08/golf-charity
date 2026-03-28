"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // 🔁 Fetch all users (for winners + payouts)
  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (id !== "ADMIN_ID_HERE") {
      window.location.href = "/";
    }
  });
  // 🎯 Run Draw
  const runDraw = async () => {
    setLoading(true);

    const res = await fetch("/api/draw");
    const data = await res.json();

    setResult(data);
    setLoading(false);

    fetchUsers(); // refresh winners
  };

  // 💰 Mark payment as paid
  const markPaid = async (userId: string) => {
    await fetch("/api/admin/update-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, status: "paid" }),
    });

    fetchUsers();
  };

  return (
    <div style={styles.container}>
      <h1>👨‍💼 Admin Panel</h1>

      {/* 🎯 DRAW BUTTON */}
      <motion.button
        style={styles.button}
        onClick={runDraw}
        whileTap={{ scale: 0.9 }}
      >
        {loading ? "Running..." : "Run Monthly Draw"}
      </motion.button>

      {/* 🎯 DRAW RESULT */}
      {result && (
        <motion.div
          style={styles.card}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2>Draw Result</h2>

          <div style={styles.numbers}>
            {result.drawNumbers.map((n: number, i: number) => (
              <motion.span
                key={i}
                style={styles.ball}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
              >
                {n}
              </motion.span>
            ))}
          </div>

          <p>🏆 Tier 5: {result.winners.tier5.winners.length}</p>
          <p>🥈 Tier 4: {result.winners.tier4.winners.length}</p>
          <p>🥉 Tier 3: {result.winners.tier3.winners.length}</p>
        </motion.div>
      )}

      {/* 💰 WINNERS + PAYOUT SECTION */}
      <div style={styles.card}>
        <h2>Winners & Payouts</h2>

        {users
          .filter((u) => u.isWinner)
          .map((u) => (
            <div key={u.id} style={styles.userCard}>
              <p><b>{u.email}</b></p>
              <p>₹{u.winningAmount}</p>
              <p>Status: {u.paymentStatus}</p>

              {u.paymentStatus === "pending" && (
                <button
                  onClick={() => markPaid(u.id)}
                  style={styles.payButton}
                >
                  Mark Paid
                </button>
              )}
            </div>
          ))}

        {users.filter((u) => u.isWinner).length === 0 && (
          <p>No winners yet</p>
        )}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    background: "linear-gradient(135deg, #141e30, #243b55)",
    color: "white",
  },

  button: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#00c6ff",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "20px",
  },

  card: {
    marginTop: "20px",
    padding: "20px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
  },

  numbers: {
    display: "flex",
    gap: "10px",
    margin: "10px 0",
    flexWrap: "wrap",
  },

  ball: {
    background: "#ffcc00",
    padding: "10px",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    fontWeight: "bold",
  },

  userCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
  },

  payButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    background: "#00ff99",
    cursor: "pointer",
  },
};