import React, { Component } from "react";
import { Text, Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import RF from "react-native-responsive-fontsize";
import i18n from "../../locale/i18n";

export default class WhiteNavHeader extends Component {
  render() {
    let bShowCloseOrBack = false;
    let imgSrc;
    if (this.props.onBack) {
      bShowCloseOrBack = true;
      imgSrc = require("../../assets/images/gray_chevron.png");
    }
    if (this.props.onClose) {
      bShowCloseOrBack = true;
      imgSrc = require("../../assets/images/Close.png");
    }

    return (
      <View style={styles.container}>
        <View style={styles.navigationBar}>
          {bShowCloseOrBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() =>
                this.props.onBack ? this.props.onBack() : this.props.onClose()
              }
            >
              <Image source={imgSrc} />
            </TouchableOpacity>
          )}
          <Text style={styles.txtTitle}>{this.props.title}</Text>
          {this.props.onCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={this.props.onCancel}
            >
              <Text style={styles.txtCancel}>
                {i18n.t("beneficiary.cancel")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50 + getStatusBarHeight(),
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",

    borderBottomWidth: 0.5,
    borderColor: "#6666",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.05
  },
  navigationBar: {
    width: "100%",
    height: 50,
    marginTop: getStatusBarHeight(),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  backBtn: {
    position: "absolute",
    left: 20
  },
  cancelBtn: {
    position: "absolute",
    right: 20
  },
  txtTitle: {
    color: "#707070",
    fontSize: RF(2.5)
  },
  txtCancel: {
    color: "#00aca9",
    fontSize: RF(2.4),
    textDecorationLine: "underline"
  }
});
