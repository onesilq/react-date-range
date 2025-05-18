import React, { PureComponent } from 'react';
import DateInput, { DateConditionInput } from '../DateInput';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import coreStyles from '../../styles';
import { generateStyles } from '../../utils';
import { rangeShape } from '../DayCell';
import { ariaLabelsShape } from '../../accessibility';
import { enUS as defaultLocale } from 'date-fns/locale/en-US';

class DateInputGroup extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.styles = generateStyles([coreStyles, props.classNames]);
    this.dateOptions = { locale: props.locale };
  }

  renderDateInputsBasedOnCondition = (range, i) => {
    const styles = this.styles;
    const {
      focusedRange,
      dateDisplayFormat,
      editableDateInputs,
      startDatePlaceholder,
      endDatePlaceholder,
      ariaLabels,
      condition,
    } = this.props;

    const label = condition === 'on' ? 'Date' : condition === 'before' ? 'End Date' : 'Start Date';

    switch (condition) {
      case 'between':
        return (
          <>
            <DateInput
              label="Start Date"
              id={`${range.key}-start-date`}
              className={classnames(styles.dateDisplayItem, {
                [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 0,
              })}
              readOnly={!editableDateInputs}
              disabled={range.disabled}
              value={range.startDate}
              placeholder={startDatePlaceholder}
              dateOptions={this.dateOptions}
              dateDisplayFormat={dateDisplayFormat}
              ariaLabel={
                ariaLabels.dateInput &&
                ariaLabels.dateInput[range.key] &&
                ariaLabels.dateInput[range.key].startDate
              }
              onChange={this.props.onDragSelectionEnd}
              onFocus={() => this.props.handleRangeFocusChange(i, 0)}
            />
            <DateInput
              label="End Date"
              id={`${range.key}-end-date`}
              className={classnames(styles.dateDisplayItem, {
                [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 1,
              })}
              readOnly={!editableDateInputs}
              disabled={range.disabled}
              value={range.endDate}
              placeholder={endDatePlaceholder}
              dateOptions={this.dateOptions}
              dateDisplayFormat={dateDisplayFormat}
              ariaLabel={
                ariaLabels.dateInput &&
                ariaLabels.dateInput[range.key] &&
                ariaLabels.dateInput[range.key].endDate
              }
              onChange={this.props.onDragSelectionEnd}
              onFocus={() => this.props.handleRangeFocusChange(i, 1)}
            />
          </>
        );
      case 'before':
      case 'after':
      case 'on':
        return (
          <DateInput
            label={label}
            id={`${range.key}-date`}
            className={classnames(styles.dateDisplayItem, {
              [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 0,
            })}
            readOnly={!editableDateInputs}
            disabled={range.disabled}
            value={range.startDate}
            placeholder={startDatePlaceholder}
            dateOptions={this.dateOptions}
            dateDisplayFormat={dateDisplayFormat}
            ariaLabel={
              ariaLabels.dateInput &&
              ariaLabels.dateInput[range.key] &&
              ariaLabels.dateInput[range.key].startDate
            }
            onChange={this.props.onDragSelectionEnd}
            onFocus={() => this.props.handleRangeFocusChange(i, 0)}
          />
        );
    }
  };

  render = () => {
    const { focusedRange, color, ranges, rangeColors, condition, onConditionChange } = this.props;

    const defaultColor = rangeColors[focusedRange[0]] || color;
    const styles = this.styles;

    return ranges.map((range, i) => {
      if (range.showDateDisplay === false || (range.disabled && !range.showDateDisplay))
        return null;
      return (
        <div
          className={styles.dateDisplayWrapper}
          key={i}
          style={{ color: range.color || defaultColor }}>
          <DateConditionInput
            condition={condition}
            onConditionChange={onConditionChange}
            id={`${range.key}-condition`}
          />
          {this.renderDateInputsBasedOnCondition(range, i)}
        </div>
      );
    });
  };
}

DateInputGroup.defaultProps = {
  focusedRange: [0, 0],
  locale: defaultLocale,
  color: '#334bfa',
  ranges: [],
  rangeColors: ['#334bfa', '#3ecf8e', '#fed14c'],
  ariaLabels: {},
  dateDisplayFormat: 'MM/d/yyyy',
  editableDateInputs: false,
  startDatePlaceholder: 'Early',
  endDatePlaceholder: 'Continuous',
};

DateInputGroup.propTypes = {
  classNames: PropTypes.object,
  locale: PropTypes.object,
  focusedRange: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string,
  ranges: PropTypes.arrayOf(rangeShape),
  rangeColors: PropTypes.arrayOf(PropTypes.string),
  dateDisplayFormat: PropTypes.string,
  editableDateInputs: PropTypes.bool,
  startDatePlaceholder: PropTypes.string,
  endDatePlaceholder: PropTypes.string,
  ariaLabels: ariaLabelsShape,
  onDragSelectionEnd: PropTypes.func,
  handleRangeFocusChange: PropTypes.func,
  condition: PropTypes.string,
  onConditionChange: PropTypes.func,
};

export default DateInputGroup;
