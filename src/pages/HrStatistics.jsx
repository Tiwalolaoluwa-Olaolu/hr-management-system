import { BarChart3, UserCheck, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../shared/components/AppShell';
import { apiGet } from '../core/services/Api';
import { useAuth } from '../core/services/Context';

const HrStatistics = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/Employees')
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message));
  }, []);

  const active = employees.filter(item => Number(item.status) === 0).length;
  const inactive = employees.filter(item => Number(item.status) === 1).length;

  return (
    <>
      <AppShell 
        name={user?.name} 
        role={user?.role} 
        status={user?.status}
      >
        <section className='page-heading'>  
          <div>
            <span className='eyebrow'>REPORTING</span>
            <h1>Company statistics</h1>
            <p>
              Employee-level statistics
            </p>
          </div>
        </section>
        {
          error && (
            <div className='inline-alert error-alert'>
              {error}
            </div>
          )
        }
        <section>
          <div className="employee-total-badge">
            <span>{employees.length}</span>
            <small>Total employees</small>
          </div>
          <div className="employee-status-list">
            <div className="employee-status-item">
              <div className="employee-status-icon active">
                <UserCheck size={22} />
              </div>
              <div className="employee-status-content">
                <div className="employee-status-title-row">
                  <span>Active Employees</span>
                  <strong>{active}</strong>
                </div>
                <div className="employee-status-progress">
                  <span
                    style={{
                      width: employees.length
                        ? `${(active / employees.length) * 100}%`
                        : "0%",
                    }}
                  ></span>
                </div>
                <small>
                  Currently active in the organisation
                </small>
              </div>
            </div>
            <div className="employee-status-item">
              <div className="employee-status-icon inactive">
                <UserX size={22} />
              </div>
            <div className="employee-status-content">
              <div className="employee-status-title-row">
                <span>Inactive Employees</span>
                <strong>{inactive}</strong>
              </div>
              <div className="employee-status-progress">
                <span
                  style={{
                    width: employees.length
                      ? `${(inactive / employees.length) * 100}%`
                      : "0%",
                  }}
                ></span>
              </div>
              <small>No longer marked as active</small>
            </div>
          </div>
        </div>
      </section>
      <section className='content-card dashboard-list-card'>
        <div className='section-header'>
          <div>
            <span className='eyebrow'>LEAVE ANALYTICS</span>
            <h2>Leave Statistics</h2>
          </div>
          <BarChart3 size={20} />
        </div>
        <div className='empty-state'>
          <BarChart3 size={30} />
          <p>
            No endpoint available yet
          </p>
        </div>
      </section>
    </AppShell>
  </>
  );
};

export default HrStatistics;