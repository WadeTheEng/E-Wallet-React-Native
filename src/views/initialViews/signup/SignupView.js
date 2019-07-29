import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  View,
  Keyboard,
  Text,
  Image
} from "react-native";
import { connect } from "react-redux";
import React, { Component } from "react";
import RF from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import Joi from "react-native-joi";
import GradientView from "../../../components/gradientView/GradientView";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissCheckBox from "../../../components/kralissCheckBox/KralissCheckBox";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import Loader from "../../../components/loader/Loader";
import { reqSignup, reqInitSignup } from "../../../reducers/signup";
import i18n from "../../../locale/i18n";
import { saveLocalData } from "../../../utils/localStorage";

class SignupView extends Component {
  state = {
    txtEmail: "",
    txtConfEmail: "",
    txtSecurity: "",
    txtConfSecurity: "",
    curSelSecurityID: "",
    bMailConfirmed: false,
    bRememberMe: false,
    showPwdkey: false
  };

  schema = Joi.object().keys({
    password: Joi.string().min(4),
    email: Joi.string().email()
  });

  onChangeEmail = (ID, txtEmail) => {
    this.setState({ txtEmail });
    this.setState({ showPwdkey: false });
  };

  onChangeConfEmail = (ID, txtConfEmail) => {
    this.setState({ txtConfEmail });
    this.setState({ showPwdkey: false });
  };

  emailConfirming = () => {
    if (this.state.txtConfEmail === this.state.txtEmail) {
      const result = Joi.validate({ email: this.state.txtEmail }, this.schema);
      console.log(result);
      console.log(this.state.txtEmail);
      if (result.error === null) this.setState({ bMailConfirmed: true });
      else this.setState({ bMailConfirmed: false });
    } else {
      this.setState({ bMailConfirmed: false });
    }
  };

  onChangeSecure = ID => {
    this.setState({ curSelSecurityID: ID });
    this.setState({ showPwdkey: true });
    Keyboard.dismiss();
  };

  onDeleteSecurity = ID => {
    if (ID === "1") this.setState({ txtSecurity: "" });
    else this.setState({ txtConfSecurity: "" });
    this.setState({ showPwdkey: false });
  };

  onCheckChanged = () => {
    this.setState({ bRememberMe: !this.state.bRememberMe });
  };
  onPressForgotPassword = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "ForgotPasswd"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  onPressPwdKey = key => {
    const { curSelSecurityID } = this.state;
    if (curSelSecurityID === "1")
      this.setState({ txtSecurity: this.state.txtSecurity + key });
    else this.setState({ txtConfSecurity: this.state.txtConfSecurity + key });
  };

  validateCallBack = (err, value) => {
    if (this.state.bRememberMe === true) {
      saveLocalData("rememberMeBtn", true);
      saveLocalData("rememberMeContent", this.state.txtEmail);
    } else {
      saveLocalData("rememberMeBtn", false);
    }
    if (err === null) {
      this.props.reqSignup({
        email: this.state.txtEmail,
        username: this.state.txtEmail,
        password: this.state.txtSecurity
      });
    } else {
      this.props.navigation.navigate("ErrorView", {
        errorText: err.details[0].message
      });
    }
  };

  onPressSignup = () => {
    this.emailConfirming();
    Joi.validate(
      {
        email: this.state.txtEmail,
        password: this.state.txtSecurity
      },
      this.schema,
      this.validateCallBack
    );
  };

  onPressOpenTermsAndService = () => {};

