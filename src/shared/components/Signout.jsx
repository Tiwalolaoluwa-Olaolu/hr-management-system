import { useNavigate } from "react-router";
import Button from "./Button";
import Modal from "./Modal";

const SignOut = ({wide, onClose}) => {
  const navigate = useNavigate();
  const navigateToLandingPage = () => navigate('/');

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
            btnEvent={navigateToLandingPage}
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