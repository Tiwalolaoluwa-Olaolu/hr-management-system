import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Field from './Field';
import StatusBadge from './StatusBadge';
import Toast from './Toast';
import { useAuth } from '../../core/services/Context';
import { apiGet } from '../../core/services/Api';

const MyLeaveHistory = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Pending' | 'Approved' | 'Rejected'

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // NOTE: There is no endpoint in the current API spec for listing a single
    // employee's own leave requests (only POST /api/LeaveRequests to create one,
    // and GET /api/LeaveRequests/{id} to fetch a single request by its own id —
    // nothing keyed on employeeId). This call is left wired in so the page lights
    // up as soon as a "my requests" or employee-filtered list endpoint ships on
    // the backend. Until then it fails gracefully and the error is surfaced below.
    apiGet('/leave-requests/me')
      .then(data => setRequests(data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requests
      .filter(req => {
        if (!term) return true;
        const typeName = req.leaveType?.name || req.leaveTypeName || '';
        return (
          typeName.toLowerCase().includes(term) ||
          req.reason?.toLowerCase().includes(term)
        );
      })
      .filter(req => statusFilter === 'all' || req.status === statusFilter);
  }, [requests, search, statusFilter]);

  return (
    <>
      <section className='page-heading leave-history-sec'>
        <div>
          <span className='eyebrow'>TIME OFF</span>
          <h1>My Leave History</h1>
          <p>Check the status of your leave requests — approved, pending, or rejected.</p>
        </div>
      </section>

      {
        error && (
          <Toast
            type='error'
            message={`Couldn't load your leave history: ${error}`}
            onClose={() => setError('')}
          />
        )
      }

      <section className='content-card leave-history-card'>
        <div className='table-toolbar'>
          <div className='search-field'>
            <Search size={16} />
            <Field
              label='Search requests'
              name='search'
              placeholder='Search by leave type or reason'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Field
            label='Status'
            name='statusFilter'
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value='all'>All statuses</option>
            <option value='Pending'>Pending</option>
            <option value='Approved'>Approved</option>
            <option value='Rejected'>Rejected</option>
          </Field>
        </div>

        <div className='table-wrap'>
          <table>
            <thead>
              <tr>
                <th>Leave type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                loading ? (
                  <tr><td colSpan={5}>Loading your leave history…</td></tr>
                ) : filteredRequests.length === 0 ? (
                  <tr><td colSpan={5}>No leave requests match your search.</td></tr>
                ) : (
                  filteredRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.leaveType?.name || request.leaveTypeName}</td>
                      <td>{request.startDate} — {request.endDate}</td>
                      <td>{request.requestedDays ?? request.days}</td>
                      <td>{request.reason}</td>
                      <td>
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))
                )
              }
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default MyLeaveHistory;
