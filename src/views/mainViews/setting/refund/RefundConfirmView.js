import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import RF from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../../locale/i18n";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";

export default class RefundConfirmView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const {
      refundAmount,
      myUnit,
      refundFee,
      myConversionRate,
      myBalance
    } = params.params;

    this.state = {
      refundAmount,
      myUnit,
      refundFee,
      myConversionRate,
      myBalance
    };
  }

  onPressConfirm = async () => {
    const {
      refundAmount,
      myUnit,
      refundFee,
      myConversionRate,
      myBalance
    } = this.state;
    this.props.navigation.navigate("RefundIBAN", {
      refundAmount,
      myUnit,
      refundFee,
      myConversionRate,
      myBalance
    });
  };

  componentDidMount = async () => {};

  render() {
    const {
      refundAmount,
      myUnit,
      refundFee,
      myConversionRate,
      myBalance
    } = this.state;
    let myBalanceAmount = myBalance / myConversionRate;
    let afterAmount = myBalanceAmount - (refundFee + refundAmount);

    let buttonEnabled = true;
    return (
      <View style={styles.container}>
        <WhiteNavHeader
          title={i18n.t("refillLoader.confirmation")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
          onCancel={() => this.props.navigation.navigate("Setting")}
        />
        <View style={styles.textContainer}>
          <Text style={styles.txtSectionTitle}>
            {i18n.t("refund.summaryRequest")}
          </Text>
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
          <Text style={styles.txtBottomDesc}>
            {i18n.t("creditMyAccount.clickValidate")}
          </Text>
        </View>

        <KralissRectButton
          style={styles.buttonContainer}
          enabled={buttonEnabled}
          onPress={this.onPressConfirm}
          title={i18n.t("sendMoney.toConfirm")}
        />
      </View>
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
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "column",
    flex: 1
  },
  marginCell: {
    marginTop: 12
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginTop: 20,
    marginBottom: 23
  },
  txtBottomDesc: {
    color: "#484848",
    fontSize: RF(2.0),
    marginTop: 25,
    marginBottom: 12
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});
