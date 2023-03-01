// load the JSON data file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // create groups
    var groups = new vis.DataSet([
      {id: 1, content: 'Layer 1'},
      {id: 2, content: 'Layer 2'},
      {id: 3, content: 'Layer 3'}
    ]);

    // create items and events
    var items = new vis.DataSet();

    data.forEach((item, index) => {
      var group = index % 3 + 1; // assign groups based on index

      // create the item
      var start = new Date(item.startTime);
      var end = new Date(item.endTime);
      items.add({
        id: index + 1,
        group: group,
        start: start,
        end: end,
        content: item.name
      });

      // create the events
      item.events.forEach((event, eventIndex) => {
        var time = new Date(event.time);
        items.add({
          id: (index + 1) * 100 + eventIndex + 1,
          group: group,
          start: time,
          content: event.name,
          className: 'event'
        });
      });
    });

    // specify options
    var options = {
      stack: false,
      editable: true,
      margin: {
        item: 10, // minimal margin between items
        axis: 5   // minimal margin between items and the axis
      },
      orientation: 'top'
    };

    // create a Timeline
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container, null, options);
    timeline.setGroups(groups);
    timeline.setItems(items);
    
  })
  .catch(error => console.error(error));
