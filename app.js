var page = tabris.create("Page", {
  title: "OUTATIME",
  topLevel: true
});

var travelPlan = [
  {
    name: "DESTINATION",
    color: "red",
    date: new Date(Date.UTC(2015, 9, 21, 19, 28, 0, 0))
  },
  {
    name: "PRESENT",
    color: "green",
    date: new Date()
  },
  {
    name: "DEPARTED",
    color: "#FFA500",
    date: new Date(Date.UTC(1985, 9, 26, 21, 0, 0, 0))
  }
];

var destinationSection = createSection(travelPlan[0], {centerX: 0, top: 32}).appendTo(page);

var presentSection = createSection(travelPlan[1], {centerX: 0, top: [destinationSection, 10]}).appendTo(page);

var departedSection = createSection(travelPlan[2], {centerX: 0, top: [presentSection, 10]}).appendTo(page);

var button = tabris.create("Button", {
  text: "Add to Calendar",
  layoutData: {centerX: 0, top: [departedSection, 20]}
}).appendTo(page);

var statusLabel = tabris.create("TextView", {
    text: "",
    font: "12px",
    textColor: "#696969",
    layoutData: {centerX: 0, top: [button, 5]}
  }).appendTo(page);

tabris.create("TextView", {
    text: "Note: All times are UTC",
    font: "12px",
    textColor: "#696969",
    layoutData: {right: 2, bottom: 0}
  }).appendTo(page);

button.on("select", function() {
  saveToCalendar(travelPlan);
});

function createSection(travel, layout) {
  var section = tabris.create("Composite", {layoutData: layout});
  var label = tabris.create("TextView", {
    text: travel.name,
    font: "12px",
    textColor: "#696969",
    layoutData: {left: 0, top: 0}
  }).appendTo(section);
  var display = tabris.create("TextView", {
    font: "24px",
    textColor: travel.color,
    layoutData: {left: 0, top: label}
  }).appendTo(section);
  display.set("text", formatDate(travel.date));
  section.on("tap", function(widget, event) {
    var options = {
      x: page.get("bounds").width / 2,
      date: travel.date,
      mode: 'datetime'
    };
    datePicker.show(options, function(date) {
      if( date instanceof Date ) {
        travel.date = date;
    	  display.set("text", formatDate(date));
      }
    });
  });
  return section;
}

function formatDate(date) {
  var value = date.toUTCString();
  var startIndex = value.indexOf(' ') + 1;
  var endIndex = value.indexOf(' GMT');
  return value.substring(startIndex, endIndex);
}

function saveToCalendar(travels) {
  for (var index = 0; index < travels.length; index++) {
    var travel = travels[index];
    cordova.plugins.CalendarPlugin.createEvent(
      "[BTTF] " + travel.name,
      'Hill Valley',
      'At 88MPH',
      travel.date.getTime(), // Start date as a timestamp in ms
      travel.date.getTime() + 5*60*1000, // End date as a timestamp in ms
      false, // Whether it is an all day event or not,
      function() { // function called on success
        statusLabel.set("text", "Adding succeeded.\nSearch for \"BTTF\".");
      },
      function() { // function called on error
        statusLabel.set("text", "Adding failed");
      }
    );
  }
}

page.open();