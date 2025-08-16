const SimpleCardCounter = ({ title, icon, counterValue }) => {
  return (
    <div className="row border border-lg">
      <div className="col-12 d-flex align-items-center">
        {icon} {counterValue}
      </div>
      <div className="col-12">
        <h5>{title}</h5>
      </div>
    </div>
  );
};

export default SimpleCardCounter;
