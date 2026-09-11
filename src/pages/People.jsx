import { Edit3, Plus, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppShell from '../shared/components/AppShell';
import Button from '../shared/components/Button';
import Field from '../shared/components/Field';
import Modal from '../shared/components/Modal';
import ConfirmDialog from '../shared/components/ConfirmDialog';
import Toast from '../shared/components/Toast';
import StatusBadge from '../shared/components/StatusBadge';
import { apiGet, apiPut, apiPost } from '../core/services/Api';
import { useAuth } from '../core/services/Context';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  role: '',
  managerId: '',
  dateJoined: '',
  password: ''
};

const ROLE_OPTIONS = [
  { value: 0, label: 'Employee' },
  { value: 1, label: 'Manager' },
  { value: 2, label: 'HRAdmin' },
];

const STATUS = {
  ACTIVE: 0,
  INACTIVE: 1,
};

const mapEmployeeFromApi = (employee) => {
  const name = employee?.name || '';

  const nameParts = name.trim().split(/\s+/);

  const firstName = nameParts.shift() || '';
  const lastName = nameParts.join(' ');

  return {
    ...employee,
    firstName,
    lastName,
  };
};

const mapEmployeeToCreateApi = (form) => ({
  name: `${form.firstName} ${form.lastName}`.trim(),
  email: form.email.trim(),
  department: form.department.trim(),
  managerId: form.managerId.trim() || null,
  dateJoined: new Date(`${form.dateJoined}T00:00:00`).toISOString(),
  role: Number(form.role),
  password: form.password,
});

const mapEmployeeToUpdateApi = (form, status) => ({
  name: `${form.firstName} ${form.lastName}`.trim(),
  email: form.email.trim(),
  department: form.department.trim(),
  managerId: form.managerId.trim() || null,
  role: Number(form.role),
  status,
});

