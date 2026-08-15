const FormError = ({ icon, errorMessage }) => {
  return (
    <>
      <div className='form-error-container'>
        <span>{icon}</span>
        <p>{errorMessage}</p>
      </div>
    </>
  )
};

export default FormError;