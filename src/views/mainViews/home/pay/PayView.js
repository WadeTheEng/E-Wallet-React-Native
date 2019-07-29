import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import RF from "react-native-responsive-fontsize";
import { connect } from "react-redux";

import Loader from "../../../../components/loader/Loader";
import i18n from "../../../../locale/i18n";
import {
  reqQRCodesInit,
  reqUseQRCode,
  reqDeleteQRCodes
} from "../../../../reducers/qrCodes";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import { getDeviceInformations } from "../../../../utils/deviceInfo";

export default class PayView extends Component {
  onSuccess = e => {
    let scanValue = e.data.replace(/\'/g, '"');
    const qrData = JSON.parse(scanValue);
    if (qrData !== null) {
      const qrId = qrData.qr_id;
      const qrAmount = parseFloat(qrData.amount) * this.state.myConversionRate;
      const qrValidCode = qrData.validation_code;
      this.setState(
        {
          qrId,
          qrAmount,
          qrValidCode
        },
        this.showConfirmAlert
      );
    }
  };

  showConfirmAlert = () => {
    const { qrAmount, myUnit } = this.state;
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        i18n.t("pay.confirmRequest", {
          qrAmount: qrAmount.toFixed(2),
          myUnit
        }),
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {
              this.deleteQRCodeRequest();
            }
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.useQRCodeReques();
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  useQRCodeReques = () => {
    const { qrId, qrAmount, qrValidCode } = this.state;
    this.props.reqUseQRCode({
      qr_code_id: qrId,
      secret_code: qrValidCode,
      mobile_infos: this.state.mobileInfos
    });
  };

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

  gotoPayConfirm = statusData => {
    this.props.navigation.navigate("PayConfirm", { data: statusData });
  };

  deleteQRCodeRequest = () => {
    this.props.reqDeleteQRCodes(this.state.qrId);
  };

  componentDidMount = async () => {
    try {
      const value = await getDeviceInformations(navigator.geolocation);
      saveLocalData("mobileInfos", value);
      const myuserInternational = await loadLocalData("myuserInternational");
      this.setState({
        mobileInfos: value,
        myUnit: myuserInternational["international_devise_iso_code"],
        myConversionRate: myuserInternational["international_conversion_rate"]
      });
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  };

  componentDidUpdate() {
    const { error, payLoad } = this.props;
    if (error !== undefined) {
      this.props.reqQRCodesInit();
      const { message, error_code } = error;
      let errorTitle = i18n.t("sendMoney.insuffBalance");
      let errorMsg = i18n.t("sendMoney.insuffMsg");
      if (error_code !== undefined) {
        if (error_code === "2") {
          errorTitle = i18n.t("sendMoney.monthThrsholdErrTitle");
          errorMsg = i18n.t("sendMoney.monthThrsholdMsg");
        }
        if (error_code === "3") {
          errorTitle = i18n.t("sendMoney.recipErrorTitle");
          errorMsg = i18n.t("sendMoney.recipErrorMsg");
        }
      }
      this.showErrorAlert(errorTitle, errorMsg);
      /*this.gotoPayConfirm({
        converted_amount: "2.30",
        devise_iso_code: "USD",
        kraliss_amount: "2.00",
        datetime: "2018-10-18T22:18:15.216032Z",
        receiver_name: "Valerie Venirazer",
        receiver_account_number: "1211-1211-5671-6848",
        transaction_number: "11211141214114251315"
      });*/
    }

    if (payLoad !== undefined && payLoad.transfer_informations !== null) {
      this.props.reqQRCodesInit();
      this.props.navigation.navigate("PayConfirm");
      this.gotoPayConfirm(payLoad.transfer_informations);
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <QRCodeScanner
          style={styles.fullScreen}
          onRead={this.onSuccess}
          cameraStyle={{ width: "100%", height: "100%" }}
          topViewStyle={styles.zeroContent}
          bottomViewStyle={styles.zeroContent}
        />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => this.props.navigation.goBack()}
          /*this.onSuccess({
              data:
                "{'qr_id': '8','amount': '2','validation_code': '0ecb65b407c4db7c577af8a231fd38dbb814dc75308797d3c33f31ca137419e4'}"
            })
          }*/
        >
          <Image source={require("../../../../assets/images/cross_grey.png")} />
        </TouchableOpacity>
        <Text style={styles.bottomText} numberOfLines={2}>
          {i18n.t("pay.scanDesc")}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, alignItems: "center" },
  fullScreen: { width: "100%", height: "100%" },
  zeroContent: {
    height: 0,
    flex: 0
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: 40
  },
  bottomText: {
    color: "#fff",
    fontSize: RF(2.0),
    textAlign: "center",
    position: "absolute",
    bottom: 20
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.useQRCodeReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqQRCodesInit,
  reqUseQRCode,
  reqDeleteQRCodes
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(PayView);
