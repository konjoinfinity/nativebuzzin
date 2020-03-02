import { Platform } from 'react-native';
import moment from "moment";
import AsyncStorage from '@react-native-community/async-storage';
import { oldkey, genderkey, key } from "./Variables";
import ReactNativeHaptic from 'react-native-haptic';

export class Functions {

    static getDayHourMin(date1, date2) {
        try {
            var dateDiff = date2 - date1;
            dateDiff = dateDiff / 1000;
            var seconds = Math.floor(dateDiff % 60);
            dateDiff = dateDiff / 60;
            var minutes = Math.floor(dateDiff % 60);
            dateDiff = dateDiff / 60;
            var hours = Math.floor(dateDiff % 24);
            var days = Math.floor(dateDiff / 24);
            return [days, hours, minutes, seconds];
        } catch (error) {
            console.log(error)
        }
    }

    static singleDuration(initialbuzz) {
        try {
            var date1 = Date.parse(initialbuzz), duration;
            var date2 = new Date().getTime()
            var dayHourMin = this.getDayHourMin(date1, date2);
            var days = dayHourMin[0], hours = dayHourMin[1], minutes = dayHourMin[2], seconds = dayHourMin[3];
            if (days >= 1) { hours = hours + days * 24 }
            if (hours == 0) { duration = minutes / 60 + seconds / 3600 }
            else { duration = hours + minutes / 60 + seconds / 3600 }
            return duration;
        } catch (error) {
            console.log(error)
        }
    }

    static breakDiff(date1, date2) {
        try {
            var currentdate = moment(date1), breakdate = moment(date2), intervals = ['months', 'weeks', 'days', 'hours'], durations = [];
            for (var i = 0; i < intervals.length; i++) {
                var diff = breakdate.diff(currentdate, intervals[i]);
                currentdate.add(diff, intervals[i]);
                durations.push(diff);
            }
            return durations;
        } catch (error) {
            console.log(error)
        }
    };

    static setOz(number, alcohol, metric) {
        try {
            ReactNativeHaptic.generate('selection')
            if (alcohol === "Beer" && number === 0 && metric === "oz") { return 12 }
            if (alcohol === "Beer" && number === 1 && metric === "oz") { return 16 }
            if (alcohol === "Beer" && number === 2 && metric === "oz") { return 20 }
            if (alcohol === "Wine" && number === 0 && metric === "oz") { return 5 }
            if (alcohol === "Wine" && number === 1 && metric === "oz") { return 8 }
            if (alcohol === "Wine" && number === 2 && metric === "oz") { return 12 }
            if (alcohol === "Liquor" && number === 0 && metric === "oz") { return 1.5 }
            if (alcohol === "Liquor" && number === 1 && metric === "oz") { return 3 }
            if (alcohol === "Liquor" && number === 2 && metric === "oz") { return 6 }
            if (alcohol === "Cocktail" && number === 0 && metric === "oz") { return 1.5 }
            if (alcohol === "Cocktail" && number === 1 && metric === "oz") { return 3 }
            if (alcohol === "Cocktail" && number === 2 && metric === "oz") { return 4.5 }
            if (alcohol === "Cocktail" && number === 3 && metric === "oz") { return 6 }
            if (alcohol === "Beer" && number === 0 && metric === "ml") { return 11.15 }
            if (alcohol === "Beer" && number === 1 && metric === "ml") { return 16.9 }
            if (alcohol === "Beer" && number === 2 && metric === "ml") { return 25.36 }
            if (alcohol === "Wine" && number === 0 && metric === "ml") { return 5.91 }
            if (alcohol === "Wine" && number === 1 && metric === "ml") { return 8.45 }
            if (alcohol === "Wine" && number === 2 && metric === "ml") { return 12.68 }
            if (alcohol === "Liquor" && number === 0 && metric === "ml") { return 0.84 }
            if (alcohol === "Liquor" && number === 1 && metric === "ml") { return 1.18 }
            if (alcohol === "Liquor" && number === 2 && metric === "ml") { return 1.69 }
            if (alcohol === "Cocktail" && number === 0 && metric === "ml") { return 1.7 }
            if (alcohol === "Cocktail" && number === 1 && metric === "ml") { return 3.4 }
            if (alcohol === "Cocktail" && number === 2 && metric === "ml") { return 5.1 }
            if (alcohol === "Cocktail" && number === 3 && metric === "ml") { return 6.8 }
        } catch (error) {
            console.log(error)
        }
    }

