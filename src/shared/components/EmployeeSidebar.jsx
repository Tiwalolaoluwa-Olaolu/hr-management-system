import { LayoutDashboard, ClockFading, Radar } from "lucide-react";

const EmployeeSidebar = ({ toHomeClick, toHistoryClick, toLeaveTrackerClick, role }) => {
  return (
    <>
      <li onClick={toHomeClick}>
        <span>{<LayoutDashboard size={32} />}</span>
        <h3>HOME</h3>
      </li>
      {
        role === 'Manager' && (
          <li onClick={toLeaveTrackerClick}>
            <span>{<ClockFading size={32} />}</span>
            <h3>LEAVE TRACKER</h3>
          </li>
        )
      }
      <li onClick={toHistoryClick}>
        <span>{<Radar size={32} />}</span>
        <h3>MY LEAVE HISTORY</h3>
      </li>
    </>
  );
};

export default EmployeeSidebar;