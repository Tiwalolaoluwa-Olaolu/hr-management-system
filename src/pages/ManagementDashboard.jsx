import React, { useState, useEffect } from 'react';
import AppShell from './AppShell';
import BalanceCard from './BalanceCard';
import ActivityCard from './ActivityCard';
import Button from './Button';
import Field from './Field';
import ApiStatus from './ApiStatus';
import ConfirmDialog from './ConfirmDialog';

// Base API URL
const API_BASE_URL = 'https://personlwesen-api-512914121676.us-central1.run.app';

export default function ManagerDashboard() {
  const [managerInfo, setManagerInfo] = useState({ name: 'Jane Doe', role: 'HR Manager', status: 'Active' });
  const [leaveBalance, setLeaveBalance] = useState(24);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Dialog State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogAction, setDialogAction] = useState(null); // 'approve' | 'reject'
  const [actionLoading, setActionLoading] = useState(false);

  // FETCH EMPLOYEES FROM API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        // Fetch employee data from the Personalwesen API
        const response = await fetch(`${API_BASE_URL}/api/Employees`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Enable if API requires auth token
          },
        });

        if (!response.ok) {
          throw new Error(`API Error ${response.status}: ${response.statusText}`);
        }

        const employeeData = await response.json();

        // Transform API employee data into dashboard approval requests
        const mappedRequests = employeeData.slice(0, 5).map((emp, index) => ({
          id: emp.id || emp.employeeId || index + 1,
          employeeName: emp.fullName || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || 'API Employee',
          department: emp.department || 'HR',
          leaveType: index % 2 === 0 ? 'Vacation' : 'Sick Leave',
          startDate: '2026-09-01',
          endDate: '2026-09-05',
        }));

        setLeaveRequests(mappedRequests);
      } catch (err) {
        setApiError(err.message || 'Failed to connect to API');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Action Handlers
  const handleActionClick = (request, action) => {
    setSelectedRequest(request);
    setDialogAction(action);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);

    try {
      // POST request to API endpoint for approval/rejection
      const endpoint = `${API_BASE_URL}/api/Employees/${selectedRequest.id}/${dialogAction}`;
      
      const res = await fetch(endpoint, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        console.warn(`API post returned status ${res.status}. Removing request from UI state.`);
      }

      setLeaveRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
      setSelectedRequest(null);
      setDialogAction(null);
    } catch (err) {
      alert(`Action error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppShell name={managerInfo.name} role={managerInfo.role} status={managerInfo.status}>
      <div className="dashboard-container">
        
        {/* Top Summary Section */}
        <section className="dashboard-metrics">
          <BalanceCard balance={leaveBalance} />
          <ActivityCard />
        </section>

        {/* API Status Alert when endpoint fails */}
        {apiError && (
          <section className="my-4">
            <ApiStatus message={`API Status: ${apiError}`} />
          </section>
        )}

        {/* Main Content Area */}
        <section className="pending-approvals-section">
          <h2>Pending Leave Approvals</h2>

          {isLoading ? (
            <p>Loading employee data from API...</p>
          ) : leaveRequests.length === 0 ? (
            <ApiStatus message="No pending leave requests found." />
          ) : (
            <div className="requests-list">
              {leaveRequests.map((req) => (
                <div key={req.id} className="request-item">
                  <div className="request-details">
                    <p><strong>Employee:</strong> {req.employeeName}</p>
                    <p><strong>Type:</strong> {req.leaveType}</p>
                    <p><strong>Dates:</strong> {req.startDate} to {req.endDate}</p>
                  </div>
                  <div className="request-actions">
                    <Button 
                      btnText="Approve" 
                      btnUniqueStyling="success-btn" 
                      btnEvent={() => handleActionClick(req, 'approve')} 
                    />
                    <Button 
                      btnText="Reject" 
                      btnUniqueStyling="danger-btn" 
                      btnEvent={() => handleActionClick(req, 'reject')} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Confirmation Dialog Modal */}
      {selectedRequest && dialogAction && (
        <ConfirmDialog
          title={`${dialogAction === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
          message={`Are you sure you want to ${dialogAction} the leave request for ${selectedRequest.employeeName}?`}
          confirmText={dialogAction === 'approve' ? 'Approve' : 'Reject'}
          loading={actionLoading}
          onConfirm={handleConfirmAction}
          onClose={() => {
            setSelectedRequest(null);
            setDialogAction(null);
          }}
        />
      )}
    </AppShell>
  );
}