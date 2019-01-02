//$(document).ready(function(){
    self.tagline = ko.observable('Choose a Constellation');
    let width = 500,
        height = 300;
    let links = [];
    let nodes = [];
    

    var selectelements = (function() {
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
        let selectedIndex = document.getElementsByTagName('select')[0].selectedIndex;
        console.log(selectedIndex);
        links = [];
        nodes = [];
        var self = this;

        
        nodes = selectelements.constellations[selectedIndex].stars.map(d => Object.create(d));
        
        
    

        // so links has to be an array, meaning that i'll have to figure out a way to transform the lines in my json into "source" and "target" for my links
        // links are figured out here
        for (let i = 0; i < selectelements.constellations.length; i++){
            if( i == document.getElementsByTagName('select')[0].selectedIndex){
                console.log(selectelements.constellations[i].Name)
                for (let j = 0; j < selectelements.constellations[i].lines.length; j++){
                    for (let k = 0; k < 2; k++){
                        let obj = {}
                        if(k == 0){
                            obj.source = selectelements.constellations[i].lines[j][k];                          
                            obj.target = selectelements.constellations[i].lines[j][k+1];

                            links.push(obj);

                        } 
                    }
                }  
            }           
        }

        // now... for the nodes 
        // this function is launched at start, so i have to code a way for it to populate nodes too


        
        self.constellationsList = ko.observableArray(selectelements.constellations);

    }

    ko.applyBindings (new datadisplay()); 

    document.getElementsByTagName('select')[0].value = '';

    
    //parse links to nodes
    links.forEach(function(link){
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] ||
            (noses[link.target] = {name: link.target});
    });

    //add svg!

    var svgappend = function() {
        document.getElementById("svg").remove();
        var svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('id', 'svg');

        var force = d3.layout.force()
            .size([width, height])
            .nodes(d3.values(nodes))
            .links(links)
            .on('tick', tick)
            .linkDistance(200)
            .start();

        var link = svg.selectAll('.link')
            .data(links)
            .enter().append('line')
            .attr('class', 'link');

        var node = svg.selectAll('.node')
            .data(force.nodes())
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', width * 0.03);

        function tick(e) {
            node.attr('cx', function(d){ return d.x; })
                .attr('cy', function(d){ return d.y; })
                .call(force.drag);

            link.attr('x1', function(d){ return d.source.x })
                .attr('y1', function(d){ return d.source.y })
                .attr('x2', function(d){ return d.target.x })
                .attr('y2', function(d){ return d.target.y })
        }
    }

    document.getElementsByTagName('select')[0].onchange = function() {datadisplay(); svgappend();}



//});
