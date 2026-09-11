import { useNavigate } from "react-router";
import Button from "./Button";
import Modal from "./Modal";
import { useAuth } from "../../core/services/Context";

const SignOut = ({wide, onClose}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
      <Modal
        title='Logout Confirmation'
        wide={wide}
        onClose={onClose}
      >
        <div className='signout-message'>
          <p>Are you sure you want to log out?</p>
        </div>
        <div className='signout-btn-container'>
          <Button 
            btnEvent={() => {
              logout();
              navigate('/', { replace: true });
            }}
            btnText='Confirm'
            btnUniqueStyling='primary-action'
          />
          <Button 
            btnEvent={onClose}
            btnText='Cancel'
            btnUniqueStyling='secondary-btn'
          />
        </div>
      </Modal>
    </>
  )
}

export default SignOut;