import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity
} from "react-native";
import RF from "react-native-responsive-fontsize";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";

export default class NotificationsView extends Component {
  constructor(props) {
    super(props);
    this.state = { notifyOn: false };
  }

  componentDidMount = async () => {
    let notifyOn = await loadLocalData("notifyOn");
    if (notifyOn === null) notifyOn = true;
    this.setState({ notifyOn });
  };

  onPressNotification = () => {
    let strMsgTitle, strMsgContent;
    strMsgTitle = i18n.t("notifications.enableMsgTitle");
    strMsgContent = i18n.t("notifications.enableMsg");
    if (this.state.notifyOn) {
      strMsgTitle = i18n.t("notifications.disableMsgTitle");
      strMsgContent = i18n.t("notifications.disableMsg");
    }
    setTimeout(() => {
      Alert.alert(
        strMsgTitle,
        strMsgContent,
        [
          {
            text: i18n.t("notifications.refuse"),
            onPress: () => {}
          },
          {
            text: i18n.t("notifications.ok"),
            onPress: () => {
              this.settingNotification();
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  settingNotification = () => {
    let { notifyOn } = this.state;
    notifyOn = !notifyOn;
    this.setState({ notifyOn });
    saveLocalData("notifyOn", notifyOn);
  };

  render() {
    const { notifyOn } = this.state;
    return (
      <View style={styles.container}>
        <WhiteNavHeader
          title={i18n.t("settings.notifications")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />

        <Text style={[styles.txtDesc, styles.marginSection, styles.marginLR]}>
          {i18n.t("settings.notifications")}
        </Text>
        <View style={styles.contentView}>
          <Text
            style={styles.txtMainTitle}
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {i18n.t("settings.general")}
          </Text>
          <TouchableOpacity
            style={styles.mainTouchable}
            onPress={this.onPressNotification}
          >
            <Image
              source={
                notifyOn
                  ? require("../../../assets/images/radio_enabled.png")
                  : require("../../../assets/images/radio_disabled.png")
              }
            />
          </TouchableOpacity>
        </View>
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
  contentView: {
    paddingLeft: 20,
    paddingRight: 30,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white"
  },
  marginSection: {
    marginTop: 20
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  },
  mainTouchable: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  txtMainTitle: {
    flex: 1,
    color: "#484848",
    fontSize: RF(2.1)
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RF(2.1)
  }
});
