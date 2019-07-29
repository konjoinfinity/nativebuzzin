import React, { Component } from "react";
import Routes from "./Routes";
import DropdownAlert from 'react-native-dropdownalert';
import { View, StatusBar } from 'react-native';
import { AlertHelper } from './AlertHelper';

const App = () => <View style={{ flex: 1 }}>
  <Routes />
  <DropdownAlert
    defaultContainer={{ padding: 8, paddingTop: StatusBar.currentHeight, flexDirection: 'row' }}
    ref={ref => AlertHelper.setDropDown(ref)}
    onClose={() => AlertHelper.invokeOnClose()} />
</View>;

export default App;