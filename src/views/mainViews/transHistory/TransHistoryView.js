import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native";
import { connect } from "react-redux";
import RF from "react-native-responsive-fontsize";
import _ from "lodash";
import moment from "moment";
import { getStatusBarHeight } from "react-native-status-bar-height";

import HorzGradientView from "../../../components/gradientView/HorzGradientView";
import i18n from "../../../locale/i18n";
import { loadLocalData, saveLocalData,saveUserInfo } from "../../../utils/localStorage";
import {
  reqLastTransaction,
  reqLastTransactionInit
} from "../../../reducers/lastTransaction";

import { reqAccountsMe, reqInitAccountsMe } from "../../../reducers/accountsMe";

function MergeRowsWithHeaders(obj1, obj2) {
  
  for (var p in obj2) {
    if (obj1[p] instanceof Array && obj1[p] instanceof Array) {
      obj1[p] = obj1[p].concat(obj2[p]);
    } else {
      obj1[p] = obj2[p];
    }
  }
 
  return obj1;
}

export default class TransHistoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      txtSearch: "",
      bSearch: false,
      myUnit: "",
      myConversionRate: 1,
      myBalance: 0,
      paginationStatus: "firstLoad",
      pageNo: 0,
      isRefreshing: false,
      callback: null,
      arrOriginalData: [],
      arrSections: [],
      bFromChildView: false
    };
  }

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

  groupingData = arrData => {
    return _.chain(arrData)
      .groupBy(function(data) {
        return moment(data.transaction_date_created)
          .startOf("day")
          .format();
      })
      .toPairs()
      .map(function(items, aKey) {
        return { title: items[0], data: items[1] };
      })
      .orderBy(["title"], ["desc"])
      .value();
  };

  loadUserInfo = async ()=>{
    try {
      const lastName = await loadLocalData("lastName");
      const firstName = await loadLocalData("firstName");
      let companyName = await loadLocalData["companyName"];
      if (companyName === null) companyName = "";
      const myBalance = await loadLocalData("kraBalance");
      const myuserInternational = await loadLocalData("myuserInternational");
      this.setState({
        myUnit: myuserInternational["international_devise_iso_code"],
        myConversionRate:
          myuserInternational["international_conversion_rate"],
        myBalance: parseFloat(myBalance),
        lastName,
        firstName,
        companyName
      });
    } catch (error) {
      this.showErrorAlert(error.message);
    }
  }

  async componentDidMount() {
    this.props.navigation.addListener("willFocus", async route => {
      this.props.reqAccountsMe();
      if (this.state.bFromChildView) {
        this.setState({ bFromChildView: false });
        return;
      }
      //tab changed
     
      this.setPage(0);
      this.setState({
        paginationStatus: "firstLoad",
        arrSections: [],
        arrOriginalData: []
      });
      this.onFetchTransHistory(this.getPage(), this.postRefresh, {
        firstLoad: true
      });
    });
  }

  async componentDidUpdate() {
    const { payLoad, error, accountsMeData } = this.props;
    if(accountsMeData !== undefined){
      this.props.reqInitAccountsMe();
      const { kra_user } = accountsMeData;
      if (kra_user !== undefined) {
        await saveUserInfo(accountsMeData);
        this.loadUserInfo();
      }
    }
    if (payLoad !== undefined) {
      this.props.reqLastTransactionInit();
      const arrOriginalData = [...this.state.arrOriginalData, ...payLoad];
      this.setState({ arrOriginalData });
      let groups = this.groupingData(arrOriginalData); //make new group
      let options = {};
      if (payLoad.length < 10) options = { allLoaded: true };
      this.state.callback(groups, options);
    }
    if (error !== undefined && error.length > 0) {
      this.props.reqLastTransactionInit();
      this.showErrorAlert(this.props.error);
    }
  }

  onFetchTransHistory = (page = 0, callback, options) => {
    this.props.reqLastTransaction(page * 10, page * 10 + 10);
    this.setState({ callback: callback });
  };
  onPressTableRow = rowData => {
    this.setState({ bFromChildView: true });
    this.props.navigation.navigate("HistoryDetail", { data: rowData });
  };

  onPressSearch = () => {
    let { bSearch } = this.state;
    bSearch = !bSearch;
    this.setState({ bSearch });
    if (!bSearch) {
      const arrGrouped = this.groupingData(this.state.arrOriginalData);
      this.setState({ arrSections: arrGrouped });
    }
  };

  onChangeSearchText = txtValue => {
    this.setState({ txtSearch: txtValue }, () => {
      if (this._throttleTimeout) {
        clearTimeout(this._throttleTimeout);
      }

      this._throttleTimeout = setTimeout(
        () => this.searchHistory(txtValue),
        500
      );
    });
  };

  searchHistory = term => {
    const arrFiltered = this.state.arrOriginalData.filter(item => {
      const field1 = item.kra_transaction_total_amount;
      const field2 = item.kra_transaction_total_converted_amount;
      const field3 = item.kra_transaction_amount;
      const field4 = item.transaction_receiver_name;
      const field5 = item.transaction_sender_name;
      let arrSearchField = [];
      if (field1 !== undefined) arrSearchField.push(field1);
      if (field2 !== undefined) arrSearchField.push(field2);
      if (field3 !== undefined) arrSearchField.push(field3);
      if (field4 !== undefined) arrSearchField.push(field4);
      if (field5 !== undefined) arrSearchField.push(field5);

      const searchTxt = term.toLowerCase();
      const filtered = arrSearchField.filter(
        item => item.toLowerCase().indexOf(searchTxt) > -1
      );
      if (filtered.length > 0) return true;
      return false;
    });

    const arrGrouped = this.groupingData(arrFiltered);
    this.setState({ arrSections: arrGrouped });
  };

  getRows = () => {
    return [...this.state.arrSections];
  };
  getPage = () => {
    return this.state.pageNo;
  };
  setPage = pageNo => {
    return this.setState({ pageNo });
  };

  postRefresh = (rows = [], options = {}) => {
    this.updateRows(rows, options);
  };

  postPaginate = (rows = [], options = {}) => {
    this.setPage(this.getPage() + 1);
    //var mergedRows = null;
    //console.log("old1");
    //console.log(this.state.arrSections);
    //let arrRows = this.getRows()
    //mergedRows = MergeRowsWithHeaders(arrRows, rows);
    this.updateRows(rows, options);
  };

  updateRows = (rows = [], options = {}) => {
    if (rows !== null) {
      this.setState({
        arrSections: [...rows],
        isRefreshing: false,
        paginationStatus: options.allLoaded === true ? "allLoaded" : "waiting"
      });
    } else {
      this.setState({
        isRefreshing: false,
        paginationStatus: options.allLoaded === true ? "allLoaded" : "waiting"
      });
    }
  };

  paginationFetchingView = () => {
    return (
      <View style={customStyles.paginationView}>
        <ActivityIndicator animating={true} size="small" color={"#00768b"} />
      </View>
    );
  };

  paginationAllLoadedView = () => {
    return (
      <View style={customStyles.paginationView}>
        <Text style={customStyles.actionsLabel}>~</Text>
      </View>
    );
  };

  paginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor="#c8c7cc"
        onPress={this.onPaginate}
        style={customStyles.paginationView}
      >
        <Text style={customStyles.actionsLabel}>Load more</Text>
      </TouchableHighlight>
    );
  }

  onPaginate = () => {
    if (this.state.paginationStatus === "allLoaded") {
      return null;
    } else {
      this.setState({
        paginationStatus: "fetching"
      });
      this.onFetchTransHistory(this.getPage() + 1, this.postPaginate, {});
    }
  };

  onRefresh = (options = {}) => {
    this.setState({
      isRefreshing: true
    });
    this.setPage(0);
    this.props.onFetch(this.getPage(), this.postRefresh, options);
  };

  renderPaginationView = () => {
    if (
      this.state.paginationStatus === "fetching" ||
      this.state.paginationStatus === "firstLoad"
    ) {
      return this.paginationFetchingView();
    } else if (this.state.paginationStatus === "waiting") {
      return this.paginationWaitingView();
    } else if (this.state.paginationStatus === "allLoaded") {
      return this.paginationAllLoadedView();
    } else {
      return null;
    }
  };

  renderRowView = ({ item, index, section }) => {
    let typeIcon = require("../../../assets/images/refund_thin.png"); //default refund
    let mainTitle = "",
      subTitle = "";
    let mainAmount = "",
      subAmount = "",
      otherUnitAmount = "";
    let bPlus = false;

    if (item.transaction_type === "REFILL") {
      typeIcon = require("../../../assets/images/credit_account_grey.png");
      bPlus = true;
      mainTitle = i18n.t("transHistory.recharge");
      subTitle = i18n.t("transHistory.recharge");
      mainAmount = `+ ${item.kra_transaction_total_converted_amount} ${
        item.transaction_sender_devise_iso_code
      }`;
      subAmount = `+ ${item.kra_transaction_total_amount}`;
    }
    if (item.transaction_type === "REFUND") {
      subTitle = i18n.t("transHistory.refund");
      if (this.state.companyName === "") {
        mainTitle = this.state.companyName;
      } else {
        mainTitle = `${this.state.firstName} ${this.state.lastName}`;
      }
      mainAmount = `- ${item.kra_transaction_total_converted_amount} ${
        item.transaction_sender_devise_iso_code
      }`;
      subAmount = `- ${item.kra_transaction_total_amount}`;
    }
    if (
      item.transaction_type === "SENT" ||
      item.transaction_type === "RECEIVED"
    ) {
      if (
        item.transaction_sender_devise_iso_code !==
        item.transaction_receiver_devise_iso_code
      ) {
        //default receive:
        let unit = item.transaction_sender_devise_iso_code;
        let conversionRate = item.transaction_sender_conversion_rate;
        if (item.transaction_type === "SENT") {
          unit = item.transaction_receiver_devise_iso_code;
          conversionRate = item.transaction_receiver_conversion_rate;
        }

        let otherAmount =
          parseFloat(item.kra_transaction_amount) * conversionRate;
        otherUnitAmount = `${otherAmount.toFixed(2)} ${unit}`;
      }

      if (item.transaction_type === "SENT") {
        bPlus = false;
        //
        let transAmount =
          parseFloat(item.kra_transaction_amount) *
          item.transaction_sender_conversion_rate;
        mainTitle = item.transaction_receiver_name;
        subTitle = i18n.t("transHistory.payment");
        mainAmount = `- ${transAmount.toFixed(2)} ${
          item.transaction_sender_devise_iso_code
        }`;
        subAmount = `- ${item.kra_transaction_amount}`;
      } else {
        let transAmount =
          parseFloat(item.kra_transaction_amount) *
          item.transaction_sender_conversion_rate;
        bPlus = true;
        mainTitle = item.transaction_sender_name;
        subTitle = i18n.t("transHistory.receive");
        mainAmount = `+ ${transAmount.toFixed(2)} ${
          item.transaction_sender_devise_iso_code
        }`;
        subAmount = `+ ${item.kra_transaction_amount}`;
      }

      if (item.transaction_was_qr === true)
        typeIcon = require("../../../assets/images/payer_thin.png");
      else typeIcon = require("../../../assets/images/envoyer_thin.png");
    }

    return (
      <TouchableHighlight
        style={customStyles.row}
        underlayColor="#fff"
        onPress={() => this.onPressTableRow(item)}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              width: 45,
              height: 45,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image source={typeIcon} />
          </View>

          <View style={{ flex: 1.5, marginLeft: 10 }}>
            <Text style={customStyles.rowMainTitle}>{mainTitle}</Text>
            <Text style={customStyles.rowSubTitle}>{subTitle}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-end" }}>
            <Text
              style={
                bPlus
                  ? customStyles.rowMainTitleHighlighted
                  : customStyles.rowMainTitle
              }
            >
              {mainAmount}
            </Text>
            {otherUnitAmount !== "" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{ marginRight: 5, marginTop: 5 }}
                  source={require("../../../assets/images/arrow.png")}
                />
                <Text style={customStyles.rowSubTitle}>{otherUnitAmount}</Text>
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={customStyles.rowSubTitle}>{subAmount}</Text>
              <Image
                style={{ marginLeft: 5, marginTop: 5 }}
                source={require("../../../assets/images/kraliss_logo_grey.png")}
              />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderSectionHeaderView = ({ section: { title } }) => {
    const dateTime = moment(title).format("DD/MM/YYYY");
    return (
      <View style={customStyles.header}>
        <Text style={customStyles.headerTitle}>{dateTime}</Text>
      </View>
    );
  };

  renderStickyHeader = ballance => {
    return (
      <View
        key="sticky-header"
        style={{
          height: 70,
          width: "100%",
          postion: "absolute",
          top: 0,
          left: 0,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <HorzGradientView
          style={{
            flex: 1,
            width: "100%"
          }}
        >
          <Text style={styles.stickyHeaderTitle}>
            {`${ballance.toFixed(2)} ${this.state.myUnit}`}
          </Text>
        </HorzGradientView>
      </View>
    );
  };

  renderParallaxForeground = (statusBarHeight, ballance) => {
    return (
      <HorzGradientView key="parallax-header">
        {this.state.bSearch && (
          <View
            style={{
              flexDirection: "row",
              marginTop: statusBarHeight,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <TouchableHighlight
              style={{
                height: 45,
                marginLeft: 5,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={this.onPressSearch}
            >
              <Image source={require("../../../assets/images/chevron.png")} />
            </TouchableHighlight>
            <View
              style={{
                height: 45,
                marginLeft: 10,
                borderRadius: 25,
                backgroundColor: "#ffffff80",
                flex: 1
              }}
            >
              <TextInput
                style={{ flex: 1, height: 45, marginLeft: 10, color: "#fff" }}
                editable={true}
                placeholderTextColor="#fff"
                placeholder={i18n.t("transHistory.search")}
                value={this.state.txtSearch}
                onChangeText={this.onChangeSearchText}
              />
            </View>
          </View>
        )}
        {!this.state.bSearch && (
          <View
            style={{
              marginTop: statusBarHeight,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              style={{ width: 45, height: 45 }}
              source={require("../../../assets/images/symbol_kraliss.png")}
            />
            <TouchableOpacity
              style={styles.navBarSearchBtn}
              onPress={() => this.onPressSearch()}
            >
              <Image
                style={{ width: 19, height: 19 }}
                source={require("../../../assets/images/search.png")}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={{ marginTop: 20, height: 100 }}>
          <Text style={styles.headerDesc}>
            {i18n.t("transHistory.yourBalance")}
          </Text>
          <Text style={styles.headerBalance}>
            {`${ballance.toFixed(2)} ${this.state.myUnit}`}
          </Text>
          <View style={styles.headerMoneyInfo}>
            <Text style={styles.headerDesc}>
              {`${i18n.t("sendMoney.thats")} ${this.state.myBalance.toFixed(
                2
              )}`}
            </Text>
            <Image
              style={{ marginLeft: 5 }}
              source={require("../../../assets/images/kraliss_logo_grey.png")}
            />
          </View>
        </View>
      </HorzGradientView>
    );
  };

  render() {
    const statusBarHeight = getStatusBarHeight();
    const ballance = this.state.myBalance * this.state.myConversionRate;
    return (
      <View style={styles.container}>
        {this.state.stickHeaderHeight > 0 && this.renderStickyHeader(ballance)}
        <SectionList
          renderItem={this.renderRowView}
          renderSectionHeader={this.renderSectionHeaderView}
          sections={this.state.arrSections}
          keyExtractor={(item, index) => item + index}
          ListFooterComponent={this.renderPaginationView}
          ListHeaderComponent={
            this.state.stickHeaderHeight > 0
              ? null
              : this.renderParallaxForeground(statusBarHeight, ballance)
          }
          onScroll={event => {
            if (
              event.nativeEvent.contentOffset.y <= 0 &&
              this.state.stickHeaderHeight > 0
            )
              this.setState({ stickHeaderHeight: 0 });
            else if (
              event.nativeEvent.contentOffset.y > 175 &&
              this.state.stickHeaderHeight === 0
            )
              this.setState({ stickHeaderHeight: 50 + statusBarHeight });
          }}
          onEndReachedThreshold={0.5}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd > 150) {
              //this.onPaginate();
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff"
  },
  stickyHeaderTitle: {
    marginTop: 30,
    textAlign: "center",
    color: "#fff",
    fontSize: RF(4.0)
  },
  navBarSearchBtn: {
    width: 45,
    height: 45,
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  headerBalance: {
    marginTop: 10,
    color: "#fff",
    fontSize: RF(4.0)
  },
  headerDesc: { fontSize: RF(2.0), color: "#fff" },
  headerMoneyInfo: { marginTop: 10, flexDirection: "row" }
});

const customStyles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#00000000"
  },
  refreshableView: {
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  actionsLabel: {
    fontSize: 20,
    color: "#007aff"
  },
  paginationView: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  defaultView: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15
  },
  row: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    backgroundColor: "#fff"
  },
  rowMainTitle: {
    color: "#000",
    fontSize: RF(2.1),
    marginTop: 5
  },
  rowMainTitleHighlighted: {
    color: "#00aca9",
    marginTop: 5,
    fontSize: RF(2.1)
  },
  rowSubTitle: {
    fontSize: RF(2.0),
    marginTop: 5,
    color: "#acacac"
  },
  header: {
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10
  },
  headerTitle: {
    color: "#acacac",
    fontSize: RF(2.0)
  }
});

const mapStateToProps = state => {
  const { payLoad: accountsMeData } = state.accountsMeReducer;
  const { payLoad, loading, error } = state.lastTransactionReducer;

  return {
    accountsMeData,
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqLastTransactionInit,
  reqLastTransaction,
  reqAccountsMe,
  reqInitAccountsMe
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransHistoryView);
