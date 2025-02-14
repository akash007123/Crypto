import React from "react";
import PropTypes from "prop-types";

function ActionButton(props) {
  const { btnName, btnClass, onClick, icon, iconClass, isDisabled } = props;
  return (
    <div className="relative">
      <button className={btnClass} onClick={onClick} disabled={isDisabled}>
        {icon && (
          <img
            src={icon}
            alt="icon"
            className={`absolute left-2 top-1/2 -translate-y-1/2 transform ${iconClass}`}
          />
        )}
        <span className={icon ? "pl-8" : ""}>{btnName}</span>
        {/* {btnName} */}
      </button>
      {/* {icon && <img src={icon} alt="google" className={iconClass} />} */}
    </div>
  );
}
ActionButton.propTypes = {
  btnName: PropTypes.string,
  btnClass: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  iconClass: PropTypes.string,
  isDisabled: PropTypes.bool,
};
export default ActionButton;
