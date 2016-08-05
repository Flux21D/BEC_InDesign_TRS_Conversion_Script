function fontUpdate(){
    var myFontStyles = null;
    var DocumentFonts = "";

    Array.prototype.unique = function (){
        var r = new Array();
        o:for(var i = 0, n = this.length; i < n; i++){
            for(var x = 0, y = r.length; x < y; x++){
                if(r[x]==this[i]) continue o;}
            r[r.length] = this[i];}
        return r;
    }


    Array.prototype.findIn = function(search){
        var r = Array();
        for (var i=0; i<this.length; i++)
            if (this[i].indexOf(search) != -1){
                r.push(this[i].substr(this[i].indexOf("\t") + 1, this[i].length));
            }
        return r;
    }


    var myFonts = app.activeDocument.fonts.everyItem();
    myFontsList = myFonts.fontFamily.unique();
    for(var i = 0; i < myFontsList.length; i++){
            var myFontStyles = myFonts.name.findIn(myFontsList[i]);
                for(var j = 0; j < myFontStyles.length; j++){
                    if(myFontStyles[j].toString().toLowerCase().match('medium condensed')){
                        app.findTextPreferences = NothingEnum.nothing;
                        app.changeTextPreferences = NothingEnum.nothing;
                        app.findTextPreferences.fontStyle = myFontStyles[j];
                        app.changeTextPreferences.fontStyle = 'Bold';
                        app.activeDocument.changeText();
                    }
                }
    }

}

fontUpdate();