const People = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deactivateId, setDeactivateId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setError('');
        const people = await apiGet('/Employees');
        setEmployees(
          Array.isArray(people)
            ? people.map(mapEmployeeFromApi)
            : []
        );
      } catch(e) {
        setError(e.message);
      }
    };

    loadEmployees();
  }, []);

  const edit = (employee) => {
    setEditing(employee);
    setForm({
      firstName: employee?.firstName ?? '',
      lastName: employee?.lastName ?? '',
      email: employee?.email ?? '',
      department: employee?.department ?? '',
      role:
        employee?.role !== undefined && employee?.role !== null
          ? String(employee.role)
          : '',
      managerId: employee.managerId ?? '',
      dateJoined: employee?.dateJoined
        ? employee.dateJoined.slice(0, 10)
        : '',
      password: 'password',
    });

    setErrors({});
    setOpen(true);
  };

  const validate = () => {
    const next = {};
    if (!String(form.firstName).trim()) {
      next.firstName = 'This field is required.';
    }
    if (!String(form.lastName).trim()) {
      next.lastName = 'This field is required.';
    }
    if (!String(form.email).trim()) {
      next.email = 'This field is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email address.';
    }
    if (!String(form.department).trim()) {
      next.department = 'This field is required.';
    }
    if (form.role === '') {
      next.role = 'Select a role.';
    }
    if (!String(form.dateJoined).trim()) {
      next.dateJoined = 'This field is required.';
    }
    if (!editing && !String(form.password).trim()) {
      next.password = 'This field is required.';
    }
    setErrors(next);
    return next;
  };

  const save = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        const body = {
          ...mapEmployeeToUpdateApi(form, editing.status),
        };

        const result = await apiPut(
          '/Employees',
          editing.id,
          body
        );

        const mappedResult = mapEmployeeFromApi(result);

        setEmployees(prev =>
          prev.map((item) =>
            item.id === editing.id
              ? mappedResult
              : item
          )
        );

        setToast('Employee updated successfully.');
      } else {
        const body = mapEmployeeToCreateApi(form);
        const result = await apiPost('/Employees', body);
        const mappedResult = mapEmployeeFromApi(result);
        
        setEmployees(prev => [
          mappedResult,
          ...prev,
        ]);

        setToast('Employee created successfully.');
      }

      setOpen(false);
      setEditing(null);
      setErrors({});
    } catch (e) {
      setToast(e.message);
    } finally {
      setLoading(false);
      setForm(emptyForm);
    }
  };

  const deactivate = async () => {
    if (!deactivateId) {
      return;
    }

    setLoading(true);

    try {
      const employee = employees.find(
        (item) => item.id === deactivateId
      );

      if (!employee) {
        throw new Error('Employee could not be found.');
      }

      const body = {
        name: employee.name,
        email: employee.email,
        department: employee.department,
        managerId: employee.managerId || null,
        role: employee.role,
        status: STATUS.INACTIVE,
      };

      const result = await apiPut(
        '/Employees',
        deactivateId,
        body
      );

      const mappedResult = mapEmployeeFromApi(result);

      setEmployees(prev =>
        prev.map(item =>
          item.id === deactivateId
            ? mappedResult
            : item
        )
      );

      setToast('Employee deactivated successfully.');
    } catch (e) {
      setToast(e.message);
    } finally {
      setLoading(false);
      setDeactivateId(null);
    }
  };

  const getRoleLabel = (role) => {
    const option = ROLE_OPTIONS.find(
      (item) => item.value === Number(role)
    );
    return option?.label || `Role ${role}`;
  };

  return (
    <AppShell
      name={user?.name}
      role={user?.role}
      status={user?.status}
    >
      <section className="page-heading">
        <div>
          <span className="eyebrow">PEOPLE</span>
          <h1>Employee Management System</h1>
          <p>
            Create, Update and Manage Employee Records.
          </p>
        </div>

        <Button
          type="button"
          btnUniqueStyling="primary-action"
          btnIcon={<Plus size={17} />}
          btnText="Add employee"
          btnEvent={() => {
            setEditing(null);
            setForm(emptyForm);
            setErrors({});
            setOpen(true);
          }}
        />
      </section>

      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast('')}
        />
      )}

      <section className="content-card request-history-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {         
                error ? (
                  <tr className="empty-table-row">
                    <td colSpan="7">
                      {error} data.
                    </td>
                  </tr>
                ) : !employees.length ? (
                  <tr className="empty-table-row">
                    <td colSpan="7">
                      {
                        error ? `${error} data` : 'Loading...'
                      }
                    </td>
                  </tr>
                ) : employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="mini-avatar">
                          {employee.firstName?.[0]}
                          {employee.lastName?.[0]}
                        </div>
                        <strong>
                          {employee.firstName}{' '}{employee.lastName}
                        </strong>
                      </div>
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{getRoleLabel(employee.role)}</td>
                    <td>
                      {
                        employee.managerName || employee.manager?.name || '—'
                      }
                    </td>
                    <td>
                      <StatusBadge
                        status={
                          employee.status === 0 ? 'Active': 'Inactive'
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => edit(employee)}
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                      {
                        employee.status ===
                          STATUS.ACTIVE && (
                          <button
                            type="button"
                            className="table-action deactivate-btn"
                            onClick={() =>
                              setDeactivateId(employee.id)
                            }
                          >
                            <UserX size={15} />
                            Deactivate
                          </button>
                        )
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </section>

      {
        open && (
          <Modal
            title={
              editing ? 'Edit Employee' : 'Create Employee'
            }
            onClose={() => {
              if (!loading) {
              setOpen(false);
              }
            }}
          >
          <form onSubmit={save}>
            <div className="form-grid">
              <Field
                label="First name"
                name="firstName"
                value={form.firstName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    firstName: e.target.value,
                  })
                }
                error={errors.firstName}
                required
              />
              <Field
                label="Last name"
                name="lastName"
                value={form.lastName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lastName: e.target.value,
                  })
                }
                error={errors.lastName}
                required
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                error={errors.email}
                required
              />
              <Field
                label="Department"
                name="department"
                value={form.department}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department: e.target.value,
                  })
                }
                error={errors.department}
                required
              />
              <Field
                label="Role"
                name="role"
                type="select"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                error={errors.role}
                required
              >
                <option value="">
                  Select role
                </option>

                {ROLE_OPTIONS.map(role => (
                  <option
                    key={role.value}
                    value={role.value}
                  >
                    {role.label}
                  </option>
                ))}
              </Field>
              <Field
                label="Manager ID (optional)"
                name="managerId"
                value={form.managerId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    managerId: e.target.value,
                  })
                }
                error={errors.managerId}
                placeholder="Manager UUID"
              />
              <Field
                label="Date joined"
                name="dateJoined"
                type="date"
                value={form.dateJoined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dateJoined: e.target.value,
                  })
                }
                error={errors.dateJoined}
                required
              />
              {
                !editing && (
                  <Field
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    error={errors.password}
                    required
                  />
                )
              }
            </div>
            <div className="modal-actions">
              <Button
                type="button"
                btnUniqueStyling="secondary-btn"
                btnText="Cancel"
                btnEvent={() => {
                  if (!loading) {
                    setOpen(false);
                  }
                }}
              />
              <Button
                type="submit"
                btnUniqueStyling="primary-action"
                btnText={
                  editing ? 'Save changes' : 'Create employee'
                }
                loading={loading}
              />
            </div>
          </form>
        </Modal>
      )}

      {
        deactivateId && (
          <ConfirmDialog
            title="Deactivate employee?"
            message="Are you sure you want to deactivate this employee?"
            confirmText="Deactivate"
            loading={loading}
            onConfirm={() => {
              deactivate();
              setEmployees(prev => prev.filter(item => item.id !== deactivateId));
            }}
            onClose={() => {
              if (!loading) {
                setDeactivateId(null);
              }
            }}
          />
        )
      }
    </AppShell>
  );
};

export default People;

