import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const PageLayout = () => {

  return (
    <>
      <div>
        <Sidebar role={role} />
      </div>
      <main>
        <TopBar
          firstName={firstName}
          lastName={lastName}
          role={role}
          status={status}
        />
        <Outlet />
      </main>
    </>
  )
};

export default PageLayout;