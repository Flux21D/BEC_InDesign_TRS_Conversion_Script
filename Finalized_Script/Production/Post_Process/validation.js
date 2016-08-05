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
			if(files[i].toString().match('day') != null || files[i].toString().match('lessons') != null){
				fromDayDir(filename,'.html');
			}
			else{
				fromDir(filename, filter); //recurse
			}
        } else if (filename.indexOf(filter) >= 0) {
			var filepath = filename.toString().replace('\\' + files[i],'');
				//contentConversion(filepath,filename);

		} else {};
    };
};

function fromDayDir(startPath, filter){

	if(!fs.existsSync(startPath)) {
		console.log("no dir ", startPath);
		return;
	}
	
	var files = fs.readdirSync(startPath);
	for(var i=0; i<files.length

}

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



}
