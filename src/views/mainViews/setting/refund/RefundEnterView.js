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

import Loader from "../../../../components/loader/Loader";
import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";

import i18n from "../../../../locale/i18n";
import {
  loadLocalData,
  saveLocalData,
  saveUserInfo
} from "../../../../utils/localStorage";
import RF from "react-native-responsive-fontsize";
import {
  reqAccountsMe,
  reqInitAccountsMe
} from "../../../../reducers/accountsMe";
import { getDeviceInformations } from "../../../../utils/deviceInfo";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import KralissCurrencyInput from "../../../../components/kralissInput/KralissCurrencyInput";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";

export default class RefundEnterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txtRefundAmount: "",
      myUnit: "",
      myConversionRate: 0,
      myBalance: 0,
      refundFee: 0
    };
  }

  onPressValidate = () => {
    const { refundFee, myConversionRate, myUnit, myBalance } = this.state;

    this.props.navigation.navigate("RefundConfirm", {
      refundAmount: parseFloat(this.state.txtRefundAmount),
      myUnit,
      refundFee,
      myConversionRate,
      myBalance
    });
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  loadUserInternational = async () => {
    try {
      const myBalance = await loadLocalData("kraBalance");
      const myuserInternational = await loadLocalData("myuserInternational");
      let refundFee = 0.0;
      if (myuserInternational["international_devise_iso_code"] !== "EUR")
        refundFee = 18.0 / myuserInternational["international_conversion_rate"];
      this.setState({
        myUnit: myuserInternational["international_devise_iso_code"],
        myConversionRate: myuserInternational["international_conversion_rate"],
        myBalance: parseFloat(myBalance),
        refundFee
      });
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  };

  componentDidMount = async () => {
    this.props.reqAccountsMe();
    try {
      const value = await getDeviceInformations(navigator.geolocation);
      saveLocalData("mobileInfos", value);
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const { kra_user } = this.props.payLoad;
    if (kra_user !== undefined) {
      if (kra_user.myuser_first_sign_in === true) this.gotoTunnelWelcome();
      else {
        //save kra_user
        await saveUserInfo(this.props.payLoad);
        this.loadUserInternational();
      }
      this.props.reqInitAccountsMe();
    }
    const { error } = this.props;
    if (error !== undefined && error.length > 0) {
      this.props.reqInitAccountsMe();
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
      txtRefundAmount,
      refundFee,
      myConversionRate,
      myUnit,
      myBalance
    } = this.state;

    let refundAmount =
      txtRefundAmount.length === 0 ? 0 : parseFloat(txtRefundAmount);
    let myBalanceAmount = myBalance / myConversionRate;
    let afterAmount = myBalanceAmount - (refundFee + refundAmount);

    let buttonEnabled = false;
    if (
      (refundFee === 0 && refundAmount >= 0.01) ||
      (refundFee > 0 && refundAmount > 18)
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
            title={i18n.t("settings.refund")}
            onBack={() => this.props.navigation.goBack()}
          />
          <ScrollView style={styles.textContainer}>
            <Text style={styles.txtTitle}>{i18n.t("settings.refund")}</Text>
            <Text style={styles.txtTitleDesc}>
              {i18n.t("refund.refundDesc")}
            </Text>
            <View style={{ flex: 1, marginRight: 60, marginBottom: 40 }}>
              <Text style={styles.txtSectionTitle}>
                {i18n.t("refund.enterRefundAmount")}
              </Text>
              <KralissCurrencyInput
                ID="txtRefundAmount"
                placeHolder={"0"}
                valueFontSize={{ fontSize: RF(5.5) }}
                unitFontSize={{ fontSize: RF(4.0) }}
                value={txtRefundAmount}
                unitValue={myUnit}
                onChangeText={this.onChangeInputText}
              />
            </View>
            <KralissClearCell
              style={styles.marginCell}
              mainTitle={i18n.t("refund.curBalance")}
              detailContent={`${myBalanceAmount.toFixed(2)} ${myUnit}`}
            />
            <KralissClearCell
              style={styles.marginCell}
              mainTitle={i18n.t("refund.refundAmount")}
              detailContent={`${refundAmount.toFixed(2)} ${myUnit}`}
            />
            <KralissClearCell
              style={styles.marginCell}
              mainTitle={i18n.t("refund.refundFee")}
              detailContent={`${refundFee.toFixed(2)} ${myUnit}`}
            />
            <KralissClearCell
              style={styles.marginCell}
              boldContent={true}
              mainTitle={i18n.t("refund.afterBalance")}
              detailContent={`${afterAmount.toFixed(2)} ${myUnit}`}
            />
          </ScrollView>

          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressValidate}
            title={i18n.t("forgotPassword.validateButton")}
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
  marginCell: {
    marginTop: 12
  },
  txtTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginBottom: 20,
    marginTop: 20
  },
  txtTitleDesc: {
    color: "#484848",
    fontSize: RF(2.0)
  },
  txtSectionTitle: {
    color: "#707070",
    fontSize: RF(2.0),
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.accountsMeReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqAccountsMe,
  reqInitAccountsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(RefundEnterView);
