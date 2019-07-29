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
import { connect } from "react-redux";
import RF from "react-native-responsive-fontsize";
import _ from "lodash";
import ImagePicker from "react-native-image-picker";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import moment from "moment";

import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";
import i18n from "../../../../locale/i18n";
import {
  getAuthToken,
  loadLocalData,
  saveLocalData
} from "../../../../utils/localStorage";
import { reqDeleteDoc } from "../../../../reducers/documents";
import Loader from "../../../../components/loader/Loader";
import KralissPrevDeleteCell from "../../../../components/kralissListCell/KralissPrevDeleteCell";
import {
  getStatusText,
  getDocTitleText
} from "../../../../utils/accountInfoUtil";
import { API_URL } from "../../../../utils/config";

const options = [
  i18n.t("myAccount.actionList.item1"),
  i18n.t("myAccount.actionList.item2"),
  i18n.t("myAccount.actionList.item3"),
  i18n.t("myAccount.actionList.item4")
];

export default class DocDetailView extends Component {
  constructor(props) {
    super(props);
    const params = props.navigation.state;
    const { docItem, type } = params.params;
    let docName = null;
    if (docItem !== null) {
      const _arrPath = _.split(docItem.document_name, "/");
      if (_arrPath.length > 0) {
        docName = _arrPath[_arrPath.length - 1];
      }
    }
    this.state = { docItem, type, docName, loading: false };
  }

  showOptionToUploadDocument = () => {
    this.ActionSheet.show();
  };

