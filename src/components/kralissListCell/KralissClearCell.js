import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import RF from "react-native-responsive-fontsize";

export default class KralissClearCell extends Component {
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <View style={styles.contentView}>
          <View
            style={
              this.props.detailContent.length > 16
                ? styles.contentSmallMainContent
                : styles.contentMainContent
            }
          >
            <Text
              style={
                this.props.boldContent
                  ? styles.txtMainBoldTitle
                  : styles.txtMainTitle
              }
            >
              {this.props.mainTitle}
            </Text>
          </View>
          <View style={styles.contentRightContent}>
            {this.props.detailContent !== undefined && (
              <Text
                style={
                  this.props.boldContent
                    ? styles.txtDetailBoldContent
                    : styles.txtDetailContent
                }
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {this.props.detailContent}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column"
  },
  contentView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },

  contentSmallMainContent: {
    flexDirection: "column",
    flex: 1
  },
  contentMainContent: {
    flexDirection: "column",
    flex: 2.3
  },
  txtMainTitle: {
    color: "#484848",
    fontSize: RF(2.1)
  },
  txtMainBoldTitle: {
    color: "#484848",
    fontWeight: "bold",
    fontSize: RF(2.1)
  },
  contentRightContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  txtDetailContent: {
    color: "#484848",
    fontSize: RF(2.1),
    textAlign: "right"
  },
  txtDetailBoldContent: {
    color: "#484848",
    fontSize: RF(2),
    textAlign: "right",
    fontWeight: "bold"
  }
});
