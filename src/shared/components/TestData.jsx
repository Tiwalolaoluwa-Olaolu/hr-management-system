export const testUsers = [
  {
    id: 101,
    firstName: 'Tiwalolaoluwa',
    lastName: 'Olaolu',
    name: 'Tiwalolaoluwa Olaolu',
    email: 'tiwa@sbsc.com',
    password: 'password',
    role: 'Employee',
    department: 'Anthropologist',
    managerId: 201,
    status: 'Active'
  },
  {
    id: 201,
    firstName: 'Felicia',
    lastName: 'Dominic',
    name: 'Felicia Dominic',
    email: 'felicia@sbsc.com',
    password: 'password',
    role: 'Manager',
    department: 'Archaeologist',
    status: 'Active'
  },
  {
    id: 301,
    firstName: 'Brownson',
    lastName: 'James',
    name: 'Brownson James',
    email: 'brownson@sbsc.com',
    password: 'password',
    role: 'HR Admin',
    department: 'Human Resources',
    status: 'Active'
  },
];

export const testDashboardData = {
  Employee: {
    leaveBalance: 14,
    pendingRequests: 1,
    completedRequests: 4,
    requests: [
      {
        id: 1,
        leaveType: {
          name: 'Annual Leave'
        },
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        days: 5,
        status: 'Pending',
      },
      {
        id: 2,
        leaveType: {
          name: 'Sick Leave'
        },
        startDate: '2026-05-10',
        endDate: '2026-05-11',
        days: 2,
        status: 'Approved',
      },
    ],
  },
  Manager: {
    leaveBalance: 18,
    pendingRequests: 2,
    teamMembers: 8,
    requests: [
      {
        id: 3,
        employee: {
          firstName: 'Okiki'
        },
        leaveType: {
          name: 'Annual Leave'
        },
        startDate: '2026-09-07',
        endDate: '2026-09-10',
        days: 4,
        status: 'Pending',
      },
      {
        id: 4,
        employee: {
          firstName: 'Abisola'
        },
        leaveType: {
          name: 'Maternity Leave'
        },
        startDate: '2026-08-24',
        endDate: '2026-09-04',
        days: 12,
        status: 'Approved',
      },
    ],
  },
  'HR Admin': {
    leaveBalance: 0,
    pendingRequests: 5,
    teamMembers: 42,
    requests: [
      {
        id: 5,
        employee: {
          firstName: 'Michael'
        },
        leaveType: {
          name: 'Annual Leave'
        },
        startDate: '2026-08-24',
        endDate: '2026-08-28',
        days: 5,
        status: 'Approved',
      },
      {
        id: 6,
        employee: {
          firstName: 'Jomiloju'
        },
        leaveType: {
          name: 'Sick Leave'
        },
        startDate: '2026-08-29',
        endDate: '2026-09-05',
        days: 8,
        status: 'Pending',
      },
    ],
  },
};
