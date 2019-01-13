// $(document).ready(function(){
   
    /*  
        -- RECAP --
    
        -- Mandatory Characteristics --

        - Single Html page with local dependencies or CDN 
            i used both local and cdn dependencies for micromodal, jquery, knockout, bootstrap and d3
        - At least one AJAX call to an API or a local JSON
            i used a local JSON call with a database i found online
        - Use of a templating library
            i used knockoutjs to template the hidden select value and the tagline
        - Use of an interactive graph
            i used d3 force layout to render stars and links between them
        - Use of javascript generated SVGs
            d3 renders SVGs for the grph and appends them to the desired div
        - A funcionality that requires at least an user chosen parameter
            users could choose a value from the hidden select bar and can choose between 4 options when guessing the constellations
    
        -- Bonus Characteristics --
        
        - Code version control using Git and publishing on Github
            did that on https://github.com/giorgioperri/const-l-actions
        - Custom animated elements during data loading
            inserted a trippy gif to entertain the user when "waiting for the data"
    
    */ 

   
    
    (function($){
 
        $.fn.shuffle = function() {
     
            var allElems = this.get(),
                getRandom = function(max) {
                    return Math.floor(Math.random() * max);
                },
                shuffled = $.map(allElems, function(){
                    var random = getRandom(allElems.length),
                        randEl = $(allElems[random]).clone(true)[0];
                    allElems.splice(random, 1);
                    return randEl;
               });
     
            this.each(function(i){
                $(this).replaceWith($(shuffled[i]));
            });
     
            return $(shuffled);
     
        };
     
    })(jQuery);

    //god bless you Chris Coyier

    document.getElementById('svg').setAttribute('height', document.documentElement.clientHeight - 60);

    let resizer = function(){
        document.getElementById('svg').setAttribute('height', document.documentElement.clientHeight - 60);
        height = document.documentElement.clientHeight - 60;
    }
    
    let selectedIndex = document.getElementsByTagName('select')[0].selectedIndex;
    let constName;
  

    let width  = document.getElementsByClassName('col-8')[0].clientWidth;

    let r = 10;

    let height = document.documentElement.clientHeight -60;

    let links = [];
    let nodes = []; 
    let score = 0;
    var resizeTimer;

    if($(window).width() <= 580){
        document.getElementById("col4").classList.remove("col-4");
        document.getElementById("col4").classList.add("col-12");
        height = 300;
    }
    
    $(window).resize(function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
        resizer();
        if($(window).width() <= 580){
            document.getElementById("col4").classList.remove("col-4");
            document.getElementById("col4").classList.add("col-12");
            height = 100;
        } else if($(window).width() > 580){
            document.getElementById("col4").classList.remove("col-12");
            document.getElementById("col4").classList.add("col-4");
            r = 10;
        }
        width  = document.getElementsByClassName('col-8')[0].clientWidth
        datadisplay();
        svgappend();
        }, 250);
    });

    $(selectedIndex).change(function(){
        resizer();
    });
       
    self.tagline = ko.observable('Guess the Constellation');
    self.constellation = ko.observable('Andromeda');

    var data = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "js/constellations.json",
            'dataType': "json",
            'success': function(data) {
                json = data;
                $('.ajaxProgress').hide();
                MicroModal.show('modal-1');
            }
        });
        return json;
    })();

    let rng = 1;
    
    function datadisplay() {

        if(score == 10){
            MicroModal.show('modal-3');
        }
       
        selectedIndex = Math.floor(Math.random() * 20) + 1;

        constName = data.constellations[selectedIndex].Name;
        constNameErr1 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
        constNameErr2 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
        constNameErr3 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;

        while(constName == constNameErr1 || constName == constNameErr2 || constName == constNameErr3
        || constNameErr1 == constNameErr2 || constNameErr1 == constNameErr3 || constNameErr2 == constNameErr3){
            constNameErr1 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
            constNameErr2 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
            constNameErr3 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
        }

        $('.button').remove();
        
        $('#selectContainer').append("<button id=\"btn1\" class=\"button\" type=\"button\" data-bind=\"text: constName\">" + constName + "</button>");
        $('#selectContainer').append("<button id=\"btn2\" class=\"button\" type=\"button\">" + constNameErr1 + "</button>");
        $('#selectContainer').append("<button id=\"btn3\" class=\"button\" type=\"button\">" + constNameErr2 + "</button>");
        $('#selectContainer').append("<button id=\"btn4\" class=\"button\" type=\"button\">" + constNameErr3 + "</button>");

        $('.button').shuffle();

        $("#btn1").click(function(){
            score++
            document.getElementById('score').innerText = "Score: " + score;
        });

        //console.log(constName);

        for(let i = 0; i < 4; i++){
            document.getElementsByClassName('button')[i].onclick = function() {datadisplay(); svgappend();}
        }

        links = [];
        nodes = [];

        var self = this; // i seriously do not know what this does but everybody online says it helps :l

        // this line basically does nodes alone thank you observable.com ily
        // what it does is it takes raw data from the json and parses it into a majestic mapped data object
        
        nodes = data.constellations[selectedIndex].stars.map(d => Object.create(d));
        
        // so links has to be an array, meaning that i'll have to figure out a way to transform the lines in my json into "source" and "target" for my links
        // links are figured out here

        for (let i = 0; i < data.constellations.length; i++){

            if( i == selectedIndex){
                
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
            .charge(-500)
            .linkDistance(80)
            .size([width, height])
            .nodes(nodes)
            .links(links)
            .on("tick", tick);

        var drag = force.drag()
            .on("dragstart", dragstart);

        force.start();

        // adding the svg *^*
        var svg = d3.select(".col-8")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('id', 'svg')
            .append("g");

        var link = svg.selectAll(".link"),
            node = svg.selectAll(".node");

        force
            .nodes(nodes)
            .links(links)
            .start();


        link =
            link.data(links)
            .enter().append("line")
            .attr("class", "link");


        node = 
            node.data(nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", r)
            .on("dblclick", dblclick)
            .call(drag);

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
        
        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }
            
        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }

    }

    svgappend();

    document.getElementById('howto').onclick = function() {
        MicroModal.show('modal-1');
    }

    document.getElementById('about').onclick = function() {
        MicroModal.show('modal-2');
    }

    
    
    // this is what triggers function after gathering data (and displays a random constellation)
    
// });
