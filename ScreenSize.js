import { Dimensions, PixelRatio } from 'react-native';

var screenWidth = Dimensions.get('window').width * PixelRatio.get()
var screenHeight = Dimensions.get('window').height * PixelRatio.get()
console.log(screenWidth + " x " + screenHeight)

if (PixelRatio.get() === 1) {
    console.log("mdpi")
} else if (PixelRatio.get() === 1.5) {
    console.log("hdpi");
} else if (PixelRatio.get() === 2) {
    console.log("xhdpi");
} else if (PixelRatio.get() === 3) {
    console.log("xxhdpi");
} else if (PixelRatio.get() === 3.5) {
    console.log("xxxhdpi");
} else if (PixelRatio.get() === 4) {
    console.log("xxxhdpi");
}

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

let data = [{ value: 'Beer' }, { value: 'Wine' }, { value: 'Liquor' }];
let activeStyle = [{ color: 'white' }, { color: 'white' }, { color: 'white' }]
let beerActive = [{ color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }, { color: 'white' }]

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
} else if (screenWidth === 1440 && screenHeight === 2768) {
    console.log("1440x2768/2896")
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
} else {
    console.log("else")
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

export { gaugeSize, bacTextSize, alcTypeSize, alcTypeText, abvText, abvSize, abvWineText, abvWineSize, abvLiquorText, abvLiquorSize, addButtonText, addButtonSize, multiSwitchMargin, data, activeStyle, beerActive }