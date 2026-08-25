import { ServerOff } from 'lucide-react';

const ApiStatus = ({ message = 'This screen is ready for the backend API.' }) => (
  <div className='empty-state api-status'>
    <ServerOff size={30} />
    <h3>Waiting for backend data</h3>
    <p>{message}</p>
  </div>
);

export default ApiStatus;
