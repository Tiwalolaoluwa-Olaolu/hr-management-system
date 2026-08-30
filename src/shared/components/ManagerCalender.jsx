import React, { useState, useEffect } from 'react';

// Base API URL
const API_BASE_URL = 'https://personlwesen-api-512914121676.us-central1.run.app';

export default function EmployeeLeaveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDayLeaves, setSelectedDayLeaves] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. FETCH REAL EMPLOYEES FROM THE API
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
       
        const API_EMPLOYEES_ENDPOINT = '/api/Employees';

        const response = await fetch(`${API_BASE_URL}${API_EMPLOYEES_ENDPOINT}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            
          },
        });

        if (!response.ok) {
          throw new Error(`API Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        
        const normalizedEmployees = data.map((emp) => ({
          id: emp.id ,
          name: emp.name,
          department: emp.department,
        }));

        setEmployees(normalizedEmployees);
      } catch (err) {
        setError(err.message || 'Failed to load employees from API');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 2. MOCK LEAVE DATA OBJECTS (Referencing API Employee IDs)
  // Maps leave periods using employee IDs fetched from your backend
  const leaveObjects = [
    {
      id: 'L-101',
      employeeId: employees[0]?.id || 1, // Connects to 1st employee from API
      leaveType: 'Vacation',
      startDate: '2026-08-05',
      endDate: '2026-08-12',
    },
    {
      id: 'L-102',
      employeeId: employees[1]?.id || 2, // Connects to 2nd employee from API
      leaveType: 'Sick Leave',
      startDate: '2026-08-10',
      endDate: '2026-08-11',
    },
    {
      id: 'L-103',
      employeeId: employees[2]?.id || 3, // Connects to 3rd employee from API
      leaveType: 'Personal Leave',
      startDate: '2026-08-20',
      endDate: '2026-08-25',
    },
  ];

  // Helper to map a leave object to its full API employee details
  const getLeavesForDate = (dayNumber) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

    return leaveObjects
      .filter((leave) => formattedDate >= leave.startDate && formattedDate <= leave.endDate)
      .map((leave) => {
        // Find corresponding employee fetched from the API
        const matchedEmployee = employees.find((emp) => emp.id === leave.employeeId);
        return {
          ...leave,
          employeeName: matchedEmployee ? matchedEmployee.name : 'Unknown Employee',
          department: matchedEmployee ? matchedEmployee.department : 'N/A',
        };
      });
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Employee Leave Calendar</h2>
          <p className="text-sm text-gray-500">
            Employees loaded from API • Leave schedule stored locally
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            ←
          </button>
          <span className="text-lg font-semibold text-gray-700 w-36 text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            →
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-blue-600 mb-4">Fetching employees from API...</p>}
      {error && <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 bg-gray-50/50 rounded-lg" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const activeLeaves = getLeavesForDate(day);
          const hasLeaves = activeLeaves.length > 0;

          return (
            <div
              key={day}
              onClick={() => hasLeaves && setSelectedDayLeaves({ day, list: activeLeaves })}
              className={`h-24 p-2 rounded-lg border transition flex flex-col justify-between cursor-pointer ${
                hasLeaves
                  ? 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                  : 'bg-white border-gray-100'
              }`}
            >
              <span className={`text-sm font-semibold ${hasLeaves ? 'text-amber-900' : 'text-gray-700'}`}>
                {day}
              </span>

              <div className="space-y-1 overflow-hidden">
                {activeLeaves.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="text-[10px] px-1.5 py-0.5 bg-amber-200/80 text-amber-900 rounded truncate font-medium"
                  >
                    {item.employeeName}
                  </div>
                ))}
                {activeLeaves.length > 2 && (
                  <div className="text-[9px] text-amber-700 font-semibold pl-1">
                    +{activeLeaves.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDayLeaves && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">
              Leaves on {monthNames[month]} {selectedDayLeaves.day}, {year}
            </h3>
            <button
              onClick={() => setSelectedDayLeaves(null)}
              className="text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <ul className="divide-y divide-gray-200">
            {selectedDayLeaves.list.map((leave) => (
              <li key={leave.id} className="py-2 flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">{leave.employeeName}</p>
                  <p className="text-xs text-gray-500">
                    Dept: {leave.department} • {leave.startDate} to {leave.endDate}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full h-fit">
                  {leave.leaveType}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}