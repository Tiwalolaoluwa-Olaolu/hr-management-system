import React, { useState, useEffect } from 'react';
import AppShell from './AppShell';
import BalanceCard from './BalanceCard';
import ActivityCard from './ActivityCard';
import Button from './Button';
import Field from './Field';
import ApiStatus from './ApiStatus';
import ConfirmDialog from './ConfirmDialog';

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

  // Fetch HR/Manager Data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Replace endpoint path with your backend target path
        const res = await fetch('/api/manager/dashboard');
        if (!res.ok) throw new Error('Failed to load dashboard data');
        const data = await res.json();
        
        setLeaveRequests(data.pendingRequests || []);
        if (data.balance) setLeaveBalance(data.balance);
      } catch (err) {
        setApiError(err.message);
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
      const endpoint = `/api/leave-requests/${selectedRequest.id}/${dialogAction}`;
      const res = await fetch(endpoint, { method: 'POST' });
      
      if (!res.ok) throw new Error(`Failed to ${dialogAction} request`);

      setLeaveRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
      setSelectedRequest(null);
      setDialogAction(null);
    } catch (err) {
      alert(err.message);
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
            <ApiStatus message={`API Error: ${apiError}`} />
          </section>
        )}

        {/* Main Content Area */}
        <section className="pending-approvals-section">
          <h2>Pending Leave Approvals</h2>

          {isLoading ? (
            <p>Loading pending requests...</p>
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