import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  View
} from "react-native";
import { connect } from "react-redux";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import KralissClearCell from "../../../../components/kralissListCell/KralissClearCell";
import RF from "react-native-responsive-fontsize";
import i18n from "../../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import Loader from "../../../../components/loader/Loader";
import {
  reqConfirmAsk,
  reqConfirmAskInit
} from "../../../../reducers/receiveKraliss";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import KralissMoneyIconCell from "../../../../components/kralissListCell/KralissMoneyIconCell";

export default class ConfirmAskView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;

    const {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name,
      receiver_account_number,
      transaction_id
    } = params.params;

    this.state = {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name,
      receiver_account_number,
      transaction_id
    };
  }

  showErrorAlert(title, message) {
    setTimeout(() => {
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
    }, 100);
  }

  confirmingAskMoney = async status => {
    const mobileInfos = await loadLocalData("mobileInfos");
    const { transaction_id } = this.state;
    this.props.reqConfirmAsk(transaction_id, {
      mobile_infos: mobileInfos,
      acceptation_status: status
    });
    this.setState({ status });
  };

  onPressConfirm = () => {
    this.showConfirmAlert("ACCEPTED");
  };
  onPressRefuse = () => {
    this.showConfirmAlert("DECLINED");
  };

  showConfirmAlert = status => {
    const {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name
    } = this.state;

    const balanceAmount = amount * conversion_rate;
    let msg = i18n.t("askMoney.acceptConfMsg", {
      amount: balanceAmount.toFixed(2),
      myUnit: devise_iso_code,
      receiver: receiver_name
    });
    if (status === "DECLINED")
      msg = i18n.t("askMoney.refuseConfMsg", {
        amount: balanceAmount.toFixed(2),
        myUnit: devise_iso_code,
        receiver: receiver_name
      });
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        msg,
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {}
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.confirmingAskMoney(status);
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  componentDidUpdate() {
    const { error, payLoad } = this.props;
    if (error !== undefined) {
      this.props.reqConfirmAskInit();
      this.showErrorAlert("", error);
    }

    if (payLoad !== undefined && payLoad.length > 0) {
      this.props.reqConfirmAskInit();
      this.props.navigation.navigate("AskMoneySuccess", {
        title: i18n.t("sendMoney.successTitle"),
        failed: this.state.status === "DECLINED" ? true : false,
        description: i18n.t("refillLoader.findHistoryDesc"),
        returnNavigate: "Home"
      });
    }
  }

  render() {
    const {
      amount,
      conversion_rate,
      devise_iso_code,
      receiver_name,
      receiver_account_number
    } = this.state;

    const balanceAmount = amount * conversion_rate;

    let buttonEnabled = true;
    return (
      <View style={styles.container}>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader title={i18n.t("refillLoader.confirmation")} />
        <ScrollView style={styles.textContainer}>
          <Text style={styles.txtMainTitle}>
            {i18n.t("askMoney.summaryOfRequest")}
          </Text>

          <Text style={styles.txtSectionTitle}>{i18n.t("cash.amount")}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={styles.txtBottomDesc}>
              {`${balanceAmount.toFixed(2)} ${devise_iso_code}`}
            </Text>
            <KralissMoneyIconCell
              style={{ position: "absolute", right: 0 }}
              title={`${i18n.t("sendMoney.thats")} ${amount.toFixed(2)}`}
              titleFontSize={{ fontSize: RF(2.0) }}
            />
          </View>

          <Text style={styles.txtSectionTitle}>
            {i18n.t("transHistory.applicant")}
          </Text>
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("tunnel.lastName")}
            detailContent={receiver_name}
          />
          <KralissClearCell
            style={styles.marginCell}
            mainTitle={i18n.t("sendMoney.accountNumber")}
            detailContent={receiver_account_number}
          />

          <Text style={styles.txtSectionTitle}>
            {i18n.t("sendMoney.transactionType")}
          </Text>
          <Text style={styles.txtBottomDesc}>
            {i18n.t("askMoney.moneyRequest")}
          </Text>
        </ScrollView>
        <Text style={styles.txtBottomQuestion}>
          {i18n.t("askMoney.wantProceedRequest")}
        </Text>
        <KralissRectButton
          style={styles.buttonContainer}
          enabled={buttonEnabled}
          onPress={this.onPressConfirm}
          title={i18n.t("login.validateButton")}
        />
        <KralissRectButton
          style={styles.buttonContainer}
          isYellow={true}
          enabled={buttonEnabled}
          onPress={this.onPressRefuse}
          title={i18n.t("notifications.refuse")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  textContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 30,
    flexDirection: "column",
    flex: 1
  },
  txtMainTitle: {
    color: "#484848",
    fontSize: RF(2.0),
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center"
  },
  txtBottomQuestion: {
    color: "#484848",
    fontSize: RF(2.0),
    marginTop: 30,
    marginBottom: 70,
    textAlign: "center"
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginTop: 20,
    marginBottom: 5
  },
  txtBottomDesc: {
    color: "#484848",
    fontSize: RF(2.0)
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.confirmAskReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqConfirmAsk,
  reqConfirmAskInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmAskView);
