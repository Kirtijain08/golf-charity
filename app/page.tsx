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

  // ➕ ADD SCORE (WITH SUBSCRIPTION CHECK)
const addScore = async () => {
  if (user?.subscriptionStatus !== "active") {
    alert("⚠️ Please subscribe to add scores");
    return;
  }

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
  if (user?.subscriptionStatus !== "active") {
    alert("⚠️ Please subscribe to run the draw");
    return;
  }

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
  const subscribe = async (plan: string) => {
    await fetch("/api/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    fetchUser();
  };
const isActive = user?.subscriptionStatus === "active";
  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* NAVBAR */}
      <div style={styles.navbar}>
  <h2>⛳ Golf Charity</h2>

  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
    
    <p
      style={styles.navItem}
      onClick={() => (window.location.href = "/")}
    >
      Dashboard
    </p>

    <p
      style={styles.navItem}
      onClick={() => (window.location.href = "/history")}
    >
      History
    </p>

    <p style={{ opacity: 0.7 }}>{user?.email}</p>

    <p
      style={styles.logout}
      onClick={() => {
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }}
    >
      Logout
    </p>

  </div>
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
        {/* ADD SCORE */}
<div style={styles.card}>
  <h2>Add Score</h2>

  <input
    type="number"
    value={score}
    onChange={(e) => setScore(e.target.value)}
    style={styles.input}
    disabled={!isActive}
  />

  <button
    onClick={addScore}
    style={{
      ...styles.button,
      opacity: isActive ? 1 : 0.5,
      cursor: isActive ? "pointer" : "not-allowed",
    }}
    disabled={!isActive}
  >
    Add
  </button>

  {!isActive && (
    <p style={{ color: "#ff4d4f", marginTop: "10px" }}>
      🔒 Subscribe to unlock features
    </p>
  )}
</div>

        {/* SCORES */}
        <div style={styles.card}>
          <h2>Your Scores</h2>
          <div style={styles.scoreList}>
            {scores.map((s, i) => (
  <motion.span
    key={i}
    style={styles.score}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: i * 0.1 }}
  >
    {s}
  </motion.span>
))}
          </div>
        </div>

        {/* SUBSCRIPTION + CHARITY */}
        <div style={styles.card}>
          <h2>Subscription</h2>

<p>Status: {user?.subscriptionStatus}</p>

{user?.subscriptionStatus !== "active" ? (
  <>
    <h3 style={{ marginTop: "10px" }}>Choose Plan</h3>

    <button
      onClick={() => subscribe("monthly")}
      style={{ ...styles.button, marginTop: "10px" }}
    >
      Monthly ₹100
    </button>

    <button
      onClick={() => subscribe("yearly")}
      style={{ ...styles.button, marginTop: "10px" }}
    >
      Yearly ₹1000 (Save 20%)
    </button>
  </>
) : (
  <>
    <p style={{ color: "#00ff99" }}>✅ Active</p>
    <p>
      Plan: <b>{user?.subscriptionPlan}</b>
    </p>
    <p>
      Expires:{" "}
      {user?.subscriptionEnd
        ? new Date(user.subscriptionEnd).toLocaleDateString()
        : "-"}
    </p>
  </>
)}
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
                {draw.drawNumbers.map((n: number, idx: number) => (
  <motion.span
    key={idx}
    style={styles.drawBall}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: idx * 0.2 }}
  >
    {n}
  </motion.span>
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
  width: "100%",
  padding: "15px",
  boxSizing: "border-box",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  color: "white",
},
  navbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap", // ⭐ important
  gap: "10px",
  padding: "15px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
},
  stats: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "15px",
},

  card: {
  background: "rgba(255,255,255,0.08)",
  padding: "20px",
  borderRadius: "16px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
},
  cardFull: {
    gridColumn: "span 2",
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "12px",
  },
  input: {
  padding: "10px",
  width: "100%",
  borderRadius: "8px",
  border: "none",
  marginBottom: "10px",
},
  button: {
  width: "100%", // ⭐ important for mobile
  padding: "10px",
  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontWeight: "bold",
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
  width: "32px",
  height: "32px",
  fontSize: "12px",
},
  drawBall: {
  background: "#ffcc00",
  padding: "10px",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  fontSize: "12px",
},
  resultBox: {
    marginTop: "10px",
    background: "rgba(255,255,255,0.2)",
    padding: "10px",
    borderRadius: "8px",
  },
};