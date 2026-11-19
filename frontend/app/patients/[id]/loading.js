// Shown for a moment while a patient's page loads, so tapping a patient responds straight away
export default function PatientLoading() {
  return (
    <div className="wrap detail" aria-busy="true">
      <div className="dmain">
        <div className="panel skeleton" style={{ height: 420 }} />
        <div className="panel skeleton" style={{ height: 200 }} />
      </div>
      <aside className="drail">
        <div className="panel skeleton" style={{ height: 300 }} />
      </aside>
    </div>
  );
}