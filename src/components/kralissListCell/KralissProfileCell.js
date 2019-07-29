import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import RF from "react-native-responsive-fontsize";

export default class KralissProfileCell extends Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        {this.props.sectionTitle !== undefined && (
          <Text style={styles.txtSectionTitle}>{this.props.sectionTitle}</Text>
        )}
        <TouchableOpacity
          style={styles.mainTouchable}
          onPress={this.props.onSelect ? this.props.onSelect : () => {}}
        >
          {!this.props.noTopPadding && <View style={styles.paddingView} />}
          <View style={styles.contentView}>
            <View style={styles.contentMainContent}>
              <View
                style={{
                  backgroundColor: "#00aca9",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 65,
                  aspectRatio: 1,
                  borderRadius: 65 / 2
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: RF(5.0)
                  }}
                >
                  {this.props.firstName.substring(0, 1).toUpperCase() +
                    this.props.lastName.substring(0, 1).toUpperCase()}
                </Text>
              </View>
              <View style={{ flexDirection: "column", marginLeft: 5 }}>
                <Text style={styles.txtMainTitle}>{`${this.props.firstName} ${
                  this.props.lastName
                }`}</Text>
                <Text style={styles.txtSubTitle}>{this.props.secondInfo}</Text>
                <Text style={styles.txtSubTitle}>{this.props.thirdInfo}</Text>
              </View>
            </View>
            <View style={styles.contentRightContent}>
              <Image
                source={require("../../assets/images/chevron_small_lghtgrey.png")}
              />
            </View>
          </View>
          {!this.props.noBottomPadding && <View style={styles.paddingView} />}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column"
  },
  mainTouchable: {
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20
  },
  paddingView: {
    height: 20,
    width: "100%",
    backgroundColor: "#fff"
  },
  txtSectionTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginLeft: 20,
    marginRight: 20,
    marginTop: 12,
    marginBottom: 12
  },
  contentView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  contentMainContent: {
    flexDirection: "row",
    backgroundColor: "#fff",
    flex: 2.5
  },
  txtMainTitle: {
    color: "#484848",
    fontSize: RF(2.2)
  },
  txtSubTitle: {
    color: "#acacac",
    fontSize: RF(2.0),
    marginTop: 5
  },
  contentRightContent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end"
  }
});
