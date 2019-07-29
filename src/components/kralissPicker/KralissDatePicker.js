import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  PickerIOS
} from "react-native";
import { Container, Header, Content, Item, Input, Icon } from "native-base";
import RF from "react-native-responsive-fontsize";
import {
  KeyboardAccessoryView,
  KeyboardUtils
} from "react-native-keyboard-input";
import Moment from "moment";
import "../customKeyboards/pickerKeyboard";
import "../customKeyboards/datePickerKeyboard";

export default class KralissDatePicker extends Component {
  state = {
    customKeyboard: undefined
  };
  onPressPicker = event => {
    //console.log(event.target);
    this.setState({ customKeyboard: "DatePickerKeyboardView" });
    this.valueTextInput.focus();
  };
  //

  onKeyboardResigned = () => {
    this.setState({ customKeyboard: undefined });
  };

  onKeyboardItemSelected = (keyboardId, params) => {
    if (params.value) {
      //done
      this.props.onSelect(params.value);
    } else {
    }
    this.valueTextInput.blur();
    KeyboardUtils.dismiss();
    this.setState({ customKeyboard: undefined });
  };

  render() {
    let _iconArrow = require("../../assets/images/icon_downarrow.png");
    if (this.state.customKeyboard !== undefined)
      _iconArrow = require("../../assets/images/icon_uparrow.png");
    const formattedDate = Moment(this.props.value).format("DD MMM YYYY");
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.onPressPicker()}
          >
            <View style={{ flex: 1 }} pointerEvents="none">
              <TextInput
                ref={ref => {
                  this.valueTextInput = ref;
                }}
                style={styles.textInput}
                editable={false}
                placeholderTextColor="#8fff"
                placeholder={this.props.placeHolder}
                value={formattedDate}
              />
            </View>
          </TouchableOpacity>
          <Image style={styles.iconArrow} source={_iconArrow} />
        </Item>
        <KeyboardAccessoryView
          renderContent={() => {
            return <View />;
          }}
          trackInteractive={false}
          kbInputRef={this.valueTextInput}
          kbComponent={this.state.customKeyboard}
          kbInitialProps={{
            cancelTitle: this.props.cancelBtnTitle,
            doneTitle: this.props.confirmBtnTitle,
            currentValue: this.props.value
          }}
          onItemSelected={this.onKeyboardItemSelected}
          onKeyboardResigned={this.onKeyboardResigned}
          revealKeyboardInteractive
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },

  item: {
    borderBottomColor: "#fff"
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#fff",
    fontSize: RF(2.3)
  },
  iconArrow: {
    marginLeft: 10,
    width: 20,
    height: 20
  }
});
