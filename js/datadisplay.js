 $(document).ready(function(){
    function datadisplay() {
        var self = this;

        self.tagline = ko.observable('Choose a Constellation');

        var selectelements = (function() {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': "js/constellations.json",
                'dataType': "json",
                'success': function(data) {
                    json = data;

                    let width = 500,
                        height = 300;

                    // so links has to be an array, meaning that i'll have to figure out a way to transform the lines in my json into "source" and "target" for my links
                    let links = [];
                    for (let i = 0; i < data.constellations.length; i++){
                        if( i == document.getElementsByTagName('select')[0].selectedIndex){
                            console.log(data.constellations[i].Name)
                            for (let j = 0; j < data.constellations[i].lines.length; j++){
                                for (let k = 0; k <= 2; k++){
                                    let source = data.constellations[i].lines[j][k]
                                    console.log(source);
                                }
                            }  
                        }
                        
                    }
                    
                    console.log(links);

                }
            });
            return json;
        })();
        self.constellationsList = ko.observableArray(selectelements.constellations);
    }

    ko.applyBindings (new datadisplay()); 

    document.getElementsByTagName('select')[0].value = '';

    document.getElementsByTagName('select')[0].onchange = function() {datadisplay();}
    

 });
