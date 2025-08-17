import PropTypes from "prop-types";

const SimpleCardCounter = ({ title, icon, counterValue }) => {
  return (
    <div className="row align-items-center p-2">
      <div className="col-12 bg-white p-2 border">
        <div className="d-flex gap-2 mb-2">
          <span
            style={{
              backgroundColor: "rgb(148, 252, 163)",
              color: "rgb(0, 128, 0)",
              padding: "6px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden="true"
          >
            {icon}
          </span>
          <h3 className="m-0">{counterValue}</h3>
        </div>

        <p className="m-0 text-muted p-0">{title}</p>
      </div>
    </div>
  );
};

SimpleCardCounter.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  counterValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default SimpleCardCounter;
