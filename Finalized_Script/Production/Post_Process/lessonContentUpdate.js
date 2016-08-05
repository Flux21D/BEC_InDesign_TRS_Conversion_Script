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
var GradeRegex = /Grade [K0-9]+/g;
var UnitRegex = /unit[0-9]+/g;
var WeekRegex = /week[0-9]+/g;
var DayRegex = /day[0-9]+/g;
var filename = "";

var finalOutputPath = input.toString().replace('InDesign_Output','Final_Output');
fromDir(finalOutputPath, '.html');



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
			var folderName = path.join(startPath, files[i]);
			if(files[i].toString().match('lessons')){
				var lessonButtonContent = upperLessonFileReading(folderName,'html');
				//console.log(lessonButtonContent);
				//exit(0);
				upperLessonFileUpdated(folderName,'html',lessonButtonContent);
			}
			else if(files[i].toString().match('day')){
				var lessonButtonContent = LessonFileReading(folderName,'html');
				LessonFileUpdated(folderName,'html',lessonButtonContent);
			}
			else{
				fromDir(filename, filter); //recurse
			}
        }else {};
    };
};

function upperLessonFileReading(rootPath, filter){
var headerContent = "";
	if (!fs.existsSync(rootPath)) {
		console.log("no dir ", rootPath);
		return;
	}
	var files = fs.readdirSync(rootPath);
	for(var i=0; i<files.length; i++){
		filename = path.join(rootPath, files[i]);
		var stat = fs.lstatSync(filename);
		if(stat.isDirectory()){}
		else if(filename.indexOf(filter) >= 0){
			var lessonFileName = rootPath + '\\lesson' + (i+1) + '.html';
			if(fs.existsSync(lessonFileName)){
				var content = readfile(lessonFileName);
				var $ = cheerio.load(content);
				$('div.week-btn').find('b').each(function(ind,ele){
					$(this).before($(this).html());
					$(this).remove();
				});
				$('div.week-btn').find('i').each(function(ind,ele){
					$(this).before($(this).html());
					$(this).remove();
				});
				$('div.week-btn').find('big').each(function(ind,ele){
					$(this).before('<b>' + $(this).html() + '</b>');
					$(this).remove();
				});
				headerContent = headerContent + '\n' + $('div.week-btn').html().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/\&amp\;/g,'&').replace(/ & /g,' &amp; ');
			}
			else{}
		}
		else{}
	}
	
	return headerContent;
}

function LessonFileReading(rootPath, filter){
var headerContent = "";
	if (!fs.existsSync(rootPath)) {
		console.log("no dir ", rootPath);
		return;
	}
	var files = fs.readdirSync(rootPath);
	for(var i=0; i<files.length; i++){
		filename = path.join(rootPath, files[i]);
		var stat = fs.lstatSync(filename);
		if(stat.isDirectory()){}
		else if(filename.indexOf(filter) >= 0){
			var content = readfile(filename);
			var $ = cheerio.load(content);
			headerContent = headerContent + '\n' + $('div.week-btn').html().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/\&amp\;/g,'&').replace(/ & /g,' &amp; ');
		}
		else{}
	}
	
	return headerContent;
}

function upperLessonFileUpdated(rootPath, filter,headerContent){
	if (!fs.existsSync(rootPath)) {
		console.log("no dir ", rootPath);
		return;
	}
	var files = fs.readdirSync(rootPath);
	for(var i=0; i<files.length; i++){
		filename = path.join(rootPath, files[i]);
		var stat = fs.lstatSync(filename);
		if(stat.isDirectory()){}
		else if(filename.indexOf(filter) >= 0){
			var lessonFileName = rootPath + '\\lesson' + (i+1) + '.html';
			if(fs.existsSync(lessonFileName)){
				var content = readfile(filename);
				var $$ = cheerio.load(content);
				$$('div.week-btn').html(headerContent.replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/\&amp\;/g,'&').replace(/ & /g,' &amp; '));
				$$('div.week-btn').find('a[href*="'+files[i] +'"]').each(function(index,elem){
					$$(this).addClass('activebutton');
				});
				fs.writeFileSync(filename,$$.html().toString().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/\&amp\;/g,'&').replace(/ & /g,' &amp; ').replace(/data\-extlink/g,'data-extLink'));
			}
			else{}
		}
		else{}

	}
}

function LessonFileUpdated(rootPath, filter,headerContent){
	if (!fs.existsSync(rootPath)) {
		console.log("no dir ", rootPath);
		return;
	}
	var files = fs.readdirSync(rootPath);
	for(var i=0; i<files.length; i++){
		filename = path.join(rootPath, files[i]);
		var stat = fs.lstatSync(filename);
		if(stat.isDirectory()){}
		else if(filename.indexOf(filter) >= 0){
			var content = readfile(filename);
			var $$ = cheerio.load(content);
			$$('div.week-btn').html(headerContent.replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/\&amp\;/g,'&').replace(/ & /g,' &amp; '));
			$$('div.week-btn').find('a[href*="'+files[i] +'"]').each(function(index,elem){
				$$(this).addClass('activebutton');
			});
			fs.writeFileSync(filename,$$.html().toString().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/\&amp\;/g,'&').replace(/ & /g,' &amp; ').replace(/data\-extlink/g,'data-extLink'));
		}
		else{}

	}
}