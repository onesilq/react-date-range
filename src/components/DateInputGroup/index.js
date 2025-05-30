// @ts-check
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
  constructor(props) {
    super(props);
    this.styles = generateStyles([coreStyles, props.classNames]);
    this.dateOptions = { locale: props.locale };
  }

  handleRangeFocusChange = (rangesIndex, rangeItemIndex) => {
    this.props.onRangeFocusChange && this.props.onRangeFocusChange([rangesIndex, rangeItemIndex]);
  };

  renderDateInputsBasedOnCondition = (range, i) => {
    const styles = this.styles;
    const {
      focusedRange,
      dateDisplayFormat,
      editableDateInputs,
      ariaLabels,
      condition,
      inputLabels,
      inputPlaceholders,
    } = this.props;

    switch (condition) {
      case 'between':
        return (
          <div className={styles.betweenDateInputsWrapper}>
            <DateInput
              label={inputLabels.between.startDate}
              id={`${range.key}-start-date`}
              className={classnames(styles.dateDisplayItem, {
                [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 0,
              })}
              readOnly={!editableDateInputs}
              disabled={range.disabled}
              value={range.startDate}
              placeholder={inputPlaceholders.between.startDate}
              dateOptions={this.dateOptions}
              dateDisplayFormat={dateDisplayFormat}
              ariaLabel={
                ariaLabels.dateInput &&
                ariaLabels.dateInput[range.key] &&
                ariaLabels.dateInput[range.key].startDate
              }
              onChange={this.props.onDragSelectionEnd}
              onFocus={() => this.handleRangeFocusChange(i, 0)}
            />
            <DateInput
              label={inputLabels.between.endDate}
              id={`${range.key}-end-date`}
              className={classnames(styles.dateDisplayItem, {
                [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 1,
              })}
              readOnly={!editableDateInputs}
              disabled={range.disabled}
              value={range.endDate}
              placeholder={inputPlaceholders.between.endDate}
              dateOptions={this.dateOptions}
              dateDisplayFormat={dateDisplayFormat}
              ariaLabel={
                ariaLabels.dateInput &&
                ariaLabels.dateInput[range.key] &&
                ariaLabels.dateInput[range.key].endDate
              }
              onChange={this.props.onDragSelectionEnd}
              onFocus={() => this.handleRangeFocusChange(i, 1)}
            />
          </div>
        );
      case 'before':
      case 'after':
      case 'on':
        return (
          <DateInput
            label={inputLabels[condition]}
            id={`${range.key}-date`}
            className={classnames(styles.dateDisplayItem, {
              [styles.dateDisplayItemActive]: focusedRange[0] === i && focusedRange[1] === 0,
            })}
            readOnly={!editableDateInputs}
            disabled={range.disabled}
            value={range.startDate}
            placeholder={inputPlaceholders[condition]}
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
            className={classnames(styles.dateDisplayItem)}
            condition={condition}
            onConditionChange={onConditionChange}
            availableConditions={this.props.availableConditions}
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
  startDatePlaceholder: 'Start Date',
  endDatePlaceholder: 'End Date',
};

export const ExposedDateInputProps = {
  condition: PropTypes.string,
  availableConditions: PropTypes.array,
  inputLabels: PropTypes.shape({
    between: PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    on: PropTypes.string,
    before: PropTypes.string,
    after: PropTypes.string,
  }),
  inputPlaceholders: PropTypes.shape({
    between: PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    on: PropTypes.string,
    before: PropTypes.string,
    after: PropTypes.string,
  }),
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
  ariaLabels: ariaLabelsShape,
  onDragSelectionEnd: PropTypes.func,
  handleRangeFocusChange: PropTypes.func,
  onConditionChange: PropTypes.func,
  ...ExposedDateInputProps,
};

export default DateInputGroup;
