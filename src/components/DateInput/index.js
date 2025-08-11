// @ts-check
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format, parse, isValid, isEqual, isBefore, isAfter } from 'date-fns';
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

class DateInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      invalid: false,
      error: '',
      changed: false,
      value: this.formatDate(props),
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = prevProps;

    if (!isEqual(value, this.props.value)) {
      const { isValid, error } = this.checkValidity(this.props.value);
      this.setState({
        value: this.formatDate(this.props),
        invalid: !isValid,
        error,
        changed: false,
      });
    }
  }

  formatDate({ value, dateDisplayFormat, dateOptions }) {
    if (value && isValid(value)) {
      return format(value, dateDisplayFormat, dateOptions);
    }
    return '';
  }

  parse(value) {
    const { dateDisplayFormat, dateOptions } = this.props;
    return parse(value, dateDisplayFormat, new Date(), dateOptions);
  }

  checkValidity(value) {
    const { minDate, maxDate, label, dateDisplayFormat, dateOptions } = this.props;
    const parsed = typeof value === 'string' ? this.parse(value) : value;
    if (!isValid(parsed)) {
      return { isValid: false, error: 'Please enter a valid date' };
    }
    if (minDate && !isAfter(parsed, minDate)) {
      return {
        isValid: false,
        error: `${label} should be after ${format(minDate, dateDisplayFormat, dateOptions)}`,
      };
    }
    if (maxDate && !isBefore(parsed, maxDate)) {
      return {
        isValid: false,
        error: `${label} should be before ${format(maxDate, dateDisplayFormat, dateOptions)}`,
      };
    }
    return { isValid: true };
  }

  update(value) {
    const { invalid, changed } = this.state;

    if (invalid || !changed || !value) {
      return;
    }

    const { onChange } = this.props;
    const parsed = this.parse(value);
    const { isValid, error } = this.checkValidity(value);
    if (isValid) {
      this.setState({ changed: false }, () => onChange(parsed));
    } else {
      this.setState({ invalid: true, error }, () => onChange(parsed, !invalid, error));
    }
  }

  onKeyDown = e => {
    const { value } = this.state;

    if (e.key === 'Enter') {
      this.update(value);
    }
  };

  onChange = e => {
    this.setState({ value: e.target.value, changed: true, invalid: false });
  };

  onBlur = () => {
    const { value } = this.state;
    this.update(value);
  };

  render() {
    const {
      className,
      readOnly,
      placeholder,
      ariaLabel,
      disabled,
      onFocus,
      label,
      id,
    } = this.props;
    const { value, invalid, error } = this.state;

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
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={onFocus}
          />
        </div>
        {invalid && <div className="rdrError">{error || 'Please enter a valid date'}</div>}
      </div>
    );
  }
}

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
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

DateInput.defaultProps = {
  label: 'Date',
  id: '',
  readOnly: true,
  disabled: false,
  dateDisplayFormat: 'MMM D, YYYY',
};

export default DateInput;
