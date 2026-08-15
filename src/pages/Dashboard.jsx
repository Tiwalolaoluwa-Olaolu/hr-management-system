import { Plus } from "lucide-react";
import Button from "../shared/components/Button";
import Sidebar from "../shared/components/Sidebar";
import BalanceCard from "../shared/components/BalanceCard";
import StatsCard from "../shared/components/StatsCard";
import { useNavigate } from "react-router";
import ErrorMessage from "../shared/components/ErrorMessage";
import TopBar from "../shared/components/TopBar";

const Dashboard = () => {
  const navigate = useNavigate();

  const userInfo = {
    firstName: 'Tiwalola',
    lastName: 'Olaolu',
    role: 'Employee',
    status: 'Active',
    leaveBalance: 18,
    completedRequests: 25,
    pendingRequests: 2
  };

  const {
    firstName,
    lastName,
    role,
    status,
    leaveBalance,
    completedRequests,
    pendingRequests} = userInfo
  ;

  const navigateToRequestLeave = () => {
    status === 'Active' ? navigate('/request-leave') : <ErrorMessage />;
  }

  return (
    <>
      <main className='dashboard-wrapper'>
        <Sidebar role={role} />
        <div className='dashboard-main-view'>
          <TopBar />
          <div className='stats-section-wrapper'>
            <h2>Welcome, {firstName}!</h2>
            <section className='stats-section'>
              <BalanceCard balance={leaveBalance} />
              <StatsCard
                cardTitle='COMPLETED'
                number={completedRequests}
              />
              <StatsCard
                cardTitle='PENDING'
                number={pendingRequests}
              />
            </section>
            <Button
              btnEvent={navigateToRequestLeave}
              btnUniqueStyling='request-leave-btn'
              btnIcon={<Plus />}
              btnText='Request Leave'
            />
          </div>
          <section className="feed-section">
            <div className='activity-section'>
              <h3>Recent Activity</h3>
            </div>
            <div className='trend-section'>

            </div>
          </section>
        </div>
      </main>
    </>
  )
};

export default Dashboard;