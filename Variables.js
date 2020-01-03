import React from 'react';
import { Dimensions, PixelRatio, View, Text, Linking } from 'react-native';
import styles from "./Styles"

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
    scrollToAmt, warnTitleButton, warnBody;

let alcValues = [{ value: 'Beer' }, { value: 'Wine' }, { value: 'Liquor' }, { value: 'Cocktail' }],
    activeStyle = [{ color: 'white' }, { color: 'white' }, { color: 'white' }],
    beerActive = [{ color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }],
    shotsStyle = [{ color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }]

const gaugeLabels = [
    { name: '1', labelColor: '#e0f2f1', activeBarColor: '#ffffff' }, { name: '2', labelColor: '#e0f2f1', activeBarColor: '#b5d3a0' },
    { name: '3', labelColor: '#e0f2f1', activeBarColor: '#96c060' }, { name: '4', labelColor: '#e0f2f1', activeBarColor: '#9fc635' },
    { name: '5', labelColor: '#e0f2f1', activeBarColor: '#d3e50e' }, { name: '6', labelColor: '#e0f2f1', activeBarColor: '#ffeb00' },
    { name: '7', labelColor: '#e0f2f1', activeBarColor: '#f9bf00' }, { name: '8', labelColor: '#e0f2f1', activeBarColor: '#e98f00' },
    { name: '9', labelColor: '#e0f2f1', activeBarColor: '#d05900' }, { name: '10', labelColor: '#e0f2f1', activeBarColor: '#AE0000' },
    { name: '11', labelColor: '#e0f2f1', activeBarColor: '#571405' }, { name: '12', labelColor: '#e0f2f1', activeBarColor: '#000000' }
]

const namekey = "name", genderkey = "gender", weightkey = "weight", key = "buzzes", oldkey = "oldbuzzes", breakkey = "break",
    breakdatekey = "breakdate", autobreakkey = "autobreak", happyhourkey = "happyhour", autobreakminkey = "autobreakmin",
    autobreakthresholdkey = "autobreakthreshold", limitkey = "limit", limitbackey = "limitbac", drinkskey = "drinks",
    cancelbreakskey = "cancelbreaks", showlimitkey = "showlimit", custombreakkey = "custombreak", hhhourkey = "hhhour",
    indefbreakkey = "indefbreak", limithourkey = "limithour", pacerkey = "pacer", pacertimekey = "pacertime",
    limitdatekey = "limitdate", lastcallkey = "lastcall", logskey = "logs", maxreckey = "maxrec", warningkey = "warning";

