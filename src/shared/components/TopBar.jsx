import { User } from "lucide-react";

const TopBar = () => {
  const userInfo = {
    firstName: 'Tiwalola',
    lastName: 'Olaolu',
    role: 'Employee',
    status: 'Active',
  };

  const {
    firstName,
    lastName,
    role,
    status,
  } = userInfo
  ;

  return (
    <>
      <section className='top-bar-section'> 
        <span>{<User />}</span> 
        <p>{firstName} {lastName}</p>
        <p>{role}</p>
        <p>
          Status:
          <span> {status}</span>
        </p>
      </section>
    </>
  )
};

export default TopBar;