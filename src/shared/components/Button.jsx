const Button = ({ btnEvent, btnUniqueStyling, btnIcon, btnText = 'Submit' }) => {
  return (
    <>
      <button type='submit' onClick={btnEvent} className={`btn ${btnUniqueStyling}`}>
        <span className='btn-icon'>{btnIcon}</span>
        {btnText}
      </button>
    </>
  )
};

export default Button;