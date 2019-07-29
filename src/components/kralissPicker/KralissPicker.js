import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { Container, Header, Content, Item, Input, Icon } from "native-base";
import RF from "react-native-responsive-fontsize";
import {
  KeyboardAccessoryView,
  KeyboardUtils
} from "react-native-keyboard-input";
import "../customKeyboards/pickerKeyboard";

export default class KralissPicker extends Component {
  state = {
    customKeyboard: undefined
  };
  onPressPicker = event => {
    //console.log(event.target);
    this.setState({ customKeyboard: "PickerKeyboardView" });
    this.valueTextInput.focus();
  };
  //

  onKeyboardResigned = () => {
    this.valueTextInput.blur();
    this.setState({ customKeyboard: undefined });
  };

  onKeyboardItemSelected = (keyboardId, params) => {
    if (params.value) {
      //done
      this.props.onSelect(params.value, params.index);
    } else {
    }
    KeyboardUtils.dismiss();
    this.valueTextInput.blur();
    this.setState({ customKeyboard: undefined });
  };

  render() {
    let _iconArrow = require("../../assets/images/icon_downarrow.png");
    if (this.state.customKeyboard !== undefined)
      _iconArrow = require("../../assets/images/icon_uparrow.png");
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          {this.props.prefixString && (
            <Text style={styles.textPrefix}>{this.props.prefixString}</Text>
          )}
          <TouchableOpacity
            style={{ flex: 1, height: 40 }}
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
                value={this.props.value}
              />
            </View>
          </TouchableOpacity>
          {!this.props.prefixString && (
            <Image style={styles.iconArrow} source={_iconArrow} />
          )}
        </Item>
        <KeyboardAccessoryView
          trackInteractive={false}
          kbInputRef={this.valueTextInput}
          kbComponent={this.state.customKeyboard}
          kbInitialProps={{
            cancelTitle: this.props.cancelBtnTitle,
            doneTitle: this.props.confirmBtnTitle,
            currentValue: this.props.value,
            pickerData: this.props.pickerData
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
  textPrefix: {
    height: 20,
    marginRight: 5,
    alignContent: "center",
    color: "#fff",
    fontSize: RF(2.3)
  },
  iconArrow: {
    marginLeft: 10,
    width: 20,
    height: 20
  }
});
