import React, { Component } from "react";
import { WebView, Text, View } from "react-native";
import WhiteNavHeader from "../../../../components/navHeader/WhiteNavHeader";

export default class DocPreview extends Component {
  state = {
    canGoBack: false
  };

  render() {
    const params = this.props.navigation.state;
    const { url, title } = params.params;

    return (
      <View style={{ flex: 1 }}>
        <WhiteNavHeader
          title={title}
          onBack={() => {
            if (this.state.canGoBack) this._webview.goBack();
            else this.props.navigation.goBack();
          }}
        />
        <WebView source={{ uri: url }} style={{ marginTop: 0, flex: 1 }} />
      </View>
    );
  }
}
