// imports for usage within the App component
import React, { Component } from "react";
import Routes from "./Routes";
import DropdownAlert from 'react-native-dropdownalert';
import { View, StatusBar } from 'react-native';
import { AlertHelper } from './AlertHelper';

// Main App component
const App = () => <View style={{ flex: 1 }}>
  {/* Pass in routes for usage across the entire app */}
  <Routes />
  {/* Pass in DropdownAlert in order for the dropdowns to show above the header nav bar */}
  <DropdownAlert
    defaultContainer={{ padding: 8, paddingTop: StatusBar.currentHeight, flexDirection: 'row' }}
    ref={ref => AlertHelper.setDropDown(ref)}
    onClose={() => AlertHelper.invokeOnClose()} />
</View>;

// Normal export for App
export default App;