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
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import i18n from "../../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import RF from "react-native-responsive-fontsize";
import KralissCurrencyInput from "../../../../components/kralissInput/KralissCurrencyInput";
import KralissGreyInput from "../../../../components/kralissInput/KralissGreyInput";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";
import { reqInternationals } from "../../../../reducers/internationals";
import { getDeviceInformations } from "../../../../utils/deviceInfo";

export default class SendMoneyView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { title, paramData } = params.params;
    const txtSendAmount = "",
      txtReceiveMount = "";

    this.state = {
      title: title,
      benUser: paramData,
      txtSendAmount,
      txtReceiveMount,
      kralissMoney: 0,
      benUnit: "",
      benConversionRate: 0,
      myUnit: "",
      myConversionRate: 0
    };
  }

  onPressFollowing = () => {
    this.props.navigation.navigate("SendConfirm", {
      sendAmount: parseFloat(this.state.txtSendAmount),
      benUser: this.state.benUser,
      sendUnit: this.state.myUnit,
      conversionRate: this.state.myConversionRate,
      message: this.state.txtMessage
    });
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);

    if (id === "txtSendAmount") {
      let sendValue = value.length === 0 ? 0 : parseFloat(value);
      const kralissMoney = sendValue / this.state.myConversionRate;
      this.setState({
        kralissMoney
      });
      const receiveValue = kralissMoney * this.state.benConversionRate;
      this.setState({ txtReceiveMount: receiveValue.toFixed(2) });
    }

    if (id === "txtReceiveMount") {
      let receiveValue = value.length === 0 ? 0 : parseFloat(value);
      const kralissMoney = receiveValue / this.state.benConversionRate;
      this.setState({
        kralissMoney
      });
      const sendValue = kralissMoney * this.state.myConversionRate;
      this.setState({ txtSendAmount: sendValue.toFixed(2) });
    }
  };

  componentDidMount = async () => {
    this.props.reqInternationals();
    try {
      const value = await getDeviceInformations(navigator.geolocation);
      saveLocalData("mobileInfos", value);
      const myuserInternational = await loadLocalData("myuserInternational");
      this.setState({
        myUnit: myuserInternational["international_devise_iso_code"],
        myConversionRate: myuserInternational["international_conversion_rate"]
      });
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.internationals.length > 0 &&
      this.state.benUnit.length === 0
    ) {
      let countries = this.props.internationals.filter(
        item => item.id === this.state.benUser.myuser_international
      );

      if (countries.length > 0) {
        const benCountry = countries[0];
        this.setState({
          benUnit: benCountry.international_devise_iso_code,
          benConversionRate: benCountry.international_conversion_rate
        });
      }
    }
    if (this.props.error !== undefined && this.props.error.length > 0) {
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
    const { kralissMoney, txtSendAmount, txtReceiveMount } = this.state;
    let buttonEnabled = false;
    if (kralissMoney >= 0.01) {
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
            title={this.state.title}
            onBack={() => this.props.navigation.goBack()}
            onCancel={() => this.props.navigation.navigate("Home")}
          />
          <ScrollView style={styles.textContainer}>
            <View style={{ flex: 1, marginRight: 60 }}>
              <Text style={[styles.txtSectionTitle, { marginTop: 40 }]}>
                {i18n.t("sendMoney.youSend")}
              </Text>
              <KralissCurrencyInput
                ID="txtSendAmount"
                placeHolder={"0"}
                valueFontSize={{ fontSize: RF(5.5) }}
                unitFontSize={{ fontSize: RF(4.0) }}
                value={txtSendAmount}
                unitValue={this.state.myUnit}
                onChangeText={this.onChangeInputText}
              />
              <KralissMoneyIconCell
                style={styles.moneyInfo}
                title={`${i18n.t("sendMoney.thats")} ${kralissMoney.toFixed(
                  2
                )}`}
                titleFontSize={{ fontSize: RF(2.5) }}
              />
              <Text style={styles.txtSectionTitle}>
                {i18n.t("sendMoney.beneficiaryReceive")}
              </Text>
              <KralissCurrencyInput
                ID="txtReceiveMount"
                placeHolder={"0"}
                valueFontSize={{ fontSize: RF(5.5) }}
                unitFontSize={{ fontSize: RF(4.0) }}
                value={txtReceiveMount}
                unitValue={this.state.benUnit}
                onChangeText={this.onChangeInputText}
              />
            </View>

            <KralissGreyInput
              style={styles.moneyInfo}
              ID="txtMessage"
              placeHolder={i18n.t("sendMoney.msgPlaceHolder")}
              value={this.state.txtMessage}
              onChangeText={this.onChangeInputText}
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
  txtSectionTitle: {
    color: "#707070",
    fontSize: RF(2.0),
    marginBottom: 20
  },
  moneyInfo: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.internationalsReducer;
  return { loading, error, internationals: payLoad };
};

const mapDispatchToProps = {
  reqInternationals
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendMoneyView);
