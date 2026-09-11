import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../shared/components/AppShell';
import Button from '../shared/components/Button';
import Field from '../shared/components/Field';
import { useAuth } from '../core/services/Context';
import { apiGet, apiPut, apiPost } from '../core/services/Api';
import FormTextArea from '../shared/components/FormTextArea';

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
  const today = new Date().toISOString().slice(0, 10);

  const validate = () => {
    const errors = {};

    if (!form.leaveTypeId) {
      errors.leaveTypeId = 'Leave type is required.';
    }

    if (!form.startDate) {
      errors.startDate = 'Start date is required.';
    } else if (form.startDate < today) {
      errors.startDate = 'Start date cannot be in the past.';
    }

    if (!form.endDate) {
      errors.endDate = 'End date is required.';
    } else if (form.startDate && form.endDate < form.startDate) {
      errors.endDate = 'End date must be on or after start date.';
    }

    if (!form.reason.trim()) {
      errors.reason = 'Reason is required.';
    } else if (form.reason.trim().length < 5) {
      errors.reason = 'Please add a bit more detail (at least 5 characters).';
    }

    return errors;
  };

  const submit = async (e) => { 
    e.preventDefault(); 
    const validateErrors = validate();
    setErrors(validateErrors);
    setToast(''); 
    if (Object.keys(validateErrors).length > 0) return; 
    setLoading(true); 
    try { 
      const created = await apiPost('/leave-requests', {    
        employeeId: user.id, 
        leaveTypeId: Number(form.leaveTypeId), 
        startDate: form.startDate, 
        endDate: form.endDate, 
        reason: form.reason.trim(),
        days 
      }); 
      setRequests(prev => [created, ...prev]); 
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
      await apiPut('/leave-requests', id, { status: 'Cancelled' });
       setRequests(prev => prev.map(item => item.id === id ? { ...item, status: 'Cancelled' } : item)); 
       setToast('Leave request cancelled successfully.'); 
      } catch(e) { 
        setToast(e.message); 
      } 
    };

    return (
      <>
        <AppShell
          role={user?.role}
          name={user?.name}
          status={user?.status}
        >
          <section className='page-heading'>
            <div>
              <span className='eyebrow'>TIME OFF</span>
              <h1>Request leave</h1>
              <p>Submit a leave request and track its status from one place.</p>
            </div>
          </section>
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
                  <option value=''>Select leave type</option>
                    {
                      leaveTypes.map((type) => (
                        <option
                          key={type.id}
                          value={type.id}
                        >{type.name}</option>
                      ))
                    }
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
                <FormTextArea 
                  labelTitle='Reason'
                  name='reason'
                  value={form.reason}
                  onChange={update}
                  placeholder='State your reason for the leave request or add a comment'
                  error={errors.reason}
                  required
                />
              </div>
              <div className='leave-days-preview'>
                <CalendarDays size={18} />
                <span>Total Leave Days Requested</span>
                <strong>{days || 0}</strong>
              </div>
              <Button
                btnUniqueStyling='primary-action' btnText='Submit leave request'                    loading={loading} 
              />
            </form>
          </section>
        </AppShell>
      </>  
    )
};

const calculateDays = (start, end) => Math.floor(
  (new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)
) / 86400000) + 1;

export default RequestLeave;
