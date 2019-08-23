import React, { Component } from 'react';
import { Dimensions, PixelRatio, View, Text } from 'react-native';

var screenWidth = Dimensions.get('window').width * PixelRatio.get()
var screenHeight = Dimensions.get('window').height * PixelRatio.get()
// console.log(screenWidth + " x " + screenHeight)

// if (PixelRatio.get() === 1) {
//     console.log("mdpi")
// } else if (PixelRatio.get() === 1.5) {
//     console.log("hdpi");
// } else if (PixelRatio.get() === 2) {
//     console.log("xhdpi");
// } else if (PixelRatio.get() === 3) {
//     console.log("xxhdpi");
// } else if (PixelRatio.get() === 3.5) {
//     console.log("xxxhdpi");
// } else if (PixelRatio.get() === 4) {
//     console.log("xxxhdpi");
// }

var gaugeSize;
var bacTextSize;
var alcTypeSize;
var alcTypeText;
var abvText;
var abvSize;
var abvWineText;
var abvWineSize;
var abvLiquorText;
var abvLiquorSize;
var addButtonText;
var addButtonSize;
var multiSwitchMargin;

let alcValues = [{ value: 'Beer' }, { value: 'Wine' }, { value: 'Liquor' }];
let activeStyle = [{ color: 'white' }, { color: 'white' }, { color: 'white' }]
let beerActive = [{ color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }]

const gaugeLabels = [
    { name: '1', labelColor: '#e0f2f1', activeBarColor: '#ffffff' },
    { name: '2', labelColor: '#e0f2f1', activeBarColor: '#b5d3a0' },
    { name: '3', labelColor: '#e0f2f1', activeBarColor: '#96c060' },
    { name: '4', labelColor: '#e0f2f1', activeBarColor: '#9fc635' },
    { name: '5', labelColor: '#e0f2f1', activeBarColor: '#d3e50e' },
    { name: '6', labelColor: '#e0f2f1', activeBarColor: '#ffeb00' },
    { name: '7', labelColor: '#e0f2f1', activeBarColor: '#f9bf00' },
    { name: '8', labelColor: '#e0f2f1', activeBarColor: '#e98f00' },
    { name: '9', labelColor: '#e0f2f1', activeBarColor: '#d05900' },
    { name: '10', labelColor: '#e0f2f1', activeBarColor: '#AE0000' },
    { name: '11', labelColor: '#e0f2f1', activeBarColor: '#571405' },
    { name: '12', labelColor: '#e0f2f1', activeBarColor: '#000000' }
]

const namekey = "name"
const genderkey = "gender"
const weightkey = "weight"
const key = "buzzes"
const oldkey = "oldbuzzes"
const breakkey = "break"
const breakdatekey = "breakdate"
const autobreakkey = "autobreak"
const happyhourkey = "happyhour"
const autobreakminkey = "autobreakmin"
const autobreakthresholdkey = "autobreakthreshold"
const cutoffkey = "cutoff"
const cutoffbackey = "cutoffbac"
const drinkskey = "drinks"

const warnText = (<View>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" }}>Warning!</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold" }}>Your BAC is now above the legal drinking limit in most states.
Please consider one of the following:</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Drinking a glass of water.</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Taking a break from drinking for at least an hour.</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Calling a friend, Uber, or Lyft to come pick you up.</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold" }}>If you continue drinking:</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8 }}>Your decision making abilities could be impaired.  You should NOT drive an automobile or operate heavy machinery.  You could have a hangover tomorrow morning.  You might do something you regret.  You could injure yourself or others.  You could end up in legal trouble or jail.</Text>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" }}>YOU are liable for all decisions made from now on, you have been advised and warned.</Text>
</View>)

const dangerText = (<View>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>Danger!</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>Your BAC is well above the legal drinking limit.
    Please do one of the following:</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Drink only water from now on.</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Take a break from drinking for at least two hours.</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Call a friend, Uber, or Lyft to pick you up.</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>If you continue drinking:</Text>
    <Text style={{ fontSize: 16, textAlign: "center", padding: 8, color: "white" }}>Your decision making abilities will be impaired.  Do NOT drive an automobile or operate heavy machinery.  You will have a hangover tomorrow morning.  You will likely do something you regret.  You will likely injure yourself or others.  You will likely end up in legal trouble or jail.</Text>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold", color: "white" }}>YOU are liable for all decisions made from now on, you have been advised and warned.</Text>
</View>)

