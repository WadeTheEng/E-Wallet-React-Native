import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  PickerIOS
} from "react-native";
import { KeyboardRegistry } from "react-native-keyboard-input";

class PickerKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: this.props.currentValue,
      currentIndex: 0
    };
    //console.log("Picker" + this.props.pickerData);
  }

  static propTypes = {
    doneTitle: PropTypes.string,
    cancelTitle: PropTypes.string
  };

  onPressDone = () => {
    let _curValue = this.state.currentValue;
    if (this.state.currentValue === "") {
      _curValue = this.props.pickerData[this.state.currentIndex];
    }

    KeyboardRegistry.onItemSelected("PickerKeyboardView", {
      value: _curValue,
      index: this.state.currentIndex
    });
  };

  onPressCancel = () => {
    KeyboardRegistry.onItemSelected("PickerKeyboardView", {
      cancel: true
    });
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
        <PickerIOS
          style={styles.centerPickerView}
          selectedValue={this.state.currentValue}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ currentValue: itemValue, currentIndex: itemIndex })
          }
        >
          {this.props.pickerData.map(value => (
            <PickerIOS.Item key={value} label={value} value={value} />
          ))}
        </PickerIOS>
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
    backgroundColor: "#fff"
  },
  accessoryBtn: {
    color: "#0d80fe"
  },
  centerPickerView: {
    backgroundColor: "#c9ced4"
  }
});

KeyboardRegistry.registerKeyboard("PickerKeyboardView", () => PickerKeyboard);
