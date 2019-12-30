// var cal = new CalHeatMap();
// 	cal.init({
// 	itemSelector: "#domainDynamicDimension-b",
// 	domain: "month",
// 	range: 5,
// 	cellSize: 8,
// 	displayLegend: false,
// 	domainDynamicDimension: false,
// 	nextSelector: "#domainDynamicDimension-next",
// 	previousSelector: "#domainDynamicDimension-previous",
// 	itemNamespace: "domainDynamicDimension",
//     //The string is interpreted as an URL to an API, 
//     //which should be returning the data used to fill the calendar.
//     start: new Date(2019, 0), // January, 1st 2019
// 	range: 12,
// 	domain: "year",
// 	subDomain: "month",
// 	data: data.json//"http://localhost/api?start={{d:start}}&stop={{d:end}}"
// });
//cal.next(); // Load January 2020

var cal = new CalHeatMap();
cal.init({
	itemSelector: "#cal-heatmap",
	domain: "month",
	subDomain: "x_day",
	data: "data-years.json",
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

