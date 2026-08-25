import { X } from 'lucide-react';

const Modal = ({title, children, onClose, wide = false}) => {
  return (
    <>
      <div className='modal-backdrop' role='presentation' onMouseDown={onClose}>
        <div className={
          `modal ${wide ? 'modal-wide' : ''}`
          }
          role='dialog' 
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className='modal-header'>
            <h3>{title}</h3>
            <button
              type='button' 
              className='icon-button' 
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  )
};

export default Modal;
