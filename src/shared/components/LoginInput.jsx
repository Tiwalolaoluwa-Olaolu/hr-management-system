const LoginInput = ({ onChange, icon, type, name, value, placeholder }) => {
  return (
    <>
      <div className='login-input'>
        <span>{icon}</span>
        <input
          onChange={onChange}
          value={value}
          name={name}
          type={type}
          placeholder={placeholder}
        />
      </div>
    </>
  )
};

export default LoginInput;