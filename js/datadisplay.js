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


$('#right').css("opacity", "0");
$('#wrong').css("opacity", "0");

(function ($) {

    $.fn.shuffle = function () {

        var allElems = this.get(),
            getRandom = function (max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function () {
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
            });

        this.each(function (i) {
            $(this).replaceWith($(shuffled[i]));
        });

        return $(shuffled);

    };

})(jQuery);

//god bless you Chris Coyier for this function

//defining some useful little snippets of code to ensure the size of the pagee stays coherent

document.getElementById('svg').setAttribute('height', document.documentElement.clientHeight - 60);

let resizer = function () {
    document.getElementById('svg').setAttribute('height', document.documentElement.clientHeight - 60);
    height = document.documentElement.clientHeight - 60;
}

let width = document.getElementsByClassName('col-8')[0].clientWidth;

//declaring some variables to check out stuff later on in the project

//these 2 i use for testing i like em here

let selectedIndex = document.getElementsByTagName('select')[0].selectedIndex; 
let constName;

//declaring important variables to use with d3 later on

let r = 10;

let height = document.documentElement.clientHeight - 60;

let links = [];
let nodes = [];
let score = 0;

//declaring a variable to use when resizing the window (responsive stuff u know)

var resizeTimer;

//making the app responsive moving classes here and there

if ($(window).width() <= 580) {
    document.getElementById("col4").classList.remove("col-4");
    document.getElementById("col4").classList.add("col-12");
    height = 300;
}

//writing the function that adapts the whole app on resizing

$(window).resize(function (e) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        resizer();
        if ($(window).width() <= 580) {
            document.getElementById("col4").classList.remove("col-4");
            document.getElementById("col4").classList.add("col-12");
            height = 100;
        } else if ($(window).width() > 580) {
            document.getElementById("col4").classList.remove("col-12");
            document.getElementById("col4").classList.add("col-4");
            r = 10;
        }
        width = document.getElementsByClassName('col-8')[0].clientWidth
        datadisplay();
        svgappend();
    }, 250);
});

//the app resizes on changing the constellation

$(selectedIndex).change(function () {
    resizer();
});

//here i use knockout to pass data into html

self.tagline = ko.observable('Guess the Constellation');
self.constellation = ko.observable('Andromeda');

//here goes the ajax call, with a return so that i get my data out of the function scope

var data = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "js/constellations.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
            $('.ajaxProgress').hide();
            MicroModal.show('modal-1');
        }
    });
    return json;
})();

//this  variable is used to sort out numbers for randomic purpouses

let rng = 1;

//here starts the main function

function datadisplay() {

    //show the congratulations modal on scoring 10 points

    if (score == 10) {
        MicroModal.show('modal-3');
    }

    //selecting 4 random constellazions: one will be the right answer
    //random indexes are used to move around stuff

    selectedIndex = Math.floor(Math.random() * 20) + 1;

    constName = data.constellations[selectedIndex].Name;
    constNameErr1 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
    constNameErr2 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
    constNameErr3 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;

    //here i make sure no buttons have the same answer with a while cyle

    while (constName == constNameErr1 || constName == constNameErr2 || constName == constNameErr3
        || constNameErr1 == constNameErr2 || constNameErr1 == constNameErr3 || constNameErr2 == constNameErr3) {
        constNameErr1 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
        constNameErr2 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
        constNameErr3 = data.constellations[Math.floor(Math.random() * 20) + 1].Name;
    }

    //removing buttons on new function call, to then create new ones

    $('.button').remove();

    $('#selectContainer').append("<button id=\"btn1\" class=\"button\" type=\"button\" data-bind=\"text: constName\">" + constName + "</button>");
    $('#selectContainer').append("<button id=\"btn2\" class=\"button\" type=\"button\">" + constNameErr1 + "</button>");
    $('#selectContainer').append("<button id=\"btn3\" class=\"button\" type=\"button\">" + constNameErr2 + "</button>");
    $('#selectContainer').append("<button id=\"btn4\" class=\"button\" type=\"button\">" + constNameErr3 + "</button>");

    //this shuffles the buttons in a random order

    $('.button').shuffle();

    //on clicking the right button i will show thumbs up, augment the score and update score on html

    $("#btn1").click(function () {
        $('#right').css("opacity", "1");
        score++;
        document.getElementById('score').innerHTML = "Score: " + score + "<i class=\"fas fa-thumbs-up\" id=\"right\"></i>";
        setTimeout(function () { $('#right').fadeOut() }, 1000);
    });

    //on clicking the wrong button, showing the wrong feedback

    $('#btn2, #btn3, #btn4').click(function () {
        $('#wrong').css("opacity", "1");
        setTimeout(function () { $('#wrong').fadeOut() }, 1000);
        document.getElementById('score').innerHTML = "Score: " + score + "<i class=\"fas fa-thumbs-down\" id=\"wrong\"></i>";
    });

    //easter egg?????

    $("#skipper").click(function () {
        score++;
        document.getElementById('score').innerText = "Score: " + score;
        datadisplay(); svgappend();
    });

    //making each button start the function all over again

    for (let i = 0; i < 4; i++) {
        document.getElementsByClassName('button')[i].onclick = function () { datadisplay(); svgappend(); }
    }

    //declaring links and nodes arrays

    links = [];
    nodes = [];

    var self = this; // i seriously do not know what this does but everybody online says it helps :l

    // this line basically does nodes alone thank you observable.com ily
    // what it does is it takes raw data from the json and parses it into a majestic mapped data object

    nodes = data.constellations[selectedIndex].stars.map(d => Object.create(d));

    // so links has to be an array, meaning that i'll have to figure out a way to transform the lines in my json into "source" and "target" for my links
    // links are figured out here, with cycles.

    //... inside cycles

    //... inside cycles

    for (let i = 0; i < data.constellations.length; i++) {

        if (i == selectedIndex) {

            for (let j = 0; j < data.constellations[i].lines.length; j++) {

                for (let k = 0; k < 2; k++) {

                    let obj = {}

                    if (k == 0) {

                        obj.source = data.constellations[i].lines[j][k];
                        obj.target = data.constellations[i].lines[j][k + 1];

                        links.push(obj);

                    }
                }
            }
        }
    }

    //this i use to give my hidden select i use for testing the elements i need

    self.constellationsList = ko.observableArray(data.constellations);

}

//as last comment

ko.applyBindings(new datadisplay());

//giving the select an empty value to start with

document.getElementsByTagName('select')[0].value = '';



// parse links to nodes (or basically avoid doing stuff twice)

links.forEach(function (link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = { name: link.source });
    link.target = nodes[link.target] ||
        (noses[link.target] = { name: link.target });
});

// here is where i add all of my nodes and links with d3js, and program the drag function

var svgappend = function () {

    document.getElementById("svg").remove();

    var rightAscension = d3.scale.linear()
        .range([0, width])
        .domain([0, 24]);

    var declination = d3.scale.linear()
        .range([0, height])
        .domain([-90, 90]);

    for (let i = 0; i < data.constellations[selectedIndex].stars.length; i++) {
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
            .enter().append("circle").classed("pulse", true)
            .attr("class", "node")
            .attr("r", r)
            .on("dblclick", dblclick)
            .call(drag);

    node
        .append("title")
        .text(function (d) {
            return d.bfID;
        });

    function tick() {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
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

//showing modals on requests

document.getElementById('howto').onclick = function () {
    MicroModal.show('modal-1');
}

document.getElementById('about').onclick = function () {
    MicroModal.show('modal-2');
}

// });
