import { CalendarCheck2, ClockFading, LayoutDashboard, LogOut, Radar } from "lucide-react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const navigateToHome = () => navigate('/dashboard');

  return (
    <>
      <aside className='side-bar'>
        <NavBar className='side-bar-title' />
        <ul className='nav-list'>
          <li onClick={navigateToHome}>
            <span>{<LayoutDashboard size={32} />}</span>
            <h3>HOME</h3>
          </li>
          <li>
            <span>{<ClockFading size={32} />}</span>
            <h3>LEAVE TRACKER</h3>
          </li>
          {
            role === 'Manager' && <li>
              <span>{<CalendarCheck2 size={32} />}</span>
              <h3>TEAM REQUESTS</h3>
          </li>
          }
          <li>
            <span>{<Radar size={32} />}</span>
            <h3>LEAVE HISTORY</h3>
          </li>
          <li>
            <span>{<LogOut size={32} />}</span>
            <h3>SIGN OUT</h3>
          </li>
        </ul>
      </aside>
    </>
  )
};

export default Sidebar;