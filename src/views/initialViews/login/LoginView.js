import {
  Linking,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  Keyboard,
  Alert
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
import { reqInitSignIn, reqLogin } from "../../../reducers/login";
import { reqAccountsMe, reqInitAccountsMe } from "../../../reducers/accountsMe";
import setAuthToken from "../../../utils/networkUtils";
import { saveAuthToken } from "../../../utils/localStorage";
import {
  saveLocalData,
  saveUserInfo,
  loadLocalData,
  deleteMyAccount
} from "../../../utils/localStorage";
import i18n from "../../../locale/i18n";

class LoginView extends Component {
  state = {
    txtEmail: "",
    txtSecurity: "",
    bRememberMe: false,
    showPwdkey: false,
    loadingAccountsMe: false,
    isLoading: false
  };

  schema = Joi.object()
    .keys({
      password: Joi.string()
        .min(4)
        .required(),
      email: Joi.string()
        .email()
        .required()
    })
    .with("email", "password");

  async componentDidMount() {
    if (Platform.OS === "android") {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener("url", this.handleOpenURL);
    }
    let rememberMeBtn = false;
    rememberMeBtn = await loadLocalData("rememberMeBtn");
    if (rememberMeBtn === true) {
      const emailInLocalStorage = await loadLocalData("rememberMeContent");
      this.setState({ txtEmail: emailInLocalStorage, bRememberMe: true });
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }
  handleOpenURL = event => {
    console.log(event.url);
    this.navigate(event.url);
    // do something with the url, in our case navigate(route)
    //this.props.navigation.navigate("ResetPasswd");
  };

  navigate = url => {
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, "");

    const routeName = route.split("?")[0];
    //console.log(routeName);
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;
    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
    }
    //console.log(params);
    if (routeName === "reset") {
      navigate("ResetPasswd", params);
    }
    if (routeName === "credit") {
    }
  };

  onChangeEmail = (ID, txtEmail) => {
    this.setState({ txtEmail });
    this.setState({ showPwdkey: false });
  };

  onChangeSecure = ID => {
    this.setState({ showPwdkey: true });
    Keyboard.dismiss();
  };
  onDeleteSecurity = ID => {
    this.setState({ txtSecurity: "" });
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
    this.setState({ txtSecurity: this.state.txtSecurity + key });
  };

  validateCallBack = (err, value) => {
    this.setState({ isLoading: true });
    deleteMyAccount() // It's not deleting the account, it's just to clear the cache of the app
    if (this.state.bRememberMe === true) {
      saveLocalData("rememberMeBtn", true);
      saveLocalData("rememberMeContent", this.state.txtEmail);
    } else {
      saveLocalData("rememberMeBtn", false);
    }
    if (err === null) {
      saveLocalData("email", this.state.txtEmail);
      this.props.reqLogin({
        username: this.state.txtEmail,
        password: this.state.txtSecurity
      });
    } else {
      this.props.navigation.navigate("ErrorView", {
        errorText: err.details[0].message
      });
    }
  };

  onPressLogin = () => {
    Joi.validate(
      { email: this.state.txtEmail, password: this.state.txtSecurity },
      this.schema,
      this.validateCallBack
    );
  };
  onPressSignup = async () => {
    this.props.navigation.navigate("SignupView");
  };

  gotoTunnelWelcome = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "TunnelWelcomeView"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  gotoMainTab = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "Main"
    });
    this.props.navigation.dispatch(navigateAction);
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const { auth_token } = this.props.auth_token;
    if (auth_token !== undefined && !this.state.loadingAccountsMe) {
      saveAuthToken(this.props.auth_token.auth_token);
      setAuthToken(this.props.auth_token.auth_token);
      //kraliss_accounts/me api call => goto main or Tunnel welcome
      this.setState({ loadingAccountsMe: true });
      this.props.reqAccountsMe();
      this.props.reqInitSignIn();
    }
    const { kra_user } = this.props.payLoad;
    if (kra_user !== undefined) {
      this.props.reqInitAccountsMe();
      if (kra_user.myuser_first_sign_in === true) this.gotoTunnelWelcome();
      else {
        //save kra_user
        await saveUserInfo(this.props.payLoad);
        this.setState({ isLoading: false });
        this.gotoMainTab();
      }
    }
    const { error } = this.props;
    if (error !== undefined && error.length > 0) {
      this.props.reqInitSignIn();
      this.props.reqInitAccountsMe();
      this.setState({ isLoading: false });
      this.props.navigation.navigate("ErrorView", {
        errorText: this.props.error
      }); //dispatch(navigateAction);
    }
  };

  render() {
    let buttonEnable = false;
    if (this.state.txtEmail.length != 0 && this.state.txtSecurity.length === 4)
      buttonEnable = true;
    if (this.state.txtEmail.length === 0 || this.state.txtSecurity.length === 0)
      buttonEnable = false;

    return (
      <GradientView style={styles.container}>
        <Loader
          loading={this.state.isLoading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/symbol_kraliss.png")}
          />
        </View>

        <View style={styles.center}>
          <KralissInput
            icon={require("../../../assets/images/mail.png")}
            placeHolder={i18n.t("login.placeholderEmail")}
            value={this.state.txtEmail}
            onChangeText={this.onChangeEmail}
            keyboardType={"email-address"}
            autoCapitalize
          />
          <KralissCheckBox
            onCheckChanged={this.onCheckChanged}
            isChecked={this.state.bRememberMe}
          />
          <KralissInput
            icon={require("../../../assets/images/lock.png")}
            placeHolder={i18n.t("login.placeholderPassword")}
            value={this.state.txtSecurity}
            onDeleteText={this.onDeleteSecurity}
            showDeleteBtn={this.state.showPwdkey === false ? false : true}
            secureText="true"
            onSecureChange={this.onChangeSecure}
          />
          <TouchableOpacity
            style={styles.textBtn}
            onPress={this.onPressForgotPassword}
          >
            <Text style={styles.forgotPwdBtn}>
              {i18n.t("login.forgotPassword")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          {this.state.showPwdkey && (
            <KralissPwdKey
              style={{ height: "60%", width: "98%" }}
              onPressKey={this.onPressPwdKey}
            />
          )}

          <KralissButton
            style={styles.loginBtn}
            onPress={this.onPressLogin}
            title={i18n.t("login.validateButton")}
            enabled={buttonEnable}
          />

          {!this.state.showPwdkey && (
            <View style={styles.footerSignupSection}>
              <Text style={styles.signupText}>{i18n.t("login.noAccount")}</Text>
              <TouchableOpacity
                style={styles.textBtn}
                onPress={this.onPressSignup}
              >
                <Text style={styles.signupBtnText}>
                  {i18n.t("login.register")}
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
    height: "33%",
    justifyContent: "flex-end",
    alignItems: "center"
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  pwdKeyPad: {
    height: "50%",
    width: "100%"
  },
  center: {
    height: "29%",
    justifyContent: "space-between"
  },
  footer: {
    height: "35%",
    flexDirection: "column",
    justifyContent: "space-around",
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
    height: 55
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
  const {
    payLoad,
    loading: accountsLoading,
    error: accountsError
  } = state.accountsMeReducer;
  const { auth_token, loading, error: loginError } = state.loginReducer;

  let error = loginError;
  if (accountsError) error = accountsError;

  return {
    payLoad,
    auth_token,
    loading: accountsLoading || loading,
    error
  };
};

const mapDispatchToProps = {
  reqLogin,
  reqInitSignIn,
  reqAccountsMe,
  reqInitAccountsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);
