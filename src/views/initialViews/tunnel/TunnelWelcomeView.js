import { StyleSheet, View, Text, KeyboardAvoidingView } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import RF from "react-native-responsive-fontsize";
import PageControl from "react-native-page-control";
import GradientView from "../../../components/gradientView/GradientView";
import NavHeader from "../../../components/navHeader/NavHeader";
import KralissPicker from "../../../components/kralissPicker/KralissPicker";
import KralissButton from "../../../components/kralissButton/KralissButton";
import { reqInternationals } from "../../../reducers/internationals";
import Loader from "../../../components/loader/Loader";
import { saveLocalData } from "../../../utils/localStorage";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../locale/i18n";

class TunnelWelcomeView extends Component {
  state = {
    countryIndex: 0,
    country: "",
    userMode: "",
    userModeIndex: 0,
    countries: []
  };

  onPressFollowing = () => {
    saveLocalData(
      "idInternational",
      this.props.internationals[this.state.countryIndex].id
    );
    saveLocalData(
      "myuserInternational",
      this.props.internationals[this.state.countryIndex]
    );

    if (this.state.userModeIndex === 1) {
      this.props.navigation.navigate("TunnelEnterprise2View");
      saveLocalData("myuserIsBusiness", true);
      saveLocalData(
        "myInternationalData",
        this.props.internationals[this.state.countryIndex]
      );
    } else {
      saveLocalData("myuserIsBusiness", false);
      this.props.navigation.navigate("TunnelParticular2View");
    }
  };

  onPressPageIndicator = index => {};

  componentDidMount() {
    this.props.reqInternationals();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.internationals.length > 0 &&
      this.state.countries.length === 0
    ) {
      //console.log(this.props.payload);
      let countries = this.props.internationals
        .map(item => item.international_name)
        .sort();

      this.setState({ countries });
      saveLocalData("internationals", this.props.internationals);

      const international_phones = this.props.internationals
        .map(item => item.international_phone)
        .sort(function(a, b) {
          return (
            a.length - b.length || a.localeCompare(b) // sort by length, if equal then
          ); // sort by dictionary order
        });
      saveLocalData("countries", countries);
      saveLocalData("internationalPhones", international_phones);
    }
    if (this.props.error) {
      this.props.navigation.navigate("ErrorView", {
        errorText: this.props.error
      }); //dispatch(navigateAction);
    }
  };

  render() {
    let buttonEnable = true;
    if (this.state.country.length === 0 || this.state.userMode.length === 0)
      buttonEnable = false;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <GradientView style={styles.container}>
          {/* <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          /> */}
          <NavHeader
            onBack={() => {
              this.props.navigation.goBack();
            }}
          />
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {i18n.t("tunnel.welcomeToKraliss")}
            </Text>
          </View>

          <View style={styles.center}>
            <KralissPicker
              placeHolder={i18n.t("tunnel.country")}
              confirmBtnTitle={i18n.t("tunnel.done")}
              cancelBtnTitle={i18n.t("tunnel.cancel")}
              pickerData={this.state.countries}
              value={this.state.country}
              onSelect={(country, countryIndex) => {
                this.setState({ country, countryIndex });
              }}
            />
            <KralissPicker
              placeHolder={i18n.t("tunnel.particularEnterprise")}
              confirmBtnTitle={i18n.t("tunnel.done")}
              cancelBtnTitle={i18n.t("tunnel.cancel")}
              pickerData={[
                i18n.t("tunnel.particular"),
                i18n.t("tunnel.enterprise")
              ]}
              value={this.state.userMode}
              onSelect={(userMode, userModeIndex) =>
                this.setState({ userMode, userModeIndex })
              }
            />
          </View>
          <View style={styles.footer}>
            <PageControl
              numberOfPages={3}
              currentPage={0}
              hidesForSinglePage
              pageIndicatorTintColor={PageControlGrayColor}
              currentPageIndicatorTintColor={SecondaryColor}
              indicatorStyle={{ borderRadius: 5 }}
              currentIndicatorStyle={{ borderRadius: 5 }}
              indicatorSize={{ width: 8, height: 8 }}
              onPageIndicatorPress={this.onPressPageIndicator}
            />
            <KralissButton
              style={styles.sendBtn}
              onPress={this.onPressFollowing}
              title={i18n.t("forgotPassword.validateButton")}
              enabled={buttonEnable}
            />
          </View>
        </GradientView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  header: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    color: "#fff",
    fontSize: RF(4.2),
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "flex-start"
  },
  footer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
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
)(TunnelWelcomeView);
