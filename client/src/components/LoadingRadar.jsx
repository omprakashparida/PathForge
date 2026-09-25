export default function LoadingRadar() {
  return (
    <span className="row" style={{ gap: 10, justifyContent: 'center' }}>
      <span className="spin" />
      <span style={{ fontWeight: 600 }}>Processing...</span>
    </span>
  );
}
