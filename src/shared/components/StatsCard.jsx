const StatsCard = ({ cardTitle, number }) => {
  return (
    <>
      <div className='stats-card'>
        <h3>{cardTitle}</h3>
        <p className='stats-number'>
          {number}
          <span>REQUESTS</span>
        </p>
      </div>
    </>
  )
};

export default StatsCard;