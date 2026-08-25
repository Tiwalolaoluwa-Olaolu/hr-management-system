import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../shared/components/AppShell';
import ApiStatus from '../shared/components/ApiStatus';
import { useAuth } from '../core/services/Context';
import { apiGet } from '../core/services/Api';

const TeamCalendar = () => { 
  const { user } = useAuth();
  const [calendar, setCalendar] = useState(null); 
  const [error, setError] = useState(''); 
  const [range, setRange] = useState({ 
    start: '', 
    end: '' 
  }); 
  
  useEffect(() => { 
    const query = range.start && range.end ? 
      `?startDate=${range.start}&endDate=${range.end}` : '';

    apiGet(`/team/leave-calendar${query}`)
      .then(setCalendar)
      .catch((e) => setError(e.message)); 
    }, [range.start, range.end]
  ); 
    
  return (
    <>
      <AppShell
        name={user.name}
        role={user.role}
        status={user.status}
      >
        <section className='page-heading'>
          <div>
            <span className='eyebrow'>TEAM COVERAGE</span>
            <h1>Team leave calendar</h1>
            <p>
              View approved leave for your direct reports.
            </p>
          </div>
        </section>
        <section className='content-card calendar-card'>
          <div className='calendar-toolbar'>
            <div>
              <h2>Approved leave</h2>
              <span>
                <CalendarDays size={15} /> 
                Backend calendar data
              </span>
            </div>
            <div className='calendar-range'>
              <label htmlFor='startDate'>From</label>
              <input
                id='startDate'
                type='date' 
                value={range.start} 
                onChange={
                  e => setRange({ ...range, start: e.target.value })
                } />
              <label htmlFor='endDate'>To</label>
              <input
                type='date' 
                value={range.end}
                onChange={
                  e => setRange({ ...range, end: e.target.value })
                }
              />
            </div>
          </div>
          {
            error ? <ApiStatus message={error} /> : !calendar ? <ApiStatus /> : 
            !calendar.length ? <ApiStatus message='No approved team leave was returned for this date range.' /> : 
            (<div className='request-row-list'>
              {
                calendar.map(item => (<div 
                  className='request-row'
                  key={item.id}
                >
                  <div className='request-row-main'>
                    <div className='mini-avatar'>
                      {item.employee?.name?.[0] || '?'}
                    </div>
                    <div>
                      <strong>
                        {
                          item.employee?.name || item.employeeName
                        }
                      </strong>
                      <span>
                        {item.startDate} — {item.endDate}
                      </span>
                    </div>
                  </div>
                  <strong>
                    {item.days} days
                  </strong>
              </div>))
              }
            </div>)
          }
          </section>
        </AppShell>
      </>
    ) 
  };

export default TeamCalendar;
