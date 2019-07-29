import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Alert
} from "react-native";
import { connect } from "react-redux";

import Loader from "../../../components/loader/Loader";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../components/kralissButton/KralissRectButton";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import RF from "react-native-responsive-fontsize";
import KralissGreyInput from "../../../components/kralissInput/KralissGreyInput";
import KralissMoneyIconCell from "../../../components/kralissListCell/KralissMoneyIconCell";
import KralissPwdKey from "../../../components/kralissPwdKey/KralissPwdKey";
import { reqAuthPasswd } from "../../../reducers/authPasswd";

export default class ModifyPasswdView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txtOldPasswd: "",
      txtNewPasswd: "",
      txtConfPasswd: "",
      bShowPwdKey: false
    };
  }

  onPressValidate = () => {
    this.props.reqAuthPasswd({
      current_password: this.state.txtOldPasswd,
      new_password: this.state.txtNewPasswd
    });
  };

  onPressPwdKey = key => {
    const { curSelSecurityID } = this.state;
    var _stateObj = {};
    _stateObj[curSelSecurityID] = this.state[curSelSecurityID] + key;
    this.setState(_stateObj);
  };

  onSecureChange = ID => {
    if (this.state.bShowPwdKey === false) {
      this.setState({ bShowPwdKey: true });
    }
    this.setState({ curSelSecurityID: ID });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { success, error } = this.props;
    if (success === true) {
      this.props.navigation.navigate("SettingSuccess", {
        title: i18n.t("contacts.succResetTitle"),
        description: "",
        returnNavigate: "Setting"
      });
    }
    if (error !== undefined && this.props.error.length > 0) {
      this.showErrorAlert(this.props.error);
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("beneficiary.fault"),
        errorMsg,
        [
          {
            text: i18n.t("passwdIdentify.return"),
            onPress: () => {}
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };
  /**/
  render() {
    const {
      bShowPwdKey,
      txtOldPasswd,
      txtNewPasswd,
      txtConfPasswd
    } = this.state;
    let buttonEnabled = false;
    if (
      txtNewPasswd.length > 0 &&
      txtOldPasswd.length > 0 &&
      txtNewPasswd === txtConfPasswd
    ) {
      buttonEnabled = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <WhiteNavHeader
            title={i18n.t("settings.changePasswd")}
            onBack={() => this.props.navigation.goBack()}
          />
          <ScrollView style={styles.textContainer}>
            <Text style={styles.sectionText}>
              {i18n.t("modifyPasswd.modifyDesc")}
            </Text>
            <Text style={styles.txtSectionTitle}>
              {i18n.t("modifyPasswd.inputOldPasswd")}
            </Text>
            <KralissGreyInput
              ID="txtOldPasswd"
              secureText="true"
              placeHolder={i18n.t("modifyPasswd.oldPasswd")}
              value={this.state.txtOldPasswd}
              onSecureChange={this.onSecureChange}
            />
            <Text style={styles.txtSectionTitle}>
              {i18n.t("modifyPasswd.newPasswd")}
            </Text>
            <KralissGreyInput
              ID="txtNewPasswd"
              secureText="true"
              placeHolder={i18n.t("modifyPasswd.newPasswd")}
              value={this.state.txtNewPasswd}
              onSecureChange={this.onSecureChange}
            />

            <KralissGreyInput
              style={styles.marginCell}
              ID="txtConfPasswd"
              secureText="true"
              placeHolder={i18n.t("modifyPasswd.confirmPasswd")}
              value={this.state.txtConfPasswd}
              onSecureChange={this.onSecureChange}
            />
          </ScrollView>
          {bShowPwdKey && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <KralissPwdKey
                style={{ marginBottom: 20, height: 160, width: "95%" }}
                onPressKey={this.onPressPwdKey}
              />
            </View>
          )}
          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressValidate}
            title={i18n.t("login.validateButton")}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  sectionText: {
    marginTop: 20,
    color: "#acacac",
    fontSize: RF(2.0)
  },
  txtSectionTitle: {
    color: "#707070",
    fontSize: RF(2.0),
    marginTop: 30
  },
  marginCell: {
    marginTop: 10
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, success } = state.authPasswdReducer;
  return { loading, error, success };
};

const mapDispatchToProps = {
  reqAuthPasswd
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyPasswdView);