  selectionOption = index => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
        quality: 0.5,
        mediaType: "photo"
      }
    };
    switch (index) {
      case 1:
        ImagePicker.launchCamera(options, response => {
          console.log("Response = ", response);

          if (response.didCancel !== true || !response.error !== true) {
            const isNotOversized = this._checkFileSize(response.fileSize);
            if (isNotOversized === true) {
              const uri = response.uri.replace("file://", "");
              const extention = uri.slice(
                ((uri.lastIndexOf(".") - 1) >>> 0) + 2
              );
              const typeOfMime = this._defineMimeType(extention);
              const name = moment();
              const documentInfo = {
                uri: uri,
                type: typeOfMime,
                name: name
              };
              this.uploadImage(documentInfo);
            }
          }
        });
        break;
      case 2:
        ImagePicker.launchImageLibrary(options, response => {
          console.log("Response = ", response);

          if (response.didCancel !== true || !response.error !== true) {
            const isNotOversized = this._checkFileSize(response.fileSize);
            if (isNotOversized === true) {
              const uri = response.uri.replace("file://", "");
              const extention = uri.slice(
                ((uri.lastIndexOf(".") - 1) >>> 0) + 2
              );
              const typeOfMime = this._defineMimeType(extention);
              const name = response.fileName;
              const documentInfo = {
                uri: uri,
                type: typeOfMime,
                name: name
              };
              this.uploadImage(documentInfo);
            }
          }
        });
        break;
      case 3:
        setTimeout(() => {
          DocumentPicker.show(
            {
              filetype: [DocumentPickerUtil.images(), DocumentPickerUtil.pdf()]
            },
            (error, response) => {
              console.log("Response = ", response);
              const isNotOversized = this._checkFileSize(response.fileSize);
              if (isNotOversized === true) {
                const uri = response.uri.replace("file://", "");
                const extention = uri.slice(
                  ((uri.lastIndexOf(".") - 1) >>> 0) + 2
                );
                const typeOfMime = this._defineMimeType(extention);
                const name = response.fileName;
                const documentInfo = {
                  uri: uri,
                  type: typeOfMime,
                  name: name
                };
                this.uploadImage(documentInfo);
              }
            }
          );
        }, 100);
        break;
    }
  };

  _defineMimeType = extension => {
    switch (extension) {
      case "jpg":
        return "image/jpeg";
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "pdf":
        return "application/pdf";
    }
  };

  _checkFileSize = fileSize => {
    if (fileSize >= 1500000) {
      this.showErrorAlert(i18n.t("myAccount.errorMessageMaxSize"));
    } else {
      return true;
    }
  };

  uploadImage = async file => {
    const token = await getAuthToken();
    this.setState({ loading: true });
    try {
      const settings = {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data"
      };
      const resp = await RNFetchBlob.fetch(
        "POST",
        `${API_URL}/api/resources/documents/me/`,
        settings,
        [
          {
            name: "document_file",
            filename: file.name,
            type: file.tyle,
            data: RNFetchBlob.wrap(file.uri)
          },
          { name: "document_type", data: this.state.type },
          { name: "document_kra_type", data: this.state.type }
        ]
      );
      if (resp.respInfo.status === 201) {
        const data = resp.json();
        const _arrPath = data.document_name.split("/");
        if (_arrPath.length > 0) {
          docName = _arrPath[_arrPath.length - 1];
        }
        this.setState({
          loading: false,
          docItem: {
            id: data.id,
            document_name: data.document_name,
            document_kra_type: data.document_kra_type,
            document_file: data.document_file,
            document_api_money_state: data.document_api_money_state
          },
          docName: docName
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      this.showErrorAlert(i18n.t("myAccount.errorMessageUploadFail"));
    }
  };

  showErrorAlert = errorMsg => {
    setTimeout(() => {
      Alert.alert(
        "",
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

  onPressPreview = () => {
    const { docItem, type } = this.state;
    let title = getDocTitleText(type);
    this.props.navigation.navigate("DocPreview", {
      url: docItem.document_file,
      title
    });
  };

  onPressDelete = () => {
    setTimeout(() => {
      Alert.alert(
        i18n.t("refillLoader.confirmation"),
        i18n.t("myAccount.docDeleteMsg"),
        [
          {
            text: i18n.t("beneficiary.cancel"),
            onPress: () => {}
          },
          {
            text: i18n.t("forgotPassword.validateButton"),
            onPress: () => {
              this.confirmDeleteDocument();
            }
          }
        ],
        { cancelable: true }
      );
    }, 100);
  };

  confirmDeleteDocument = () => {
    const { docItem } = this.state;
    this.props.reqDeleteDoc(docItem.id);
    this.setState({ docItem: null, docName: null });
  };

  getDocumentRule = (docItem, type) => {
    if (docItem === null) return null;
    if (type == "PROOF_OF_ADDRESS")
      return i18n.t("myAccount.documentRuleOneYear");
    if (type == "PROOF_OF_HOST_HOSTING")
      return i18n.t("myAccount.documentRule3Month");
    if (type == "PROOF_OF_HOST_ADDRESS")
      return i18n.t("myAccount.documentRuleOneYear");
    return null;
  };

  render() {
    const { docItem, type, docName } = this.state;
    let { title, showIcon } = getStatusText(docItem);

    let txtAddRule = null;
    txtAddRule = this.getDocumentRule(docItem, type);

    showIcon = true;
    return (
      <View style={styles.container}>
        <Loader
          loading={this.state.loading}
          typeOfLoad={i18n.t("components.loader.descriptionText")}
        />
        <WhiteNavHeader
          title={getDocTitleText(type)}
          onBack={() => {
            this.props.navigation.goBack();
          }}
        />
        <ScrollView style={{ flex: 1 }}>
          <Text style={[styles.txtDesc, styles.marginSection, styles.marginLR]}>
            {getDocTitleText(type)}
          </Text>

          {docName !== null && (
            <KralissPrevDeleteCell
              style={styles.marginCell}
              mainTitle={docName}
              onPreview={this.onPressPreview}
              onDelete={this.onPressDelete}
            />
          )}

          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center"
              },
              styles.marginCell
            ]}
          >
            <Text style={[styles.txtDesc, styles.marginLR]}>{title}</Text>
            {showIcon && (
              <Image
                style={{
                  marginLeft: -15,
                  width: 12,
                  height: 12
                }}
                source={require("../../../../assets/images/chevron_small_lghtgrey.png")}
              />
            )}
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          {txtAddRule !== null && (
            <Text style={[styles.txtDesc, styles.marginLR]}>{txtAddRule}</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={this.showOptionToUploadDocument}
            >
              <Image source={require("../../../../assets/images/add.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={<Text>{i18n.t("myAccount.actionList.title")}</Text>}
            options={options}
            cancelButtonIndex={0}
            onPress={index => {
              this.selectionOption(index);
            }}
          />
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
    justifyContent: "flex-end"
  },
  addBtn: {
    position: "absolute",
    right: 20,
    bottom: 10
  },
  bottomContainer: { justifyContent: "flex-end" },
  buttonContainer: { height: 100 },
  marginSection: {
    marginTop: 20
  },
  marginCell: {
    marginTop: 12
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
  const { payLoad, loading, error } = state.docMeReducer;
  return {
    payLoad,
    loading,
    error
  };
};

const mapDispatchToProps = {
  reqDeleteDoc
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocDetailView);
