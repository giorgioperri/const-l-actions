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
            }
        });
        return json;
    })();
    self.constellationsList = ko.observableArray(selectelements.constellations);
}

ko.applyBindings (new datadisplay()); 

