import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Alert
} from "react-native";
import { connect } from "react-redux";

import Loader from "../../../components/loader/Loader";
import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import KralissRectButton from "../../../components/kralissButton/KralissRectButton";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import RF from "react-native-responsive-fontsize";
import RoundRectView from "../../../components/gradientView/RoundRectView";
import { reqContacts } from "../../../reducers/contacts";

export default class ContactsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txtSubject: "",
      txtMsg: ""
    };
  }

  onPressSend = () => {
    this.props.reqContacts({
      contact_subject: this.state.txtSubject,
      contact_body: this.state.txtMsg
    });
  };

  onChgInputText = (id, text) => {
    var _stateObj = {};
    _stateObj[id] = text;
    this.setState(_stateObj);
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { payLoad, error } = this.props;
    if (payLoad !== undefined) {
      this.props.navigation.navigate("SettingSuccess", {
        title: i18n.t("contacts.succContactTitle"),
        subTitle: i18n.t("contacts.succContactSubTitle"),
        description: "",
        returnNavigate: "Setting"
      });
    }
    if (error !== undefined && this.props.error.length > 0) {
      this.showErrorAlert(this.props.error);
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("beneficiary.fault"),
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
  /**/
  render() {
    const { txtSubject, txtMsg } = this.state;
    let buttonEnabled = false;
    if (txtSubject.length > 0 && txtMsg.length > 0) {
      buttonEnabled = true;
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <Loader
            loading={this.props.loading}
            typeOfLoad={i18n.t("components.loader.descriptionText")}
          />
          <WhiteNavHeader
            title={i18n.t("settings.helpContact")}
            onBack={() => this.props.navigation.goBack()}
          />

          <ScrollView style={styles.textContainer}>
            <Text style={styles.sectionText}>
              {i18n.t("contacts.description")}
            </Text>

            <Text style={styles.txtSectionTitle}>
              {i18n.t("contacts.subject")}
            </Text>
            <RoundRectView style={{ marginTop: 10, padding: 15 }}>
              <TextInput
                maxLength={256}
                placeholderTextColor="#cecece"
                placeholder={i18n.t("contacts.subjectPlaceHolder")}
                onChangeText={text => this.onChgInputText("txtSubject", text)}
              />
            </RoundRectView>

            <Text style={styles.txtSectionTitle}>{i18n.t("contacts.msg")}</Text>
            <RoundRectView style={{ marginTop: 10, padding: 15 }}>
              <TextInput
                style={{ height: 150 }}
                maxLength={4096}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="#cecece"
                placeholder={i18n.t("contacts.msgPlaceHolder")}
                onChangeText={text => this.onChgInputText("txtMsg", text)}
              />
            </RoundRectView>
            <Text style={styles.txtSectionTitle}>
              {i18n.t("contacts.requiredField")}
            </Text>
          </ScrollView>

          <KralissRectButton
            style={styles.buttonContainer}
            enabled={buttonEnabled}
            onPress={this.onPressSend}
            title={i18n.t("contacts.send")}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  sectionText: {
    marginTop: 20,
    color: "#484848",
    fontSize: RF(2.0)
  },
  txtSectionTitle: {
    color: "#484848",
    fontSize: RF(2.0),
    marginTop: 30
  },
  marginCell: {
    marginTop: 10
  },
  buttonContainer: {
    height: 60,
    width: "100%"
  }
});

const mapStateToProps = state => {
  const { loading, error, payLoad } = state.contactsReducer;
  return { loading, error, payLoad };
};

const mapDispatchToProps = {
  reqContacts
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsView);
