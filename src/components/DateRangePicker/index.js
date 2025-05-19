// @ts-check
import React, { Component } from 'react';
import { startOfDay, isEqual } from 'date-fns';
import PropTypes from 'prop-types';
import DateRange from '../DateRange';
import DefinedRange from '../DefinedRange';
import { findNextRangeIndex, generateStyles } from '../../utils';
import classnames from 'classnames';
import coreStyles from '../../styles';
import DateInputGroup from '../DateInputGroup';

class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedRange: [findNextRangeIndex(props.ranges), 0],
      condition: this.props.condition,
    };
    this.styles = generateStyles([coreStyles, props.classNames]);
  }

  render() {
    const { title, showPresets } = this.props;
    const { focusedRange } = this.state;
    return (
      <div>
        <div className={this.styles.titleAndInputWrapper}>
          {title && <span className={this.styles.title}>{title}</span>}
          <DateInputGroup
            {...this.props}
            // onDragSelectionEnd={this.onDragSelectionEnd}
            // handleRangeFocusChange={this.handleRangeFocu sChange}
            condition={this.state.condition}
            onConditionChange={condition => {
              this.setState({ condition });
            }}
          />
        </div>
        <div className={classnames(this.styles.dateRangePickerWrapper, this.props.className)}>
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
                this.setState({
                  condition: isEqual(
                    startOfDay(value.selection.startDate),
                    startOfDay(value.selection.endDate)
                  )
                    ? 'on'
                    : 'between',
                });
                this.props.onChange(value);
              }}
              range={this.props.ranges[focusedRange[0]]}
              className={undefined}
            />
          )}
          <DateRange
            onRangeFocusChange={focusedRange => this.setState({ focusedRange })}
            focusedRange={focusedRange}
            displayMode={this.state.condition === 'between' ? 'dateRange' : 'date'}
            {...this.props}
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
};

DateRangePicker.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  showPresets: PropTypes.bool,
  ...DateRange.propTypes,
  ...DefinedRange.propTypes,
  className: PropTypes.string,
};

export default DateRangePicker;
