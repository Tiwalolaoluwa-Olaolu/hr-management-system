import { ChartLine, IdCardLanyard, LayoutDashboard, LogOut } from "lucide-react";
import SignOut from "./Signout";

const HrSidebar = ({toHomeClick, toPeopleClick, toStatsClick, wide, onClose}) => {
  return (
    <>
      <li onClick={toHomeClick}>
        <span>{<LayoutDashboard size={32} />}</span>
        <h3>HOME</h3>
      </li>
      <li onClick={toPeopleClick}>
        <span>{<IdCardLanyard size={32} />}</span>
        <h3>PEOPLE</h3>
      </li>
      <li onClick={toStatsClick}>
        <span>{<ChartLine size={32} />}</span>
        <h3>LEAVE STATISTICS</h3>
      </li>
      <li onClick={onClose}>
        <span>{<LogOut size={32} />}</span>
        <h3>SIGN OUT</h3>
      </li>
      {
        wide && <SignOut wide={wide} onClose={onClose} />
      }
    </>
  );
};

export default HrSidebar;