const BalanceCard = ({ balance }) => {
  return (
    <>
      <div className="balance-card">
        <h3>AVAILABLE LEAVE BALANCE</h3>
        <p>{balance}</p>
      </div>
    </>
  )
};

export default BalanceCard;