import React from "react";
import PropTypes from "prop-types";

function InputFields(props) {
  const {
    type,
    inpClass,
    placeholder,
    icon,
    iconClass,
    onChange,
    error,
    showPassword,
    setShowPassword,
    value,
    showConfPassword,
    setShowConfPassword,
    onKeyDown,
    name,
    isDisabled,
    autoComplete,
  } = props;
  return (
    <div className="py-2">
      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className={inpClass}
          onChange={onChange}
          onKeyDown={onKeyDown}
          name={name}
          autoComplete={autoComplete}
          disabled={isDisabled}
          // style={{
          //   padding: '20px',
          //   background: 'black',
          //   borderRadius: '15px',
          //   fontSize: '22px',
          //   color: 'white',
          //   width: '100%',
          // }}
        />
        {icon && (
          <span
            className={iconClass}
            onClick={() => {
              if (placeholder === "Enter your password") {
                setShowPassword(!showPassword);
                return;
              } else if (placeholder === "Enter your confirm password") {
                setShowConfPassword(!showConfPassword);
              }
            }}
          >
            {icon}
          </span>
        )}
      </div>
      {error && (
        <div className="mt-1 text-left">
          <span className="text-14 errors text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}

InputFields.propTypes = {
  type: PropTypes.string,
  inpClass: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.object,
  iconClass: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.object,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
  value: PropTypes.string,
  showConfPassword: PropTypes.bool,
  setShowConfPassword: PropTypes.func,
  onKeyDown: PropTypes.func,
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  autoComplete: PropTypes.any,
};
export default InputFields;
