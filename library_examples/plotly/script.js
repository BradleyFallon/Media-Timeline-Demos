// Example data for reference.  This is the same data as in the json file.
var jsonData = [
    {
        "name": "Media Timeline 1",
        "startTime": "2022-01-01T00:00:00Z",
        "endTime": "2022-01-01T01:00:00Z",
        "events": [
            {
                "name": "Event 1",
                "time": "2022-01-01T00:10:00Z"
            },
            {
                "name": "Event 2",
                "time": "2022-01-01T00:30:00Z"
            }
        ]
    },
    {
        "name": "Media Timeline 2",
        "startTime": "2022-01-01T02:00:00Z",
        "endTime": "2022-01-01T03:00:00Z",
        "events": [
            {
                "name": "Event 3",
                "time": "2022-01-01T02:20:00Z"
            },
            {
                "name": "Event 4",
                "time": "2022-01-01T02:40:00Z"
            }
        ]
    }
];

// Read the real json data from file, and continue after it is loaded.
Plotly.d3.json("data.json", function (jsonData) {

    // Create an array of trace objects for the timeline chart.
    var traces = [];

    for (var i = 0; i < jsonData.length; i++) {
        var clip = jsonData[i];
        var clipName = clip.name;
        var clipStart = new Date(clip.startTime);
        var clipEnd = new Date(clip.endTime);

        // Add a bar trace for the clip.
        traces.push({
            type: "bar",
            x: [clipStart, clipEnd],
            y: [clipName, clipName],
            orientation: "h",
            name: clipName
        });

        var clipEvents = clip.events;
        for (var j = 0; j < clipEvents.length; j++) {
            var event = clipEvents[j];
            var eventName = event.name;
            var eventTime = new Date(event.time);

            // Add a marker trace for the event.
            traces.push({
                type: "scatter",
                mode: "markers",
                x: [eventTime],
                y: [clipName],
                name: eventName,
                marker: {
                    symbol: "triangle-up",
                    size: 10,
                    line: {
                        width: 2,
                        color: "white"
                    }
                }
            });
        }
    }

    // Set the layout options for the timeline chart.
    var layout = {
        title: "Video Timeline (Plotly)",
        xaxis: {
            tickformat: "%M:%S",
            type: "date",
            automargin: true,
            title: "Time"
        },
        yaxis: {
            automargin: true,
            title: "Media Timeline"
        },
        showlegend: false
    };

    // Create the timeline chart.
    Plotly.newPlot("timeline", traces, layout);
});
