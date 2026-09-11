const FormTextArea = ({ labelTitle, id, name, value, onChange, placeholder, error }) => {
  return (
    <>
      <div className='input-container field'>
        <label htmlFor={id} className='form-label'>{labelTitle}</label>
        <textarea 
          onChange={onChange} 
          name={name} 
          id={id} 
          value={value ?? ''}
          placeholder={placeholder}
        ></textarea>
        {
          error && <small className='field-error'>{error}</small>
        }
      </div>
    </>
  )
};

export default FormTextArea;