import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import { Item } from "native-base";
import RF from "react-native-responsive-fontsize";
import i18n from "../../../../locale/i18n";
import Loader from "../../../../components/loader/Loader";
import { reqRefundsInit, reqRefunds } from "../../../../reducers/refunds";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import KralissRectButton from "../../../../components/kralissButton/KralissRectButton";
import Moment from "moment";

export default class RefundIBANView extends Component {
  state = {
    IBAN: ""
  };

  onPressConfirm = async () => {
    saveLocalData("kraIban", this.state.IBAN);
    const mobileInfos = await loadLocalData("mobileInfos");
    const params = this.props.navigation.state;
    const { refundAmount, refundFee, myConversionRate } = params.params;

    this.props.reqRefunds({
      mobile_infos: mobileInfos,
      amount: refundAmount * myConversionRate,
      fee_amount: refundFee === 0 ? 0 : 18
    }); //fee : EUR = 0, other 18
  };

  onChangeInputText = value => {
    this.setState({ IBAN: value });
  };

  componentWillMount = async () => {
    const IBAN = await loadLocalData("kraIban");

    if (IBAN !== null) {
      this.setState({ IBAN });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { success, error } = this.props;
    if (success !== undefined && success.length > 0) {
      //Set IBAN value
      this.props.reqRefundsInit();
      this.props.navigation.navigate("RefundSuccess");
    }
    if (error !== undefined) {
      this.props.reqRefundsInit();
      const { next_refund_date } = error;
      if (next_refund_date !== undefined) {
        const dateTime = Moment(next_refund_date).format("DD MMMM YYYY");
        this.props.navigation.navigate("RefundError", {
          kind: 1,
          refundDate: dateTime
        });
      } else
        this.props.navigation.navigate("RefundError", {
          kind: 2,
          refundDate: ""
        });
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        "",
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

  render() {
    let buttonEnabled = true;
    if (this.state.IBAN.length === 0) buttonEnable = false;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <WhiteNavHeader
            title={i18n.t("refillLoader.confirmation")}
            onBack={() => {
              this.props.navigation.goBack();
            }}
            onCancel={() => this.props.navigation.navigate("Setting")}
          />
          <View style={styles.textContainer}>
            <Text style={styles.txtSectionTitle}>
              {i18n.t("refund.confirmIBAN")}
            </Text>

            <Item style={styles.item}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor="#cecece"
                placeholder={i18n.t("tunnel.IBAN")}
                value={this.state.IBAN}
                onChangeText={this.onChangeInputText}
              />
            </Item>

            <Text style={styles.skipDescText}>{i18n.t("refund.IBANDesc")}</Text>
          </View>
          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressConfirm}
            title={i18n.t("sendMoney.toConfirm")}
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
    justifyContent: "flex-end",
    backgroundColor: "#FFF"
  },
  marginCell: {
    marginTop: 12
  },
  textContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RF(2.0)
  },
  item: {
    marginTop: 30,
    borderBottomColor: "#cecece"
  },
  skipDescText: {
    marginTop: 30,
    color: "#484848",
    fontSize: RF(2.0)
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#000",
    fontSize: RF(2.2)
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { success, loading, error } = state.refundsReducer;

  return {
    success,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqRefundsInit,
  reqRefunds
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(RefundIBANView);
