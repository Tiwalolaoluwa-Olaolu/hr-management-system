const Field = ({ label, name, type = 'text', value, onChange, error, required = false, placeholder = '', children, min, max, disabled = false }) => (
  <div className='field'>
    <label htmlFor={name}>
        {label}
        {
          required && <span className='required-mark'>*</span>
        }
      </label>
    {
      children ? (
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
        >
          {children}
        </select>
      ) :
      (
        <input 
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          required={required}
        />
      )
    }
    {
      error && <small className='field-error'>{error}</small>
    }
  </div>
);

export default Field;
