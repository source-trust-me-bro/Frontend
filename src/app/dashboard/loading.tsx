/** Shown in the content area while a dashboard page loads. The sidebar and panel stay put. */
export default function DashboardLoading() {
  return (
    <div className="dash-view" aria-busy="true" aria-live="polite">
      <div className="dash-skeleton dash-skeleton--line dash-skeleton--title"></div>
      <div className="dash-skeleton dash-skeleton--line"></div>
      <div className="dash-skeleton dash-skeleton--card"></div>
      <div className="dash-skeleton dash-skeleton--card"></div>
      <span className="dash-sr">Loading</span>
    </div>
  );
}
