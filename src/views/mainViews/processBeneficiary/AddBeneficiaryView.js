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
import {
  reqRefreshBeneficiary,
  reqPatchUsersInit,
  reqPostMyUsers
} from "../../../reducers/patchMyUsers";

export default class AddBeneficiaryView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { title, kind } = params.params;
    const txtEmail = "",
      txtAccountNum = "",
      txtName = "";

    this.state = { title, kind, txtEmail, txtAccountNum, txtName };
  }

  componentDidMount = () => {};

  onPressFollowing = () => {
    this.props.reqPostMyUsers({
      add_beneficiary: {
        kraliss_beneficiary_email: this.state.txtEmail,
        kraliss_beneficiary_kraliss_account_number: this.state.txtAccountNum
      }
    });
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.payLoad !== undefined) {
      //Set IBAN value
      const myuserBeneficiary = this.props.payLoad["myuser_beneficiary"];
      await saveLocalData("myuserBeneficiary", myuserBeneficiary);
      this.props.reqPatchUsersInit();
      this.props.reqRefreshBeneficiary();
      const newUser = myuserBeneficiary.filter(
        item => item.username === this.state.txtEmail
      );
      if (newUser !== null) {
        const benUser = newUser[0]
        this.props.navigation.navigate("PasswdIndentify", {
          title: this.state.title,
          nextNavigate: this.state.kind,
          paramData: benUser
        });
      } else this.setState({ txtEmail: "", txtName: "", txtAccountNum: "" });
    }
    if (this.props.error !== undefined && this.props.error.length > 0) {
      this.props.reqPatchUsersInit();
      this.showErrorAlert(this.props.error);
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("beneficiary.fault"),
        i18n.t("beneficiary.accountNotExist"),
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

  render() {
    const { txtName, txtEmail, txtAccountNum } = this.state;
    let buttonEnabled = false;
    if (
      txtName.length > 0 &&
      (txtEmail.length > 0 || txtAccountNum.length > 0)
    ) {
      buttonEnabled = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <View style={styles.container}>
          <WhiteNavHeader
            title={i18n.t("beneficiary.addNewBeneficiary")}
            onBack={() => this.props.navigation.goBack()}
            onCancel={() => this.props.navigation.goBack()}
          />
          <ScrollView style={styles.textContainer}>
            <KralissGreyInput
              ID="txtName"
              placeHolder={i18n.t("beneficiary.recipientName")}
              value={this.state.txtName}
              onChangeText={this.onChangeInputText}
              autoCapitalize
            />
            <Text style={styles.txtSectionTitle}>
              {i18n.t("beneficiary.emailOrAccount")}
            </Text>
            <KralissGreyInput
              ID="txtEmail"
              placeHolder={i18n.t("forgotPassword.placeholderEmail")}
              value={this.state.txtEmail}
              onChangeText={this.onChangeInputText}
              keyboardType={"email-address"}
              autoCapitalize
            />
            <KralissGreyInput
              ID="txtAccountNum"
              placeHolder={i18n.t("settings.accountNumber")}
              value={this.state.txtAccountNum}
              onChangeText={this.onChangeInputText}
              keyboardType={"numeric"}
            />
          </ScrollView>

          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressFollowing}
            title={i18n.t("beneficiary.following")}
          />
        </View>
      </KeyboardAvoidingView>
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
  textContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginTop: 40,
    marginBottom: 20
  },
  buttonContainer: {
    height: 60,
    width: "100%",
    position: "absolute",
    bottom: 0
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.postBenefReducer;

  return {
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqPatchUsersInit,
  reqPostMyUsers,
  reqRefreshBeneficiary
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBeneficiaryView);
