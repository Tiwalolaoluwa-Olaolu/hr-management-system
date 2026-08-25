import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppShell = ({ children, name, role, status }) => {
  return (
    <div className='app-shell'>
      <Sidebar role={role} />
      <main className='app-main'>
        <TopBar 
          name={name} 
          role={role} 
          status={status} 
        />
        <div className='page-content'>{children}</div>
      </main>
    </div>  
)};

export default AppShell;
