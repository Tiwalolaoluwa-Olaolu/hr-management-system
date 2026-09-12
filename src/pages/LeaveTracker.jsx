import AppShell from '../shared/components/AppShell';
import EmployeesOnLeave from '../shared/components/EmployeesOnLeave';
import RequireRole from '../shared/components/RequireRole';
import { useAuth } from '../core/services/Context';

const LeaveTracker = () => {
  const { user } = useAuth();

  return (
    <RequireRole role={user?.role} allowed={['Manager']}>
      <AppShell
        role={user?.role}
        name={user?.name}
        status={user?.status}
      >
        <EmployeesOnLeave />
      </AppShell>
    </RequireRole>
  );
};

export default LeaveTracker;
