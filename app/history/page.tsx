"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function History() {
  const [draws, setDraws] = useState<any[]>([]);

  const fetchHistory = async () => {
    const res = await fetch("/api/history");
    const data = await res.json();
    setDraws(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📜 Draw History</h1>

      {draws.map((d, index) => {
        const numbers = JSON.parse(d.numbers); // ✅ FIX HERE

        return (
          <motion.div
            key={d.id}
            style={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>Draw #{index + 1}</h3>

            <div style={styles.numbers}>
              {numbers.map((n: number, idx: number) => (
                <span key={idx} style={styles.ball}>
                  {n}
                </span>
              ))}
            </div>

            <p>💰 Pool: ₹{d.totalPool}</p>
            <p style={styles.date}>
              {new Date(d.createdAt).toLocaleString()}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

const styles: any = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #141e30, #243b55)",
    color: "white",
  },

  title: {
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    backdropFilter: "blur(10px)",
  },

  numbers: {
    display: "flex",
    gap: "10px",
    margin: "10px 0",
  },

  ball: {
    background: "#ffcc00",
    color: "#000",
    padding: "10px",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  date: {
    fontSize: "12px",
    opacity: 0.7,
  },
};