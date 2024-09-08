module.exports = {
	dateGenerate: (date) => {
		const newDate = new Date();

		newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
		newDate.setHours(0,0,0,0);

		return newDate;
	},

	getFirstLastDate: (date) => {
        const first = new Date(date);
        const last = new Date(date);

        first.setHours(0, 0, 0, 0);
        first.setDate(1);

        last.setHours(23, 59, 59, 59);
        last.setMonth(last.getMonth() + 1);
        last.setDate(0);

        return { first, last };
    },
}