// add metric key value for usage across the app (oz and ml) load on each screen mount

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
    barChartWidth = 202
    scrollToAmt = 479
    warnTitleButton = 21
    warnBody = 18
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
    barChartWidth = 122
    scrollToAmt = 320
    warnTitleButton = 12
    warnBody = 9
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
    barChartWidth = 140
    scrollToAmt = 362
    warnTitleButton = 16
    warnBody = 13
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
    abvLiquorSize = 35
    addButtonText = 30
    addButtonSize = true
    multiSwitchMargin = 0
    loginButtonText = 15
    loginGenderText = 15
    numberInputSize = 135
    loginTitle = 25
    if (screenHeight === 1136) {
        barChartWidth = 120
        scrollToAmt = 320
    } else {
        barChartWidth = 142
        scrollToAmt = 360
    }
    warnTitleButton = 13
    warnBody = 10
} else if (screenWidth === 1080 && screenHeight === 1920) {
    console.log("1080 x 1920" + " galaxy s5")
    gaugeSize = 295
    bacTextSize = 18
    alcTypeSize = 52
    alcTypeText = 23
    abvText = 14
    abvSize = 42
    abvWineText = 14
    abvWineSize = 44
    abvLiquorText = 14
    abvLiquorSize = 38
    addButtonText = 33
    addButtonSize = false
    multiSwitchMargin = 0
    loginButtonText = 16
    loginGenderText = 16
    numberInputSize = 150
    loginTitle = 22
    barChartWidth = 142
    scrollToAmt = 360
    warnTitleButton = 13
    warnBody = 10
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
    if (screenHeight === 1184) {
        barChartWidth = 155
        scrollToAmt = 385
    } else {
        barChartWidth = 142
        scrollToAmt = 360
    }
    warnTitleButton = 13
    warnBody = 10
} else if (screenWidth >= 750 && screenWidth < 828) {
    console.log("greater or equal to 750 & less than 828")
    gaugeSize = 350
    bacTextSize = 30
    alcTypeSize = 64
    alcTypeText = 30
    abvText = 18
    abvSize = 45
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 41
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 2.5
    loginButtonText = 22
    loginGenderText = 22
    numberInputSize = 220
    loginTitle = 26
    barChartWidth = 150
    scrollToAmt = 375
    warnTitleButton = 17
    warnBody = 14
} else if (screenWidth === 828 || screenWidth === 1242 && screenHeight === 2688) {
    console.log("828 or 1242 x 2688")
    gaugeSize = 390
    bacTextSize = 35
    alcTypeSize = 70
    alcTypeText = 40
    abvText = 20
    abvSize = 50
    abvWineText = 22
    abvWineSize = 60
    abvLiquorText = 22
    abvLiquorSize = 50
    addButtonText = 45
    addButtonSize = false
    multiSwitchMargin = 20
    loginButtonText = 25
    loginGenderText = 26
    numberInputSize = 270
    loginTitle = 30
    barChartWidth = 168
    scrollToAmt = 410
    warnTitleButton = 24
    warnBody = 20
} else if (screenWidth === 1440 && screenHeight === 2712 || screenWidth === 1440 && screenHeight === 2792 || screenWidth === 1440 && screenHeight === 2621 || screenWidth === 1440 && screenHeight === 2416) {
    console.log("1440 x 2712/2792/2621/2416(s6 edge+)")
    gaugeSize = 380
    bacTextSize = 30
    alcTypeSize = 70
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
    if (screenHeight === 2416) {
        barChartWidth = 202
        scrollToAmt = 479
    } else {
        barChartWidth = 168
        scrollToAmt = 410
    }
    warnTitleButton = 20
    warnBody = 17
} else if (screenWidth === 1080 && screenHeight === 2028) {
    console.log("1080 x 2028")
    gaugeSize = 365
    bacTextSize = 30
    alcTypeSize = 70
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
    barChartWidth = 159
    scrollToAmt = 392
    warnTitleButton = 18
    warnBody = 15
} else if (screenWidth === 1125) {
    console.log("1125")
    gaugeSize = 350
    bacTextSize = 30
    alcTypeSize = 64
    alcTypeText = 35
    abvText = 18
    abvSize = 42
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 45
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 15
    loginButtonText = 23
    loginGenderText = 26
    numberInputSize = 260
    loginTitle = 30
    barChartWidth = 150
    scrollToAmt = 375
    warnTitleButton = 22
    warnBody = 19
} else if (screenWidth === 1242) {
    console.log("1242")
    gaugeSize = 390
    bacTextSize = 30
    alcTypeSize = 70
    alcTypeText = 30
    abvText = 18
    abvSize = 45
    abvWineText = 20
    abvWineSize = 50
    abvLiquorText = 20
    abvLiquorSize = 50
    addButtonText = 40
    addButtonSize = false
    multiSwitchMargin = 5
    loginButtonText = 24
    loginGenderText = 24
    numberInputSize = 250
    loginTitle = 30
    barChartWidth = 170
    scrollToAmt = 415
    warnTitleButton = 20
    warnBody = 18
} else if (screenWidth === 1440 && screenHeight === 2896 || screenWidth === 1440 && screenHeight === 2816) {
    console.log("1440x2896/2816")
    gaugeSize = 455
    bacTextSize = 40
    alcTypeSize = 80
    alcTypeText = 45
    abvText = 25
    abvSize = 60
    abvWineText = 25
    abvWineSize = 60
    abvLiquorText = 25
    abvLiquorSize = 60
    addButtonText = 45
    addButtonSize = false
    multiSwitchMargin = 15
    loginButtonText = 26
    loginGenderText = 26
    numberInputSize = 260
    loginTitle = 32
    barChartWidth = 202
    scrollToAmt = 480
    warnTitleButton = 23
    warnBody = 20
} else if (screenWidth === 1440 && screenHeight === 2768) {
    console.log("1440x2768")
    gaugeSize = 335
    bacTextSize = 25
    alcTypeSize = 62
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
    barChartWidth = 143
    scrollToAmt = 363
    warnTitleButton = 18
    warnBody = 15
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
    barChartWidth = 168
    scrollToAmt = 410
    warnTitleButton = 16
    warnBody = 13
}
else if (screenWidth === 1536 && screenHeight === 2048 || screenWidth === 1668 && screenHeight === 2224 || screenWidth === 1668 && screenHeight === 2388 || screenWidth === 2048 && screenHeight === 2732) {
    console.log("ipad 9.7/ipad pro 10.5/ipad pro 11/12.9")
    gaugeSize = screenHeight === 2224 ? 735 : screenHeight === 2388 ? 765 : screenHeight === 2732 ? 910 : 630
    bacTextSize = screenHeight === 2224 ? 60 : screenHeight === 2388 ? 70 : screenHeight === 2732 ? 85 : 50
    alcTypeSize = screenHeight === 2388 ? 130 : screenHeight === 2732 ? 150 : 110
    alcTypeText = screenHeight === 2388 ? 60 : screenHeight === 2732 ? 70 : 55
    abvText = screenHeight === 2388 ? 40 : screenHeight === 2732 ? 50 : 35
    abvSize = screenHeight === 2388 ? 95 : screenHeight === 2732 ? 110 : 80
    abvWineText = screenHeight === 2388 ? 40 : screenHeight === 2732 ? 50 : 35
    abvWineSize = screenHeight === 2388 ? 95 : screenHeight === 2732 ? 110 : 80
    abvLiquorText = screenHeight === 2388 ? 40 : screenHeight === 2732 ? 50 : 35
    abvLiquorSize = screenHeight === 2388 ? 95 : screenHeight === 2732 ? 110 : 80
    addButtonText = screenHeight === 2388 ? 95 : screenHeight === 2732 ? 110 : 80
    addButtonSize = "tablet"
    multiSwitchMargin = 3
    loginButtonText = screenHeight === 2388 ? 40 : screenHeight === 2732 ? 50 : 35
    loginGenderText = screenHeight === 2388 ? 40 : screenHeight === 2732 ? 50 : 35
    numberInputSize = screenHeight === 2388 ? 420 : screenHeight === 2732 ? 450 : 400
    loginTitle = screenHeight === 2388 ? 50 : screenHeight === 2732 ? 60 : 45
    barChartWidth = screenHeight === 2224 ? 379 : screenHeight === 2388 ? 379 : screenHeight === 2732 ? 475 : 347
    scrollToAmt = screenHeight === 2224 ? 832 : screenHeight === 2388 ? 832 : screenHeight === 2732 ? 1024 : 768
    warnTitleButton = screenHeight === 2388 ? 40 : screenHeight === 2732 ? 45 : 35
    warnBody = screenHeight === 2388 ? 30 : screenHeight === 2732 ? 35 : 25
}
else if (screenWidth > 1125) {
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
    barChartWidth = 165
    scrollToAmt = 405
    warnTitleButton = 20
    warnBody = 18
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
    barChartWidth = 168
    scrollToAmt = 410
    warnTitleButton = 16
    warnBody = 13
}

