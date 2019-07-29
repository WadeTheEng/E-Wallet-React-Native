import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Text,
  Alert
} from "react-native";
import { connect } from "react-redux";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import KralissButton from "../../../components/kralissButton/KralissButton";
import KralissCircleButton from "../../../components/kralissCircleButton/KralissCircleButton";
import RF from "react-native-responsive-fontsize";
import { reqRechargeInit, reqRecharges } from "../../../reducers/recharges";
import { getDeviceInformations } from "../../../utils/deviceInfo";
import Loader from "../../../components/loader/Loader";

export default class CreditAccountView extends Component {
  state = {
    nSelected: -1,
    recharges: [],
    unit: "",
    conversionRate: 0,
    rechargesOrignial: [],
    isLoading: false
  };
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      const value = await getDeviceInformations(navigator.geolocation);
      saveLocalData("mobileInfos", value);
      const myuserInternational = await loadLocalData("myuserInternational");
      this.setState({
        unit: myuserInternational["international_devise_iso_code"],
        conversionRate: myuserInternational["international_conversion_rate"]
      });
      this.setState({ isLoading: false });
      //console.log(myuserInternational);
    } catch (error) {
      this.showErrorAlert("Error occured!", error.message);
    }
    this.props.reqRecharges();
  }

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

  componentDidUpdate() {
    const { error, payLoad, refillsFailed } = this.props;
    if (error !== undefined && error.length > 0) {
      //show error
      this.showErrorAlert("Error", this.error);
    }

    if (payLoad !== undefined && payLoad.length > 0) {
      let cntItems = payLoad.length;
      let nRows = Math.floor(cntItems / 3);
      let recharges = new Array();

      for (let i = 0; i < nRows; i++) {
        let colsMap = new Array();
        for (let j = 0; j < 3; j++) {
          const index = i * 3 + j;
          colsMap.push({ key: index, value: payLoad[index] });
        }
        recharges.push({ key: i, items: colsMap });
      }

      let nRestItems = cntItems % 3;
      if (nRestItems > 0) {
        let colsMap = new Array();
        for (let j = 0; j < nRestItems; j++) {
          const index = nRows * 3 + j;
          colsMap.push({ key: nRows * 3 + j, value: payLoad[index] });
        }
        recharges.push({ key: nRows, items: colsMap });
      }
      const rechargesOrignial = payLoad;
      this.setState({ recharges, rechargesOrignial });
      this.props.reqRechargeInit();
    }

    if (refillsFailed) {
      this.props.reqRechargeInit();
      this.showErrorAlert(
        i18n.t("creditMyAccount.reachedMonthlyThresholds"),
        i18n.t("creditMyAccount.cantPeformTrans")
      );
    }
  }
  onSelectRecharge = nSelected => {
    this.setState({ nSelected });
  };
  onPressValidate = () => {
    const value = this.state.rechargesOrignial[this.state.nSelected];
    const amount = parseFloat(value.recharge_amount);
    const commission = parseFloat(value.recharge_commission);

    this.props.navigation.navigate("CreditSummary", {
      amount: amount,
      commission: commission,
      conversionRate: this.state.conversionRate,
      unit: this.state.unit
    });
  };

  render() {
    let buttonEnable = this.state.nSelected !== -1 ? true : false;

    return (
      <View style={styles.rootContainer}>
        <Loader
          loading={this.state.isLoading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader title={i18n.t("creditMyAccount.creditMyAccount")} />
        <View style={styles.container}>
          <View
            style={{
              width: "100%",
              flex: 5
            }}
          >
            <ScrollView>
              <Text style={styles.subTitle}>
                {i18n.t("creditMyAccount.accountRecharge")}
              </Text>
              <Text style={styles.subDesc}>
                {i18n.t("creditMyAccount.mainDesc")}
              </Text>
              {this.state.recharges.map(row => {
                const { key, items } = row;
                return (
                  <View
                    key={key}
                    style={{
                      height: Dimensions.get("window").width * 0.28,
                      width: "100%",
                      marginTop: 20,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center"
                    }}
                  >
                    {items.map(({ key, value }) => {
                      const amount =
                        parseFloat(value.recharge_amount) *
                        this.state.conversionRate;
                      return (
                        <KralissCircleButton
                          key={key}
                          isSelected={
                            key === this.state.nSelected ? true : false
                          }
                          style={{
                            height: Dimensions.get("window").width * 0.28,
                            width: Dimensions.get("window").width * 0.28
                          }}
                          borderRadius={Math.round(
                            Dimensions.get("window").width * 0.15
                          )}
                          amount={amount.toFixed(2)}
                          unit={this.state.unit}
                          onSelect={() => this.onSelectRecharge(key)}
                        />
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={{ flex: 1, justifyContent: "center" }}>
            <KralissButton
              style={styles.validateBtn}
              onPress={this.onPressValidate}
              title={i18n.t("login.validateButton")}
              enabled={buttonEnable}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: { flexDirection: "column", flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  validateBtn: {
    width: "100%",
    height: 55
  },
  subTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginTop: 10
  },
  subDesc: {
    color: "#484848",
    fontSize: RF(2.0),
    marginTop: 10
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error, refillsFailed } = state.rechargesReducer;
  //console.log(payLoad);
  return {
    payLoad,
    loading,
    error,
    refillsFailed
  };
};

const mapDispatchToProps = {
  reqRecharges,
  reqRechargeInit
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditAccountView);
