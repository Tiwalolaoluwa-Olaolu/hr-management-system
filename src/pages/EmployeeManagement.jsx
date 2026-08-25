import { Edit3, Plus, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../shared/components/AppShell';
import Button from '../shared/components/Button';
import Field from '../shared/components/Field';
import Modal from '../shared/components/Modal';
import ConfirmDialog from '../shared/components/ConfirmDialog';
import Toast from '../shared/components/Toast';
import StatusBadge from '../shared/components/StatusBadge';
import ApiStatus from '../shared/components/ApiStatus';
import { apiGet, apiPatch, apiPost } from '../core/services/Api';

const emptyForm = {
  firstName: '', 
  lastName: '', 
  email: '', 
  department: '', 
  managerId: '', 
  dateJoined: '' 
};

const EmployeeManagement = () => { 
  const [employees, setEmployees] = useState([]); 
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(''); 
  const [open, setOpen] = useState(false); 
  const [editing, setEditing] = useState(null); 
  const [deactivateId, setDeactivateId] = useState(null); const [form, setForm] = useState(emptyForm); 
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false); 
  const [toast, setToast] = useState('');

  useEffect(() => { 
    Promise.all([apiGet('/employees'), apiGet('/managers')])
      .then(([people, leads]) => { 
        setEmployees(people || []); 
        setManagers(leads || []); })
      .catch(e => setError(e.message))
    }, []
  );

  const edit = (employee) => { 
    setEditing(employee); 
    setForm({
      firstName: employee.firstName || '', 
      lastName: employee.lastName || '', 
      email: employee.email || '', 
      department: employee.department || '', 
      managerId: employee.managerId || '', 
      dateJoined: employee.dateJoined || '' 
    }); 
    setErrors({}); 
    setOpen(true); 
  };

  const save = async (e) => { 
    e.preventDefault(); 
    const next = {}; 
    ['firstName','lastName','email','department','managerId','dateJoined'].forEach(field => { 
      if (!String(form[field]).trim()) next[field] = 'This    field is required.'; 
    }); 

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))   
        next.email = 'Enter a valid email address.'; 
    setErrors(next); 
    if (Object.keys(next).length) return; 
    setLoading(true);
    
    try { 
      const body = { 
        ...form, 
        managerId: Number(form.managerId) 
      }; 
      
      const result = editing ? 
        await apiPatch('/employees', editing.id, body) : await apiPost('/employees', body); setEmployees((previous) => editing ? previous.map((item) => item.id === editing.id ? result : item) : [result, ...previous]); setToast(editing ? 'Employee updated successfully.' : 'Employee created successfully.'); setOpen(false); } catch (e) { setToast(e.message); } finally { setLoading(false); } };

  const deactivate = async () => { 
    setLoading(true); 
    try { 
      const result = await apiPatch('/employees',   
        deactivateId, { 
        status: 'Inactive' 
      }); 
      setEmployees(prev => prev.map(item => item.id === deactivateId ? result : item)); 
      setToast('Employee deactivated successfully.'); 
    } catch(e) { 
      setToast(e.message);
    } finally { 
      setLoading(false); 
      setDeactivateId(null); 
    } 
  };

  return (
    <>
      <AppShell>
        <section className='page-heading'>
          <div>
            <span className='eyebrow'>PEOPLE</span>
            <h1>Employees</h1>
            <p>Create, Update and Manage Employee Records.</p>
          </div>
          <Button 
            type='button' 
            btnUniqueStyling='primary-action' 
            btnIcon={<Plus size={17} />} 
            btnText='Add employee' 
            btnEvent={() => { 
              setEditing(null); 
              setForm(emptyForm); 
              setErrors({}); 
              setOpen(true); 
              }}
            />
          </section>
          {
            toast && <Toast message={toast} onClose={() => setToast('')} />
          }
          {
            error ? <ApiStatus message={error} /> : !employees.length ? (<ApiStatus message='No employee records have been returned by the backend.' />) : (<section className='content-card request-history-card'>
              <div className='table-wrap'>
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Manager</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      employees.map(employee => (<tr key={employee.id}>
                        <td>
                          <div className='employee-cell'>
                            <div className='mini-avatar'>   
                              {employee.firstName?.[0]}{employee.lastName?.[0]}
                            </div>
                            <strong>
                              {employee.firstName} {employee.lastName}
                            </strong>
                          </div>
                        </td>
                        <td>
                          {employee.email}
                        </td>
                        <td>{employee.department}</td>
                        <td>
                          {employee.managerName || employee.manager?.name || '—'}
                        </td>
                        <td>
                          <StatusBadge
                            status={employee.status}
                          />
                        </td>
                        <td>
                          <button
                            type='button' className='table-action'
                            onClick={() => edit(employee)}
                          >
                            <Edit3 size={15} />
                            Edit
                          </button>
                          {
                            employee.status === 'Active' && <button
                              type='button' className='table-action' onClick={() => setDeactivateId(employee.id)}
                            >
                              <UserX size={15} />
                              Deactivate
                            </button>
                          }
                        </td>
                      </tr>))
                    }
                  </tbody>
                </table>
              </div>
            </section>)
          }
          {
            open && <Modal
              title={
                editing ? 'Edit employee' : 'Create employee'
              }
              onClose={() => setOpen(false)}>
              <form onSubmit={save}>
                <div className='form-grid'>
                  <Field
                    label='First name' 
                    name='firstName' 
                    value={form.firstName} 
                    onChange={e => setForm({
                      ...form, 
                      firstName: e.target.value 
                      })} 
                    error={errors.firstName} 
                    required
                  />
                  <Field 
                    label='Last name' 
                    name='lastName' 
                    value={form.lastName} 
                    onChange={e => setForm({ 
                      ...form, 
                      lastName: e.target.value 
                    })} 
                    error={errors.lastName} 
                    required 
                  />
                  <Field 
                    label='Email' 
                    name='email' 
                    type='email' 
                    value={form.email} 
                    onChange={e => setForm({
                      ...form, 
                      email: e.target.value 
                    })} 
                    error={errors.email} 
                    required 
                  />
                  <Field
                    label='Department' 
                    name='department' 
                    value={form.department} 
                    onChange={e => setForm({
                      ...form, 
                      department: e.target.value
                    })} 
                    error={errors.department} 
                    required
                  />
                  <Field
                    label='Manager' 
                    name='managerId' 
                    value={form.managerId} 
                    onChange={e => setForm({
                      ...form, 
                      managerId: e.target.value
                    })} 
                    error={errors.managerId} 
                    required
                  >
                    <select
                      id='managerId' 
                      name='managerId' 
                      value={form.managerId} 
                      onChange={e => setForm({
                        ...form, 
                        managerId: e.target.value 
                      })}
                    >
                      <option value=''>Select manager</option>{
                        managers.map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.firstName} {manager.lastName}
                        </option>))
                      }
                    </select>
                  </Field>
                  <Field
                    label='Date joined'
                    name='dateJoined' 
                    type='date' 
                    value={form.dateJoined} 
                    onChange={(e) => setForm({
                      ...form, 
                      dateJoined: e.target.value 
                    })} 
                    error={errors.dateJoined} 
                    required 
                  />
                </div>
                <div className='modal-actions'>
                  <Button 
                    type='button' btnUniqueStyling='secondary-btn' btnText='Cancel' 
                    btnEvent={() => setOpen(false)} 
                  />
                  <Button
                    btnUniqueStyling='primary-action' 
                    btnText={editing ? 'Save changes' : 'Create employee'} 
                    loading={loading} 
                  />
                </div>
              </form>
            </Modal>
          }
          {
            deactivateId && <ConfirmDialog 
              title='Deactivate employee?' 
              message='Are you sure you want to deactivate thisemployee.' 
              confirmText='Deactivate' 
              loading={loading} 
              onConfirm={deactivate} 
              onClose={() => setDeactivateId(null)} />
          }
      </AppShell>
    </>
  )
};

export default EmployeeManagement;
