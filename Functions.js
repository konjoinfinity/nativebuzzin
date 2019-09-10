import { Vibration } from 'react-native';
import moment from "moment";

export class Functions {

    // The getDayHourMin passes in two timestamps (dates) and calculates the duration between the two
    // returns the values in and array of [days, hours, minutes, seconds]
    static getDayHourMin(date1, date2) {
        var dateDiff = date2 - date1;
        dateDiff = dateDiff / 1000;
        var seconds = Math.floor(dateDiff % 60);
        dateDiff = dateDiff / 60;
        var minutes = Math.floor(dateDiff % 60);
        dateDiff = dateDiff / 60;
        var hours = Math.floor(dateDiff % 24);
        var days = Math.floor(dateDiff / 24);
        return [days, hours, minutes, seconds];
    }

    // The singleDuration method takes a timestamp argument of the first drink in the current buzz array
    // It calculates the duration between that timestamp and the a current timestamp (when the function is run)
    // The duration is calculated and the value is returned in hours, (this utlilizes the getDayHourMin method)
    static singleDuration(initialbuzz) {
        var date1 = Date.parse(initialbuzz), duration, currentDate = new Date();
        var date2 = currentDate.getTime();
        var dayHourMin = this.getDayHourMin(date1, date2);
        var days = dayHourMin[0], hours = dayHourMin[1], minutes = dayHourMin[2], seconds = dayHourMin[3];
        if (days >= 1) { hours = hours + days * 24 }
        if (hours == 0) { duration = minutes / 60 + seconds / 3600 }
        else { duration = hours + minutes / 60 + seconds / 3600 }
        return duration;
    }

    static breakDiff(date1, date2) {
        var currentdate = moment(date1), breakdate = moment(date2), intervals = ['months', 'weeks', 'days', 'hours'], durations = [];
        for (var i = 0; i < intervals.length; i++) {
            var diff = breakdate.diff(currentdate, intervals[i]);
            currentdate.add(diff, intervals[i]);
            durations.push(diff);
        }
        return durations;
    };

    // varGetBAC (VariableGetBAC) This method is the most important part of the app paried with the two methods (getDayHourMin & singleDuration)
    // It takes weight (user weight), gender (user gender), hours (duration elapsed since the first drink was added),
    // and buzz (this.state.buzz - buzz array) as parameters.  Distribution is different depending on the user gender.
    // The method then loops through the current buzz array and calculates the total bac based on each variable drink
    // type, abv, and ounce size.  Returns the total bac 
    static varGetBAC(weight, gender, hours, buzz) {
        var distribution, drinkTotal, totalAlc, totalArray = [];
        if (gender === "Female") { distribution = 0.66 }
        if (gender === "Male") { distribution = 0.73 }
        for (var i = 0; i < buzz.length; i++) {
            if (buzz[i].drinkType === "Beer") { drinkTotal = buzz[i].oz * 1 * buzz[i].abv }
            if (buzz[i].drinkType === "Wine") { drinkTotal = buzz[i].oz * 1 * buzz[i].abv }
            if (buzz[i].drinkType === "Liquor") { drinkTotal = buzz[i].oz * 1 * buzz[i].abv }
            totalArray.push(drinkTotal)
        }
        totalAlc = totalArray.reduce((a, b) => a + b, 0)
        var bac = (totalAlc * 5.14) / (weight * distribution) - 0.015 * hours;
        return bac;
    }

    static setOz(number, alcohol) {
        Vibration.vibrate();
        if (alcohol === "Beer" && number === 0) { return 12 }
        if (alcohol === "Beer" && number === 1) { return 16 }
        if (alcohol === "Beer" && number === 2) { return 20 }
        if (alcohol === "Wine" && number === 0) { return 5 }
        if (alcohol === "Wine" && number === 1) { return 8 }
        if (alcohol === "Wine" && number === 2) { return 12 }
        if (alcohol === "Liquor" && number === 0) { return 1.5 }
        if (alcohol === "Liquor" && number === 1) { return 3 }
        if (alcohol === "Liquor" && number === 2) { return 6 }
    }

    static setAbv(number, alcohol) {
        Vibration.vibrate();
        if (alcohol === "Beer" && number === 0) { return 0.04 }
        if (alcohol === "Beer" && number === 1) { return 0.05 }
        if (alcohol === "Beer" && number === 2) { return 0.06 }
        if (alcohol === "Beer" && number === 3) { return 0.07 }
        if (alcohol === "Beer" && number === 4) { return 0.08 }
        if (alcohol === "Wine" && number === 0) { return 0.11 }
        if (alcohol === "Wine" && number === 1) { return 0.12 }
        if (alcohol === "Wine" && number === 2) { return 0.13 }
        if (alcohol === "Liquor" && number === 0) { return 0.30 }
        if (alcohol === "Liquor" && number === 1) { return 0.40 }
        if (alcohol === "Liquor" && number === 2) { return 0.50 }
    }

    static setAlcType(value) {
        Vibration.vibrate();
        if (value === "Beer") { return [0.05, 12] }
        if (value === "Wine") { return [0.12, 5] }
        if (value === "Liquor") { return [0.40, 1.5] }
    }

    static setColorPercent(bac) {
        if (bac === 0 || bac === undefined) { return ["#ffffff", 0] }
        else if (bac > 0.00 && bac < 0.01) { return ["#b5d3a0", bac * 1000] }
        else if (bac > 0.01 && bac < 0.02) { return ["#96c060", bac * 1000] }
        else if (bac > 0.02 && bac < 0.03) { return ["#9fc635", bac * 1000] }
        else if (bac > 0.03 && bac < 0.04) { return ["#d3e50e", bac * 1000] }
        else if (bac > 0.04 && bac < 0.05) { return ["#ffeb00", bac * 1000] }
        else if (bac > 0.05 && bac < 0.06) { return ["#f9bf00", bac * 1000] }
        else if (bac > 0.06 && bac < 0.07) { return ["#e98f00", bac * 1000] }
        else if (bac > 0.07 && bac < 0.08) { return ["#d05900", bac * 1000] }
        else if (bac > 0.08 && bac < 0.09) { return ["#AE0000", bac * 1000] }
        else if (bac > 0.09 && bac < 0.10) { return ["#571405", bac * 1000] }
        else if (bac >= 0.10) { return ["#000000", 100] }
    }

    static sevenColor(drinks) {
        if (drinks <= 5) { return "#96c060" }
        else if (drinks > 5 && drinks <= 10) { return "#ffeb00" }
        else if (drinks > 10 && drinks <= 14) { return "#e98f00" }
        else if (drinks > 14) { return "#AE0000" }
    }

    static thirtyColor(drinks) {
        if (drinks <= 20) { return "#96c060" }
        else if (drinks > 20 && drinks <= 40) { return "#ffeb00" }
        else if (drinks > 40 && drinks <= 56) { return "#e98f00" }
        else if (drinks > 56) { return "#AE0000" }
    }

    static reverseArray(array) {
        var reversedArray = [];
        for (var i = array.length - 1; i >= 0; i--) { reversedArray.push(array[i]) }
        return reversedArray;
    }
}