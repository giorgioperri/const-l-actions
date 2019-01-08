//$(document).ready(function(){

    let selectedIndex = document.getElementsByTagName('select')[0].selectedIndex;


    let width  = 300;
    let height = 300;
    let r = 5;

    let links = [];
    let nodes = [];   

       
    self.tagline = ko.observable('Choose a Constellation');

    var data = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "js/constellations.json",
            'dataType': "json",
            'success': function(data) {
                json = data;
            }
        });
        return json;
    })();

    
    function datadisplay() {
        selectedIndex = document.getElementsByTagName('select')[0].selectedIndex;

        links = [];
        nodes = [];

        var self = this; // i seriously do not know what this does but everybody online says it helps :l

        // this line basically does nodes alone thank you observable.com ily
        // what it does is it takes raw data from the json and parses it into a majestic mapped data object
        
        nodes = data.constellations[selectedIndex].stars.map(d => Object.create(d));
        
        // so links has to be an array, meaning that i'll have to figure out a way to transform the lines in my json into "source" and "target" for my links
        // links are figured out here

        for (let i = 0; i < data.constellations.length; i++){

            if( i == document.getElementsByTagName('select')[0].selectedIndex){
                
                //console.log(data.constellations[i].Name)

                for (let j = 0; j < data.constellations[i].lines.length; j++){

                    for (let k = 0; k < 2; k++){

                        let obj = {}

                        if(k == 0){

                            obj.source = data.constellations[i].lines[j][k];                          
                            obj.target = data.constellations[i].lines[j][k+1];

                            links.push(obj);

                        } 
                    }
                }  
            }           
        }        

        self.constellationsList = ko.observableArray(data.constellations);

    }

    ko.applyBindings (new datadisplay()); 

    document.getElementsByTagName('select')[0].value = '';
   
    // parse links to nodes (or basically avoid doing stuff twice)
    links.forEach(function(link){
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] ||
            (noses[link.target] = {name: link.target});
    });

    // here is where i add all of my nodes and links with d3js, and program the drag function

    var svgappend = function() {

        document.getElementById("svg").remove();

        var rightAscension = d3.scale.linear()
            .range([0, width])
            .domain([0, 24]);

        var declination = d3.scale.linear()
            .range([0, height])
            .domain([-90, 90]);

        for (let i = 0; i < data.constellations[selectedIndex].stars.length; i++){
            nodes[i].x = rightAscension(data.constellations[selectedIndex].stars[i].RAh)
            nodes[i].y = declination(data.constellations[selectedIndex].stars[i].DEd)
        }

        // defining force properties (so edgy)
        // force, nodes and links loaded in and force started (engine at maximum)
        var force = d3.layout.force()
            .charge(-100)
            .linkDistance(20)
            .size([width, height])
            .nodes(nodes)
            .links(links)
            .on("tick", tick);

        force.start();

        // adding the svg *^*
        var svg = d3.select(".col-8")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('id', 'svg')
            .call(d3.behavior.zoom().on("zoom", function() {
                svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                }))
            .append("g");

        // links

        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("line")
            .attr("class", "link");

         // nodes
        var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", r)
            .call(force.drag);

        node
            .append("title")
            .text(function(d) {
              return d.bfID;
            });

        function tick() {
            link.attr("x1", function(d) {
                return d.source.x;
                })
                .attr("y1", function(d) {
                return d.source.y;
                })
                .attr("x2", function(d) {
                return d.target.x;
                })
                .attr("y2", function(d) {
                return d.target.y;
                });
            
            node.attr("cx", function(d) {
                return d.x;
                })
                .attr("cy", function(d) {
                return d.y;
                });
            }
                    

    }

    // this is what triggers function after gathering data (and choosing a constellation)

    document.getElementsByTagName('select')[0].onchange = function() {datadisplay(); svgappend();}

//});
