import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import RF from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissListCell from "../../../components/kralissListCell/KralissListCell";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";

export default class PersonalInfoView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { type, myuserIsBusiness } = params.params;
    let navTitle = i18n.t("settings.personalInfo");
    if (type === "COMP_INFO") {
      navTitle = i18n.t("personalInfo.companyInfo");
    } else if (type === "LEGAL_INFO") {
      navTitle = i18n.t("personalInfo.legalInfo");
    }
    this.state = {
      accountNumber: "",
      lastName: "",
      firstName: "",
      country: "",
      birthDate: "",
      interPhoneNum: "",
      myPhoneNum: "",
      interMobileNum: "",
      myMobileNum: "",
      address: "",
      IBAN: "",
      navTitle,
      type,
      myuserIsBusiness
    };
  }

  onPressIBAN = () => {
    this.props.navigation.navigate("IBANInput");
  };

  componentDidMount = async () => {
    let accountNumber = await loadLocalData("kraAccountNumber");
    if (accountNumber === null) accountNumber = "";

    const lastName = await loadLocalData("lastName");
    const firstName = await loadLocalData("firstName");

    const userInternational = await loadLocalData("myuserInternational"); //
    const country = userInternational["international_name"];

    const birthDate = await loadLocalData("myuserBirthdate"); //myuser_birthdate

    const interPhone = await loadLocalData("myuserInternationalPhone"); //
    const interPhoneNum = interPhone["international_phone"];
    const myPhoneNum = await loadLocalData("myuserPhoneNumber"); //myuser_phone_number

    const interMobile = await loadLocalData("myuserInternationalMobilePhone"); //
    const interMobileNum = interMobile["international_phone"];
    const myMobileNum = await loadLocalData("myuserMobilePhoneNumber"); //myuser_mobile_phone_number

    const address = await loadLocalData("formattedAddress"); //formatted address​

    const IBAN = await loadLocalData("kraIban");

    if (this.state.myuserIsBusiness) {
      const companyName = await loadLocalData("companyName");
      const identificationNumber = await loadLocalData("identificationNumber");
      const activityField = await loadLocalData("activityField");
      const companyPhoneNumber = await loadLocalData("companyPhoneNumber");
      const companyInternational = await loadLocalData("companyInternational");
      const functionInSociety = await loadLocalData("functionInSociety");
      this.setState({
        accountNumber,
        lastName,
        firstName,
        country,
        birthDate,
        interPhoneNum,
        myPhoneNum,
        interMobileNum,
        myMobileNum,
        address,
        IBAN,
        companyName,
        identificationNumber,
        activityField,
        companyPhoneNumber,
        companyInternational,
        functionInSociety
      });
    } else
      this.setState({
        accountNumber,
        lastName,
        firstName,
        country,
        birthDate,
        interPhoneNum,
        myPhoneNum,
        interMobileNum,
        myMobileNum,
        address,
        IBAN
      });
  };

  render() {
    const {
      type,
      accountNumber,
      lastName,
      firstName,
      country,
      birthDate,
      interPhoneNum,
      myPhoneNum,
      interMobileNum,
      myMobileNum,
      address,
      IBAN,
      companyName,
      identificationNumber,
      activityField,
      companyPhoneNumber,
      companyInternational,
      functionInSociety,
      navTitle
    } = this.state;

    return (
      <View style={styles.container}>
        <WhiteNavHeader
          title={navTitle}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <ScrollView>
          <KralissListCell
            style={styles.marginCell}
            mainTitle={i18n.t("settings.accountNumber")}
            detailContent={accountNumber}
          />
          {type === "COMP_INFO" && (
            <View>
              <KralissListCell
                mainTitle={i18n.t("personalInfo.companyName")}
                detailContent={companyName}
                noTopPadding={true}
              />
              <KralissListCell
                mainTitle={i18n.t("personalInfo.numberSIRET")}
                detailContent={identificationNumber}
                noTopPadding={true}
              />
              <KralissListCell
                mainTitle={i18n.t("personalInfo.fieldOfActivity")}
                detailContent={activityField}
                noTopPadding={true}
              />
            </View>
          )}

          {type !== "COMP_INFO" && (
            <View>
              <KralissListCell
                style={styles.marginCell}
                mainTitle={i18n.t("tunnel.lastName")}
                detailContent={lastName}
              />
              <KralissListCell
                mainTitle={i18n.t("tunnel.firstName")}
                detailContent={firstName}
                noTopPadding={true}
              />
            </View>
          )}

          <KralissListCell
            mainTitle={i18n.t("tunnel.country")}
            detailContent={country}
            noTopPadding={true}
          />

          {type !== "COMP_INFO" && (
            <KralissListCell
              mainTitle={i18n.t("tunnel.birthday")}
              detailContent={birthDate}
              noTopPadding={true}
            />
          )}

          {type === "LEGAL_INFO" && (
            <KralissListCell
              mainTitle={i18n.t("personalInfo.companyFixedTelephone")}
              detailContent={functionInSociety}
              noTopPadding={true}
            />
          )}

          {type === "COMP_INFO" && (
            <KralissListCell
              mainTitle={i18n.t("personalInfo.companyFixedTelephone")}
              detailContent={`${companyInternational} ${companyPhoneNumber}`}
              noTopPadding={true}
            />
          )}
          {type !== "COMP_INFO" && (
            <View>
              <KralissListCell
                mainTitle={i18n.t("personalInfo.fixedTelephone")}
                detailContent={`${interPhoneNum} ${myPhoneNum}`}
                noTopPadding={true}
              />
              <KralissListCell
                mainTitle={i18n.t("personalInfo.mobileNumber")}
                detailContent={`${interMobileNum} ${myMobileNum}`}
                noTopPadding={true}
              />
            </View>
          )}
          {type !== "LEGAL_INFO" && (
            <View>
              <KralissListCell
                mainTitle={i18n.t("tunnel.address")}
                detailContent={address}
                noTopPadding={true}
              />
              <KralissListCell
                style={styles.marginCell}
                mainTitle={i18n.t("tunnel.IBAN")}
                subTitle={
                  this.state.IBAN === ""
                    ? i18n.t("personalInfo.notSpecified")
                    : IBAN
                }
                onSelect={this.onPressIBAN}
                hasClosure={true}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1
  },
  marginCell: {
    marginTop: 12
  },
  marginSection: {
    marginTop: 20
  }
});
