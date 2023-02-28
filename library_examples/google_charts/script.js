google.charts.load('current', { 'packages': ['timeline', 'controls'] });
google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard() {

    var jsonData = $.ajax({
        url: "data.json",
        dataType: "json",
        async: false
    })
        .fail(function () {
            alert("Failed to load data.");
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
    
    // Create a formatter.
    // This example uses object literal notation to define the options.
    var formatter = new google.visualization.DateFormat({pattern: "EEE, MMM d, ''yy"});

    // Reformat our data.
    formatter.format(dataTable, 2);
    formatter.format(dataTable, 3);


    // Create a dashboard. The dashboard is the container hold the range slider and the chart.
    var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

    // Create a range slider
    var rangeSlider = new google.visualization.ControlWrapper({
        controlType: 'ChartRangeFilter',
        containerId: 'filter_div',
        options: {
            filterColumnIndex: 2, // Filter by the date axis.
            // Apply a label above the slider.
            filterColumnLabel: 'Time',
            title: 'Toppings I Like On My Pizza',
            ui: {
                chartOptions: {
                    height: 50,
                    width: '90%',
                    chartArea: {
                        width: '60%',
                    },
                    hAxis: {
                        format: 'h:mm a',
                        textStyle: {
                            fontSize: 10,
                            bold: false,
                            italic: false
                        },
                        titleTextStyle: {
                            fontSize: 16,
                            bold: true,
                            italic: false
                        }
                    }
                },

                chartView: {
                    // Specify the columns that are to be filtered.
                    columns: [2, 3]
                }
            }
        }
    });

    // Create a timeline chart
    var chart = new google.visualization.ChartWrapper({
        chartType: 'Timeline',
        containerId: 'timeline',
        options: {

            timeline: {
                groupByRowLabel: true,
                showRowLabels: true,
                colorByRowLabel: false,
                avoidOverlappingGridLines: false,
                showBarLabels: true,
                barLabelStyle: { fontName: 'Arial', fontSize: 12 },
                barLabelWidth: 100
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
        },
        view: {
            columns: [0, 1, 2, 3]
        }
    });


    // Establish dependencies, declaring that 'filter' drives 'chart',
    // so that the chart will only display entries that are let through
    // given the chosen slider range.
    dashboard.bind(rangeSlider, chart);

    dashboard.draw(dataTable);
}


