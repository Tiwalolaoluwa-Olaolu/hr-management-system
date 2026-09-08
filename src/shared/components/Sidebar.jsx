import { CalendarCheck2, ClockFading, LayoutDashboard, LogOut, Radar } from "lucide-react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";
import HrSidebar from "./HrSidebar";
import SignOut from "./Signout";
import { useState } from "react";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSignOut = () => setIsOpen(prev => !prev);

  const navigate = useNavigate();
  const navigateToHome = () => navigate('/dashboard');
  const navigateToTeam = () => navigate('/team-requests');
  const navigateToHistory = () => navigate('/leave-history');
  const navigateToPeople = () => navigate('/people');
  const navigateToStats = () => navigate('/statistics');

  return (
    <>
      <aside className='side-bar'>
        <NavBar className='side-bar-title' />
        <ul className='nav-list'>
          {
            role === 'HRAdmin' ? 
              (
                <HrSidebar 
                  toHomeClick={navigateToHome}
                  toPeopleClick={navigateToPeople}
                  toStatsClick={navigateToStats}
                  wide={isOpen}
                  onClose={handleSignOut}
                />
              ) : (
              <>
              <li onClick={navigateToHome}>
                <span>
                  {<LayoutDashboard size={32} />}
                </span>
                <h3>HOME</h3>
              </li>
              <li>
                <span>
                  {<ClockFading size={32} />}
                </span>
                <h3>LEAVE TRACKER</h3>
              </li>
              {
                role === 'Manager' && (<li onClick=   {navigateToTeam}>
                  <span>{<CalendarCheck2 size={32} />}</span>
                  <h3>TEAM REQUESTS</h3>
                </li>)
              }
              <li onClick={navigateToHistory}>
                <span>{<Radar size={32} />}</span>
                <h3>LEAVE HISTORY</h3>
              </li>
              <li className='sidebar-signout' onClick={handleSignOut}>
                <span>{<LogOut size={32} />}</span>
                <h3>SIGN OUT</h3>
              </li>
              {
                isOpen && <SignOut wide={isOpen} onClose={handleSignOut} />
              }
              </>
            )
          }
        </ul>
      </aside>
    </>
  )
};

export default Sidebar;