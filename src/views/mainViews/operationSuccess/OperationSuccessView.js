import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";
import Spinner from "react-native-spinkit";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import RF from "react-native-responsive-fontsize";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";

export default class OperationSuccessView extends Component {
  state = { loading: false };

  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const {
      title,
      subTitle,
      description,
      returnNavigate,
      failed
    } = params.params;
    this.state = { title, failed, subTitle, description, returnNavigate };
  }

  onPressValidate = async () => {
    this.props.navigation.navigate(this.state.returnNavigate);
  };

  componentDidMount = async () => {};

  render() {
    let buttonEnabled = !this.props.loading;
    return (
      <View style={styles.container}>
        <WhiteNavHeader title={i18n.t("refillLoader.confirmation")} />
        <View style={styles.textContainer}>
          <Text style={styles.txtMainDesc}>{this.state.title}</Text>
          {this.state.failed !== true ? (
            <Image
              source={require("../../../assets/images/check_circle.png")}
            />
          ) : (
            <Image
              source={require("../../../assets/images/check_circle_solid_orange.png")}
            />
          )}

          {this.state.subTitle !== undefined && (
            <Text style={styles.txtMainDesc}>{this.state.subTitle}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.txtDesc}>{this.state.description}</Text>
          <TouchableOpacity
            style={styles.buttonEnabled}
            onPress={this.onPressValidate}
          >
            <Text style={styles.buttonTitle}>
              {i18n.t("passwdIdentify.return")}
            </Text>
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
    flex: 1,
    backgroundColor: "#fff"
  },
  textContainer: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: "column",
    justifyContent: "center",
    flex: 3,
    alignItems: "center"
  },
  txtMainDesc: {
    color: "#484848",
    fontSize: RF(2.2),
    marginTop: 25,
    marginBottom: 12
  },
  buttonContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RF(2.0),
    textAlign: "center",
    marginBottom: 32,
    marginLeft: 40,
    marginRight: 40
  },
  buttonTitle: {
    color: "#fff",
    textAlign: "center",
    fontSize: RF(2.8)
  },
  buttonEnabled: {
    width: "100%",
    height: 60,
    backgroundColor: "#00aca9",
    justifyContent: "center",
    alignItems: "center"
  }
});
