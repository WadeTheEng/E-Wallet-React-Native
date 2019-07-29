import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { connect } from "react-redux";
import RF from "react-native-responsive-fontsize";
import { NavigationActions } from "react-navigation";
import PageControl from "react-native-page-control";
import GradientView from "../../../components/gradientView/GradientView";
import NavHeader from "../../../components/navHeader/NavHeader";
import KralissInput from "../../../components/kralissInput/KralissInput";
import KralissButton from "../../../components/kralissButton/KralissButton";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import { reqPatchMyUsers } from "../../../reducers/patchMyUsers";
import Loader from "../../../components/loader/Loader";
import {
  SecondaryColor,
  PageControlGrayColor
} from "../../../assets/styles/Styles";
//Add i18n
import i18n from "../../../locale/i18n";

export default class TunnelPersonalInfoView extends Component {
  state = {
    IBAN: ""
  };

  onPressFollowing = () => {
    saveLocalData("kraIban", this.state.IBAN);
    this.sendPatchRequest();
  };

  async sendPatchRequest() {
    let _reqdata = {};

    const myuserIsBusiness = await loadLocalData("myuserIsBusiness");

    //common data
    const firstName = await loadLocalData("firstName");
    _reqdata["first_name"] = firstName;
    const lastName = await loadLocalData("lastName");
    _reqdata["last_name"] = lastName;
    const email = await loadLocalData("email");
    _reqdata["email"] = email; //email;//hard coding for test
    const myuserNationality = await loadLocalData("myuserNationality");
    _reqdata["myuser_nationality"] = myuserNationality;
    if (myuserIsBusiness === true) {
      _reqdata["myuser_birth_city"] = "";
      _reqdata["myuser_residence_city"] = "";
    }

    const idInternationalPhone = await loadLocalData("idInternationalPhone");
    _reqdata["id_international_phone"] = idInternationalPhone;
    const myuserPhoneNumber = await loadLocalData("myuserPhoneNumber");
    _reqdata["myuser_phone_number"] = myuserPhoneNumber;
    const idInternationalMobilePhone = await loadLocalData(
      "idInternationalMobilePhone"
    );
    _reqdata["id_international_mobile_phone"] = idInternationalMobilePhone;
    const myuserMobilePhoneNumber = await loadLocalData(
      "myuserMobilePhoneNumber"
    );
    _reqdata["myuser_mobile_phone_number"] = myuserMobilePhoneNumber;

    _reqdata["myuser_is_business"] = myuserIsBusiness;

    const address = await loadLocalData("address");

    const idInternational = await loadLocalData("idInternational");
    _reqdata["id_international"] = idInternational;

    const myuserBirthDate = await loadLocalData("myuserBirthdate");
    _reqdata["myuser_birthdate"] = myuserBirthDate;

    if (myuserIsBusiness === true) {
      // company info
      let _companyInfo = {};
      const companyName = await loadLocalData("companyName");
      _companyInfo["company_name"] = companyName;
      const identificationNumber = await loadLocalData("identificationNumber");
      _companyInfo["identification_number"] = identificationNumber;
      const activityField = await loadLocalData("activityField");
      _companyInfo["activity_field"] = activityField;
      const functionInSociety = await loadLocalData("functionInSociety");
      _companyInfo["function_in_society"] = functionInSociety;
      const companyPhoneNumber = await loadLocalData("companyPhoneNumber");
      _companyInfo["company_phone_number"] = companyPhoneNumber;
      const idCompanyInternational = await loadLocalData(
        "idCompanyInternational"
      );
      _companyInfo["id_company_international"] = idCompanyInternational;

      _companyInfo["address"] = address;
      _reqdata["company"] = _companyInfo;
    } else {
      _reqdata["address"] = address;
      //address
    }
    _reqdata["kra_iban"] = this.state.IBAN;
    console.log(_reqdata);
    this.props.reqPatchMyUsers(_reqdata);
  }

  onPressPageIndicator = index => {};
  onPressPass = () => {
    this.sendPatchRequest();
  };

  onAddressSelected = place => {
    this.setState({ addressText: place.address });
  };

  componentDidUpdate = (prevProps, prevState) => {
    //console.log(this.props.payLoad);
    if (this.props.payLoad !== undefined) {
      const { id } = this.props.payLoad;
      if (id !== undefined) {
        const navigateAction = NavigationActions.navigate({
          routeName: "ConfirmSuccessView",
          params: {
            title: i18n.t("tunnel.patchSuccessTitle"),
            descMessage: i18n.t("tunnel.patchSuccessDesc"),
            route: "Main"
          }
        });
        this.props.navigation.dispatch(navigateAction);
      }
    }

    if (this.props.error) {
      this.props.navigation.navigate("ErrorView", {
        errorText: this.props.error
      });
      /*const navigateAction = NavigationActions.navigate({
        routeName: "ConfirmSuccessView",
        params: {
          title: i18n.t("tunnel.patchSuccessTitle"),
          descMessage: i18n.t("tunnel.patchSuccessDesc"),
          route: "Main"
        }
      });
      this.props.navigation.dispatch(navigateAction);*/
    }
  };

  onChangeInputText = (id, value) => {
    var _stateObj = {};
    _stateObj[id] = value;
    this.setState(_stateObj);
  };

  render() {
    const params = this.props.navigation.state;
    const bEnterprise = false; //params.params.enterprise;
    let buttonEnable = true;
    if (this.state.IBAN.length === 0) buttonEnable = false;
    return (
      <GradientView style={styles.container}>
        <NavHeader
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <View style={styles.header}>
          <Text style={styles.headerText}>{i18n.t("tunnel.personalInfo")}</Text>
        </View>

        <View style={styles.center}>
          <KralissInput
            ID="IBAN"
            placeHolder={i18n.t("tunnel.IBAN")}
            onChangeText={this.onChangeInputText}
            value={this.state.IBAN}
          />
          <Text style={styles.skipDescText}>
            {i18n.t("tunnel.skipStepDesc")}
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.textBtn} onPress={this.onPressPass}>
            <Text style={styles.passBtnText}>{i18n.t("tunnel.pass")}</Text>
          </TouchableOpacity>
          <PageControl
            style={styles.pageIndicator}
            numberOfPages={bEnterprise ? 4 : 3}
            currentPage={bEnterprise ? 3 : 2}
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
  center: {
    flex: 1,
    justifyContent: "flex-start"
  },
  footer: {
    flexDirection: "column",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  pageIndicator: {
    flex: 1,
    marginTop: 20
  },
  skipDescText: {
    marginTop: 30,
    color: "#8fff",
    fontSize: RF(2.1)
  },
  sendBtn: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20
  },
  textBtn: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  passBtnText: {
    color: "#fff",
    fontSize: RF(2.2),
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.patchInterReducer;
  return {
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqPatchMyUsers
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(TunnelPersonalInfoView);
