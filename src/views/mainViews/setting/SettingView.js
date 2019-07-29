import React, { Component } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissListCell from "../../../components/kralissListCell/KralissListCell";
import KralissProfileCell from "../../../components/kralissListCell/KralissProfileCell";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";

export default class SettingView extends Component {
  state = {
    accountNumber: "",
    lastName: "",
    firstName: "",
    interPhoneNum: "",
    myPhoneNum: "",
    kraKycLevel: 0
  };

  onPressProfile = () => {
    if (this.state.myuserIsBusiness === true)
      this.props.navigation.navigate("PersonalInfo", {
        type: "COMP_INFO",
        myuserIsBusiness: this.state.myuserIsBusiness
      });
    else
      this.props.navigation.navigate("PersonalInfo", {
        type: "PERSON_INFO",
        myuserIsBusiness: this.state.myuserIsBusiness
      });
  };

  onPressCompanyProfile = () => {
    this.props.navigation.navigate("PersonalInfo", {
      type: "LEGAL_INFO",
      myuserIsBusiness: this.state.myuserIsBusiness
    });
  };

  onPressRefund = async () => {
    let kraIBAN = await loadLocalData("kraIban");
    if (kraIBAN === null) {
      this.props.navigation.navigate("RefundError", { kind: 2 });
    } else this.props.navigation.navigate("RefundEnter");
  };

  onPressMyAccount = () => {
    this.props.navigation.navigate("MyAccount");
  };

  onPressNotifications = () => {
    this.props.navigation.navigate("Notifications");
  };

  onPressInvoices = () => {
    this.props.navigation.navigate("Invoices");
  };

  onPressModifyPasswd = () => {
    this.props.navigation.navigate("ModifyPasswd");
  };

  onPressContacts = () => {
    this.props.navigation.navigate("Contacts");
  };

  onPressExchgRateCGU = () => {
    this.props.navigation.navigate("ExchangeRateCGU");
  };

  componentDidMount = async () => {
    let accountNumber = await loadLocalData("kraAccountNumber");
    const myuserIsBusiness = await loadLocalData("myuserIsBusiness");

    const lastName = await loadLocalData("lastName");
    const firstName = await loadLocalData("firstName");
    const email = await loadLocalData("email");

    const interPhone = await loadLocalData("myuserInternationalPhone"); //
    const interPhoneNum = interPhone["international_phone"];
    const myPhoneNum = await loadLocalData("myuserPhoneNumber"); //myuser_phone_number

    let kraKycLevel = await loadLocalData("kraKycLevel");
    if (kraKycLevel === null) kraKycLevel = 0;
    if (accountNumber === null) accountNumber = "";

    if (myuserIsBusiness === true) {
      const birthDate = await loadLocalData("myuserBirthdate");
      const userBusiness = await loadLocalData("myUserBusiness");
      const companyAddress = await loadLocalData("formattedAddress");
      const companyPhoneNumber = await loadLocalData("companyPhoneNumber");
      const companyInternational = await loadLocalData("companyInternational");
      this.setState({
        accountNumber,
        myuserIsBusiness,
        lastName,
        firstName,
        email,
        interPhoneNum,
        myPhoneNum,
        kraKycLevel,
        birthDate,
        userBusiness,
        companyAddress,
        companyPhoneNumber,
        companyInternational
      });
    } else
      this.setState({
        accountNumber,
        myuserIsBusiness,
        lastName,
        firstName,
        email,
        interPhoneNum,
        myPhoneNum,
        kraKycLevel
      });
  };

  render() {
    const { myuserIsBusiness, firstName, lastName, email } = this.state;
    let profSecondLine, profThirdLine;
    let companyFirstName, companySecLine, companyThirdLine;

    if (myuserIsBusiness) {
      const {
        birthDate,
        userBusiness,
        companyAddress,
        companyPhoneNumber,
        companyInternational
      } = this.state;
      profSecondLine = `${i18n.t("settings.bornOn")} ${birthDate}`;
      profThirdLine = email;
      companyFirstName = userBusiness;
      companySecLine = companyAddress;
      companyThirdLine = `+ ${companyInternational} ${companyPhoneNumber}`;
    } else {
      profSecondLine = email;
      profThirdLine = `+ ${this.state.interPhoneNum} ${this.state.myPhoneNum}`;
    }

    return (
      <View style={styles.container}>
        <WhiteNavHeader title={i18n.t("settings.settings")} />
        <ScrollView>
          <KralissListCell
            style={styles.marginCell}
            sectionTitle={i18n.t("settings.personalInfo")}
            mainTitle={i18n.t("settings.accountNumber")}
            detailContent={this.state.accountNumber}
            onSelect={() => {}}
          />

          <KralissProfileCell
            style={styles.marginCell}
            firstName={firstName}
            lastName={lastName}
            secondInfo={profSecondLine}
            thirdInfo={profThirdLine}
            onSelect={this.onPressProfile}
          />

          {myuserIsBusiness && (
            <KralissProfileCell
              style={styles.marginSection}
              sectionTitle={i18n.t("settings.companyInfo")}
              firstName={companyFirstName}
              lastName={companyFirstName.substring(1, 2)}
              secondInfo={companySecLine}
              thirdInfo={companyThirdLine}
              onSelect={this.onPressCompanyProfile}
            />
          )}

          <KralissListCell
            style={styles.marginSection}
            sectionTitle={i18n.t("settings.generalInfo")}
            mainTitle={i18n.t("settings.myAccount")}
            subTitle={
              this.state.kraKycLevel === 3
                ? i18n.t("settings.verifiedStatus")
                : i18n.t("settings.unverifiedStatus")
            }
            onSelect={this.onPressMyAccount}
            hasClosure={true}
          />

          <KralissListCell
            style={styles.marginCell}
            mainTitle={i18n.t("settings.notifications")}
            subTitle={i18n.t("settings.settingNotif")}
            hasClosure={true}
            onSelect={this.onPressNotifications}
          />
          <KralissListCell
            mainTitle={i18n.t("settings.myBills")}
            subTitle={i18n.t("settings.finishHistory")}
            hasClosure={true}
            onSelect={this.onPressInvoices}
          />

          <KralissListCell
            style={styles.marginCell}
            sectionTitle={i18n.t("settings.actions")}
            mainTitle={i18n.t("settings.refund")}
            subTitle={i18n.t("settings.removeMoney")}
            hasClosure={true}
            onSelect={this.onPressRefund}
          />
          <KralissListCell
            mainTitle={i18n.t("settings.changePasswd")}
            subTitle={i18n.t("settings.resettingPasswd")}
            hasClosure={true}
            onSelect={this.onPressModifyPasswd}
          />

          <KralissListCell
            style={styles.marginCell}
            mainTitle={i18n.t("settings.helpContact")}
            hasClosure={true}
            onSelect={this.onPressContacts}
          />

          <KralissListCell
            style={{ marginBottom: 20 }}
            mainTitle={i18n.t("settings.exchgrate")}
            hasClosure={true}
            onSelect={this.onPressExchgRateCGU}
          />
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
