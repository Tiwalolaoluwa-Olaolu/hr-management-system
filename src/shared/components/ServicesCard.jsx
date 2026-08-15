

const ServicesCard = ({ icon, title, content }) => {
  return (
    <>
      <div className='services-card'>
        <span className="service-icon">{icon}</span>
        <h4 className='service-title'>{title}</h4>
        <p>{content}</p>
      </div>
    </>
  )
};

export default ServicesCard;