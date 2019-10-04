import { Vibration, Platform } from 'react-native';
import moment from "moment";
import AsyncStorage from '@react-native-community/async-storage';
import { oldkey, genderkey, key } from "./Variables";

export class Functions {

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

    static singleDuration(initialbuzz) {
        var date1 = Date.parse(initialbuzz), duration;
        var date2 = new Date().getTime()
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

    static varGetBAC(weight, gender, hours, buzz) {
        var distribution, drinkTotal, totalAlc, totalArray = [], bac
        if (gender === "Female") { distribution = 0.66 }
        if (gender === "Male") { distribution = 0.73 }
        for (var i = 0; i < buzz.length; i++) {
            if (buzz[i].drinkType === "Beer") { drinkTotal = buzz[i].oz * 1 * buzz[i].abv }
            if (buzz[i].drinkType === "Wine") { drinkTotal = buzz[i].oz * 1 * buzz[i].abv }
            if (buzz[i].drinkType === "Liquor") { drinkTotal = buzz[i].oz * 1 * buzz[i].abv }
            if (buzz[i].drinkType === "Cocktail") { drinkTotal = buzz[i].oz * 1 * buzz[i].abv }
            totalArray.push(drinkTotal)
        }
        totalAlc = totalArray.reduce((a, b) => a + b, 0);
        bac = (totalAlc * 5.14) / (weight * distribution) - 0.015 * hours;
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
        if (alcohol === "Cocktail" && number === 0) { return 1.5 }
        if (alcohol === "Cocktail" && number === 1) { return 3 }
        if (alcohol === "Cocktail" && number === 2) { return 4.5 }
        if (alcohol === "Cocktail" && number === 3) { return 6 }
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
        if (value === "Cocktail") { return [0.45, 1.5] }
    }

    static setColorPercent(bac) {
        if (bac === 0 || bac === undefined) { return ["#ffffff", 0] }
        else if (bac > 0.00 && bac < 0.01) { return ["#b5d3a0", bac * 1000] }
        else if (bac >= 0.01 && bac < 0.02) { return ["#96c060", bac * 1000] }
        else if (bac >= 0.02 && bac < 0.03) { return ["#9fc635", bac * 1000] }
        else if (bac >= 0.03 && bac < 0.04) { return ["#d3e50e", bac * 1000] }
        else if (bac >= 0.04 && bac < 0.05) { return ["#ffeb00", bac * 1000] }
        else if (bac >= 0.05 && bac < 0.06) { return ["#f9bf00", bac * 1000] }
        else if (bac >= 0.06 && bac < 0.07) { return ["#e98f00", bac * 1000] }
        else if (bac >= 0.07 && bac < 0.08) { return ["#d05900", bac * 1000] }
        else if (bac >= 0.08 && bac < 0.09) { return ["#AE0000", bac * 1000] }
        else if (bac >= 0.09 && bac < 0.10) { return ["#571405", bac * 1000] }
        else if (bac >= 0.10) { return ["#000000", 100] }
    }

    static barColor(drinks, weekMonth, gender) {
        if (gender === "Male") {
            if (weekMonth === "seven") {
                if (drinks <= 5) { return ["#96c060", "0-5 Low"] }
                else if (drinks > 5 && drinks <= 10) { return ["#ffeb00", "6-10 Moderate"] }
                else if (drinks > 10 && drinks <= 14) { return ["#e98f00", "11-14 Max"] }
                else if (drinks > 14) { return ["#AE0000", "15+ Over Max"] }
            } else {
                if (drinks <= 20) { return ["#96c060", "0-20 Low"] }
                else if (drinks > 20 && drinks <= 40) { return ["#ffeb00", "21-40 Moderate"] }
                else if (drinks > 40 && drinks <= 56) { return ["#e98f00", "41-56 Max"] }
                else if (drinks > 56) { return ["#AE0000", "56+ Over Max"] }
            }
        } else {
            if (weekMonth === "seven") {
                if (drinks <= 2) { return ["#96c060", "0-2 Low"] }
                else if (drinks > 2 && drinks <= 5) { return ["#ffeb00", "3-5 Moderate"] }
                else if (drinks > 5 && drinks <= 7) { return ["#e98f00", "6-7 Max"] }
                else if (drinks > 7) { return ["#AE0000", "8+ Over Max"] }
            } else {
                if (drinks <= 10) { return ["#96c060", "0-10 Low"] }
                else if (drinks > 10 && drinks <= 20) { return ["#ffeb00", "11-20 Moderate"] }
                else if (drinks > 20 && drinks <= 28) { return ["#e98f00", "21-28 Max"] }
                else if (drinks > 28) { return ["#AE0000", "29+ Over Max"] }
            }
        }
    }

    static reverseArray(array) {
        var reversedArray = [];
        for (var i = array.length - 1; i >= 0; i--) { reversedArray.push(array[i]) }
        return reversedArray;
    }

    static bacEmotion(bac) {
        if (bac > 0.00 && bac < 0.01) { return ["white", Platform.OS === 'android' && Platform.Version < 24 ? "😊" : "🙂"] }
        else if (bac >= 0.01 && bac < 0.02) { return ["white", Platform.OS === 'android' && Platform.Version < 24 ? "☺️" : "😊"] }
        else if (bac >= 0.02 && bac < 0.03) { return ["white", Platform.OS === 'android' && Platform.Version < 24 ? "😀" : "☺️"] }
        else if (bac >= 0.03 && bac < 0.04) { return ["teal", "😃"] }
        else if (bac >= 0.04 && bac < 0.05) { return ["teal", "😄"] }
        else if (bac >= 0.05 && bac < 0.06) { return ["teal", "😆"] }
        else if (bac >= 0.06 && bac < 0.07) { return ["white", "😝"] }
        else if (bac >= 0.07 && bac < 0.08) { return ["white", "😜"] }
        else if (bac >= 0.08 && bac < 0.09) { return ["white", Platform.OS === 'android' && Platform.Version < 24 ? "😋" : "🤪"] }
        else if (bac >= 0.09 && bac < 0.10) { return ["white", Platform.OS === 'android' && Platform.Version < 24 ? "😅" : "🥴"] }
        else if (bac >= 0.10) { return ["white", Platform.OS === 'android' && Platform.Version < 24 ? "😵" : "🤮"] }
    }

    static timeSince(recent, type) {
        var date1 = Date.parse(recent), date2 = new Date().getTime();
        var dayHourMin = type === "timesince" ? this.getDayHourMin(date1, date2) : this.getDayHourMin(date2, date1)
        return [dayHourMin[0], dayHourMin[1], dayHourMin[2], dayHourMin[3]]
    }

    static zeroDate() {
        var breakDate = new Date()
        breakDate.setHours(breakDate.getHours() + Math.round(breakDate.getMinutes() / 60))
        breakDate.setMinutes(0, 0, 0)
        return breakDate
    }

    static async maxRecDrinks() {
        var oldbuzzes, gender, sevenArray = [], thirtyArray = [], lastWeeks = [], weeksData = [],
            maxrecdata = [], maxrecgender, weekColor, monthColor, sevenData, weekly, monthly, buzzes
        await AsyncStorage.multiGet([oldkey, genderkey, key], (error, result) => {
            gender = JSON.parse(result[1][1])
            if (result[0][1] !== null && result[1][1] !== null) {
                oldbuzzes = JSON.parse(result[0][1])
                result[2][1] !== null && result[2][1] !== "[]" ? buzzes = JSON.parse(result[2][1]) : buzzes = []
                var numOfArrays = Math.ceil(this.singleDuration(oldbuzzes[0][0].dateCreated) / 168)
                maxrecgender = gender === "Male" ? 14 : 7
                for (i = 1; i <= numOfArrays; i++) { lastWeeks.push([]) }
                (oldbuzzes.map((buzz) => {
                    return buzz.map((oldbuzz) => {
                        var drinkTime = this.singleDuration(oldbuzz.dateCreated);
                        if (drinkTime < 168) { lastWeeks[0].push(oldbuzz), sevenArray.push(oldbuzz) }
                        if (drinkTime < 720) { thirtyArray.push(oldbuzz) }
                        for (var i = 1; i < numOfArrays; i++) {
                            var low = 168 * i, high = 168 * (i + 1)
                            if (drinkTime >= low && drinkTime < high) { lastWeeks[i].push(oldbuzz) }
                        }
                    })
                }))
                for (i = 0; i < numOfArrays; i++) {
                    weeksData.push(lastWeeks[i].length)
                    maxrecdata.push(maxrecgender)
                }
                weekColor = this.barColor(sevenArray.length + buzzes.length, "seven", gender)
                monthColor = this.barColor(thirtyArray.length, "thirty", gender)
                sevenData = [sevenArray.length + buzzes.length], thirtyData = [thirtyArray.length]
                weekly = gender === "Male" ? 14 : 7
                monthly = gender === "Male" ? 56 : 28
            } else {
                if (result[2][1] !== null && result[2][1] !== "[]") {
                    buzzes = JSON.parse(result[2][1])
                    weeksData = [0], maxrecdata = [0], maxrecgender = [0], weekColor = this.barColor(buzzes.length, "seven", gender), monthColor = ["#ffffff", "0 Drinks"], sevenData = [buzzes.length], thirtyData = [0], weekly = 14, monthly = 56
                } else {
                    weeksData = [0], maxrecdata = [0], maxrecgender = [0], weekColor = ["#ffffff", "0 Drinks"], monthColor = ["#ffffff", "0 Drinks"], sevenData = [0], thirtyData = [0], weekly = 14, monthly = 56
                }
            }
        })
        return [weeksData, maxrecdata, maxrecgender, weekColor, monthColor, sevenData, thirtyData, weekly, monthly]
    }
}

