/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  Linking,
  StyleSheet,
  StatusBar,
  Text,
  View
} from "react-native";
import { Root } from "native-base";
import GradientView from "../../components/gradientView/GradientView";
import GuestNavigation from "../initialViews/navigations/guest";
import MainTabNavigator from "../mainViews/navigations/mainTab";
import { createSwitchNavigator } from "react-navigation";

const MainNavigator = createSwitchNavigator(
  {
    Guest: { screen: GuestNavigation },
    Main: { screen: MainTabNavigator }
  },
  {
    initialRouteName: "Main",
    headerMode: "none"
  }
);

type Props = {};
export default class App extends Component<Props> {
  render() {
    console.disableYellowBox = true;
    return (
      <Root>
        <StatusBar barStyle="light-content" />
        <MainNavigator />
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
