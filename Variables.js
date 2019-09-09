import React from 'react';
import { Dimensions, PixelRatio, View, Text } from 'react-native';

var screenWidth = Dimensions.get('window').width * PixelRatio.get(), screenHeight = Dimensions.get('window').height * PixelRatio.get()
console.log(screenWidth + " x " + screenHeight)

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

var gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText, abvLiquorSize,
    addButtonText, addButtonSize, multiSwitchMargin, loginButtonText, loginGenderText, numberInputSize, loginTitle, barChartWidth,
    scrollToAmt;

let alcValues = [{ value: 'Beer' }, { value: 'Wine' }, { value: 'Liquor' }],
    activeStyle = [{ color: 'white' }, { color: 'white' }, { color: 'white' }],
    beerActive = [{ color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }]

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

const namekey = "name", genderkey = "gender", weightkey = "weight", key = "buzzes", oldkey = "oldbuzzes", breakkey = "break",
    breakdatekey = "breakdate", autobreakkey = "autobreak", happyhourkey = "happyhour", autobreakminkey = "autobreakmin",
    autobreakthresholdkey = "autobreakthreshold", cutoffkey = "cutoff", cutoffbackey = "cutoffbac", drinkskey = "drinks",
    cancelbreakskey = "cancelbreaks", showcutoffkey = "showcutoff", custombreakkey = "custombreak", hhhourkey = "hhhour";

const warnText = (<View>
    <Text style={{ fontSize: 22, textAlign: "center", padding: 8, fontWeight: "bold" }}>Warning!</Text>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" }}>Your BAC is now above the legal drinking limit in most states.</Text>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" }}>Please:</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8, fontWeight: "bold" }}>Take a break from drinking.</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8 }}>Drink water.</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8 }}>Call a friend, Uber, or Lyft to pick you up.</Text>
</View>)

const dangerText = (<View>
    <Text style={{ fontSize: 22, textAlign: "center", padding: 8, fontWeight: "bold" }}>Danger!</Text>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 8, fontWeight: "bold" }}>Your BAC is well above the legal drinking limit.</Text>
    <Text style={{ fontSize: 25, textAlign: "center", padding: 8, fontWeight: "bold" }}>STOP DRINKING!</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8 }}>Drink water!</Text>
    <Text style={{ fontSize: 18, textAlign: "center", padding: 8 }}>Call a friend, Uber, or Lyft to pick you up.</Text>
</View>)

const abovePoint10 = (<View>
    <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
    <Text style={{ fontSize: 22, textAlign: "center", padding: 5, fontWeight: "bold" }}>Your BAC is less than 0.10</Text>
    <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>Until then, stop drinking and have some water.</Text>
</View>)

const loginText = (<View>
    <Text style={{ fontSize: 25, textAlign: "center", padding: 10 }}>Welcome to Buzzin!</Text>
    <Text style={{ fontSize: 20, textAlign: "center", padding: 10 }}>Legal Disclaimer and User Agreement</Text>
    <Text style={{ fontSize: 15, textAlign: "center", padding: 10 }}>Buzzin will not be held liable for any decisions made based on the information provided.
    The Blood Alcohol Content (BAC) calculations are not 100% accurate and are aimed to give our users a general ballpark estimate based on their approximate weight and gender.
    Users are liable for all data they input, as it is stored on their personal local device.  No user data is stored externally, Buzzin does not store inputted user data externally.
    By pressing agree, the user forfeits their rights to hold Buzzin or LifeSystems LLC liable for any incidents, accidents, decisions based on information provided, risky activities, personal bodily injury, or accidental death.
    This application is designed to reduce and track personal alcoholic consumption habits.  Enjoy!</Text>
</View>)

