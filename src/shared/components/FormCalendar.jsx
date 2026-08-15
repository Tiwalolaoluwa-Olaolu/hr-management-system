const FormCalendar = ({ id, labelTitle, type, name, value }) => {
  return (
    <>
      <div className='input-container'>
        <label htmlFor={id} className='form-label'>
          {labelTitle}
        </label>
        <input
          className='form-calendar'
          id={id}
          type={type}
          name={name}
          value={value}
        />
      </div>
    </>
  )
};

export default FormCalendar;