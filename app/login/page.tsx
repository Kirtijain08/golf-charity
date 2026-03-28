"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [score, setScore] = useState("");
  const [scores, setScores] = useState<number[]>([]);
  const [draw, setDraw] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [charities, setCharities] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  // 🔐 AUTH CHECK
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      window.location.href = "/login";
    } else {
      setUserId(id);
    }
  }, []);

  // 🔁 FETCH DATA AFTER USER LOADED
  useEffect(() => {
    if (!userId) return;

    fetchScores();
    fetchUser();
    fetchCharities();
  }, [userId]);

  // 📊 FETCH FUNCTIONS
  const fetchScores = async () => {
    const res = await fetch(`/api/user-scores?userId=${userId}`);
    const data = await res.json();
    setScores(data);
  };

  const fetchUser = async () => {
    const res = await fetch(`/api/user?userId=${userId}`);
    const data = await res.json();
    setUser(data);
  };

  const fetchCharities = async () => {
    const res = await fetch("/api/charities");
    const data = await res.json();
    setCharities(data);
  };

  // ➕ ADD SCORE
  const addScore = async () => {
    if (!score) return;

    await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: Number(score), userId }),
    });

    setScore("");
    fetchScores();
  };

  // 🎯 RUN DRAW
  const runDraw = async () => {
    const res = await fetch("/api/draw");
    const data = await res.json();
    setDraw(data);
  };

  // ❤️ UPDATE CHARITY
  const updateCharity = async (charityId: string) => {
    await fetch("/api/update-charity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, charityId }),
    });

    fetchUser();
  };

  // 💳 SUBSCRIPTION
  const subscribe = async () => {
    await fetch("/api/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    fetchUser();
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2>⛳ Golf Charity</h2>
        <p>{user?.email}</p>
      </div>

      {/* STATS */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>Total Scores</h3>
          <p>{scores.length}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Total Pool</h3>
          <p>₹{draw?.totalPool || 0}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Tier 3 Winners</h3>
          <p>{draw?.winners?.tier3?.winners.length || 0}</p>
        </div>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {/* ADD SCORE */}
        <div style={styles.card}>
          <h2>Add Score</h2>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            style={styles.input}
          />
          <button onClick={addScore} style={styles.button}>
            Add
          </button>
        </div>

        {/* SCORES */}
        <div style={styles.card}>
          <h2>Your Scores</h2>
          <div style={styles.scoreList}>
            {scores.map((s, i) => (
              <span key={i} style={styles.score}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* SUBSCRIPTION + CHARITY */}
        <div style={styles.card}>
          <h2>Subscription</h2>

          <p>Status: {user?.subscriptionStatus}</p>

          {user?.subscriptionStatus !== "active" ? (
            <button onClick={subscribe} style={styles.button}>
              Activate
            </button>
          ) : (
            <p style={{ color: "#00ff99" }}>✅ Active</p>
          )}

          <hr style={{ margin: "10px 0" }} />

          <h3>Charity</h3>

          <select
            value={user?.charityId || ""}
            onChange={(e) => updateCharity(e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {charities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <p>Contribution: {user?.charityPercent || 10}%</p>
        </div>

        {/* DRAW */}
        <div style={styles.cardFull}>
          <h2>Monthly Draw</h2>

          <button onClick={runDraw} style={styles.button}>
            Run Draw
          </button>

          {draw && (
            <>
              <div style={styles.scoreList}>
                {draw.drawNumbers.map((n: number, i: number) => (
                  <span key={i} style={styles.drawBall}>
                    {n}
                  </span>
                ))}
              </div>

              <div style={styles.resultBox}>
                <p>🏆 Tier 5: {draw.winners.tier5.winners.length}</p>
                <p>🥈 Tier 4: {draw.winners.tier4.winners.length}</p>
                <p>🥉 Tier 3: {draw.winners.tier3.winners.length}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 🎨 STYLES
const styles: any = {
  container: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    color: "white",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  stats: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  statCard: {
    flex: 1,
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "12px",
  },
  cardFull: {
    gridColumn: "span 2",
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "12px",
  },
  input: {
    padding: "8px",
    width: "100%",
    marginBottom: "10px",
  },
  button: {
    padding: "8px",
    background: "#00c6ff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  scoreList: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  score: {
    background: "#00c6ff",
    padding: "8px",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    textAlign: "center",
  },
  drawBall: {
    background: "#ffcc00",
    padding: "10px",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    textAlign: "center",
  },
  resultBox: {
    marginTop: "10px",
    background: "rgba(255,255,255,0.2)",
    padding: "10px",
    borderRadius: "8px",
  },
};