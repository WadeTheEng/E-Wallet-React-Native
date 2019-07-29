import React, { Component } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import GradientView from "../../../components/gradientView/GradientView";
import KralissVerticalButton from "../../../components/kralissButton/KralissVerticalButton";
import i18n from "../../../locale/i18n";
import { connect } from "react-redux";
import { reqDeviceApns } from "../../../reducers/device";
var PushNotification = require("react-native-push-notification");

export default class HomeMainView extends Component {
  initPushNotification = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        //console.log("TOKEN:", token);
        this.props.reqDeviceApns(token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log("NOTIFICATION:", notification);

        const { data } = notification.aps;
        // process the notification
        this.props.navigation.navigate("ConfirmAsk", data);
        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  };

  componentDidMount = () => {
    this.initPushNotification();
  };

  onPressPayer = () => {
    this.props.navigation.navigate("PasswdIndentify", {
      title: i18n.t("home.pay"),
      nextNavigate: "Pay",
      paramData: ""
    });
    //this.props.navigation.navigate("Pay");
  };

  onPressSendMoney = () => {
    this.props.navigation.navigate("BeneficiaryList", {
      title: i18n.t("home.sendMoney"),
      kind: "SendMoney"
    });
  };

  onPressAskMoney = () => {
    this.props.navigation.navigate("BeneficiaryList", {
      title: i18n.t("home.askForMoney"),
      kind: "AskMoney"
    });
    /*this.props.navigation.navigate("ConfirmAsk", {
      amount: 10,
      conversion_rate: 1.55786,
      devise_iso_code: "GBP",
      receiver_name: "a username",
      receiver_account_number: "1211-1211-5671-6848",
      transaction_id: 7
    });*/
  };

  onPressCash = () => {
    this.props.navigation.navigate("PasswdIndentify", {
      title: i18n.t("home.cash"),
      nextNavigate: "CashEnter",
      paramData: ""
    });

    /*this.props.navigation.navigate("CashConfirm", {
      data: {
        converted_amount: "1.77",
        devise_iso_code: "GBP",
        kraliss_amount: "2.00",
        datetime: "2018-10-18T20:51:06.099926Z",
        sender_name: "le2424test",
        sender_account_number: "1211-1211-5671-6849",
        transaction_number: "11211141214114251313"
      }
    });

    this.props.navigation.navigate("CashEnter", {
      title: i18n.t("home.cash")
    });*/
  };

  render() {
    return (
      <GradientView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.headerLogo}
            source={require("../../../assets/images/symbol_kraliss.png")}
          />
        </View>

        <View style={styles.center}>
          <Image
            style={styles.imgCross}
            source={require("../../../assets/images/cross_welcome.png")}
          />
          <View style={styles.centerContent}>
            <View style={styles.contentFirstRow}>
              <KralissVerticalButton
                style={styles.btnTopCenter}
                enabled={true}
                image={require("../../../assets/images/payer.png")}
                title={i18n.t("home.pay")}
                onPress={this.onPressPayer}
              />
            </View>
            <View style={styles.contentSecondRow}>
              <KralissVerticalButton
                style={styles.btnLeftMiddle}
                enabled={true}
                image={require("../../../assets/images/envoyer.png")}
                title={i18n.t("home.sendMoney")}
                onPress={this.onPressSendMoney}
              />
              <KralissVerticalButton
                style={styles.btnRightMiddle}
                enabled={true}
                image={require("../../../assets/images/demander.png")}
                title={i18n.t("home.askForMoney")}
                onPress={this.onPressAskMoney}
              />
            </View>
            <View style={styles.contentThirdRow}>
              <KralissVerticalButton
                style={styles.btnBottomCenter}
                enabled={true}
                image={require("../../../assets/images/encaisser.png")}
                title={i18n.t("home.cash")}
                onPress={this.onPressCash}
              />
            </View>
          </View>
        </View>
      </GradientView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  header: {
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  headerLogo: { width: 45, height: 45 },
  imgCross: {
    position: "absolute",
    left: "10%",
    top: "10%",
    width: "80%",
    height: "80%"
  },
  center: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  centerContent: {
    width: "100%",
    height: "80%",
    flexDirection: "column"
  },
  contentFirstRow: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  contentSecondRow: {
    justifyContent: "space-between",
    flex: 0.6,
    width: "100%",
    alignItems: "center",
    flexDirection: "row"
  },

  contentThirdRow: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },

  btnTopCenter: {
    width: 150,
    height: 100
  },
  btnLeftMiddle: {
    width: 150,
    height: 100
  },
  btnRightMiddle: {
    width: 150,
    height: 100
  },
  btnBottomCenter: {
    width: 150,
    height: 100
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.deviceApnsReducer;
  return { loading, error, internationals: payLoad };
};

const mapDispatchToProps = {
  reqDeviceApns
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeMainView);
