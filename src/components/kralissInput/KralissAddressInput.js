import React, { Component } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { Item } from "native-base";
import RF from "react-native-responsive-fontsize";
import RNGooglePlaces from "react-native-google-places";

export default class KralissAddressInput extends Component {
  openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        this.props.onAddressSelected(this.getFormatedAddress(place));
        //console.log(place);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  };

  getFormatedAddress(gPlace) {
    let _addressData = {};
    _addressData["formatted_address"] = gPlace["address"];
    _addressData["street_number"] =
      gPlace["addressComponents"]["street_number"];
    _addressData["route"] = gPlace["addressComponents"]["route"];
    _addressData["locality"] = gPlace["addressComponents"]["locality"];
    _addressData["administrative_area_level_1"] =
      gPlace["addressComponents"]["administrative_area_level_1"];
    _addressData["country"] = gPlace["addressComponents"]["country"];
    _addressData["postal_code"] = gPlace["addressComponents"]["postal_code"];
    return _addressData;
  }

  onPressOpenAddress = () => {
    this.openSearchModal();
  };
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Item style={styles.item}>
          {this.props.icon && (
            <Image style={{ marginRight: 10 }} source={this.props.icon} />
          )}
          <TouchableOpacity
            style={{ flex: 1, height: 40 }}
            onPress={this.onPressOpenAddress}
          >
            <View style={{ flex: 1 }} pointerEvents="none">
              <TextInput
                style={styles.textInput}
                editable={false}
                placeholderTextColor="#8fff"
                placeholder={this.props.placeHolder}
                value={this.props.value}
                secureTextEntry={this.props.secureText ? true : false}
              />
            </View>
          </TouchableOpacity>

          {this.props.showDeleteBtn &&
            this.props.value.length > 0 && (
              <TouchableOpacity
                onPress={() => this.props.onDeleteText(this.props.ID)}
              >
                <Image
                  source={require("../../assets/images/times_circle_regular.png")}
                />
              </TouchableOpacity>
            )}
          {this.props.confirmIcon &&
            this.props.isConfirmed && (
              <Image
                style={styles.iconConfirm}
                source={this.props.confirmIcon}
              />
            )}
        </Item>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },

  item: {
    borderBottomColor: "#fff"
  },
  textInput: {
    height: 40,
    marginRight: 0,
    flex: 1,
    color: "#fff",
    fontSize: RF(2.3)
  },
  iconConfirm: {
    marginLeft: 10,
    width: 20,
    height: 20
  }
});
