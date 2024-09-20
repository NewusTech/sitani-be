module.exports = {
    fixedNumber: (obj, fix = 2) => {
        let temp = {}
        for (let i of Object.keys(obj)) {
            temp[i] = obj[i] ? (Number.isInteger(obj[i]) ? obj[i] : (obj[i]).toFixed(fix)) : null;
        }
        return temp;
    }
}
