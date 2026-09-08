const Button = ({ type = 'button', btnEvent, btnUniqueStyling, btnIcon, btnText = 'Submit' }) => {
  return (
    <>
      <button type={type} onClick={btnEvent} className={`btn ${btnUniqueStyling}`}>
        <span className='btn-icon'>{btnIcon}</span>
        {btnText}
      </button>
    </>
  )
};

export default Button;