  showCheckEmailAlert = () => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("signup.confirm"),
        i18n.t("signup.emailSentMessage"),
        [
          {
            text: i18n.t("confirmResetPassword.done"),
            onPress: () => {
              this.props.reqInitSignup();
              const navigateAction = NavigationActions.navigate({
                routeName: "Login"
              });
              this.props.navigation.dispatch(navigateAction);
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };
  componentDidMount() {}

  componentDidUpdate = (prevProps, prevState) => {
    const { id } = this.props;
    if (id !== undefined && id !== "") {
      //
      this.showCheckEmailAlert();
    }

    if (this.props.error !== null && this.props.error !== "") {
      this.props.navigation.navigate("ErrorView", {
        errorText: this.props.error
      });
      this.props.reqInitSignup();
      //dispatch(navigateAction);
      //this.setState({ error });
    }
  };

  render() {
    //console.log(this.props.loading);
    let buttonEnable = true;
    if (
      this.state.txtEmail.length === 0 ||
      this.state.txtSecurity.length === 0 ||
      this.state.txtConfEmail.length === 0 ||
      this.state.txtConfSecurity.length === 0
    )
      buttonEnable = false;

    return (
      <GradientView style={styles.container}>
        <Loader loading={this.props.loading} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image source={require("../../../assets/images/chevron.png")} />
          </TouchableOpacity>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/symbol_kraliss.png")}
          />
          <Text style={styles.titleText}>{i18n.t("signup.registration")}</Text>
        </View>

        <View style={styles.center}>
          <KralissInput
            placeHolder={i18n.t("login.placeholderEmail")}
            value={this.state.txtEmail}
            onChangeText={this.onChangeEmail}
            keyboardType={"email-address"}
            autoCapitalize
          />
          <KralissInput
            confirmIcon={require("../../../assets/images/check_circle_solid.png")}
            placeHolder={i18n.t("signup.placeholderConfirmEmail")}
            isConfirmed={this.state.bMailConfirmed}
            value={this.state.txtConfEmail}
            onChangeText={this.onChangeConfEmail}
            keyboardType={"email-address"}
            autoCapitalize
          />
          <KralissCheckBox
            onCheckChanged={this.onCheckChanged}
            isChecked={this.state.bRememberMe}
          />
          <KralissInput
            ID="1"
            placeHolder={i18n.t("login.placeholderPassword")}
            value={this.state.txtSecurity}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={true}
            secureText="true"
            onSecureChange={this.onChangeSecure}
          />
          <KralissInput
            ID="2"
            placeHolder={i18n.t("signup.placeholderConfirmPasswd")}
            value={this.state.txtConfSecurity}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={true}
            secureText="true"
            onSecureChange={this.onChangeSecure}
          />
        </View>

        <View style={styles.footer}>
          {this.state.showPwdkey && (
            <KralissPwdKey
              style={{ height: "60%", width: "98%" }}
              onPressKey={this.onPressPwdKey}
            />
          )}
          {!this.state.showPwdkey && (
            <View style={styles.footerSignupSection}>
              <Text style={styles.signupText}>
                {i18n.t("signup.IAcceptByRegsitering")}
              </Text>
              <TouchableOpacity
                style={styles.textBtn}
                onPress={this.onPressOpenTermsAndService}
              >
                <Text style={styles.signupBtnText}>{i18n.t("signup.TS")}</Text>
              </TouchableOpacity>
            </View>
          )}
          <KralissButton
            style={styles.loginBtn}
            onPress={this.onPressSignup}
            title={i18n.t("login.validateButton")}
            enabled={buttonEnable}
          />
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
    height: "22%",
    justifyContent: "center",
    alignItems: "center"
  },
  backBtn: {
    position: "absolute",
    left: 0
  },
  logo: {
    width: 45,
    height: 45
  },
  titleText: {
    color: "#fff",
    fontSize: RF(4.5),
    textAlign: "center"
  },
  pwdKeyPad: {
    height: "50%",
    width: "100%"
  },
  center: {
    height: "41%",
    justifyContent: "space-between"
  },
  footer: {
    height: "37%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  forgotPwdBtn: {
    marginLeft: 10,
    marginRight: 0,
    color: "#fff",
    fontSize: RF(2),
    textAlign: "right"
  },
  footerSignupSection: {
    height: 60
  },
  loginBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
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
    height: 30,
    justifyContent: "flex-start",
    marginTop: 10
  }
});

const mapStateToProps = state => {
  const { id, loading, error } = state.signupReducer;
  return {
    id,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqSignup,
  reqInitSignup
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupView);
