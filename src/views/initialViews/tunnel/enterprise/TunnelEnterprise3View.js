import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import React, { Component } from "react";
import RF from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import PageControl from "react-native-page-control";
import Moment from "moment";
import GradientView from "../../../../components/gradientView/GradientView";
import NavHeader from "../../../../components/navHeader/NavHeader";
import KralissPicker from "../../../../components/kralissPicker/KralissPicker";
import KralissInput from "../../../../components/kralissInput/KralissInput";
import KralissButton from "../../../../components/kralissButton/KralissButton";
import { loadLocalData, saveLocalData } from "../../../../utils/localStorage";
import KralissDatePicker from "../../../../components/kralissPicker/KralissDatePicker";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../../locale/i18n";

export default class TunnelEnterprise3View extends Component {
  state = {
    lastName: "",
    firstName: "",
    myuserBirthdate: new Date(),
    myuserNationality: "", //international_iso_code
    myuserNationalityIndex: 0,
    functionInSociety: "",
    idInternationalPhone: "",
    idInternationalPhoneIndex: 0,
    myuserPhoneNumber: "",
    idInternationalMobilePhone: "", //international_iso_code
    idInternationalMobilePhoneIndex: 0,
    myuserMobilePhoneNumber: "",

    internationalPhonesNum: [],
    countries: [],
    internationals: []
  };

  onPressFollowing = () => {
    saveLocalData("firstName", this.state.firstName);
    saveLocalData("lastName", this.state.lastName);
    saveLocalData(
      "myuserNationality",
      this.state.internationals[this.state.myuserNationalityIndex]
        .international_iso_code
    );
    const _birthDay = Moment(this.state.myuserBirthdate).format("YYYY-MM-DD");
    saveLocalData("myuserBirthdate", _birthDay);
    saveLocalData("functionInSociety", this.state.functionInSociety);

    saveLocalData(
      "idInternationalPhone",
      this.state.internationals[this.state.idInternationalPhoneIndex].id
    );
    saveLocalData("myuserPhoneNumber", this.state.myuserPhoneNumber);
    saveLocalData(
      "myuserInternationalPhone",
      this.state.internationals[this.state.idInternationalPhoneIndex]
    );

    saveLocalData(
      "idInternationalMobilePhone",
      this.state.internationals[this.state.idInternationalMobilePhoneIndex].id
    );
    saveLocalData(
      "myuserMobilePhoneNumber",
      this.state.myuserMobilePhoneNumber
    );
    saveLocalData(
      "myuserInternationalMobilePhone",
      this.state.internationals[this.state.idInternationalMobilePhoneIndex]
    );

    const navigateAction = NavigationActions.navigate({
      routeName: "TunnelPersonalInfoView",
      params: { enterprise: true }
    });
    this.props.navigation.dispatch(navigateAction);
  };

  onPressPageIndicator = index => {};

  async componentDidMount() {
    const internationalPhonesNum = await loadLocalData("internationalPhones");
    this.setState({ internationalPhonesNum });
    const countries = await loadLocalData("countries");
    this.setState({ countries });
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
      this.state.lastName.length === 0 ||
      this.state.firstName.length === 0 ||
      this.state.myuserNationality.length === 0 ||
      this.state.functionInSociety.length === 0
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
                {i18n.t("tunnel.legalRepresntative")}
              </Text>
            </View>

            <View style={styles.center}>
              <KralissInput
                ID="lastName"
                placeHolder={i18n.t("tunnel.lastName")}
                onChangeText={this.onChangeInputText}
                value={this.state.lastName}
              />
              <KralissInput
                ID="firstName"
                placeHolder={i18n.t("tunnel.firstName")}
                onChangeText={this.onChangeInputText}
                value={this.state.firstName}
              />
              <KralissDatePicker
                placeHolder={i18n.t("tunnel.birthday")}
                value={this.state.myuserBirthdate}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                onSelect={myuserBirthdate => {
                  this.setState({ myuserBirthdate });
                }}
              />
              <KralissPicker
                placeHolder={i18n.t("tunnel.nationality")}
                confirmBtnTitle={i18n.t("tunnel.done")}
                cancelBtnTitle={i18n.t("tunnel.cancel")}
                pickerData={this.state.countries}
                value={this.state.myuserNationality}
                onSelect={(myuserNationality, myuserNationalityIndex) => {
                  this.setState({ myuserNationality, myuserNationalityIndex });
                }}
              />
              <KralissInput
                ID="functionInSociety"
                placeHolder={i18n.t("tunnel.positionInComp")}
                onChangeText={this.onChangeInputText}
                value={this.state.functionInSociety}
              />
              <Text style={styles.phoneSectionText}>
                {i18n.t("tunnel.phoneNumberFix")}
              </Text>
              <View style={styles.phoneSection}>
                <KralissPicker
                  style={styles.phoneNum1}
                  prefixString="+"
                  placeHolder={i18n.t("tunnel.phoneNumEx1")}
                  confirmBtnTitle={i18n.t("tunnel.done")}
                  cancelBtnTitle={i18n.t("tunnel.cancel")}
                  pickerData={this.state.internationalPhonesNum}
                  value={this.state.idInternationalPhone}
                  onSelect={(idInternationalPhone, idInternationalPhoneIndex) =>
                    this.setState({
                      idInternationalPhone,
                      idInternationalPhoneIndex
                    })
                  }
                />
                <KralissInput
                  ID="myuserPhoneNumber"
                  style={styles.phoneNum2}
                  placeHolder={i18n.t("tunnel.phoneNumEx2")}
                  onChangeText={this.onChangeInputText}
                  keyboardType={"numeric"}
                  value={this.state.myuserPhoneNumber}
                />
              </View>
              <Text style={styles.phoneSectionText}>
                {i18n.t("tunnel.phoneNumbermobile")}
              </Text>
              <View style={styles.phoneSection}>
                <KralissPicker
                  style={styles.phoneNum1}
                  prefixString="+"
                  placeHolder={i18n.t("tunnel.phoneNumEx1")}
                  confirmBtnTitle={i18n.t("tunnel.done")}
                  cancelBtnTitle={i18n.t("tunnel.cancel")}
                  pickerData={this.state.internationalPhonesNum}
                  value={this.state.idInternationalMobilePhone}
                  onSelect={(
                    idInternationalMobilePhone,
                    idInternationalMobilePhoneIndex
                  ) =>
                    this.setState({
                      idInternationalMobilePhone,
                      idInternationalMobilePhoneIndex
                    })
                  }
                />
                <KralissInput
                  ID="myuserMobilePhoneNumber"
                  style={styles.phoneNum2}
                  placeHolder={i18n.t("tunnel.phoneNumEx2")}
                  onChangeText={this.onChangeInputText}
                  keyboardType={"numeric"}
                  value={this.state.myuserMobilePhoneNumber}
                />
              </View>
              <PageControl
                style={styles.pageIndicator}
                numberOfPages={4}
                currentPage={2}
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
