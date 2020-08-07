function getData() {
    // Read in json data
    d3.json("samples.json").then(bellydata => {
        console.log(bellydata)
        // Get OTU ids from sample file
        var otuIds = bellydata.samples[0].otu_ids;
        console.log(otuIds)
        // Get # of samples for top ten ids, reverse so h bar chart is correct
        var sampleValues = bellydata.samples[0].sample_values.slice(0,10).reverse();
        console.log(sampleValues)
        // Get labels for top 10 otu ids.
        var otuLabels = bellydata.samples[0].otu_labels.slice(0,10);
        console.log(`OTU labels: ${otuLabels}`)
        // get top 10 otu ids for the bar plot and reverse it
        var topOtuIds = bellydata.samples[0].otu_ids.slice(0,10).reverse();
        var otuIdLabels = topOtuIds.map(d => "OTU " + d);
        console.log(`OTU ids: ${otuIdLabels}`)
        // Build horizontal bar chart
        var trace1 = {
            x: sampleValues,
            y: otuIdLabels,
            text: otuLabels,
            marker: {
                color: 'green'
            },
            type: "bar",
            orientation: "h"
        };
        // Data variable
        var data = [trace1];
        var layout = {
            title: "Top 10 OTUs",
            // yaxis: {
            //     tickmode: "linear"
            // },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Create bar plot
        Plotly.newPlot("bar", data, layout);

        // Info for bubble plot
        var trace2 = {
            x: bellydata.samples[0].otu_ids,
            y: bellydata.samples[0].sample_values,
            mode: "markers",
            marker:{
                size: bellydata.samples[0].sample_values,
                color: bellydata.samples[0].otu_ids
            },
            text: bellydata.samples[0].otu_labels
        };

        // Data variable
        var data1 = [trace2];
        var layout1 = {
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1200
        };

        // Create bubble plot
        Plotly.newPlot("bubble", data1, layout1);
        });
    };

// Function for metadata
function getInfo() {
    // Read in json data
    d3.json("samples.json").then((bellydata) =>{
        // Collect metadata for demo panel
        var metadata = bellydata.metadata;
        console.log(metadata)

        // Variable for id
        var id = 940;

        // Filter metadata by id
        var result = metadata.filter(meta => meta.id === id)[0];
        console.log(result)
        // Find panel to insert data
        var demographicInfo = d3.select("#sample-metadata");

        // To empty demo panel before getting new id info
        demographicInfo.html("");

        // Grab demo data for selected id and append to panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}   

// Function for change
function optionChanged() {
    getData();
    getInfo();
}

// Function for initial page layout
function init() {
    // choose dropdown menu
    var dropdown = d3.select("#selDataset");

    // read data again
    d3.json("samples.json").then((bellydata) => {
        console.log(bellydata)

        // pull id data to dropdown
        bellydata.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Call functions to display data and render plots
        getData(bellydata.names[0]);
        getInfo(bellydata.names[0]);
    });
}

init();
