import { ArrowRight, CalendarClock, Clock3, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AppShell from '../shared/components/AppShell';
import { useAuth } from '../core/services/Context';
import { apiGet } from '../core/services/Api';
import Metric from '../shared/components/Metric';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    apiGet(`/LeaveBalances/${user.id}`)
      .then(setBalance)
      .catch((e) => setError(e.message));
  }, [user?.id]);

  const balanceValue = typeof balance === 'number'
    ? balance
    : balance?.remainingDays ?? balance?.balance ?? balance?.availableDays ?? '—';

  return (
    <AppShell 
      name={user?.name} 
      role={user?.role} 
      status={user?.status}
    >
      <section className='page-heading dashboard-heading'>
        <div>
          <span className='eyebrow'>OVERVIEW</span>
          <h1>Hi, {user?.firstName || 'there!'}</h1>
          <p>
            Here is your current leave-management overview.
          </p>
        </div>
        <button 
          type='button' 
          className='primary-action' 
          onClick={() => navigate('/leave-requests')}
        >
          Request leave 
          <ArrowRight size={17} />
        </button>
      </section>
      {
        error && (
          <div className='inline-alert error-alert'>
            {error}
          </div>
        )
      }
      <section className='metric-grid'>
        <Metric 
          icon={<WalletCards />} 
          label='Leave balance' 
          value={
            balanceValue === '—' ? '—' : `${balanceValue} days`
          } 
          accent 
        />
        <Metric 
          icon={<Clock3 />} 
          label='Pending requests' 
          value='—'
        />
        <Metric 
          icon={<CalendarClock />} 
          label='Leave history' 
          value='—' 
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
            onClick={() => navigate('/leave-history')}
          >
            View details 
            <ArrowRight size={15} />
          </button>
        </div>
        <div className='empty-state'>
          <CalendarClock size={30} />
          <p>No leave history yet!</p>
        </div>
      </section>
    </AppShell>
  );
};

export default Dashboard;