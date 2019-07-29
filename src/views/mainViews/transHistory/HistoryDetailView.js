import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import RF from "react-native-responsive-fontsize";
import moment from "moment";

import HorzGradientView from "../../../components/gradientView/HorzGradientView";
import KralissMoneyIconCell from "../../../components/kralissListCell/KralissMoneyIconCell";
import KralissClearCell from "../../../components/kralissListCell/KralissClearCell";
import i18n from "../../../locale/i18n";

const statusBarHeight = getStatusBarHeight();

export default class HistoryDetailView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { data } = params.params;
    this.state = { historyData: data };
  }

  render() {
    const { historyData: item } = this.state;
    let mainTitle = "";
    let mainAmount = "",
      subAmount = "",
      transType;

    const dateTime = moment(item.transaction_date_create).format(
      "DD/MM/YYYY a hh:mm:ss"
    );
    let userInfoTitle = "",
      tradeUserName,
      tradeUserAccount;
    let beforeTransKraAmount = 0,
      beforeTransAmount = 0,
      afterTransKraAmount = 0,
      afterTransAmount = 0;

    let IBANBeneficiary = "";

    let message = null;

    let amountTitle = "",
      amountField1Title,
      amountField2Title;
    let amountField1Value, amountField2Value, exchgRate;

    afterTransKraAmount = parseFloat(item.transaction_after_balance);
    afterTransAmount =
      afterTransKraAmount * item.transaction_sender_conversion_rate;

    if (item.transaction_type === "REFILL") {
      mainTitle = i18n.t("transHistory.recharge");
      transType = i18n.t("transHistory.recharge");
      mainAmount = `+ ${item.kra_transaction_total_converted_amount} ${
        item.transaction_sender_devise_iso_code
      }`;
      subAmount = `+ ${item.kra_transaction_total_amount}`;
      beforeTransKraAmount =
        afterTransKraAmount - parseFloat(item.kra_transaction_total_amount);
      beforeTransAmount =
        beforeTransKraAmount * item.transaction_sender_conversion_rate;
    }
    if (item.transaction_type === "REFUND") {
      mainTitle = i18n.t("transHistory.refund");
      transType = i18n.t("transHistory.refund");
      mainAmount = `- ${item.kra_transaction_total_converted_amount} ${
        item.transaction_sender_devise_iso_code
      }`;
      subAmount = `- ${item.kra_transaction_total_amount}`;
      beforeTransKraAmount =
        afterTransKraAmount - parseFloat(item.kra_transaction_total_amount);
      beforeTransAmount =
        beforeTransKraAmount * item.transaction_sender_conversion_rate;
      IBANBeneficiary = item.refund_iban;
    }
    if (
      item.transaction_type === "SENT" ||
      item.transaction_type === "RECEIVED"
    ) {
      if (item.transaction_type === "SENT") {
        transType = i18n.t("transHistory.payment");
        let transAmount =
          parseFloat(item.kra_transaction_amount) *
          item.transaction_sender_conversion_rate;
        mainTitle = item.transaction_receiver_name;
        mainAmount = `- ${transAmount.toFixed(2)} ${
          item.transaction_sender_devise_iso_code
        }`;
        subAmount = `- ${item.kra_transaction_amount}`;
        userInfoTitle = i18n.t("sendMoney.beneficiary");
        tradeUserName = item.transaction_receiver_name;
        tradeUserAccount = item.transaction_receiver_account_number;
        amountField1Title = i18n.t("transHistory.transmittter");
        amountField2Title = i18n.t("transHistory.receipient");
      } else {
        transType = i18n.t("transHistory.receive");
        let transAmount =
          parseFloat(item.kra_transaction_amount) *
          item.transaction_sender_conversion_rate;
        mainTitle = item.transaction_sender_name;
        mainAmount = `+ ${transAmount.toFixed(2)} ${
          item.transaction_sender_devise_iso_code
        }`;
        subAmount = `+ ${item.kra_transaction_amount}`;
        userInfoTitle = i18n.t("transHistory.transmittter");
        tradeUserName = item.transaction_sender_name;
        tradeUserAccount = item.transaction_sender_account_number;
        amountField1Title = i18n.t("transHistory.applicant");
        amountField2Title = i18n.t("transHistory.payer");
      }
      amountTitle = i18n.t("cash.amount");

      const kraTransAmount = parseFloat(item.kra_transaction_amount);
      amountField1Value = `${(
        kraTransAmount * item.transaction_sender_conversion_rate
      ).toFixed(2)} ${item.transaction_sender_devise_iso_code}`;
      amountField2Value = `${(
        kraTransAmount * item.transaction_receiver_conversion_rate
      ).toFixed(2)} ${item.transaction_receiver_devise_iso_code}`;
      if (
        item.transaction_sender_conversion_rate ===
        item.transaction_receiver_conversion_rate
      )
        exchgRate = "-";
      else {
        const rateValue =
          item.transaction_sender_conversion_rate /
          item.transaction_receiver_conversion_rate;
        exchgRate = `${rateValue.toFixed(2)}`;
      }

      beforeTransKraAmount =
        afterTransKraAmount - parseFloat(item.kra_transaction_amount);
      beforeTransAmount =
        beforeTransKraAmount * item.transaction_sender_conversion_rate;
      message = item.transaction_message;
    }

    const beforeKraTxt = `${i18n.t(
      "sendMoney.thats"
    )} ${beforeTransKraAmount.toFixed(2)}`;
    const beforeAmountTxt = `${beforeTransAmount.toFixed(2)} ${
      item.transaction_sender_devise_iso_code
    }`;

    const afterKraTxt = `${i18n.t(
      "sendMoney.thats"
    )} ${afterTransKraAmount.toFixed(2)}`;
    const afterAmountTxt = `${afterTransAmount.toFixed(2)} ${
      item.transaction_sender_devise_iso_code
    }`;

    const transNumber = item.transaction_number;
    return (
      <View style={styles.container}>
        <HorzGradientView style={{ height: 185 + statusBarHeight }}>
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.btnBack}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image source={require("../../../assets/images/chevron.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.headerDesc}>{mainTitle}</Text>
            <Text style={styles.headerBalance}>{mainAmount}</Text>
            <View style={styles.headerMoneyInfo}>
              <Text style={styles.headerDesc}>
                {`${i18n.t("sendMoney.thats")} ${subAmount}`}
              </Text>
              <Image
                style={{ marginLeft: 5 }}
                source={require("../../../assets/images/kraliss_logo_grey.png")}
              />
            </View>
          </View>
        </HorzGradientView>
        <ScrollView style={styles.mainContent}>
          <Text style={styles.txtSectionTitle}>{i18n.t("cash.date")}</Text>
          <Text style={styles.txtSectionDesc}>{dateTime}</Text>

          {userInfoTitle !== "" && (
            <View>
              <Text style={styles.txtSectionTitle}>{userInfoTitle}</Text>
              <KralissClearCell
                mainTitle={i18n.t("tunnel.lastName")}
                detailContent={tradeUserName}
              />
              <KralissClearCell
                style={{ marginTop: 5 }}
                mainTitle={i18n.t("sendMoney.accountNumber")}
                detailContent={tradeUserAccount}
              />
            </View>
          )}

          {amountTitle !== "" && (
            <View>
              <Text style={styles.txtSectionTitle}>{amountTitle}</Text>
              <KralissClearCell
                mainTitle={amountField1Title}
                detailContent={amountField1Value}
              />
              <KralissClearCell
                style={{ marginTop: 5 }}
                mainTitle={amountField2Title}
                detailContent={amountField2Value}
              />
              <KralissClearCell
                style={{ marginTop: 5 }}
                mainTitle={i18n.t("transHistory.exchgRate")}
                detailContent={exchgRate}
              />
            </View>
          )}

          {IBANBeneficiary !== "" && (
            <View>
              <Text style={styles.txtSectionTitle}>
                {i18n.t("transHistory.IBANBenef")}
              </Text>
              <Text style={styles.txtSectionDesc}>{IBANBeneficiary}</Text>
            </View>
          )}

          <Text style={styles.txtSectionTitle}>
            {i18n.t("cash.transactionNumber")}
          </Text>
          <Text style={styles.txtSectionDesc}>{transNumber}</Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.transactionType")}
          </Text>
          <Text style={styles.txtSectionDesc}>{transType}</Text>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.beforeBalance")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>{beforeAmountTxt}</Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={beforeKraTxt}
              titleFontSize={{ fontSize: RF(2.0) }}
            />
          </View>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.afterBalance")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>{afterAmountTxt}</Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={afterKraTxt}
              titleFontSize={{ fontSize: RF(2.0) }}
            />
          </View>
          {message !== null && (
            <View>
              <Text style={styles.txtSectionTitle}>
                {i18n.t("transHistory.message")}
              </Text>
              <Text style={styles.txtSectionDesc}>{message}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff"
  },
  navBar: {
    flexDirection: "row",
    marginTop: statusBarHeight,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  btnBack: {
    height: 45,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  headerContainer: { marginTop: 20, height: 100, alignItems: "center" },
  headerBalance: {
    marginTop: 10,
    color: "#fff",
    fontSize: RF(4.0)
  },
  headerDesc: { fontSize: RF(2.0), color: "#fff" },
  headerMoneyInfo: { marginTop: 10, flexDirection: "row" },

  mainContent: { flex: 1, paddingLeft: 20, paddingRight: 20 },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginTop: 20,
    marginBottom: 5
  },
  txtSectionDesc: {
    color: "#484848",
    fontSize: RF(2.0)
  }
});
