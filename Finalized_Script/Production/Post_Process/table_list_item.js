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
var input = argv.i;
var sizeOf = require('image-size');
var GradeRegex = /Grade [K0-9]+/g;
var UnitRegex = /unit[0-9]+/g;
var WeekRegex = /week[0-9]+/g;
var DayRegex = /day[0-9]+/g;

fromDir(input, '.html');

var filepath = input.substr(0, input.lastIndexOf('\\'));
//contentConversion(filepath,input);


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
			if(files[i].toString().match('day') || files[i].toString().match('lessons')){
				fromLessonDir(filename, filter);
			}
			else{
			fromDir(filename, filter); //recurse
			}
        }  else {
		};
    };
};

// Reading a input Directory
function fromLessonDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {}
		else if (filename.indexOf(filter) >= 0) {
			var filepath = filename.toString().replace('\\' + files[i],'');
			contentConversion(filepath,filename);
			
		} else {};
    };
};

function contentConversion(filepath,file){
	if(filepath.toString().match(GradeRegex) == null){}
	else{
		var rootpath = filepath.substr(0, filepath.lastIndexOf('\\'));
		var weekpath = rootpath.substr(0, rootpath.lastIndexOf('\\'));
		var unitpath = weekpath.substr(0, weekpath.lastIndexOf('\\'));
		var currentfileName = filepath.toString().replace(rootpath + '\\','') + '.html';

		var frameContent = readfile(file);
		var $$ = cheerio.load(frameContent);
		var fileName = file.toString().replace(filepath + '\\','');

		var currentUnit = filepath.toString().match(UnitRegex);
		var currentGrade = filepath.toString().match(GradeRegex).toString().replace('Grade ','grade').replace('K','k');
		var currentWeek = filepath.toString().match(WeekRegex);
		var currentDay = filepath.toString().match(DayRegex);
		$$('article.Lesson').find('table').each(function (index,element){
			console.log($$(this).find('ol').html());
		});
	}

	//fs.writeFileSync(file,$$.html().toString().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/data\-extlink/g,'data-extLink'));
	
}