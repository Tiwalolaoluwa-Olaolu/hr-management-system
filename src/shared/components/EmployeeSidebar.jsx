import { LayoutDashboard, ClockFading, Radar } from "lucide-react";

const EmployeeSidebar = ({ toHomeClick, toHistoryClick, toLeaveTrackerClick }) => {
  return (
    <>
      <li onClick={toHomeClick}>
        <span>{<LayoutDashboard size={32} />}</span>
        <h3>HOME</h3>
      </li>
      <li onClick={toLeaveTrackerClick}>
        <span>{<ClockFading size={32} />}</span>
        <h3>LEAVE TRACKER</h3>
      </li>
      <li onClick={toHistoryClick}>
        <span>{<Radar size={32} />}</span>
        <h3>LEAVE HISTORY</h3>
      </li>
    </>
  );
};

export default EmployeeSidebar;