    static setAbv(number, alcohol) {
        try {
            ReactNativeHaptic.generate('selection')
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
        } catch (error) {
            console.log(error)
        }
    }

    static setAlcType(value, metric) {
        try {
            ReactNativeHaptic.generate('selection')
            if (metric === "oz") {
                if (value === "Beer") { return [0.05, 12] }
                if (value === "Wine") { return [0.12, 5] }
                if (value === "Liquor") { return [0.40, 1.5] }
                if (value === "Cocktail") { return [0.45, 1.5] }
            } else if (metric === "ml") {
                if (value === "Beer") { return [0.05, 11.15] }
                if (value === "Wine") { return [0.12, 5.91] }
                if (value === "Liquor") { return [0.40, 0.84] }
                if (value === "Cocktail") { return [0.45, 1.7] }
            }
        } catch (error) {
            console.log(error)
        }
    }

    static barColor(drinks, weekMonth, gender) {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    static timeSince(recent, type) {
        try {
            var date1 = Date.parse(recent), date2 = new Date().getTime();
            var dayHourMin = type === "timesince" ? this.getDayHourMin(date1, date2) : this.getDayHourMin(date2, date1)
            return [dayHourMin[0], dayHourMin[1], dayHourMin[2], dayHourMin[3]]
        } catch (error) {
            console.log(error)
        }
    }

    static zeroDate() {
        try {
            var breakDate = new Date()
            breakDate.setHours(breakDate.getHours() + Math.round(breakDate.getMinutes() / 60))
            breakDate.setMinutes(0, 0, 0)
            return breakDate
        } catch (error) {
            console.log(error)
        }
    }

    static standardDrinks(oz, abv) {
        try {
            var total, volume;
            volume = oz * 29.574
            total = volume * abv * 0.78924
            total = total / 14
            return parseFloat(total.toFixed(1))
        } catch (error) {
            console.log(error)
        }
    }

    static drinkVals(old) {
        try {
            var total = [];
            old.map((buzz) => {
                var drink;
                drink = this.standardDrinks(buzz.oz, buzz.abv)
                total.push(drink)
            })
            return parseFloat(total.reduce((a, b) => a + b, 0).toFixed(1))
        } catch (error) {
            console.log(error)
        }
    }

    static async maxRecDrinks() {
        try {
            var oldbuzzes, gender, sevenArray = [], thirtyArray = [], lastWeeks = [], weeksData = [], trendLine = [],
                maxrecdata = [], maxrecgender, weekColor, monthColor, sevenData, weekly, monthly, buzzes, pushavg, avg;
            await AsyncStorage.multiGet([oldkey, genderkey, key], (error, result) => {
                gender = JSON.parse(result[1][1])
                if (result[0][1] !== null && result[0][1] !== "[]" && result[1][1] !== null && result[1][1] !== "[]") {
                    oldbuzzes = JSON.parse(result[0][1])
                    result[2][1] !== null && result[2][1] !== "[]" ? buzzes = JSON.parse(result[2][1]) : buzzes = []
                    var numOfArrays = Math.ceil(this.singleDuration(oldbuzzes[oldbuzzes.length - 1][oldbuzzes[oldbuzzes.length - 1].length - 1].dateCreated) / 168)
                    maxrecgender = gender === "Male" ? 14 : 7
                    for (i = 0; i <= numOfArrays; i++) { lastWeeks.push([]) }
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
                        weeksData.push(this.drinkVals(lastWeeks[i]))
                        maxrecdata.push(maxrecgender)
                        trendLine.push(this.drinkVals(lastWeeks[i]) / 7)
                    }
                    weekColor = this.barColor(this.drinkVals(sevenArray) + this.drinkVals(buzzes), "seven", gender)
                    monthColor = this.barColor(this.drinkVals(thirtyArray) + this.drinkVals(buzzes), "thirty", gender)
                    sevenData = [this.drinkVals(sevenArray) + this.drinkVals(buzzes)]
                    thirtyData = [this.drinkVals(thirtyArray) + this.drinkVals(buzzes)]
                    weekly = gender === "Male" ? 14 : 7
                    monthly = gender === "Male" ? 56 : 28
                    pushavg = weeksData.reduce((a, b) => a.concat(b), []).reduce((a, b) => a + b, 0) / weeksData.length
                    avg = Array(maxrecdata.length).fill(pushavg)
                } else {
                    if (result[2][1] !== null && result[2][1] !== "[]") {
                        buzzes = JSON.parse(result[2][1])
                        weeksData = [0], maxrecdata = [0], maxrecgender = [0], weekColor = this.barColor(buzzes.length, "seven", gender), monthColor = ["#ffffff", "0 Drinks"], sevenData = [buzzes.length], thirtyData = [0], weekly = 14, monthly = 56, trendArr = [0], avg = [0]
                    } else {
                        weeksData = [0], maxrecdata = [0], maxrecgender = [0], weekColor = ["#ffffff", "0 Drinks"], monthColor = ["#ffffff", "0 Drinks"], sevenData = [0], thirtyData = [0], weekly = 14, monthly = 56, trendArr = [0], avg = [0]
                    }
                }
            })
            return [weeksData, maxrecdata, maxrecgender, weekColor, monthColor, sevenData, thirtyData, weekly, monthly, avg]
        } catch (error) {
            console.log(error)
        }
    }

