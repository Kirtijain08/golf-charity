export default function ScoreList({ scores }: any) {
  return (
    <div>
      {scores.map((s: number, i: number) => (
        <span key={i}>{s} </span>
      ))}
    </div>
  );
}