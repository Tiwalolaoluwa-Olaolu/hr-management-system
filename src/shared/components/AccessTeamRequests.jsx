import { Check, MessageSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import Toast from './Toast';
import { useAuth } from '../../core/services/Context';
import { apiGet, apiPut } from '../../core/services/Api';
import FormTextArea from './FormTextArea';

const AccessTeamRequests = () => {
  const { user } = useAuth(); 
  const [requests, setRequests] = useState([]); 
  const [error, setError] = useState(''); 
  const [selected, setSelected] = useState(null); 
  const [decision, setDecision] = useState(''); 
  const [comment, setComment] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [toast, setToast] = useState('');

  useEffect(() => { 
    apiGet('/team/leave-requests')
      .then(data => setRequests(data || []))
      .catch(e => setError(e.message)); 
    }, [user]
  );

  const submit = async () => { 
    if (!decision) return; 
    setLoading(true); 
    try { 
      const result = await apiPut('/leave-requests',  
        selected.id, 
        { status: decision, comment }
      ); 
      setRequests(prev => prev.map(item => item.id === selected.id ? result : item)); 
      setToast(`Request ${decision.toLowerCase()} successfully.`); 
      setSelected(null); 
    } catch(e) { 
      setToast(e.message); 
    } finally { 
      setLoading(false);
    } 
  };

  return (
    <>
      <section className='page-heading team-requests-sec'>
        <div>
          <span className='eyebrow'>TEAM MANAGEMENT</span>
          <h1>Team Requests</h1>
          <p>
            Review leave requests from your direct reports.
          </p>
        </div>
      </section>
      {
        toast && <Toast 
          message={toast} 
          onClose={() => setToast('')} 
        />
      }
        <section className='content-card request-history-card'>
          <div className='table-wrap'>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  requests.map(request => (
                  <tr key={request.id}>
                    <td>
                      {
                        request.employee?.name || request.employeeName
                      }
                    </td>
                    <td>
                      {
                        request.leaveType?.name || request.leaveTypeName
                      }
                    </td>
                    <td>
                      {request.startDate} — {request.endDate}
                    </td>
                    <td>
                      {request.days}
                    </td>
                    <td>
                      {request.reason}
                    </td>
                    <td>
                      <StatusBadge 
                        status={request.status} 
                      />
                    </td>
                    <td>
                      {
                        request.status === 'Pending' ? <button 
                          type='button' className='table-action'
                          onClick={() => { 
                            setSelected(request); 
                            setDecision(''); 
                            setComment(''); 
                          }}
                        >
                          <MessageSquare size={15} /> 
                          Review
                        </button> : 'Closed'
                      }
                    </td>
                  </tr>))
                }
              </tbody>
            </table>
          </div>
        </section>
      {
        selected && (<Modal 
          title='Review leave request' 
          onClose={() => setSelected(null)}
        >
          <div className='review-summary'>
            <strong>
              {selected.employee?.name || selected.employeeName}
            </strong>
            <p>
              {selected.leaveType?.name || selected.leaveTypeName} · {selected.days} days
            </p>
            <p>
              {selected.startDate} — {selected.endDate}
            </p>
            <p>
              {selected.reason}
            </p>
            <FormTextArea
              labelTitle='Comment (optional)'
              id='comment' 
              name='comment' 
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className='modal-actions'>
              <Button 
                type='button' 
                btnUniqueStyling='reject-btn' btnText='Reject' 
                btnIcon={<X size={16} />} 
                btnEvent={() => setDecision('Rejected')} 
              />
              <Button 
                type='button' 
                btnUniqueStyling='approve-btn' btnText='Approve' 
                btnIcon={<Check size={16} />} 
                btnEvent={() => setDecision('Approved')} 
              />
            </div>
            {
              decision && <Button 
                type='button' btnUniqueStyling='primary-action' 
                btnText={`Confirm ${decision}`} 
                loading={loading} 
                btnEvent={submit} 
              />
            }
          </div>
        </Modal>
      )}
    </>
  );
};

export default AccessTeamRequests;