    // Calculate everyday for drinks consumed
    // If no drink for that day, push empty array
    // Plot and display total number of standard drinks per day
    // Will have to overlay 7 line chart points per week
    // Overlay days of the week? Probably for ease reading, grab datestamp from drink (if drink)
    // Will likely have to loop over the object, adding one day after last drink is read or no drinks are present
    // Potentially add "Today" stacked bar chart for last 7 days 
    // start from oldest or most recent?

    // Only run if 2 weeks worth of data is present, just like maxrecdrinks/weekly & cumulative switch

    // static async dailyDrinks() {
    //     try {
    //         var oldDrinks, days;
    //         await AsyncStorage.getItem(oldkey, (error, result) => {
    //             oldDrinks = JSON.parse(result)
    //             days = this.getDayHourMin(Date.parse(oldDrinks[oldDrinks.length - 1][oldDrinks[oldDrinks.length - 1].length - 1].dateCreated), Date.parse(oldDrinks[0][0].dateCreated))

    //         })
    //         console.log("Total Days: " + days[0])
    //         console.log(days[0])
    //         var dailyarr = []
    //         var totalbuzzes = oldDrinks.length - 1
    //         var currentDay = new Date(oldDrinks[oldDrinks.length - 1][oldDrinks[oldDrinks.length - 1].length - 1].dateCreated)
    //         for (i = 0; i <= days[0]; i++) {
    //             var dayNum = currentDay.getDate()
    //             // console.log(totalbuzzes)
    //             // console.log(currentDay)
    //             // console.log(dayNum)
    //             // console.log(currentDay)
    //             dayNum = currentDay.getDate()
    //             // var daytotal = 0
    //             // console.log(oldDrinks[totalbuzzes][0].dateCreated)
    //             var currentDrink = new Date(oldDrinks[totalbuzzes][0].dateCreated).getDate()
    //             console.log(dayNum)
    //             console.log(currentDrink)
    //             if (currentDrink === dayNum) {
    //                 // will have to loop / map through each buzz, and check each
    //                 // return total calculated standard drinks for that day
    //                 // daytotal = # of standard drinks
    //                 // calculate standard drinks for that drink array, then push the [total]
    //                 dailyarr.push([1])
    //                 totalbuzzes = totalbuzzes - 1
    //                 console.log(totalbuzzes)
    //                 currentDay.setDate(currentDay.getDate() + 1);
    //             } else {
    //                 dailyarr.push([0])
    //                 currentDay.setDate(currentDay.getDate() + 1);
    //                 // daytotal = 0
    //             }
    //         }
    //         console.log(dailyarr)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
}

