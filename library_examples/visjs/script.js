// These are the color base classes selected from the materialize css framework
color_classes = [
  'yellow',
  'light-green',
  'cyan',
  'blue-grey',
  'deep-purple',
  'blue-grey',
  'light-green',
];


// load the JSON data file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // create groups
    // These are lanes/rows on the timeline
    var groups = new vis.DataSet();
    // Items are time points or blocks that get added to a lane/group
    var items = new vis.DataSet();
    data.IngestTimelines.forEach((timelineLane, laneIndex) => {

      var groupId = laneIndex + 1; // assign groups based on index

      groups.add({
        id: groupId,
        content: "",
      });

      // Hilight the lane to show the range of time logged
      var start = new Date(timelineLane.BeginTime.UtcTime);
      var end = timelineLane.EndTime ? new Date(timelineLane.EndTime.UtcTime) : null;
      items.add({
        id: timelineLane.Name + " Region",
        group: groupId,
        start: start,
        end: end,
        content: timelineLane.Name,
        className: color_classes[laneIndex % color_classes.length] + " group-" + groupId,
        type: "background",
      });

      // Create the TimeRegions for media
      if (timelineLane.TimeRegions) {
        timelineLane.TimeRegions.forEach((region, index) => {
          var start = new Date(region.begin_time);
          var end = new Date(region.end_time);
          items.add({
            id: timelineLane.Name + " Media " + region.event_id,
            group: groupId,
            start: start,
            end: end,
            content: '<h5>' + region.event_id + '</h5>',
            className: color_classes[laneIndex % color_classes.length],
            title: "<table border='1'><tr><td> Start Time </td><td>" + start + "</td></tr><tr><td> End Time </td><td>" + end + "</td></tr></table>"
          });
        });
      }

      // Create the TimePoints for markers
      if (timelineLane.TimePoints) {
        timelineLane.TimePoints.forEach((point, index) => {
          var start = new Date(point.ArrivalTime.UtcTime);
          items.add({
            id: "SCTE-35 Marker #" + index + 1,
            group: groupId,
            start: start,
            content: "X",
            className: 'scte-35-marker ' + color_classes[laneIndex % color_classes.length] + ' group-' + groupId,
            // style: 'border-color: darkred;'
            // The title is the tooltip. Show time details and the event id
            title: "<table border='1'><tr><td> Arrival Time </td><td>" + start + "</td></tr><tr><td> Slice Time </td><td>" + start + "</td></tr></table>"
          });
        });
      }
    });

    // specify options
    var options = {
      stack: false,
      editable: false,
      horizontalScroll: true,
      groupHeightMode: 'fixed',
      // Height of timeline, in pixels
      height: 60 + data.IngestTimelines.length * 75,
      zoomKey: "ctrlKey",
      zoomMin: 100, // (milliseconds)
      zoomMax: 1000 * 60 * 60, // 60 minutes(milliseconds)

      margin: {
        item: 5, // minimal margin between items
        axis: 5,   // minimal margin between items and the axis
        item: { vertical: 30 } // minimal margin between items
      },
      orientation: 'bottom', // place events below media items
    };

    // create a Timeline
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container, null, options);
    timeline.on('click', function (properties) {
      var item = items.get(properties.item);
      console.log(item);
      // create the info box and display it
      var infoBox = document.getElementById('info-box');
      infoBox.innerHTML = '<h4>' + item.id + '</h4>' + '<p>' + item.title + '</p>';
      infoBox.style.display = 'block';
    });
    timeline.setGroups(groups);
    timeline.setItems(items);



    // Find all of the the divs that are vis-inner and insert an icon
    var visInner = document.getElementsByClassName('vis-inner');
    // Log the number of markers
    console.log(visInner.length);
    for (var i = 0; i < visInner.length; i++) {
      var div = document.createElement("div");
      div.className = "material-icons";
      div.innerHTML = "movie";
      visInner[i].appendChild(div);
    }

    // Find all of the vis-label divs and apply color
    var visLabel = document.getElementsByClassName('vis-label');
    for (var i = 0; i < visLabel.length; i++) {
      // Update the class to add the color
      visLabel[i].className = visLabel[i].className + " " + color_classes[i % color_classes.length];
    }


  })
  .catch(error => console.error(error));




// After the timeline is created, we can add the icons to the markers
// This is a hack to get the icons to show up on the markers
// Wait a second then add the icons
setTimeout(addIcons, 1000);


function addIcons() {
  var visItemContent = document.getElementsByClassName('scte-35-marker');

  console.log(visItemContent.length);
  for (var i = 0; i < visItemContent.length; i++) {
    // If this is also a vis-box
    // Replace with icon
    if (visItemContent[i].classList.contains('vis-box')) {

      visItemContent[i].innerHTML = "<div class='material-icons'>flag</div>";

    }

  }
}

