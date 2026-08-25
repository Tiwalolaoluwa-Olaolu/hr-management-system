import { CheckCircle2, CircleAlert, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role='alert'>
      {type === 'success' ? <CheckCircle2 size={19} /> : <CircleAlert size={19} />}
      <span>{message}</span>
      <button type='button' onClick={onClose} aria-label='Close notification'><X size={17} /></button>
    </div>
  );
};

export default Toast;
