import { Eye, EyeIcon, EyeOff, LockKeyhole, LucideEye, UserRound } from "lucide-react";
import LoginInput from "../shared/components/LoginInput";
import NavBar from "../shared/components/NavBar";
import Button from "../shared/components/Button";
import { useNavigate } from "react-router";
import BgImg from "../assets/login-bg-img.jpg"
import { useState } from "react";

const Login = () => {
  const [type, setType] = useState('password');
  const [toggleIcon, setToggleIcon] = useState(false);
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const navigateToDashBoard = () => navigate('/dashboard');

  const togglePassword = () => {
    setType(prev => (
      prev === 'password' ? 'text' : 'password'
    ));
    setToggleIcon(!toggleIcon);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToDashBoard();
  }

  return (
    <>
      <main className='login-page-wrapper'>
        <img className='bg-image' src={BgImg} alt="Background image" />
        <form onSubmit={handleSubmit}className="login-input-container">
          <NavBar />
          <LoginInput
            onChange={handleChange}
            icon={<UserRound size={26} />}
            type='email'
            name='email'
            value={input.value}
            placeholder='Email ID'
          />
          <div className='pwd-container'>
            <LoginInput
              onChange={handleChange}
              icon={<LockKeyhole size={26} />}
              type={type}
              name='password'
              value={input.value}
              placeholder='Password'
            />
            <div className='pwd-toggle' onClick={togglePassword}>
              {
                toggleIcon ? <LucideEye /> : <EyeOff />
              }
            </div>
          </div>
          <Button
            btnText='Login'
          />
        </form>
      </main>
    </>
  )
};

export default Login;