import { TouchableOpacity, StyleSheet, View, Text, Image } from "react-native";
import React, { Component } from "react";
import RF from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import GradientView from "../../../components/gradientView/GradientView";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";

//Add i18n
import i18n from "../../../locale/i18n";

export default class ResetPasswdView extends Component {
  state = {
    txtEmail: "co**ct@gmail.com",
    txtSecurity: "",
    txtConfSecurity: "",
    curSelSecurityID: "",
    showPwdkey: false,
    uid: "",
    token: ""
  };

  componentDidMount() {
    const param = this.props.navigation.state;
    //console.log();
    this.setState({ txtEmail: param.params.email });
    this.setState({ uid: param.params.id });
    this.setState({ token: param.params.token });
  }

  onSecureChange = ID => {
    this.setState({ curSelSecurityID: ID });
    this.setState({ showPwdkey: true });
  };

  onDeleteSecurity = ID => {
    if (ID === "1") this.setState({ txtSecurity: "" });
    else this.setState({ txtConfSecurity: "" });
    this.setState({ showPwdkey: false });
  };

  onPressPwdKey = key => {
    const { curSelSecurityID } = this.state;
    if (curSelSecurityID === "1")
      this.setState({ txtSecurity: this.state.txtSecurity + key });
    else this.setState({ txtConfSecurity: this.state.txtConfSecurity + key });
  };

  onPressSend = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "RenewPasswd"
    });
    this.props.navigation.dispatch(navigateAction);
  };
  onPressSignup = () => {
    console.log("click");
  };

  render() {
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/symbol_kraliss.png")}
          />
        </View>

        <View style={styles.center}>
          <KralissInput
            icon={require("../../../assets/images/mail.png")}
            placeHolder={i18n.t("resetPassword.placeholderEmail")}
            value={this.state.txtEmail}
            editible={false}
            keyboardType={"email-address"}
            autoCapitalize
          />
          <KralissInput
            ID="1"
            icon={require("../../../assets/images/lock.png")}
            placeHolder={i18n.t("resetPassword.new")}
            value={this.state.txtSecurity}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={true}
            secureText="true"
            onSecureChange={this.onSecureChange}
          />
          <KralissInput
            ID="2"
            icon={require("../../../assets/images/lock.png")}
            placeHolder={i18n.t("resetPassword.confirmNew")}
            value={this.state.txtConfSecurity}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={true}
            secureText="true"
            onSecureChange={this.onSecureChange}
          />
        </View>

        <View style={styles.footer}>
          {this.state.showPwdkey && (
            <KralissPwdKey
              style={styles.pwdKeyPad}
              onPressKey={this.onPressPwdKey}
            />
          )}

          <KralissButton
            style={styles.loginBtn}
            onPress={this.onPressSend}
            title="Valider"
            enabled={true}
          />

          {!this.state.showPwdkey && (
            <View style={styles.footerSignupSection}>
              <Text style={styles.signupText}>
                {i18n.t("resetPassword.noAccount")}
              </Text>
              <TouchableOpacity
                style={styles.textBtn}
                onPress={this.onPressSignup}
              >
                <Text style={styles.signupBtnText}>
                  {i18n.t("resetPassword.register")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  center: {
    flex: 1,
    justifyContent: "center"
  },
  forgotPwdBtn: {
    marginLeft: 10,
    marginRight: 0,
    color: "#fff",
    fontSize: RF(2),
    textAlign: "right"
  },
  pwdKeyPad: {
    height: "60%",
    width: "100%"
  },
  footer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  footerSignupSection: {
    height: 60,
    marginBottom: 20
  },
  loginBtn: {
    width: "100%",
    height: 55,
    marginBottom: 10
  },
  signupText: {
    color: "#fff",
    fontSize: RF(2),
    textAlign: "center"
  },
  signupBtnText: {
    color: "#fff",
    fontSize: RF(2),
    textAlign: "center",
    textDecorationLine: "underline"
  },
  textBtn: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 10
  }
});
