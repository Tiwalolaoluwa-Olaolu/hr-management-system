import { useAuth } from "../core/services/Context";
import AccessTeamRequests from "../shared/components/AccessTeamRequests";
import AppShell from "../shared/components/AppShell";
import TeamCalendar from "../shared/components/TeamCalendar";

const TeamRequests = () => {
  const { user } = useAuth();
  return (
    <>
      <AppShell
        name={user?.name}
        role={user?.role}
        status={user?.status}
      >
        <TeamCalendar />
        <AccessTeamRequests />
      </AppShell>
    </>
  );
};

export default TeamRequests;