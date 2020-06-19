// Create function for Data plotting- Bar, gauge, bubble
function goPlot(id) {
    // Retreave data from the json file
    d3.json("data/samples.json").then((data)=> {
        console.log(data)
    
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        // filter data values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);

        // Use .slice method to get the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        // .slice only top 10 "otu_ids" for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        // use .map to get the otu_id's  for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)

        // console.log(`OTU IDS: ${OTU_id}`)

        // Use .slice to get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);

      //   console.log(`Sample Values: ${samplevalues}`)
      //   console.log(`Id Values: ${OTU_top}`)
        // Create a trace for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            type:"bar",
            orientation: "h",
            text: labels,
            marker: {
              color: '#4287f5'},
        };

        // Create data variable
        var data = [trace];

        // Create layout for Bar plot
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 40
            }
        };

        // Create the Bar plot
        Plotly.newPlot("bar", data, layout);

        //console.log(`ID: ${samples.otu_ids}`)

        // Create a trace for Bubble plot
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                color: samples.otu_ids,
                size: samples.sample_values  
            },
            text: samples.otu_labels
        };

        // Create a layout for the Bubble plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // Create data variable trace
        var data1 = [trace1];

        // Create the Bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 

        // Set The Guage chart plot
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "#42f5ef" },
                    { range: [2, 4], color: "#75f542" },
                    { range: [4, 6], color: "#75f542" },
                    { range: [6, 8], color: "#f542f5" },
                    { range: [8, 9], color: "#f54251" },
                  ]}
          }
        ];

        // Create a layout for the Guage chart plot
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, 
                    b: 40, 
                    l:100, 
                    r:100 } 
          };

        // Create the Gauge plot
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  

// create the function to get data
function getInfo(id) {

    // read the json file from dataset
    d3.json("data/samples.json").then((data)=> {

        // get the metadata info for the demographic panel
        var metadata = data.metadata;
        console.log(metadata)

        // filter metadata info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // forEach to loop through data getting id and append the info 
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    goPlot(id);
    getInfo(id);
}

// create the function rendering the initial data
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        goPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();