import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import RNLanguages from "react-native-languages";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissClearCell from "../../../components/kralissListCell/KralissClearCell";
import RF from "react-native-responsive-fontsize";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import Loader from "../../../components/loader/Loader";
import { getCreditcardInit } from "../../../utils/apiMoneyUtil";

export default class CreditSummaryView extends Component {
  state = { loading: false };

  getLanguageTosendToApiMoney = () => {
    const iphoneLanguage = RNLanguages.language;
    if (iphoneLanguage === "fr-FR") {
      return "fr";
    } else {
      return "en";
    }
  };

  onCallBackFromApiMoney = (response, error) => {
    this.setState({ loading: false });
    console.log(response);
    if (error !== null) {
      //console.log(error);
      showErrorAlert("", error);
    } else {
      const { id, redirect_url, message } = response;
      if (message !== undefined) {
        showErrorAlert("", message);
      } else {
        saveLocalData("apiMoneyId", id);
        this.props.navigation.navigate("CreditRedirect", { url: redirect_url });
      }
    }
  };
  showErrorAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: i18n.t("passwdIdentify.return"),
          onPress: () => {}
        }
      ],
      { cancelable: true }
    );
  }
  onPressValidate = async () => {
    const params = this.props.navigation.state;
    const { amount, commission } = params.params;
    const dateTimeStamp = Date.now();
    const accountId = await loadLocalData("kraAccountId");
    const apiMoneyWalletId = await loadLocalData("kraApiMoneyWalletId");

    const partnerRef = `REFILL-${dateTimeStamp}-${accountId}`;
    const bodyData = {
      partner_ref: partnerRef,
      tag: "refill",
      receiver_wallet_id: apiMoneyWalletId,
      fees_wallet_id: "WF-4836856013590597",
      amount: (amount + commission).toFixed(0),
      fees: commission.toFixed(0),
      return_url: `http://kraliss.credit?amount=${amount}&fee=${commission}`,
      lang: this.getLanguageTosendToApiMoney()
    };
    saveLocalData("partnerRef", partnerRef);
    this.setState({ loading: true });
    getCreditcardInit(JSON.stringify(bodyData), this.onCallBackFromApiMoney);
  };

  componentDidMount = async () => {};

  render() {
    const params = this.props.navigation.state;
    const { amount, commission, conversionRate, unit } = params.params;
    const total = (amount + commission) * conversionRate;

    let buttonEnabled = true;
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={i18n.t("creditMyAccount.creditMyAccount")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.txtSectionTitle}>
            {i18n.t("creditMyAccount.summeryOfOrder")}
          </Text>
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("creditMyAccount.amountOfRecharge")}
            detailContent={`${(amount * conversionRate).toFixed(2)} ${unit}`}
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("creditMyAccount.multiServiceDesc")}
            detailContent={`${(commission * conversionRate).toFixed(
              2
            )} ${unit}`}
          />
          <KralissClearCell
            style={styles.marginCell}
            boldContent={true}
            mainTitle={i18n.t("creditMyAccount.totalCost")}
            detailContent={`${total.toFixed(2)} ${unit}`}
          />
          <Text style={styles.txtBottomDesc}>
            {i18n.t("creditMyAccount.clickValidate")}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={buttonEnabled ? styles.buttonEnabled : styles.buttonDisabled}
            onPress={this.onPressValidate}
          >
            <Text style={styles.buttonTitle}>
              {i18n.t("login.validateButton")}
            </Text>
          </TouchableOpacity>
        </View>
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
  textContainer: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "column",
    flex: 1
  },
  marginCell: {
    marginTop: 12
  },
  marginSection: {
    marginTop: 20
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginTop: 12,
    marginBottom: 12
  },
  txtBottomDesc: {
    color: "#484848",
    fontSize: RF(2.0),
    marginTop: 25,
    marginBottom: 12
  },
  buttonContainer: {
    height: 60,
    width: "100%",
    position: "absolute",
    bottom: 0
  },
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
