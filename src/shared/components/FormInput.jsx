const FormInput = ({ onChange, id, labelTitle, type, name, value, placeholder }) => {
  return (
    <>
      <div className='input-container'>
        <label htmlFor={id} className='form-label'>
          {labelTitle}
        </label>
        <input
          className='form-input'
          onChange={onChange}
          id={id}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
        />
      </div>
    </>
  )
};

export default FormInput;