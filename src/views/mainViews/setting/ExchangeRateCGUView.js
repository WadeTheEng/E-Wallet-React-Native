import React, { Component } from "react";
import { StyleSheet, Linking, Text, View } from "react-native";
import RF from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";
import KralissRectButton from "../../../components/kralissButton/KralissRectButton";

export default class ExchangeRateCGUView extends Component {
  state = {
    url: "http://www.google.com"
  };

  onPressShowWebSite = () => {
    Linking.canOpenURL(this.state.url).then(supported => {
      if (supported) {
        Linking.openURL(this.state.url);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <WhiteNavHeader
          title={i18n.t("settings.exchgrate")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Text style={styles.skipDescText}>
            {i18n.t("exchgRateCGU.description")}
          </Text>
        </View>

        <KralissRectButton
          style={styles.buttonContainer}
          enabled={true}
          onPress={this.onPressShowWebSite}
          title={i18n.t("exchgRateCGU.seeWebSite")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff"
  },
  marginCell: {
    marginTop: 12
  },
  marginSection: {
    marginTop: 20
  },
  skipDescText: {
    marginTop: 20,
    color: "#484848",
    fontSize: RF(2.0)
  },

  buttonContainer: {
    height: 60,
    width: "100%",
    position: "absolute",
    bottom: 0
  }
});
