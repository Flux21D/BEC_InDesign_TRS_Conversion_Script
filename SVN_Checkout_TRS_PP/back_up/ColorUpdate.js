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
var cssFolder = argv.c;
//var cssFolder = __dirname + '\\supporting_files\\template_css';
var GradeRegex = /Grade [K0-9]+/g;
var UnitRegex = /unit[0-9]+/g;
var WeekRegex = /week[0-9]+/g;
var DayRegex = /day[0-9]+/g;

if(input.toString().match('InDesign_Output')){
	input = input.toString().replace('InDesign_Output','Final_Output');
}
fromDir(input, '.html');

// Reading a input Directory
function fromDir(htmlPath, htmlFilter) {
    if (!fs.existsSync(htmlPath)) {
        console.log("no dir ", htmlPath);
        return;
    }
	
    var htmlFiles = fs.readdirSync(htmlPath);
	for (var i = 0; i < htmlFiles.length; i++) {
        htmlFileName = path.join(htmlPath, htmlFiles[i]);
        var stat = fs.lstatSync(htmlFileName);
        if (stat.isDirectory()) {
            fromDir(htmlFileName, htmlFilter); //recurse
        } else if (htmlFileName.indexOf(htmlFilter) >= 0) {
			var htmlFilePath = htmlFileName.toString().replace('\\' + htmlFiles[i],'');
			htmlTraverse(htmlFilePath,htmlFileName);
		} else {};
    };
};


function htmlTraverse(inputPath,inputFile){
	var htmlContent = readfile(inputFile);
	var $$ = cheerio.load(htmlContent);
	$$('head').find('link[rel*="stylesheet"]').each(function (index,element){
	
		if($$(this).attr('href').toString().match('daylevel')){
			var cssSrc = $$(this).attr('href');
			var cssFileName = cssSrc.replace(cssSrc.substr(0, cssSrc.lastIndexOf('/')) + '/','');
			fromCSSDir(cssFolder,cssFileName,inputPath,inputFile);
		}
	});
}

// Reading a input Directory
function fromCSSDir(startPath,filter,htmlFilePath,htmlFile) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromCSSDir(filename, filter,htmlFilePath,htmlFile); //recurse
        } else if (filename.indexOf(filter) >= 0) {
			if(filename.indexOf('.svn-base') >=0){}
			else{
				contentConversion(htmlFilePath,htmlFile,filename,files[i]);
			}
		} else {};
    };
};




function contentConversion(filepath,file,cssFile,cssFileName){

	var fileName = file.toString().replace(filepath + '\\','').replace('.html','');

	var frameContent = readfile(file);
	var $ = cheerio.load(frameContent);
	
	var cssContent = readfile(cssFile);
	var cssContents = cssUpdated('span',cssContent);
	cssContents = cssUpdated('strong',cssContents);
	cssContents = cssUpdated('i',cssContents);
	cssContents = cssUpdated('u',cssContents);
	cssContents = cssUpdated('p',cssContents);
	cssContents = cssUpdated('h1',cssContents);
	cssContents = cssUpdated('h2',cssContents);
	cssContents = cssUpdated('h3',cssContents);
	cssContents = cssUpdated('ul',cssContents);
	cssContents = cssUpdated('li',cssContents);
	cssContents = cssUpdated('table',cssContents);
	cssContents = cssUpdated('td',cssContents);
	cssContents = cssUpdated('tr',cssContents);
	cssContents = cssUpdated('tbody',cssContents);
	cssContents = cssUpdated('thead',cssContents);
	cssContents = cssUpdated('figcaption',cssContents);
	fs.writeFileSync(filepath + '\\' + cssFileName,cssContents);
	fs.writeFileSync(file,$.html());
	function cssUpdated(tagName,cssContent){
		var i =0;
		$('article.row').find(tagName + '[style]').each(function (index,element){
			if($(this).attr('class') == undefined){
				i++;
				$(this).attr('class','coloredClass_'+i);
			}
			
			if($(this).attr('class') != undefined){
				if($(this).attr('class').toString().match(' ')){
					var className = $(this).attr('class').toString().split(' ')[0];
				}
				else{
					var className = $(this).attr('class');
				}
				var style = $(this).attr('style').toString().replace(';',' !important');
				var parentTag = $(this).parent()[0].name;
				if($(this).parent().attr('class')){
					if($(this).parent().attr('class').toString().match(' ')){
						var parentClass = parentTag + '.' + $(this).parent().attr('class').toString().split(' ')[0];
					}
					else{
						var parentClass = parentTag + '.' + $(this).parent().attr('class');
					}
				}
				else{
					var parentClass = parentTag;
				}
				if(cssContent.toString().match(parentClass + ' ' + tagName+'.'+className + '{\n\t' + style + ';\n}') == null){
					cssContent = cssContent + '\n' + parentClass + ' ' + tagName+'.'+className + '{\n\t' + style + ';\n}';
				}
				else{}
				$(this).removeAttr('style');
			}
			else{
				var style = $(this).attr('style').toString().replace(';',' !important');
				var parentTag = $(this).parent()[0].name;
				if($(this).parent().attr('class')){
					if($(this).parent().attr('class').toString().match(' ')){
						var parentClass = parentTag + '.' + $(this).parent().attr('class').toString().split(' ')[0];
					}
					else{
						var parentClass = parentTag + '.' + $(this).parent().attr('class');
					}
				}
				else{
					var parentClass = parentTag;
				}
				cssContent = cssContent + '\n' + parentClass + ' ' + tagName + '{\n\t' + style + ';\n}';

				$(this).removeAttr('style');
			}
		});
		return cssContent;
		
		
	}

}
