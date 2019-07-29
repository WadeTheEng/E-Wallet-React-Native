import { StyleSheet, View, Text, Image } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import GradientView from "../../components/gradientView/GradientView";
import KralissButton from "../../components/kralissButton/KralissButton";

//Add i18n
import i18n from "../../locale/i18n";

export default class ConfirmSuccessView extends Component {
  onPressTerminal = () => {
    const params = this.props.navigation.state.params;
    //this.props.navigation.goBack();
    const navigateAction = NavigationActions.navigate({
      routeName: params.route
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    const params = this.props.navigation.state.params;
    console.log(params);
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{params.title}</Text>
          <Image
            style={{ marginTop: 30, marginBottom: 30 }}
            source={require("../../assets/images/check_circle_solid.png")}
          />
          <Text style={styles.headerText}>{params.descMessage}</Text>
        </View>
        <View style={styles.footer}>
          <KralissButton
            style={styles.sendBtn}
            onPress={this.onPressTerminal}
            title={i18n.t("confirmResetPassword.done")}
            enabled={true}
          />
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 80
  },
  headerText: {
    color: "#fff",
    textAlign: "center"
  },
  footer: {
    flex: 0.5,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginBottom: 25
  }
});