const warnText = (<View><Text style={styles.modalTextTitle}>Warning!</Text>
    <Text style={styles.modalTextBody}>Your BAC is now above the legal drinking limit in most states.</Text>
    <Text style={styles.modalTextBody}>Consider:</Text>
    <Text style={[styles.modalTextAdvice, { fontWeight: "bold" }]}>Taking a break from drinking.</Text>
    <Text style={styles.modalTextAdvice}>Drinking some water.</Text>
    <Text style={styles.modalTextAdvice}>Call a friend, Uber, or Lyft to pick you up.</Text></View>)

const dangerText = (<View><Text style={styles.modalTextTitle}>Danger!</Text>
    <Text style={styles.modalTextBody}>Your BAC is well above the legal drinking limit.</Text>
    <Text style={[styles.modalTextTitle, { fontSize: 25 }]}>Take a break from drinking!</Text>
    <Text style={styles.modalTextAdvice}>Drink water!</Text>
    <Text style={styles.modalTextAdvice}>Call a friend, Uber, or Lyft to pick you up.</Text></View>)

const abovePoint10 = (<View><Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 5 }}>You are taking a break until:</Text>
    <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 5, fontWeight: "bold" }}>Your BAC is less than 0.10</Text>
    <Text style={{ color: "#000000", fontSize: abvText, textAlign: "center", padding: 5 }}>Until then, take a break and drink water.</Text></View>)

