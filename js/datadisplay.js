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
                // this i need for later as i'll probably need to map every star right ascension and declination (rip)
                // for(let i = 0; i < data.constellations.length; i++){
                //    console.log(data.constellations[i].Name)
                // }

                let width = 500,
                    height = 300;

                // so links has to be an array, meaning that i'll have to figure out a way to transform the lines in my json into "source" and "target" for my links
                let links = [];
                // i think i'll write a loop to populate this trash array but how tho
                for (let i = 0; i < data.constellations.length; i++){
                    for (let j = 0; j < data.constellations[i].lines.length; j++){
                        for (let k = 0; k < 2; k++){
                            console.log(data.constellations[i].lines[j][k])
                        }
                        //console.log(data.constellations[i].lines[j][0]);   
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

