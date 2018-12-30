// $(document).ready(function(){
    self.tagline = ko.observable('Choose a Constellation');

    let links = [];
    let width = 500,
        height = 300;

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
        links = [];
        var self = this;
    

        // so links has to be an array, meaning that i'll have to figure out a way to transform the lines in my json into "source" and "target" for my links
        
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
        
        self.constellationsList = ko.observableArray(selectelements.constellations);

    }

    ko.applyBindings (new datadisplay()); 

    document.getElementsByTagName('select')[0].value = '';

    document.getElementsByTagName('select')[0].onchange = function() {datadisplay();}
    

 //});
