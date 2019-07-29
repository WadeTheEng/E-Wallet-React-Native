import React, { Component } from "react";
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text
} from "react-native";
import RF from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import Loader from "../../../components/loader/Loader";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import {
  reqConfirmPasswd,
  reqInitConfirmPasswd
} from "../../../reducers/confirmPasswd";

//Add i18n
import i18n from "../../../locale/i18n";

class PasswdIdentify extends Component {
  onPressPwdKey = key => {
    if (this.state.nPwdCurLegnth < 4) {
      let passwords = [...this.state.passwords, key];
      let nPwdCurLegnth = this.state.nPwdCurLegnth + 1;
      this.setState({ passwords, nPwdCurLegnth });
    }
  };

  onClearPwd = () => {
    this.setState({ passwords: [], nPwdCurLegnth: 0 });
  };

  onValidate = () => {
    this.props.reqConfirmPasswd(this.state.passwords.join(""));
  };

  showAlert = () => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("passwdIdentify.accountBlocked"),
        i18n.t("passwdIdentify.pleaseResetPasswd"),
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {
              this.props.navigation.navigate("Login");
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  gotoNextNavigate() {
    this.props.navigation.navigate(this.state.nextNavigate, {
      title: this.state.title,
      paramData: this.state.paramData
    });
  }
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { title, nextNavigate, paramData } = params.params;
    this.state = {
      title: title,
      nextNavigate: nextNavigate,
      paramData: paramData,
      showPwdkey: false,
      nPwdCurLegnth: 0,
      nTryCount: 3,
      passwords: [],
      passwordKeys: [1, 2, 3, 4]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { success, error } = this.props;
    if (success !== undefined && success) {
      this.props.reqInitConfirmPasswd();
      //goto success alert
      this.gotoNextNavigate();
    }
    if (error !== undefined && error.length > 0) {
      this.props.reqInitConfirmPasswd();
      if (this.state.nTryCount - 1 === 0) this.showAlert();
      this.setState({ nTryCount: this.state.nTryCount - 1 });
      //dale- For debug-only, remove the comment below.
      //this.gotoNextNavigate();
    }
  }

  render() {
    let buttonEnable = false;
    if (this.state.nPwdCurLegnth === 4) buttonEnable = true;

    return (
      <View style={styles.container}>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={this.state.title}
          onClose={() => this.props.navigation.goBack()}
        />

        <View style={styles.contentContainer}>
          <View style={{ flex: 1 }} />

          <View style={styles.descContainer}>
            <Text style={styles.descText}>
              {i18n.t("passwdIdentify.enterCode")}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.inputFieldArea}
              onPress={() => this.setState({ showPwdkey: true })}
            >
              {this.state.passwordKeys.map(value => {
                return (
                  <Image
                    key={value}
                    style={{ flex: 1, aspectRatio: 1 }}
                    source={
                      value <= this.state.nPwdCurLegnth
                        ? require("../../../assets/images/input_password_filled.png")
                        : require("../../../assets/images/input_password_empty.png")
                    }
                  />
                );
              })}
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "center" }}>
              {this.state.nPwdCurLegnth > 0 && (
                <TouchableOpacity onPress={this.onClearPwd}>
                  <Image
                    source={require("../../../assets/images/times_circle_regular_grey.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.errorContainer}>
            <View style={{ flex: 1 }} />
            <Text style={styles.errorText}>
              {this.state.nTryCount < 3 &&
                i18n.t("passwdIdentify.pwdDesc", {
                  count: this.state.nTryCount
                })}
            </Text>
            <View style={{ flex: 1 }} />
          </View>

          <View style={styles.keyboardcontainer}>
            {this.state.showPwdkey && (
              <KralissPwdKey
                style={{ height: "80%", width: "92%" }}
                onPressKey={this.onPressPwdKey}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={
                buttonEnable ? styles.buttonEnabled : styles.buttonDisabled
              }
              onPress={this.onValidate}
            >
              <Text style={styles.buttonTitle}>
                {i18n.t("login.validateButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  navHeaderContainer: {
    height: 70,
    backgroundColor: "#fff",
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
  navHeaderContentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flex: 1
  },
  headerTitle: {
    color: "#707070",
    textAlign: "center",
    fontSize: RF(2.5)
  },
  closeBtn: {
    position: "absolute",
    left: 20
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  descContainer: {
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  descText: {
    color: "#484848",
    textAlign: "center",
    fontSize: RF(2.3)
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  inputFieldArea: {
    flex: 6,
    height: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  errorContainer: { flexDirection: "row", height: 30 },
  errorText: {
    flex: 6,
    marginLeft: 15,
    color: "#f00",
    textAlign: "left",
    fontSize: RF(2.3)
  },
  keyboardcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  buttonContainer: { height: 60, width: "100%" },
  buttonTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: RF(2.8)
  },
  buttonEnabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#00aca9",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonDisabled: {
    width: "100%",
    flex: 1,
    backgroundColor: "#c7eceb",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  const { success, loading, error } = state.confirmPasswdReducer;

  return {
    loading,
    success,
    error
  };
};

const mapDispatchToProps = {
  reqInitConfirmPasswd,
  reqConfirmPasswd
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswdIdentify);
