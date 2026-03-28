"use client";

export default function ScoreForm({ score, setScore, addScore }: any) {
  return (
    <div>
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <button onClick={addScore}>Add</button>
    </div>
  );
}