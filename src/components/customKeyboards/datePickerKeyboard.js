import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  DatePickerIOS
} from "react-native";
import { KeyboardRegistry } from "react-native-keyboard-input";

class DatePickerKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: new Date(props.currentValue)
    };
  }

  static propTypes = {
    doneTitle: PropTypes.string,
    cancelTitle: PropTypes.string
  };

  onPressDone = () => {
    //console.log("done");
    KeyboardRegistry.onItemSelected("DatePickerKeyboardView", {
      value: this.state.currentValue
    });
  };

  onPressCancel = () => {
    KeyboardRegistry.onItemSelected("DatePickerKeyboardView", {
      cancel: true
    });
  };

  setDate = newDate => {
    this.setState({ currentValue: newDate });
  };

  render() {
    return (
      <View
        contentContainerStyle={[
          styles.keyboardContainer,
          { backgroundColor: "white" }
        ]}
      >
        <View style={styles.accessBarContainer}>
          <TouchableOpacity onPress={() => this.onPressCancel()}>
            <Text style={styles.accessoryBtn}>{this.props.cancelTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onPressDone()}>
            <Text style={styles.accessoryBtn}>{this.props.doneTitle}</Text>
          </TouchableOpacity>
        </View>
        <DatePickerIOS
          date={this.state.currentValue}
          mode="date"
          onDateChange={this.setDate}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  accessBarContainer: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f7f7"
  },
  accessoryBtn: {
    color: "#0d80fe"
  },
  centerPickerView: {
    backgroundColor: "#c9ced4"
  }
});

KeyboardRegistry.registerKeyboard(
  "DatePickerKeyboardView",
  () => DatePickerKeyboard
);
