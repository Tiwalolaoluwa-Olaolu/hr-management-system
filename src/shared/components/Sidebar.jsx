import { ArrowDown, ArrowUp, CalendarCheck2, ChartLine, IdCardLanyard, LogOut } from "lucide-react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";
import EmployeeSidebar from "./EmployeeSidebar";
import SignOut from "./Signout";
import { useState } from "react";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPersonalToggled, setIsPersonalToggled] = useState(false);
  const [isCompanyToggled, setIsCompanyToggled] = useState(false);

  const handleSignOut = () => setIsOpen(prev => !prev);
  const togglePersonalNav = () => setIsPersonalToggled(prev => !prev);
  const toggleCompanyNav = () => setIsCompanyToggled(prev => !prev);

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
            role === 'Employee' ? (
              <EmployeeSidebar 
                toHomeClick={navigateToHome}
                toHistoryClick={navigateToHistory}
              />
            ) : (
              <>
                <p className='nav-section-header' onClick={togglePersonalNav}>
                  PERSONAL
                  <span>
                    {
                      isPersonalToggled ? <ArrowUp size={20} /> : <ArrowDown size={20} />
                    }
                  </span>
                </p>
                {
                  isPersonalToggled && (<EmployeeSidebar 
                    toHomeClick={navigateToHome}
                    toHistoryClick={navigateToHistory}
                  />)
                }
                <ul className='nav-list'>
                  <p className='nav-section-header' onClick={toggleCompanyNav}>
                    COMPANY
                    <span>
                      {
                        isCompanyToggled ? <ArrowUp size={20} /> : <ArrowDown size={20} />
                      }
                    </span>
                  </p>
                  {
                    (isCompanyToggled && role === 'HRAdmin') && (
                      <>
                        <li onClick={navigateToPeople}>
                          <span>{<IdCardLanyard size={32} />}</span>
                          <h3>PEOPLE</h3>
                        </li>
                        <li onClick={navigateToStats}>
                          <span>{<ChartLine size={32} />}</span>
                          <h3>LEAVE STATISTICS</h3>
                        </li>
                      </>
                    )
                  }
                  {
                    (isCompanyToggled && role === 'Manager') && (
                      <li onClick={navigateToTeam}>
                        <span>{<CalendarCheck2 size={32} />}</span>
                        <h3>TEAM REQUESTS</h3>
                      </li>
                    )
                  } 
                </ul>
              </>
            )
          }
          <li className='sidebar-signout' onClick={handleSignOut}>
            <span>{<LogOut size={32} />}</span>
            <h3>SIGN OUT</h3>
          </li>
          {
            isOpen && <SignOut wide={isOpen} onClose={handleSignOut} />
          }
        </ul>
      </aside>
    </>
  )
};

export default Sidebar;