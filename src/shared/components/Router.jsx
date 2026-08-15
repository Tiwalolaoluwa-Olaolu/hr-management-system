import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "../../pages/LandingPage";
import Login from "../../pages/Login";
import Dashboard from "../../pages/Dashboard";
import RequestLeave from "../../pages/RequestLeave";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/request-leave' element={<RequestLeave />} />
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default Router;