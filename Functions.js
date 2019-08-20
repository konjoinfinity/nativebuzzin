
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
}