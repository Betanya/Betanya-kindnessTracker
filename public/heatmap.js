var database = require("../data/database.js");


var cal = new CalHeatMap();
cal.init({
	itemSelector: "#cal-heatmap",
	domain: "month",
	subDomain: "x_day",
	data: "data-years.json",

	//would data look like this: 
	//data: getDataForHeatmap(username);
	//How would be put the username there?
	start: new Date(2000, 0, 5),
	cellSize: 20,
	cellPadding: 5,
	domainGutter: 20,
	range: 2,
	domainDynamicDimension: false,
	//previousSelector: "#example-g-PreviousDomain-selector",
	//nextSelector: "#example-g-NextDomain-selector",
	// domainLabelFormat: function(date) {
	// 	moment.lang("en");
	// 	return moment(date).format("MMMM").toUpperCase();
	// },
	subDomainTextFormat: "%d",
	legend: [20, 40, 60, 80]
});

