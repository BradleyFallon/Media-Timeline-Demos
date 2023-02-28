
google.charts.load('current', { 'packages': ['timeline'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {


  var jsonData = $.ajax({
    url: "data.json",
    dataType: "json",
    async: false
  })
    .fail(function () {
      alert("Fail&ed to load data.");
    })
    .responseText;
  jsonData = JSON.parse(jsonData);

  // Create the data table.
  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Clip' });
  dataTable.addColumn({ type: 'string', id: 'Event' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });

  for (var i = 0; i < jsonData.length; i++) {
    var clip = jsonData[i];
    var clipName = clip.name;
    var clipStart = new Date(clip.startTime);
    var clipEnd = new Date(clip.endTime);
    dataTable.addRow([clipName, '', clipStart, clipEnd]);

    var clipEvents = clip.events;
    for (var j = 0; j < clipEvents.length; j++) {
      var event = clipEvents[j];
      var eventName = event.name;
      var eventTime = new Date(event.time);
      dataTable.addRow([clipName, eventName, eventTime, eventTime]);
    }
  }

  var options = {
    timeline: {
      groupByRowLabel: true,
      showRowLabels: true,
      colorByRowLabel: false,
      avoidOverlappingGridLines: false,
      showBarLabels: true,
      barLabelStyle: { fontName: 'Arial', fontSize: 12 },
      barLabelWidth: 100,
    },
    hAxis: {
      format: 'm:ss',
      textStyle: {
        fontName: 'Arial',
        fontSize: 14,
        bold: true,
        italic: false
      },
      titleTextStyle: {
        fontName: 'Arial',
        fontSize: 16,
        bold: true,
        italic: false
      }
    },
    vAxis: {
      textStyle: {
        fontName: 'Arial',
        fontSize: 14,
        bold: true,
        italic: false
      },
      titleTextStyle: {
        fontName: 'Arial',
        fontSize: 16,
        bold: true,
        italic: false
      }
    },
    tooltip: {
      isHtml: true
    }
  };


  var chart = new google.visualization.Timeline(document.getElementById('timeline'));
  chart.draw(dataTable, options);
}