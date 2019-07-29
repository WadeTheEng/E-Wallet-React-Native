import React, { Component } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { Item } from "native-base";
import RF from "react-native-responsive-fontsize";

export default class KralissGreyInput extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          {this.props.secureText ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.props.onSecureChange(this.props.ID)}
            >
              <View style={{ flex: 1 }} pointerEvents="none">
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor="#cecece"
                  placeholder={this.props.placeHolder}
                  value={this.props.value}
                  secureTextEntry={this.props.secureText ? true : false}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.textInput}
              placeholderTextColor="#cecece"
              placeholder={this.props.placeHolder}
              value={this.props.value}
              keyboardType={this.props.keyboardType}
              onChangeText={text =>
                this.props.onChangeText(this.props.ID, text)
              }
              editable={this.props.editible}
              autoCorrect={this.props.autoCorrect ? false : true}
              autoCapitalize={this.props.autoCapitalize ? "none" : "sentences"}
            />
          )}
        </Item>
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
    borderBottomColor: "#cecece"
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#484848",
    fontSize: RF(2.0)
  }
});

KralissGreyInput.defaultProps = {
  editible: true,
  ID: "0"
};
