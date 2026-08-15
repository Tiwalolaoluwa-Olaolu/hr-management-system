const FormDropdown = ({ labelTitle, id, name, children }) => {
  return (
    <>
      <div className='input-container'>
        <label htmlFor={id} className='form-label'>
          {labelTitle}
        </label>
        <select name={name} id={id}>
          {children}
        </select>
      </div>
    </>
  )
};

export default FormDropdown;