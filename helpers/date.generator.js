module.exports = {
	dateGenerate: (date) => {
		const newDate = new Date();

		newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
		newDate.setHours(7,0,0,1);

		return newDate;
	},

	getFirstLastDate: (date) => {
        const first = new Date(date);
        const last = new Date(date);

        first.setDate(1);
        first.setHours(7, 0, 0, 0);

        last.setMonth(last.getMonth() + 1);
        last.setDate(0);
        last.setHours(30, 59, 59, 999);

        return { first, last };
    },
}
