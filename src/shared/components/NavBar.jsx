import Logo from '../../assets/hrms-logo.png';

const NavBar = ({ className }) => {
  return (
    <>
      <header className={`hrms-brand ${className}`}>
        <div className='logo-container'>
          <img className='logo' src={Logo} alt='HRMS Logo' />
        </div>
        <h1 className='title'>HRMS</h1>
      </header>
    </>
  )
};

export default NavBar;