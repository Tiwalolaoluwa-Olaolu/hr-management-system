const Metric = ({ icon, label, value, accent = false }) => {
  return (
    <>
      <article 
        className={
          `metric-card ${accent ? 'metric-accent' : ''}`
        }
      >
        <div className='metric-icon'>{icon}</div>
        <div>
          <p>{label}</p>
          <strong>{value}</strong>
          <span>Days</span>
        </div>
      </article>
    </>
  );
};


export default Metric;