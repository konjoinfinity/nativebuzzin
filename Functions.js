import { Vibration } from 'react-native';
import moment from "moment";

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
        var date1 = Date.parse(initialbuzz)
        var duration;
        var currentDate = new Date();
        var date2 = currentDate.getTime();
        var dayHourMin = this.getDayHourMin(date1, date2);
        var days = dayHourMin[0];
        var hours = dayHourMin[1];
        var minutes = dayHourMin[2];
        var seconds = dayHourMin[3];
        if (days >= 1) {
            hours = hours + days * 24;
        }
        if (hours == 0) {
            duration = minutes / 60 + seconds / 3600;
        } else {
            duration = hours + minutes / 60 + seconds / 3600;
        }
        return duration;
    }

    static breakDiff(date1, date2) {
        var currentdate = moment(date1)
        var breakdate = moment(date2)
        var intervals = ['months', 'weeks', 'days', 'hours']
        var durations = [];
        for (var i = 0; i < intervals.length; i++) {
            var diff = breakdate.diff(currentdate, intervals[i]);
            currentdate.add(diff, intervals[i]);
            durations.push(diff);
        }
        return durations;
    };

    static varGetBAC(weight, gender, hours, buzz) {
        var distribution;
        var drinkTotal;
        var totalAlc;
        var totalArray = [];
        if (gender === "Female") {
            distribution = 0.66;
        }
        if (gender === "Male") {
            distribution = 0.73;
        }
        for (var i = 0; i < buzz.length; i++) {
            if (buzz[i].drinkType === "Beer") {
                drinkTotal = buzz[i].oz * 1 * buzz[i].abv;
            }
            if (buzz[i].drinkType === "Wine") {
                drinkTotal = buzz[i].oz * 1 * buzz[i].abv;
            }
            if (buzz[i].drinkType === "Liquor") {
                drinkTotal = buzz[i].oz * 1 * buzz[i].abv;
            }
            totalArray.push(drinkTotal)
        }
        totalAlc = totalArray.reduce((a, b) => a + b, 0)
        var bac = (totalAlc * 5.14) / (weight * distribution) - 0.015 * hours;
        return bac;
    }

    static setOz(number, alcohol) {
        Vibration.vibrate();
        if (alcohol === "Beer") {
            if (number === 0) { return 12 }
            if (number === 1) { return 16 }
            if (number === 2) { return 20 }
        }
        if (alcohol === "Wine") {
            if (number === 0) { return 5 }
            if (number === 1) { return 8 }
            if (number === 2) { return 12 }
        }
        if (alcohol === "Liquor") {
            if (number === 0) { return 1.5 }
            if (number === 1) { return 3 }
            if (number === 2) { return 6 }
        }
    }

    static setAbv(number, alcohol) {
        if (alcohol === "Beer") {
            Vibration.vibrate();
            if (number === 0) { return 0.04 }
            if (number === 1) { return 0.05 }
            if (number === 2) { return 0.06 }
            if (number === 3) { return 0.07 }
            if (number === 4) { return 0.08 }
        }
        if (alcohol === "Wine") {
            if (number === 0) { return 0.11 }
            if (number === 1) { return 0.12 }
            if (number === 2) { return 0.13 }
        }
        if (alcohol === "Liquor") {
            if (number === 0) { return 0.30 }
            if (number === 1) { return 0.40 }
            if (number === 2) { return 0.50 }
        }
    }

    static setAlcType(value) {
        Vibration.vibrate();
        if (value === "Beer") {
            return [0.05, 12]
        }
        if (value === "Wine") {
            return [0.12, 5]
        }
        if (value === "Liquor") {
            return [0.40, 1.5]
        }
    }

    static setColorPercent(bac) {
        if (bac === 0 || bac === undefined) {
            return ["#ffffff", 0]
        } else if (bac > 0.00 && bac < 0.01) {
            return ["#b5d3a0", bac * 1000]
        } else if (bac > 0.01 && bac < 0.02) {
            return ["#96c060", bac * 1000]
        } else if (bac > 0.02 && bac < 0.03) {
            return ["#9fc635", bac * 1000]
        } else if (bac > 0.03 && bac < 0.04) {
            return ["#d3e50e", bac * 1000]
        } else if (bac > 0.04 && bac < 0.05) {
            return ["#ffeb00", bac * 1000]
        } else if (bac > 0.05 && bac < 0.06) {
            return ["#f9bf00", bac * 1000]
        } else if (bac > 0.06 && bac < 0.07) {
            return ["#e98f00", bac * 1000]
        } else if (bac > 0.07 && bac < 0.08) {
            return ["#d05900", bac * 1000]
        } else if (bac > 0.08 && bac < 0.09) {
            return ["#AE0000", bac * 1000]
        } else if (bac > 0.09 && bac < 0.10) {
            return ["#571405", bac * 1000]
        } else if (bac >= 0.10) {
            return ["#000000", 100]
        }
    }

    static sevenColor(drinks) {
        if (drinks <= 5) {
            return "#96c060"
        } else if (drinks > 5 && drinks <= 10) {
            return "#ffeb00"
        } else if (drinks > 10 && drinks <= 14) {
            return "#e98f00"
        } else if (drinks > 14) {
            return "#AE0000"
        }
    }

    static thirtyColor(drinks) {
        if (drinks <= 20) {
            return "#96c060"
        } else if (drinks > 20 && drinks <= 40) {
            return "#ffeb00"
        } else if (drinks > 40 && drinks <= 56) {
            return "#e98f00"
        } else if (drinks > 56) {
            return "#AE0000"
        }
    }

    static reverseArray(array) {
        var reversedArray = [];
        for (var i = array.length - 1; i >= 0; i--) {
            reversedArray.push(array[i]);
        }
        return reversedArray;
    }
}