const loginText = (<View><Text style={{ color: "#000000", fontSize: abvText + 4, textAlign: "center", padding: 5, fontWeight: "bold" }}>Disclaimer</Text>
    <Text style={{ color: "#000000", fontSize: abvText - 5, textAlign: "center", padding: 5 }}>Any information provided by this application is for entertainment purposes only. All information displayed should not be considered or construed as medical, legal, or lifestyle advice on any subject matter.
One moderation function in this application estimates blood alcohol content (BAC) based on body weight and gender using information published by the National Institutes for Health (NIH).  Maximum recommended alcoholic consumption amounts are based on information provided by the Centers for Disease Control (CDC).  Actual BAC may be higher or lower than displayed in this app due to many factors including age, food consumption, medication, and hydration or dehydration levels.  These factors are not taken into account by this application when estimating BAC.
People are affected by alcohol consumption differently and we make no claim or guarantee that any person is safe or legal to operate any machinery, equipment, or vehicles before or after consuming any amount of alcohol.
All data entered into buzzin is stored locally, buzzin does not store personal data externally.  This app is designed as an estimation tool and to moderate alcohol consumption habits over time.</Text>
    <Text style={{ color: "#000000", fontSize: abvText - 2, textAlign: "center", padding: 8 }}>By pressing Agree, the user agrees to buzzin’s:</Text>
    <Text style={{ color: "#000000", fontSize: abvText - 2, textAlign: "center", paddingBottom: 25 }}>
        <Text style={{ color: "blue" }} onPress={() => { Linking.openURL('http://buzzin.io/privacy-policy.html') }}>Privacy Policy </Text>and
    <Text style={{ color: "blue" }} onPress={() => { Linking.openURL('http://buzzin.io/terms-of-service.html') }}> Terms of Service.</Text></Text></View>)

export {
    gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText, abvLiquorSize,
    addButtonText, addButtonSize, multiSwitchMargin, alcValues, activeStyle, beerActive, namekey, genderkey, weightkey, key, oldkey,
    breakkey, breakdatekey, autobreakkey, happyhourkey, autobreakminkey, autobreakthresholdkey, gaugeLabels, warnText, dangerText,
    limitkey, drinkskey, limitbackey, cancelbreakskey, showlimitkey, custombreakkey, abovePoint10, loginText, hhhourkey,
    loginButtonText, loginGenderText, numberInputSize, loginTitle, barChartWidth, scrollToAmt, indefbreakkey, limithourkey,
    limitdatekey, pacerkey, pacertimekey, shotsStyle, lastcallkey, logskey, maxreckey, warnTitleButton, warnBody, warningkey,
    screenHeight, screenWidth
}