if (screenWidth === 480 && screenHeight === 854 && PixelRatio.get() === 1 || screenWidth === 480 && screenHeight === 800 && PixelRatio.get() === 1) {
    console.log("480x854/800")
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
    loginButtonText = 25
    loginGenderText = 25
    numberInputSize = 280
    loginTitle = 32
    barChartWidth = 120
    scrollToAmt = 330
} else if (screenWidth <= 600) {
    console.log("less than 600")
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
    loginButtonText = 13
    loginGenderText = 13
    numberInputSize = 120
    loginTitle = 17
    barChartWidth = 120
    scrollToAmt = 330
} else if (screenWidth === 720 && screenHeight === 1280) {
    console.log("720x1280")
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
    loginButtonText = 18
    loginGenderText = 18
    numberInputSize = 200
    loginTitle = 25
    barChartWidth = 120
    scrollToAmt = 330
} else if (screenWidth > 600 && screenWidth < 750 || screenWidth === 1440 && screenHeight === 2368) {
    console.log("greater than 600 & less than 750")
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
    loginButtonText = 15
    loginGenderText = 15
    numberInputSize = 135
    loginTitle = 25
    barChartWidth = 120
    scrollToAmt = 330
} else if (screenWidth === 768 || screenWidth === 1080 && screenHeight === 1776) {
    console.log("768 or equal to 1080 x 1776")
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
    loginButtonText = 16
    loginGenderText = 16
    numberInputSize = 160
    loginTitle = 22
    barChartWidth = 150
    scrollToAmt = 330
} else if (screenWidth >= 750 && screenWidth < 828) {
    console.log("greater or equal to 750 & less than 828")
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
    loginButtonText = 22
    loginGenderText = 22
    numberInputSize = 220
    loginTitle = 26
    barChartWidth = 150
    scrollToAmt = 330
} else if (screenWidth === 828 || screenWidth === 1242 && screenHeight === 2688) {
    console.log("828 or 1242 x 2688")
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
    loginButtonText = 25
    loginGenderText = 26
    numberInputSize = 270
    loginTitle = 30
    barChartWidth = 168
    scrollToAmt = 365
} else if (screenWidth === 1440 && screenHeight === 2712 || screenWidth === 1440 && screenHeight === 2792 || screenWidth === 1440 && screenHeight === 2621 || screenWidth === 1440 && screenHeight === 2416) {
    console.log("1440 x 2712/2792/2621/2416(s6 edge+)")
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
    loginButtonText = 25
    loginGenderText = 25
    numberInputSize = 230
    loginTitle = 30
    barChartWidth = 150
    scrollToAmt = 330
} else if (screenWidth === 1080 && screenHeight === 2028) {
    console.log("1080 x 2028")
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
    loginButtonText = 25
    loginGenderText = 25
    numberInputSize = 230
    loginTitle = 30
    barChartWidth = 150
    scrollToAmt = 330
} else if (screenWidth === 1125) {
    console.log("1125")
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
    loginButtonText = 25
    loginGenderText = 26
    numberInputSize = 260
    loginTitle = 30
    barChartWidth = 150
    scrollToAmt = 330
} else if (screenWidth === 1242) {
    console.log("1242")
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
    loginButtonText = 24
    loginGenderText = 24
    numberInputSize = 250
    loginTitle = 30
    barChartWidth = 165
    scrollToAmt = 360
} else if (screenWidth === 1440 && screenHeight === 2896 || screenWidth === 1440 && screenHeight === 2816) {
    console.log("1440x2896/2816")
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
    loginButtonText = 26
    loginGenderText = 26
    numberInputSize = 260
    loginTitle = 32
    barChartWidth = 150
    scrollToAmt = 360
} else if (screenWidth === 1440 && screenHeight === 2768) {
    console.log("1440x2768")
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
    loginButtonText = 24
    loginGenderText = 24
    numberInputSize = 230
    loginTitle = 28
    barChartWidth = 150
    scrollToAmt = 360
} else if (screenWidth === 1440 && screenHeight !== 2712) {
    console.log("1440")
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
    loginButtonText = 24
    loginGenderText = 24
    numberInputSize = 230
    loginTitle = 28
    barChartWidth = 150
    scrollToAmt = 360
} else if (screenWidth > 1125) {
    console.log("greater than 1125")
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
    loginButtonText = 25
    loginGenderText = 26
    numberInputSize = 260
    loginTitle = 30
    barChartWidth = 150
    scrollToAmt = 360
} else {
    console.log("other size")
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
    loginButtonText = 22
    loginGenderText = 22
    numberInputSize = 220
    loginTitle = 28
    barChartWidth = 150
    scrollToAmt = 360
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
    cutoffbackey,
    cancelbreakskey,
    showcutoffkey,
    custombreakkey,
    abovePoint10,
    loginText,
    hhhourkey,
    loginButtonText,
    loginGenderText,
    numberInputSize,
    loginTitle,
    barChartWidth,
    scrollToAmt
}
