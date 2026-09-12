import AppShell from '../shared/components/AppShell';
import MyLeaveHistory from '../shared/components/MyLeaveHistory';
import { useAuth } from '../core/services/Context';

const LeaveHistory = () => {
  const { user } = useAuth();

  return (
    <AppShell
      role={user?.role}
      name={user?.name}
      status={user?.status}
    >
      <MyLeaveHistory />
    </AppShell>
  );
};

export default LeaveHistory;
