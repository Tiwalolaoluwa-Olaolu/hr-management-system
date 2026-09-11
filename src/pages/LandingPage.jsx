import { ChartNoAxesCombined, LayoutPanelTop, Radar, Send, SquareCheckBig } from 'lucide-react';
import HeroImg from '../assets/hero-img.webp';
import Footer from '../shared/components/Footer';
import NavBar from '../shared/components/NavBar';
import Services from '../shared/components/ServicesCard';
import Button from '../shared/components/Button';
import { useNavigate } from 'react-router';


const LandingPage = () => {
  const navigate = useNavigate();
  const navigateToLogin = () => navigate('/login');

  return (
    <>
      <div className='landing-page-wrapper'>
        <section className='hero-section'>
          <NavBar className='nav-bar' />
          <img className='hero-img' src={HeroImg} alt='An image of an empty office' />
          <Button
            btnEvent={navigateToLogin}
            btnUniqueStyling='login-btn'
            btnText='LOG IN'
          />
          <div className='overlay'></div>
          <div className='hero-content-section'>
            <h2 className='hero-title'>Leave Made Easy</h2>
            <p className='hero-content'>
              No paperwork, no unnecessary delays—just a quick, convenient way to take time off when needed. With HRMS, your leave is always just a tap away.
            </p>
            <div className='btn-container'>
              <Button
                btnEvent={navigateToLogin}
                btnUniqueStyling='get-started-btn'
                btnText='Get Started'
              />
              <a className="learn-more-btn" href="#our-services">
                Learn More
              </a>
            </div>
          </div>
        </section>
        <section id="our-services" className='services-section'>
          <h3 style={{ marginLeft: '22px' }}>OUR SERVICES</h3>
          <div  className='card-container'>
            <Services
              icon={<Send size={25} />}
              title='Easy Leave Requests'
              content='Time off made effortless. Submit and manage leave requests seamlessly from your desktop or mobile—any day, anytime, anywhere.'
            />
            <Services
              icon={<Radar size={25} />}
              title='Real-time Leave Tracking'
              content='All employees have to do is request, track, and relax. From submission to approval, every update is just a glance away. No chasing. No guessing. Just clarity.'
            />
            <Services
              icon={<LayoutPanelTop size={25} />}
              title='Complete Leave Visibility'
              content='Employees can easily access their up-to-date leave balances and full time-off history anytime, anywhere—keeping them informed and in control.'
            />
            <Services
              icon={<SquareCheckBig size={25} />}
              title='Smart Approvals'
              content='With access to a clear team leave calendar, managers can easily see who’s away, plan ahead, avoid leave overlaps, and make informed decisions with confidence.'
            />
            <Services
              icon={<ChartNoAxesCombined size={25} />}
              title='HR Insights & Reports'
              content='HR can manage leave types and employee records, allocate annual leave, and view company-wide statistics—all in one place for better, data-driven decisions.'
            />
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
};

export default LandingPage;