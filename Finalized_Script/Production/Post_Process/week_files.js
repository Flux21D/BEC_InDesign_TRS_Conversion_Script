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
var sizeOf = require('image-size');
var jsonQuery = require('json-query');
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
			if(files[i].toString().match('Week')){
				fromWeekDir(filename,filter,files[i]);
			}
			else{
				fromDir(filename, filter);
			}
        }  else {};
    };
};


// Reading a input Directory
function fromWeekDir(startPath, filter,currentWeekFolder) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
			if(files[i].toString().match('html')){
				fromHTMLDir(filename,filter,currentWeekFolder);
			}
			else{
				fromWeekDir(filename, filter,currentWeekFolder)
			}
        }
		else if (filename.indexOf('.json') >= 0) {
			jsonFileModification(filename,currentWeekFolder);
		}
		else {};
    };
};


// Reading a input Directory
function fromHTMLDir(startPath, filter,currentWeekFolder) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
			fromHTMLDir(filename, filter,currentWeekFolder)
        }
		else if (filename.indexOf(filter) >= 0) {
			if(filename.toString().match('grade-resources') || filename.toString().match('review-and-routines')){}
			else{
				htmlFileModification(filename,currentWeekFolder);
			}
		}
		else {};
    };
};


function jsonFileModification(file,currentWeekFolder){
	GradeRegex = /grade [k0-9]+/g;
	UnitRegex = /unit [0-9]+/g;
	WeekRegex = /week[0-9]+/g;

	var rootPath = file.substr(0, file.lastIndexOf('\\'));
	var xCodePath = rootPath.substr(0, rootPath.lastIndexOf('\\'));
	var xCode = rootPath.toString().replace(xCodePath + '\\','');
	var Grade = currentWeekFolder.toString().toLowerCase().match(GradeRegex);
	Grade = Grade.toString().replace('grade ','Grade ');
	var Unit = currentWeekFolder.toString().toLowerCase().match(UnitRegex);
	Unit = Unit.toString().replace('unit ','Unit ');
	var Week = currentWeekFolder.toString().toLowerCase().match(WeekRegex);
	Week = Week.toString().replace('week','Week ');
	var updatedJsonContent = '{\r\n\t' + '"launchPage":"html/' + Week.toString().replace('Week ','week') + '/skills-at-a-glance.html",\r\n\t' + '"title":"' + Grade + ', ' + Unit + ', ' + Week + '",\r\n\t"vcode":"' + xCode + '"\r\n}'
	fs.writeFileSync(file,updatedJsonContent);
}


function htmlFileModification(file,currentWeekFolder){
	GradeRegex = /grade [k0-9]+/g;
	UnitRegex = /unit [0-9]+/g;
	WeekRegex = /week[0-9]+/g;

	var Grade = currentWeekFolder.toString().toLowerCase().match(GradeRegex);
	Grade = Grade.toString().replace('grade ','grade');
	var Unit = currentWeekFolder.toString().toLowerCase().match(UnitRegex);
	Unit = Unit.toString().replace('unit ','unit');
	var Week = currentWeekFolder.toString().toLowerCase().match(WeekRegex);
	var content = readfile(file);
	var $ = cheerio.load(content);
	$('*').find('a[href*="' + Week + '"]').each(function (index,element){
		var hrefFileName = $(this).attr('href').toString().replace('/html/' + Grade + '/' + Unit + '/' + Week,'');
		var extLinkFileName = $(this).attr('data-extlink').toString().replace('/html/' + Grade + '/' + Unit + '/' + Week,'');
		$(this).attr('href','/html/' + Week + hrefFileName);
		$(this).attr('data-extlink','/html/' + Week + extLinkFileName);
	});
	fs.writeFileSync(file,$.html().replace(/data\-extlink/g,'data-extLink'));
	
}
