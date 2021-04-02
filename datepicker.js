// Datepicker Setup
document.querySelectorAll("[data-ls-date]").forEach((e, i) => {
	let x = e.getAttribute("data-ls-date");
	if(!isNaN(x)) {x = Number(x)}
	else {x = i + 100}
	datepicker(e, {
		// options
		id: x,
		minDate: new Date(),
		customDays: ["S", "M", "T", "W", "T", "S", "S"],
		formatter: (input, date, instance) => {
			let v = date.toDateString().replace(/^\S+\s/, "");
			input.value = v
		}
	})
});
