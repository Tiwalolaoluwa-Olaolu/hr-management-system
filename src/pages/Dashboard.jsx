import { ArrowRight, CalendarClock, CheckCircle2, Clock3, UsersRound, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AppShell from '../shared/components/AppShell';
import StatusBadge from '../shared/components/StatusBadge';
import ApiStatus from '../shared/components/ApiStatus';
import { useAuth } from '../core/services/Context';
// import { apiGet } from '../services/api';
import { testDashboardData } from '../shared/components/TestData';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // const result = await apiGet('/dashboard');
      // setData(result);

      setData(testDashboardData[user.role]);
    };

    load();
    
    }, [user]
  );

  if (!user) return null;

  return (
    <AppShell
      name={user.name}
      role={user.role}
      status={user.status}
    >
      <section className='page-heading dashboard-heading'>
        <div>
          <span className='eyebrow'>OVERVIEW</span>
          <h1>Hi, {user.firstName}</h1>
          <p>Here is your leave management overview.</p>
        </div>
        {
          user.status === 'Active' && (
          <button type='button' className='primary-action'  
            onClick={() => navigate('/leave-requests')}>
            Request leave
            <ArrowRight size={17} />
          </button>)
        }
      </section>
      {
        error ? 
          <ApiStatus message={error} /> :
          !data ? 
            <ApiStatus /> :
            <DashboardContent
              data={data}
              role={user.role}
              navigate={navigate}
            />
      }
    </AppShell>
  );
};

const DashboardContent = ({ data, role, navigate }) => {
  const requests = data.requests || [];
  const recent = requests.slice(0, 5);

  return (
    <>
      <section className='metric-grid'>
        <Metric
          icon={<WalletCards />}
          label='Leave balance'
          value={`${data.leaveBalance ?? 0} days`}
          accent
        />
        <Metric
          icon={<Clock3 />}
          label='Pending requests'
          value={data.pendingRequests ?? 0}
          note={role === 'Manager' ? 'Awaiting your review' : 'Awaiting approval'}
        />
        <Metric
          icon={
            role === 'Manager' ? <UsersRound /> : <CheckCircle2 />
            }
            label={
              role === 'Manager' ? 'Team members' : 'Completed requests'
            }
            value={
              data.teamMembers ?? data.completedRequests ?? 0
            } 
            note='Current backend data'
          />
      </section>

      <section className='content-card dashboard-list-card'>
        <div className='section-header'>
          <div>
            <span className='eyebrow'>ACTIVITY</span>
            <h2>Recent leave activity</h2>
          </div>
        <button
          type='button'
          className='text-button'
          onClick={
            () => navigate(role === 'Manager' ? '/  team-requests' :
            role === 'HR Admin' ? '/statistics' : '/leave-requests'
          )}>
            View details
            <ArrowRight size={15} />
          </button>
        </div>
        {
          !recent.length ?
          (<div className='empty-state'>
            <CalendarClock size={30} />
            <p>No leave activity has been returned by the backend.</p>
          </div>) : 
          (<div className='request-row-list'>
            {
              recent.map((request) =>
                <div className='request-row' key={request.id}>
                  <div className='request-row-main'>
                    <div className='mini-avatar'>
                      {
                        request.employee?.firstName?.[0] || '?'
                      }
                    </div>
                    <div>
                      <strong>
                        {
                          request.leaveType?.name || request.leaveTypeName || 'Leave request'
                        }
                      </strong>
                      <span>
                        {request.startDate} — {request.endDate}
                      </span>
                    </div>
                  </div>
                  <div className='request-row-meta'>
                    <strong>
                      {
                        request.days ?? 0
                      } days
                    </strong>
                    <StatusBadge status={request.status} />
                  </div>
                </div>)
              }
            </div>
          )}
      </section>
    </>
  );
};

const Metric = ({ icon, label, value, note, accent = false }) => {
  return (
    <article className={`metric-card ${accent ? 'metric-accent' : ''}`}>
      <div className='metric-icon'>
        {icon}
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
    </article>
  )
}

export default Dashboard;
