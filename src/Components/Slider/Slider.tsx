import React, { Component } from "react";
import { Slider } from "@boomerang-io/carbon-addons-boomerang-react";
import omit from "lodash/omit";
import "./styles.scss";

export const valueTypes = {
  percentage: "%",
};

type Props = {
  id: string;
  min: number;
  max: number;
  inputType: string;
  sliderRef: any;
  sliderValue: number;
  onChange: (value: number) => void;
  "data-testid": string;
  labelText?: string;
  helperText?: string;
};

type State = any;

class BasicSlider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: this.props.sliderValue ?? 0,
    };
  }

  propsHandler = () => {
    const newProps = {
      ...this.props,
      ref: this.props.sliderRef,
      // Bypass Slider 'number' validation for the input. This way the console warning will not be thrown.
      value: parseInt(this.state.value),
      onChange: (e: { value: number }) => {
        const validatedValue = this.validateValue(e.value);
        this.setSliderValueAndPosition(validatedValue);
        this.props.onChange(validatedValue);
      },
    };

    // Remove custom props for Slider
    return omit({ ...newProps }, ["sliderRef", "sliderValue", "sliderType"]);
  };

  validateValue = (value: any) => {
    const { max = 100 } = this.props;
    // Remove invalid characters
    value = value.toString().replace(/[^0-9]+/g, "");
    // Value cannot be higher than max
    if (value > max) {
      return max;
    }

    // Force valid integer
    return parseInt(value, 10) || 0;
  };

  setSliderValueAndPosition = (value: any) => {
    this.setState({ value: value }, () => {
      // Update the Slider ref object with the current value, otherwise it will not be displayed properly
      this.props.sliderRef.current.state.left =
        (parseInt(this.state.value, 10) * 100) / this.props.sliderRef.current.props.max;
      this.props.sliderRef.current.state.value = this.state.value;
    });
  };

  render() {
    return (
      <div className="c-slider__wrapper">
        <Slider {...this.propsHandler()} />
        {this.props.helperText && <p className="c-slider__helper-text">{this.props.helperText}</p>}
        <div className="c-slider__input-divider" />
      </div>
    );
  }
}

export default BasicSlider;
