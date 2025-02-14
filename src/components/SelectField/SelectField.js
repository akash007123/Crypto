import React from "react";
import PropTypes from "prop-types";
import { reactIcons } from "utils/icons";

function SelectField(props) {
  const {
    selectClass,
    list,
    onChange,
    error,
    iconClass,
    value,
    selectLabel,
    name,
    isDisabled,
  } = props;
  return (
    <div className="py-2">
      <div className="relative">
        <select
          className={selectClass}
          disabled={isDisabled}
          onChange={onChange}
          name={name}
          value={value || ""}
        >
          <option value="" disabled hidden>
            {selectLabel || "Select an option"}
          </option>
          {list &&
            list?.map((item, index) => {
              return (
                <option
                  className="text-black hover:bg-bluewhalelight bg-white dark:!bg-navy-900 dark:text-white"
                  value={item.value ? item.value : item.name}
                  key={index}
                >
                  {item.name}
                </option>
              );
            })}
        </select>
        <span className={iconClass}>{reactIcons.arrowdown}</span>
      </div>
      {error && (
        <div className="mt-1 text-left">
          <span className="errors text-12">{error}</span>
        </div>
      )}
    </div>
  );
}

SelectField.propTypes = {
  selectClass: PropTypes.string,
  list: PropTypes.array,
  onChange: PropTypes.func,
  error: PropTypes.string,
  iconClass: PropTypes.string,
  value: PropTypes.string,
  selectLabel: PropTypes.string,
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default SelectField;
