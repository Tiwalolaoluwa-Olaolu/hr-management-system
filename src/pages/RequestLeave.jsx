/*
import { useState } from "react";
import Button from "../shared/components/Button";
import FormCalendar from "../shared/components/FormCalendar";
import FormDropdown from "../shared/components/FormDropdown";
import FormTextArea from "../shared/components/FormTextArea";
import FormInput from "../shared/components/FormInput";
import Sidebar from "../shared/components/Sidebar";
import TopBar from "../shared/components/TopBar";


const RequestLeave = () => {
  const leaveType = ['Annual', 'Casual', 'Sick', 'Maternity'];
  const [ annual, casual, sick, maternity ] = leaveType;

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <div className='page-layout'>
        <Sidebar />
        <div className='page-main-view top-bar-profile'>
          <TopBar />
          <form onSubmit={handleSubmit} className='leave-request-form'>
            <h3>Submit Leave Request</h3>
            <div>
              <FormDropdown id='leaveType' name='Leave Type' labelTitle='Leave Type'>
              <option value="">Select a leave type</option>
              {
                leaveType.map((type, id) => <option key={id} value={type}>{type}</option>)
              }
              </FormDropdown>
              <FormCalendar
                id='startDate'
                name='Start Date'
                type='date'
                labelTitle='Start Date'
              />
              <FormCalendar
                id='endDate'
                name='End Date'
                type='date'
                labelTitle='End Date'
              />
              <FormInput
                labelTitle='Total Days'
                id='totalDays'
                type='number'
                name='totalDays'
              />
              <FormTextArea
                labelTitle='Reason'
                id='leaveReason'
                name='leaveReason'
              />
            </div>
            <Button
              btnUniqueStyling='form-btn'
            />
          </form>
        </div>
      </div>
    </>
  )
};

export default RequestLeave;
*/

import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../shared/components/AppShell';
import Button from '../shared/components/Button';
import Field from '../shared/components/Field';
import StatusBadge from '../shared/components/StatusBadge';
import Toast from '../shared/components/Toast';
import ApiStatus from '../shared/components/ApiStatus';
import { useAuth } from '../core/services/Context';
import { apiGet, apiPatch, apiPost } from '../core/services/Api';

const RequestLeave = () => {
  const { user } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [requests, setRequests] = useState([]); 
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    leaveTypeId: '', 
    startDate: '', 
    endDate: '', 
    reason: '' 
  });
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false); 
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!user) return;
    const loadTestData = async () => {
      setLeaveTypes([
        {
          id: 1,
          name: 'Annual Leave',
          allocation: 20
        },
        {
          id: 2,
          name: 'Sick Leave',
          allocation: 10
        },
        {
          id: 3,
          name: 'Casual Leave',
          allocation: 5
        }
      ]);

      setRequests([
        {
          id: 1,
          employeeId: user.id,
          leaveTypeId: 1,
          leaveTypeName: 'Annual Leave',
          startDate: '2026-09-10',
          endDate: '2026-09-12',
          days: 3,
          reason: 'Personal reasons',
          status: 'Pending'
        }
      ]);

      /*
      try {
          const [types, items] = await Promise.all([
            apiGet('/leave-types'),
            apiGet('/leave-requests/me')
          ]);
          setLeaveTypes(types || []);
          setRequests(items || []);
        } catch(e) {
          setError(e.message);
      }
      */
    };

    loadTestData();
  }, [user]);
