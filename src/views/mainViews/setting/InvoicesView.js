import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import RF from "react-native-responsive-fontsize";
import _ from "lodash";

import WhiteNavHeader from "../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData } from "../../../utils/localStorage";
import { reqRefillsInit, reqRefillsMe } from "../../../reducers/refills";
import Loader from "../../../components/loader/Loader";
import KralissPrevDeleteCell from "../../../components/kralissListCell/KralissPrevDeleteCell";
import { API_URL } from "../../../utils/config";

export default class InvoicesView extends Component {
  constructor(props) {
    super(props);
    this.state = { notifyOn: false, arrInvoice: null };
  }

  componentDidMount = async () => {
    this.props.reqRefillsMe();
  };

  componentDidUpdate = (prevProps, prevState) => {
    let { payLoad, error } = this.props;
    if (payLoad !== undefined) {
      this.props.reqRefillsInit();
      this.setState({ arrInvoice: payLoad });
    }
    if (error !== undefined && error.length > 0) {
      this.props.reqRefillsInit();
      console.log(error);
    }
  };

  getFileName = filePath => {
    const _arrPath = _.split(filePath, "/");
    if (_arrPath.length > 0) {
      return _arrPath[_arrPath.length - 1];
    }
    return "";
  };

  onPressPreview = invoice => {
    this.props.navigation.navigate("DocPreview", {
      url: `${API_URL}/${invoice.invoice_url}`,
      title: this.getFileName(invoice.invoice_file_name)
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Loader
          loading={this.props.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={i18n.t("settings.invoices")}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />

        <Text style={[styles.txtDesc, styles.marginCell, styles.marginLR]}>
          {i18n.t("settings.invoices")}
        </Text>
        <FlatList
          style={styles.marginCell}
          data={this.state.arrInvoice}
          renderItem={({ item }) => (
            <KralissPrevDeleteCell
              key={item.invoice_url}
              mainTitle={this.getFileName(item.invoice_file_name)}
              onPreview={() => this.onPressPreview(item)}
            />
          )}
        />
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
    marginTop: 20
  },
  marginLR: {
    marginLeft: 20,
    marginRight: 20
  },
  txtDesc: {
    color: "#acacac",
    fontSize: RF(2.1)
  }
});

const mapStateToProps = state => {
  const { payLoad, loading, error } = state.refillsMeReducer;
  console.log(payLoad);
  return {
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqRefillsInit,
  reqRefillsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoicesView);
