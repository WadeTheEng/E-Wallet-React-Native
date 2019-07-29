import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  ScrollView
} from "react-native";
import React, { Component } from "react";
import RF from "react-native-responsive-fontsize";
import PageControl from "react-native-page-control";
import GradientView from "../../../../components/gradientView/GradientView";
import NavHeader from "../../../../components/navHeader/NavHeader";
import KralissPicker from "../../../../components/kralissPicker/KralissPicker";
import KralissInput from "../../../../components/kralissInput/KralissInput";
import KralissAddressInput from "../../../../components/kralissInput/KralissAddressInput";
import KralissButton from "../../../../components/kralissButton/KralissButton";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../../locale/i18n";

export default class TunnelEnterprise2View extends Component {
  state = {
    companyName: "",
    identificationNumber: "",
    activityField: "",
    addressText: "",
    addressGPlaceValue: undefined,
    idCompanyInternational: 0,
    internationalPhone: "",
    companyPhoneNumber: "",
    internationalPhonesNum: [],
    internationals: []
  };

  onPressFollowing = () => {
    saveLocalData("companyName", this.state.companyName);
    saveLocalData("identificationNumber", this.state.identificationNumber);
    saveLocalData("activityField", this.state.activityField);
    saveLocalData("address", this.state.addressGPlaceValue);
    saveLocalData("formattedAddress", this.state.addressText);
    saveLocalData(
      "idCompanyInternational",
      this.state.internationals[this.state.idCompanyInternational].id
    );
    saveLocalData("companyPhoneNumber", this.state.companyPhoneNumber);
    this.props.navigation.navigate("TunnelEnterprise3View");
  };

  onPressPageIndicator = index => {};

  onAddressSelected = place => {
    this.setState({
      addressText: place.formatted_address,
      addressGPlaceValue: place
    });
  };

  async componentDidMount() {
    const internationalPhonesNum = await loadLocalData("internationalPhones");
    this.setState({ internationalPhonesNum });
    const internationals = await loadLocalData("internationals");
    this.setState({ internationals });
  }

  componentDidUpdate = (prevProps, prevState) => {};

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  render() {
    let buttonEnable = true;
    if (
      this.state.companyName.length === 0 ||
      this.state.identificationNumber.length === 0 ||
      this.state.activityField.length === 0 ||
      this.state.addressText.length === 0
    )
      buttonEnable = false;
    return (
      <GradientView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <ScrollView>
            <NavHeader
              onBack={() => {
                this.props.navigation.goBack();
              }}
            />
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {i18n.t("tunnel.companyInfo")}
              </Text>
            </View>

            <View style={styles.center}>
              <KralissInput
                ID="companyName"
                placeHolder={i18n.t("tunnel.companyName")}
                onChangeText={this.onChangeInputText}
                value={this.state.company_name}
              />
              <KralissInput
                ID="identificationNumber"
                placeHolder={i18n.t("tunnel.numberSiret")}
                onChangeText={this.onChangeInputText}
                value={this.state.identification_number}
              />
              <KralissPicker
                placeHolder={i18n.t("tunnel.fieldActivity")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={i18n.t("tunnel.activityFields")}
                value={this.state.activityField}
                onSelect={(activityField, index) => {
                  this.setState({ activityField });
                }}
              />
              <KralissAddressInput
                placeHolder={i18n.t("tunnel.address")}
                onAddressSelected={this.onAddressSelected}
                value={this.state.addressText}
              />
              <Text style={styles.phoneSectionText}>
                {i18n.t("tunnel.phoneNumber")}
              </Text>
              <View style={styles.phoneSection}>
                <KralissPicker
                  style={styles.phoneNum1}
                  prefixString="+"
                  placeHolder={i18n.t("tunnel.phoneNumEx1")}
                  confirmBtnTitle={i18n.t("tunnel.done")}
                  cancelBtnTitle={i18n.t("tunnel.cancel")}
                  pickerData={this.state.internationalPhonesNum}
                  value={this.state.internationalPhone}
                  onSelect={(internationalPhone, idCompanyInternational) =>
                    this.setState({
                      internationalPhone,
                      idCompanyInternational
                    })
                  }
                />
                <KralissInput
                  ID="companyPhoneNumber"
                  style={styles.phoneNum2}
                  placeHolder={i18n.t("tunnel.phoneNumEx2")}
                  onChangeText={this.onChangeInputText}
                  keyboardType={"numeric"}
                  value={this.state.companyPhoneNumber}
                />
              </View>
              <PageControl
                style={styles.pageIndicator}
                numberOfPages={4}
                currentPage={1}
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
                title={i18n.t("tunnel.following")}
                enabled={buttonEnable}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientView>
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
    fontSize: RF(2.3),
    textAlign: "center"
  },
  phoneSectionText: {
    marginTop: 30,
    color: "#fff",
    fontSize: RF(2.3),
    textAlign: "left"
  },
  center: {
    flex: 1,
    justifyContent: "flex-start"
  },
  pageIndicator: {
    flex: 1,
    marginTop: 50
  },
  phoneSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  phoneNum1: {
    flex: 0.3
  },
  phoneNum2: { flex: 0.7, marginLeft: 10 },
  sendBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
  }
});
