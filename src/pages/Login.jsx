import { EyeOff, LockKeyhole, LucideEye, UserRound } from "lucide-react";
import LoginInput from "../shared/components/LoginInput";
import NavBar from "../shared/components/NavBar";
import Button from "../shared/components/Button";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from '../core/services/Context';
import { testUsers } from '../shared/components/TestData';
import BgImg from "../assets/login-bg.jpg"

const Login = () => {
  const [type, setType] = useState('password');
  const [toggleIcon, setToggleIcon] = useState(false);
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePassword = () => {
    setType(prev => (
      prev === 'password' ? 'text' : 'password'
    ));
    setToggleIcon(!toggleIcon);
  };

  const getEmailError = (email) => {
    if (!email.trim()) return 'Email address is required.';
    if (!email.toLowerCase().endsWith('@sbsc.com')) {
      return 'Email address must end with @sbsc.com.';
    }
    return '';
  };

  const getPasswordError = (password) => {
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldError =
      name === 'email' ? getEmailError(value) : getPasswordError(value);

    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  }

    const validate = () => {
    const emailError = getEmailError(input.email);
    const passwordError = getPasswordError(input.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const form = e.currentTarget;
    if (!validate()) return;

    setLoading(true);
    try {
      // const account = await apiPost('/auth/login', {    
      //   email: input.email.trim(),
      //   password: input.password
      // });

      const account = testUsers.find(
        (testUser) =>
          testUser.email.toLowerCase() === input.email.trim().toLowerCase() &&
          testUser.password === input.password
      );

      if (!account) {
        throw new Error('Invalid email address or password.');
      }

      login(account);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavBar className='login-page-name' />
      <main className='login-page-wrapper'>
        <img className='bg-image' src={BgImg} alt="Background image" />
        <form onSubmit={handleSubmit}className="login-input-container">
          <div className='login-header'>
            <h3>Login</h3>
            <p>Log into your account</p>
          </div>
          <div className='input-group'>
            <LoginInput
            onChange={handleChange}
            icon={<UserRound size={37} />}
            type='email'
            name='email'
            value={input.email}
            placeholder='Email ID'
            />
            {errors.email && (
                <p className='input-error' role='alert'>{errors.email}</p>
            )}
          </div>
          <div className='input-group'>
            <div className='pwd-container'>
              <LoginInput
                onChange={handleChange}
                icon={<LockKeyhole size={37} />}
                type={type}
                name='password'
                value={input.password}
                placeholder='Password'
              />
              <div className='pwd-toggle' onClick={togglePassword}>
                {
                  toggleIcon ? <LucideEye /> : <EyeOff />
                }
              </div>
              {errors.password && (
                <p className='input-error' role='alert'>{errors.password}</p>
              )}
            </div>
          </div>
          <Button
            btnUniqueStyling='log-in-btn'
            btnText='Login'
          />
        </form>
      </main>
    </>
  )
};

export default Login;