module.exports = {
    fixedNumber: (obj, fix = 2) => {
        let temp = {}
        for (let i of Object.keys(obj)) {
            temp[i] = obj[i];
            if (!isNaN(Number(obj[i]))) {
                const num = Number(obj[i]);
                if (Number.isInteger(num)) {
                    temp[i] = num;
                } else {
                    temp[i] = num.toFixed(fix);
                }
            }
        }
        return temp;
    }
}