if (screenWidth === 480 && screenHeight === 854 && PixelRatio.get() === 1 || screenWidth === 480 && screenHeight === 800 && PixelRatio.get() === 1) {
    // console.log("480x854/800")
    gaugeSize = 440
    bacTextSize = 30
    alcTypeSize = 75
    alcTypeText = 35
    abvText = 25
    abvSize = 60
    abvWineText = 25
    abvWineSize = 70
    abvLiquorText = 25
    abvLiquorSize = 70
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 4
} else if (screenWidth <= 600) {
    // console.log("less than 600")
    gaugeSize = 230
    bacTextSize = 13
    alcTypeSize = 38
    alcTypeText = 13
    abvText = 11
    abvSize = 38
    abvWineText = 11
    abvWineSize = 38
    abvLiquorText = 11
    abvLiquorSize = 38
    addButtonText = 20
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth === 720 && screenHeight === 1280) {
    // console.log("720x1280")
    gaugeSize = 320
    bacTextSize = 20
    alcTypeSize = 60
    alcTypeText = 25
    abvText = 18
    abvSize = 40
    abvWineText = 18
    abvWineSize = 50
    abvLiquorText = 18
    abvLiquorSize = 50
    addButtonText = 30
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth > 600 && screenWidth < 750 || screenWidth === 1440 && screenHeight === 2368) {
    // console.log("greater than 600 & less than 750")
    gaugeSize = 295
    bacTextSize = 20
    alcTypeSize = 50
    alcTypeText = 20
    abvText = 15
    abvSize = 40
    abvWineText = 15
    abvWineSize = 40
    abvLiquorText = 15
    abvLiquorSize = 40
    addButtonText = 30
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth === 768 || screenWidth === 1080 && screenHeight === 1776) {
    // console.log("768 or equal to 1080 x 1776")
    gaugeSize = 300
    bacTextSize = 20
    alcTypeSize = 50
    alcTypeText = 20
    abvText = 15
    abvSize = 40
    abvWineText = 15
    abvWineSize = 40
    abvLiquorText = 15
    abvLiquorSize = 40
    addButtonText = 30
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth >= 750 && screenWidth < 828) {
    // console.log("greater or equal to 750 & less than 828")
    gaugeSize = 350
    bacTextSize = 30
    alcTypeSize = 75
    alcTypeText = 30
    abvText = 18
    abvSize = 45
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 0
} else if (screenWidth === 828 || screenWidth === 1242 && screenHeight === 2688) {
    // console.log("828 or 1242 x 2688")
    gaugeSize = 390
    bacTextSize = 35
    alcTypeSize = 90
    alcTypeText = 40
    abvText = 20
    abvSize = 50
    abvWineText = 25
    abvWineSize = 60
    abvLiquorText = 25
    abvLiquorSize = 60
    addButtonText = 45
    addButtonSize = false
    multiSwitchMargin = 15
} else if (screenWidth === 1440 && screenHeight === 2712 || screenWidth === 1440 && screenHeight === 2792 || screenWidth === 1440 && screenHeight === 2621 || screenWidth === 1440 && screenHeight === 2416) {
    // console.log("1440 x 2712/2792/2621/2416(s6 edge+)")
    gaugeSize = 380
    bacTextSize = 30
    alcTypeSize = 80
    alcTypeText = 35
    abvText = 20
    abvSize = 50
    abvWineText = 22
    abvWineSize = 55
    abvLiquorText = 20
    abvLiquorSize = 55
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 8
} else if (screenWidth === 1080 && screenHeight === 2028) {
    // console.log("1080 x 2028")
    gaugeSize = 365
    bacTextSize = 30
    alcTypeSize = 75
    alcTypeText = 30
    abvText = 18
    abvSize = 45
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 6
} else if (screenWidth === 1125) {
    // console.log("1125")
    gaugeSize = 350
    bacTextSize = 30
    alcTypeSize = 80
    alcTypeText = 35
    abvText = 18
    abvSize = 40
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 12
} else if (screenWidth === 1242) {
    // console.log("1242")
    gaugeSize = 390
    bacTextSize = 30
    alcTypeSize = 75
    alcTypeText = 30
    abvText = 18
    abvSize = 45
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 8
} else if (screenWidth === 1440 && screenHeight === 2896 || screenWidth === 1440 && screenHeight === 2816) {
    // console.log("1440x2896/2816")
    gaugeSize = 455
    bacTextSize = 40
    alcTypeSize = 80
    alcTypeText = 45
    abvText = 25
    abvSize = 60
    abvWineText = 30
    abvWineSize = 80
    abvLiquorText = 30
    abvLiquorSize = 80
    addButtonText = 45
    addButtonSize = false
    multiSwitchMargin = 20
} else if (screenWidth === 1440 && screenHeight === 2768) {
    // console.log("1440x2768/2896")
    gaugeSize = 335
    bacTextSize = 25
    alcTypeSize = 70
    alcTypeText = 30
    abvText = 15
    abvSize = 40
    abvWineText = 15
    abvWineSize = 40
    abvLiquorText = 15
    abvLiquorSize = 40
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 5
} else if (screenWidth === 1440 && screenHeight !== 2712) {
    // console.log("1440")
    gaugeSize = 390
    bacTextSize = 25
    alcTypeSize = 70
    alcTypeText = 25
    abvText = 18
    abvSize = 45
    abvWineText = 18
    abvWineSize = 45
    abvLiquorText = 15
    abvLiquorSize = 45
    addButtonText = 30
    addButtonSize = true
    multiSwitchMargin = 0
} else if (screenWidth > 1125) {
    // console.log("greater than 1125")
    gaugeSize = 390
    bacTextSize = 25
    alcTypeSize = 75
    alcTypeText = 30
    abvText = 18
    abvSize = 45
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 0
} else {
    // console.log("other size")
    gaugeSize = 350
    bacTextSize = 28
    alcTypeSize = 65
    alcTypeText = 28
    abvText = 18
    abvSize = 45
    abvWineText = 18
    abvWineSize = 45
    abvLiquorText = 18
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 0
}

export {
    gaugeSize,
    bacTextSize,
    alcTypeSize,
    alcTypeText,
    abvText,
    abvSize,
    abvWineText,
    abvWineSize,
    abvLiquorText,
    abvLiquorSize,
    addButtonText,
    addButtonSize,
    multiSwitchMargin,
    alcValues,
    activeStyle,
    beerActive,
    namekey,
    genderkey,
    weightkey,
    key,
    oldkey,
    breakkey,
    breakdatekey,
    autobreakkey,
    happyhourkey,
    autobreakminkey,
    autobreakthresholdkey,
    gaugeLabels,
    warnText,
    dangerText,
    cutoffkey,
    drinkskey,
    cutoffbackey
}
