// @ts-check
import React, { PureComponent, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format, parse, isValid } from 'date-fns';
import CalendarIcon from '../../icons/Calendar';

export class DateConditionInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      invalid: false,
      changed: false,
    };
  }

  render = () => {
    const { invalid } = this.state;
    const { condition, onConditionChange } = this.props;

    return (
      <div className={classnames('rdrDateInputContainer', 'condition', this.props.className)}>
        <label htmlFor={this.props.id}>Condition</label>
        <div className="rdrDateInput">
          <select
            id={this.props.id}
            value={condition}
            onChange={e => onConditionChange(e.target.value)}>
            {this.props.availableConditions.map(condition => (
              <option key={condition} value={condition}>
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {invalid && <span className="rdrWarning">&#9888;</span>}
      </div>
    );
  };
}

DateConditionInput.defaultProps = {
  availableConditions: ['between', 'on', 'before', 'after'],
};

DateConditionInput.propTypes = {
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  onFocus: PropTypes.func,
  condition: PropTypes.string,
  onConditionChange: PropTypes.func,
  availableConditions: PropTypes.array,
  className: PropTypes.string,
};

const formatDate = ({ value, dateDisplayFormat, dateOptions }) => {
  console.log('formatDate', value, isValid(value));
  if (value && isValid(value)) {
    return format(value, dateDisplayFormat, dateOptions);
  }
  return '';
};

const DateInput = ({
  className,
  readOnly,
  placeholder,
  ariaLabel,
  disabled,
  onFocus,
  label,
  id,
  value: initialValue,
  dateDisplayFormat,
  dateOptions,
  onChange,
}) => {
  const [value, setValue] = useState(
    formatDate({ value: initialValue, dateDisplayFormat, dateOptions })
  );
  const [invalid, setInvalid] = useState(false);
  const [changed, setChanged] = useState(false);

  const update = value => {
    if (invalid || !changed || !value) {
      return;
    }

    const parsed = parse(value, dateDisplayFormat, new Date(), dateOptions);

    console.log(invalid, changed, value, isValid(parsed));
    if (isValid(parsed)) {
      setChanged(false);
      onChange(parsed);
      console.log('onChange', parsed);
    } else {
      setInvalid(true);
    }
  };

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      update(value);
    }
  };

  const handleChange = e => {
    console.log('e.target.value', e.target.value);
    setValue(e.target.value);
    setChanged(true);
    setInvalid(false);
  };

  const onBlur = () => {
    update(value);
  };

  return (
    <div className={classnames('rdrDateInputContainer', className)}>
      <label htmlFor={id}>{label}</label>
      <div className="rdrDateInput">
        <div>
          <CalendarIcon />
        </div>
        <input
          id={id}
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <div>{invalid && <span className="rdrWarning">&#9888;</span>}</div>
      </div>
    </div>
  );
};

DateInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  dateOptions: PropTypes.object,
  dateDisplayFormat: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  onFocus: PropTypes.func, // was required
  onChange: PropTypes.func, // was required
};

DateInput.defaultProps = {
  label: 'Date',
  id: '',
  readOnly: true,
  disabled: false,
  dateDisplayFormat: 'MMM D, YYYY',
};

export default DateInput;
