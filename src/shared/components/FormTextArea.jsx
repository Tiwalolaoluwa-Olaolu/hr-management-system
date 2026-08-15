const FormTextArea = ({ labelTitle, id, name, value, onChange }) => {
  return (
    <>
      <div className='input-container'>
        <label htmlFor={id} className='form-label'>{labelTitle}</label>
        <textarea onChange={onChange} name={name} id={id} value={value}></textarea>
      </div>
    </>
  )
};

export default FormTextArea;