;

  const days = form.startDate && form.endDate ? calculateDays(form.startDate, form.endDate) : 0;
  const update = (event) => { 
    const { name, value } = event.target; 
    setForm(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    setErrors(prev => ({ 
      ...prev,
      [name]: '' 
    })); 
  };
  const validate = () => { 
    const next = {}; 
    if (!form.leaveTypeId) next.leaveTypeId = 'Leave type is required.'; 
    if (!form.startDate) next.startDate = 'Start date is required.'; 
    if (!form.endDate) next.endDate = 'End date is required.';if (days <= 0 && form.startDate && form.endDate) next.endDate = 'End date must be on or after start date.'; 
    if (!form.reason.trim()) next.reason = 'Reason is required.'; 
    setErrors(next); 
    return Object.keys(next).length === 0; 
  };

  const submit = async (e) => { 
    e.preventDefault(); 
    setToast(''); 
    if (!validate()) return; 
    setLoading(true); 
    try { 
      // const created = await apiPost('/leave-requests', {    
      //   employeeId: user.id, 
      //   leaveTypeId: Number(form.leaveTypeId), 
      //   startDate: form.startDate, 
      //   endDate: form.endDate, 
      //   reason: form.reason.trim(),
      //   days 
      // }); 
      // setRequests(prev => [created, ...prev]); 
      // setForm({
      //   leaveTypeId: '', 
      //   startDate: '', 
      //   endDate: '', 
      //   reason: '' 
      // }); 
      setRequests(prev => ([newRequest, ...prev]));
      setForm({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: ''
      });
      setToast('Leave request submitted successfully.'); 
    } catch(e) { 
      setToast(e.message); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  const cancel = async (id) => { 
    try { 
      // await apiPatch('/leave-requests', id, { status: 'Cancelled' });
       setRequests(prev => prev.map(item => item.id === id ? { ...item, status: 'Cancelled' } : item)); 
       setToast('Leave request cancelled successfully.'); 
      } catch(e) { 
        setToast(e.message); 
      } 
    };

    return (
      <>
        <AppShell
          role={user.role}
          name={user.name}
          status={user.status}
        >
          <section className='page-heading'>
            <div>
              <span className='eyebrow'>TIME OFF</span>
              <h1>Request leave</h1>
              <p>Submit a leave request and track its status from one place.</p>
            </div>
          </section>
          {
            error ? <ApiStatus message={error} /> : 
              (
                <>
                  <section className='content-card request-form-card'>
                    <form onSubmit={submit}>
                      <div className='form-grid'>
                        <Field 
                          label='Leave type'
                          name='leaveTypeId' 
                          value={form.leaveTypeId} 
                          onChange={update} 
                          error={errors.leaveTypeId} 
                          required
                        >
                        <select
                         id='leaveTypeId'
                          name='leaveTypeId'
                          value={form.leaveTypeId} 
                          onChange={update}
                        >
                          <option value=''>
                            Select leave type
                          </option>
                          {
                            leaveTypes.map((type) => (
                              <option
                                key={type.id}
                                value={type.id}
                              >{type.name}</option>)
                            )
                          }
                        </select>
                      </Field>
                      <Field
                        label='Start date' 
                        name='startDate' 
                        type='date' 
                        value={form.startDate} 
                        onChange={update} 
                        error={errors.startDate} 
                        required
                      />
                      <Field
                        label='End date'
                        name='endDate'
                        type='date' 
                        value={form.endDate} 
                        onChange={update} 
                        error={errors.endDate} 
                        required 
                      />
                      <Field 
                        label='Reason' 
                        name='reason' 
                        value={form.reason} 
                        onChange={update} 
                        error={errors.reason} required
                      >
                        <textarea
                          id='reason' 
                          name='reason' 
                          value={form.reason} 
                          onChange={update} 
                          placeholder='State your reason for the leave request or add a comment' 
                        />
                      </Field>
                    </div>
                    <div className='leave-days-preview'>
                      <CalendarDays size={18} />
                      <span>Total Leave Days Requested</span>
                      <strong>
                        {days || 0}
                      </strong>
                    </div>
                    <Button
                      btnUniqueStyling='primary-action' btnText='Submit leave request'
                      loading={loading} 
                    />
                  </form>
                </section>
                <section className='content-card request-history-card'>
                  <div className='section-header'>
                    <div>
                      <span className='eyebrow'>HISTORY</span>
                      <h2>My leave requests</h2>
                    </div>
                    </div>
                    {
                      !requests.length ? (<ApiStatus message='The backend returned no leave requests.' />) : (<div className='table-wrap'>
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
                            {
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
                            }
                          </tbody>
                        </table>
                      </div>)
                    }
                  </section>
                </>
              )
          }
        </AppShell>
      </>  
    )
};

const calculateDays = (start, end) => Math.floor(
  (new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)
) / 86400000) + 1;

export default RequestLeave;
