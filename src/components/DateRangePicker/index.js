// @ts-check
import React, { Component } from 'react';
import { startOfDay, isEqual } from 'date-fns';
import PropTypes from 'prop-types';
import DateRange from '../DateRange';
import DefinedRange from '../DefinedRange';
import { findNextRangeIndex, generateStyles } from '../../utils';
import classnames from 'classnames';
import coreStyles from '../../styles';
import DateInputGroup, { ExposedDateInputProps } from '../DateInputGroup';

class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedRange: [findNextRangeIndex(props.ranges), 0],
      condition: this.props.condition,
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }

  onChange = value => {
    Object.keys(value).forEach(key => {
      value[key].condition = this.state.condition;
    });
    this.props.onChange(value);
  };

  render() {
    const { title, showPresets } = this.props;
    const { focusedRange } = this.state;
    const stackDateInputs = this.props.months === 1 && !showPresets;
    return (
      <div className={this.styles.dateRangePickerWrapper}>
        <div className={this.styles.titleAndInputWrapper}>
          {title && <span className={this.styles.title}>{title}</span>}
          <DateInputGroup
            {...this.props}
            onChange={this.onChange}
            // onDragSelectionEnd={this.onDragSelectionEnd}
            // handleRangeFocusChange={this.handleRangeFocu sChange}
            condition={this.state.condition}
            onConditionChange={condition => {
              this.setState({ condition });
            }}
            availableConditions={this.props.availableConditions}
            classNames={
              stackDateInputs
                ? {
                    dateDisplayWrapper: classnames(this.styles.dateDisplayWrapper, 'flex-col'),
                  }
                : {}
            }
          />
        </div>
        <div className={classnames(this.styles.definedAndDateRangeWrapper, this.props.className)}>
          {showPresets && (
            <DefinedRange
              focusedRange={focusedRange}
              onPreviewChange={value =>
                this.dateRange?.updatePreview(
                  value ? this.dateRange?.calcNewSelection(value, typeof value === 'string') : null
                )
              }
              {...this.props}
              onChange={value => {
                const key = this.props.ranges[0].key;
                this.setState(
                  {
                    condition: isEqual(
                      startOfDay(value[key].startDate),
                      startOfDay(value[key].endDate)
                    )
                      ? 'on'
                      : 'between',
                  },
                  () => {
                    this.onChange(value);
                  }
                );
              }}
              range={this.props.ranges[focusedRange[0]]}
              className={undefined}
            />
          )}
          <DateRange
            onRangeFocusChange={focusedRange => this.setState({ focusedRange })}
            focusedRange={focusedRange}
            displayMode={this.state.condition === 'between' ? 'dateRange' : 'date'}
            date={
              this.props.date ||
              (this.state.condition !== 'between'
                ? this.props.ranges[focusedRange[0]].startDate
                : null)
            }
            {...this.props}
            onChange={this.onChange}
            ref={t => {
              this.dateRange = t;
            }}
            className={undefined}
          />
        </div>
      </div>
    );
  }
}

DateRangePicker.defaultProps = {
  showDateDisplay: true,
  condition: 'between',
  showPresets: true,
  inputLabels: {
    between: {
      startDate: 'Start Date',
      endDate: 'End Date',
    },
    on: 'Date',
    before: 'End Date',
    after: 'Start Date',
  },
  inputPlaceholders: {
    between: {
      startDate: 'Start Date',
      endDate: 'End Date',
    },
    on: 'Date',
    before: 'End Date',
    after: 'Start Date',
  },
};

DateRangePicker.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  showPresets: PropTypes.bool,
  ...ExposedDateInputProps,
  ...DateRange.propTypes,
  ...DefinedRange.propTypes,
  className: PropTypes.string,
};

export default DateRangePicker;
