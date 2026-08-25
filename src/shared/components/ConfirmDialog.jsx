import Button from './Button';
import Modal from './Modal';

const ConfirmDialog = ({title, message, confirmText = 'Confirm', loading = false, onConfirm, onClose}) => {
  return (
    <>
      <Modal
        title={title}
        onClose={onClose}
      >
      <div className='confirm-body'>
        <p>{message}</p>
        <div className='modal-actions'>
          <Button
            type='button'
            btnUniqueStyling='secondary-btn'
            btnText='Cancel'
            btnEvent={onClose} 
          />
          <Button 
            type='button' 
            btnUniqueStyling='danger-btn'
            btnText={confirmText} 
            loading={loading} 
            btnEvent={onConfirm} 
          />
        </div>
      </div>
  </Modal>
    </>
  )
};

export default ConfirmDialog;
