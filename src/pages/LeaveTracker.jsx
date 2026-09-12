import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Field from '/Field';
import StatusBadge from './StatusBadge';
import Toast from './Toast';
import { apiGet } from '../../core/services/Api';

const TODAY = new Date().toISOString().slice(0, 10);


const APPROVED = 1;

const EmployeesOnLeave = () => {
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState('');
  const [leaveError, setLeaveError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'onLeave' | 'available'

  useEffect(() => {
    setLoading(true);
    apiGet('/api/Employees')
      .then(data => setEmployees(data || []))
      .catch(e => setEmployeesError(e.message))
      .finally(() => setLoading(false));

     
    apiGet('/api/LeaveRequests')
      .then(data => setLeaveRequests(data || []))
      .catch(e => setLeaveError(e.message));
  }, []);

  const onLeaveByEmployeeId = useMemo(() => {
    const map = new Map();
    leaveRequests.forEach(req => {
      if (req.status === APPROVED && req.startDate <= TODAY && req.endDate >= TODAY) {
        map.set(req.employeeId, req);
      }
    });
    return map;
  }, [leaveRequests]);

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    return employees
      .filter(emp => {
        if (!term) return true;
        return (
          emp.name?.toLowerCase().includes(term) ||
          emp.department?.toLowerCase().includes(term) ||
          emp.email?.toLowerCase().includes(term)
        );
      })
      .filter(emp => {
        const onLeave = onLeaveByEmployeeId.has(emp.id);
        if (filter === 'onLeave') return onLeave;
        if (filter === 'available') return !onLeave;
        return true;
      });
  }, [employees, search, filter, onLeaveByEmployeeId]);

  const onLeaveCount = onLeaveByEmployeeId.size;

  return (
    <>
      <section className='page-heading employees-on-leave-sec'>
        <div>
          <span className='eyebrow'>WORKFORCE OVERVIEW</span>
          <h1>Employees on Leave</h1>
          <p>
            {onLeaveCount} of {employees.length} employees currently on leave. Search to check anyone's status.
          </p>
        </div>
      </section>

      {
        leaveError && (
          <Toast
            type='error'
            message={`Couldn't load leave data: ${leaveError}`}
            onClose={() => setLeaveError('')}
          />
        )
      }
      {
        employeesError && (
          <Toast
            type='error'
            message={`Couldn't load employees: ${employeesError}`}
            onClose={() => setEmployeesError('')}
          />
        )
      }

      <section className='content-card employees-on-leave-card'>
        <div className='table-toolbar'>
          <div className='search-field'>
            <Search size={16} />
            <Field
              label='Search employees'
              name='search'
              placeholder='Search by name, department, or email'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Field
            label='Filter'
            name='filter'
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value='all'>All employees</option>
            <option value='onLeave'>On leave</option>
            <option value='available'>Not on leave</option>
          </Field>
        </div>

        <div className='table-wrap'>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Leave dates</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {
                loading ? (
                  <tr><td colSpan={5}>Loading employees…</td></tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr><td colSpan={5}>No employees match your search.</td></tr>
                ) : (
                  filteredEmployees.map(emp => {
                    const leave = onLeaveByEmployeeId.get(emp.id);
                    return (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.department}</td>
                        <td>
                          <StatusBadge status={leave ? 'OnLeave' : 'Available'} />
                        </td>
                        <td>{leave ? `${leave.startDate} — ${leave.endDate}` : '—'}</td>
                        <td>{leave ? leave.reason : '—'}</td>
                      </tr>
                    );
                  })
                )
              }
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default EmployeesOnLeave;
