import { User } from "lucide-react";

const TopBar = ({name, role, status}) => {
  return (
    <>
      <section className='top-bar-section'> 
        <span>{<User />}</span> 
        <p>{name}</p>
        <p>{role}</p>
        <p>
          Status:
          <span>{status}</span>
        </p>
      </section>
    </>
  )
};

export default TopBar;