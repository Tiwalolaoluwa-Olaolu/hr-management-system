import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "../../pages/LandingPage";
import Login from "../../pages/Login";
import Dashboard from "../../pages/Dashboard";
import RequestLeave from "../../pages/RequestLeave";
import TeamCalendar from "../../pages/TeamCalendar";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/leave-requests' element={<RequestLeave />} />
          <Route path='/team-calendar' element={<TeamCalendar />} />
          <Route path= '/team-request' element={<ManagerDashboard/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default Router;