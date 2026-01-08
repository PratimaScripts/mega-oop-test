import NumberFormat from "react-number-format";
import React from "react";

class MyNumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };
  }
  render() {
    return (
      <NumberFormat
        autoComplete={"none"}
        allowNegative={false}
        placeholder="Number Format Input looses focus"
        isNumericString={true}
        thousandSeparator={true}
        value={this.state.value}
        onValueChange={vals => this.setState({ value: vals.formattedValue })}
        {...this.props}
      />
    );
  }
}

export default MyNumberInput;
