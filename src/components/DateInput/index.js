import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format, parse, isValid, isEqual } from 'date-fns';
import CalendarIcon from '../../icons/Calendar';

export class DateConditionInput extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      invalid: false,
      changed: false,
    };
  }

  render = () => {
    const { invalid } = this.state;
    const { condition, onConditionChange } = this.props;

    return (
      <div className={classnames('rdrDateInputContainer', 'condition')}>
        <label htmlFor={this.props.id}>Condition</label>
        <div className="rdrDateInput">
          <select
            id={this.props.id}
            value={condition}
            onChange={e => onConditionChange(e.target.value)}>
            <option value="between">Between</option>
            <option value="on">On</option>
            <option value="before">Before</option>
            <option value="after">After</option>
          </select>
        </div>
        {invalid && <span className="rdrWarning">&#9888;</span>}
      </div>
    );
  };
}

DateConditionInput.propTypes = {
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  onFocus: PropTypes.func,
  condition: PropTypes.string,
  onConditionChange: PropTypes.func,
};

class DateInput extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      invalid: false,
      changed: false,
      value: this.formatDate(props),
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = prevProps;

    if (!isEqual(value, this.props.value)) {
      this.setState({ value: this.formatDate(this.props) });
    }
  }

  formatDate({ value, dateDisplayFormat, dateOptions }) {
    if (value && isValid(value)) {
      return format(value, dateDisplayFormat, dateOptions);
    }
    return '';
  }

  update(value) {
    const { invalid, changed } = this.state;

    if (invalid || !changed || !value) {
      return;
    }

    const { onChange, dateDisplayFormat, dateOptions } = this.props;
    const parsed = parse(value, dateDisplayFormat, new Date(), dateOptions);

    if (isValid(parsed)) {
      this.setState({ changed: false }, () => onChange(parsed));
    } else {
      this.setState({ invalid: true });
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
      // disabled,
      onFocus,
      label,
      id,
    } = this.props;
    const { value, invalid } = this.state;

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
            disabled={true}
            value={value}
            placeholder={placeholder}
            aria-label={ariaLabel}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={onFocus}
          />
        </div>
        {invalid && <span className="rdrWarning">&#9888;</span>}
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
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

DateInput.defaultProps = {
  label: 'Date',
  id: '',
  readOnly: true,
  disabled: false,
  dateDisplayFormat: 'MMM D, YYYY',
};

export default DateInput;
