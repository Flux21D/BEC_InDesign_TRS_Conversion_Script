var path = require('path'); //File System
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //file writer
var mkdirp=require('mkdirp'); //Creating Directory
var ncp = require('ncp').ncp;
var copy = require('ncp');
var cssParser = require('css-parse');
var input = argv.i;
var GradeRegex = /Grade [K0-9]+/g;
var UnitRegex = /unit[0-9]+/g;
var WeekRegex = /week[0-9]+/g;
var DayRegex = /day[0-9]+/g;

var fontStyleFound=false;
var fontWeightFound=false;

fromDir(input, '.html');



// Reading a input Directory
function fromDir(startPath, filter) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
			var filepath = filename.toString().replace('\\' + files[i],'');
			if(filepath.toString().match('InDesign_Output') != null){
				contentConversion(filepath,filename);
			}
			else{}

		} else {};
    };
};

function contentConversion(filepath,file){
var rootpath = filepath.substr(0, filepath.lastIndexOf('\\'));
var currentfileName = filepath.toString().replace(rootpath + '\\','') + '.html';

var frameContent = readfile(file);
var $ = cheerio.load(frameContent);
var fileName = file.toString().replace(filepath + '\\','');

var currentUnit = filepath.toString().match(UnitRegex);
var currentGrade = filepath.toString().match(GradeRegex).toString().replace('Grade ','grade').replace('K','k');
var currentWeek = filepath.toString().match(WeekRegex);
var currentDay = filepath.toString().match(DayRegex);


var cssFile = filepath + '\\' + $('head').find('link[type*="text/css"]').attr('href').toString().replace(/\//g,'\\');
var cssContent = readfile(cssFile);
cssDom = cssParser(cssContent);

cssDom.stylesheet.rules.forEach(function(e,j){
	if(e.selectors){
		if(e.selectors.toString().toLowerCase().match('span')!=null){
			e.selectors.forEach(function(e2,k){
				fontWeightFound = false;
				fontStyleFound = false;
				for(var i=0;i<e.declarations.length;i++)
				{
					if(e.declarations[i].property == 'font-family'){
						if(e.declarations[i].value.toString().toLowerCase().match('bold') || e.declarations[i].value.toString().toLowerCase().match('bolder') || e.declarations[i].value.toString().toLowerCase().match('medium condensed')){
							fontWeightFound = true;
						}
						if(e.declarations[i].value.toString().toLowerCase().match('italic') || e.declarations[i].value.toString().toLowerCase().match('oblique')){
							fontStyleFound = true;
						}
					}
					 if(e.declarations[i].property == 'font-style' && (e.declarations[i].value == 'italic' || e.declarations[i].value == 'oblique')){
						fontStyleFound = true;
					 }
					 if(e.declarations[i].property == 'font-weight' && (e.declarations[i].value == 'bold' || e.declarations[i].value == 'bolder')){
						fontWeightFound = true;
					 }
				}
				if(fontWeightFound && fontStyleFound){
					var className = e.selectors.toString().split('.')[1];
					$('body').find('span.' + className).each(function( index,elem ) {
						$(this).addClass('css_bolditalic');
					});
				 }
				 else if(fontWeightFound && !fontStyleFound){
					var className = e.selectors.toString().split('.')[1];
					$('body').find('span.' + className).each(function( index,elem ) {
						$(this).addClass('css_bold');
					});
				 }
				 else if(fontStyleFound && !fontWeightFound){
					var className = e.selectors.toString().split('.')[1];
					$('body').find('span.' + className).each(function( index,elem ) {
						$(this).addClass('css_italic');
					});
				 }
			});
		}
	}
});

fs.writeFileSync(file,$.html());

}
