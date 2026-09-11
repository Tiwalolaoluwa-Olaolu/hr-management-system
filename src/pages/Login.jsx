import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import LoginInput from '../shared/components/LoginInput';
import NavBar from '../shared/components/NavBar';
import Button from '../shared/components/Button';
import { useAuth } from '../core/services/Context';
import BgImg from '../assets/login-bg.jpg';
import { apiPost } from '../core/services/Api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const getEmailError = (email) => {
    const value = email.trim();
    if (!value) return 'Email address is required.';
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Enter a valid email address.';
    return '';
  };

  const getPasswordError = (password) => {
    if (!password) return 'Password is required.';
    return '';
  };

  const validateField = (name, value) => (
    name === 'email' ? getEmailError(value) : getPasswordError(value)
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setMessage('');

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const next = {
      email: getEmailError(input.email),
      password: getPasswordError(input.password),
    };
    setTouched({ email: true, password: true });
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const account = await apiPost('/Auth/login', {
        email: input.email.trim(),
        password: input.password,
      }, true);

      login(account);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setMessage('Unable to sign in. Please check your details and try again.');
    } finally {
      setLoading(false);
      setInput({
        email: '',
        password: ''
      })
    }
  };

  return (
    <>
      <NavBar className='login-page-name' />
      <main className='login-page-wrapper'>
        <img className='bg-image' src={BgImg} alt='' aria-hidden='true' />
        <section className='login-card'>
          <div className='login-card-intro'>
            <span className='login-security-icon'><ShieldCheck size={25} /></span>
            <h3 className='login-header'>LOGIN</h3>
          </div>

          <form onSubmit={handleSubmit} className='login-input-container'>
            <div className='input-group'>
              <LoginInput
                onChange={handleChange}
                onBlur={handleBlur}
                icon={<UserRound size={22} />}
                type='email'
                name='email'
                value={input.email}
                placeholder='Email address'
              />
              {errors.email && <p className='input-error' role='alert'>{errors.email}</p>}
            </div>

            <div className='input-group'>
              <div className='pwd-container'>
                <LoginInput
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon={<LockKeyhole size={22} />}
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={input.password}
                  placeholder='Password'
                />
                <button
                  className='pwd-toggle'
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye size={23} /> : <EyeOff size={20} />}
                </button>
              </div>
              {errors.password && <p className='input-error' role='alert'>{errors.password}</p>}
            </div>

            {message && <p className='form-message error' role='alert'>{message}</p>}

            <Button
              type='submit'
              btnUniqueStyling='log-in-btn'
              btnText={loading ? 'Signing in…' : 'Sign in'}
            />
          </form>
        </section>
      </main>
    </>
  );
};

export default Login;
