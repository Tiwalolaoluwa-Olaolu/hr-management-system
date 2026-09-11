import AppShell from "../shared/components/AppShell";
import { useAuth } from '../core/services/Context';


const LeaveHistory = () => {
  const { user } = useAuth();

  return (
    <>
      <AppShell
        role={user?.role}
        name={user?.name}
        status={user?.status}
      >
          <section className='page-heading'>
            <div>
              <span className='eyebrow'>MY LEAVE HISTORY</span>
              <h1>Leave History</h1>
              <p>View past leave requests.</p>
            </div>
          </section>
          
          <section className='content-card request-history-card'>
                  <div className='section-header'>
                    <div>
                      <span className='eyebrow'>HISTORY</span>
                      <h2>My Leave Requests</h2>
                    </div>
                    </div>
                   <div className='table-wrap'>
                        <table>
                          <thead>
                            <tr>
                              <th>Leave type</th>
                              <th>Dates</th>
                              <th>Days</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/*
                              requests.map((request) => (
                              <tr key={request.id}>
                                <td>
                                  {
                                    request.leaveType?.name || request.leaveTypeName
                                  }
                                </td>
                                <td>
                                  {request.startDate} — {request.endDate}
                                </td>
                                <td>{request.days}</td>
                                <td>
                                  <StatusBadge status={request.status} />
                                </td>
                                <td>
                                  {
                                    request.status === 'Pending' && <button
                                      type='button' className='table-action'onClick={() => cancel(request.id)}
                                    >
                                      Cancel
                                    </button>
                                  }
                                </td>
                              </tr>))
                            */}
                          </tbody>
                        </table>
                      </div>
          </section>
      </AppShell>
    </>
  )
}

export default LeaveHistory;