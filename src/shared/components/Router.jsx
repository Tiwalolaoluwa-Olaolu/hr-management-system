import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "../../pages/LandingPage";
import Login from "../../pages/Login";
import Dashboard from "../../pages/Dashboard";
import RequestLeave from "../../pages/RequestLeave";
import HrStatistics from "../../pages/HrStatistics";
import People from "../../pages/People";
import LeaveHistory from "../../pages/LeaveHistory";
import TeamRequests from "../../pages/TeamRequests";
import HrStatistics from "../../pages/HrStatistics";
import People from "../../pages/People";
import LeaveHistory from "../../pages/LeaveHistory";
import TeamRequests from "../../pages/TeamRequests";
import LeaveTracker from "../../pages/LeaveTracker";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/leave-requests' element={<RequestLeave />} />
          <Route path='/leave-history' element={<LeaveHistory />} />
          <Route path='/leave-tracker' element={<LeaveTracker />} />
          <Route path='/team-requests' element={<TeamRequests />} />
          <Route path='/people' element={<People />} />
          <Route path='/statistics' element={<HrStatistics />} />
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default Router;
