var path = require('path'); //File System
fs = require('fs'); //FileSystem
var argv = require('optimist').argv; //Arguments
var writetofile = require('./writetofile'); //file writer
var readfile = require('./readfile'); //file writer
var cheerio = require('cheerio');
var cssParser = require('css-parse');
var underscore = require('./underscore.js'); //file writer
var correctViewPort = "";
var spreadcorrectViewPort = "";
var width = "";
var errorReport1 = 'File Name,Selector,Color,Script Comment';
var errorReport = '';
module.exports = function(inputFolder) {

var root = inputFolder.substr(0, inputFolder.lastIndexOf('\\'));
var reportContent = readfile(__dirname + '\\template.html');
var $$$ = cheerio.load(reportContent);
errorReport = $$$('table').html().toString().replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');

fromDirCoverFile(inputFolder, '.html');
fromDirOtherFile(inputFolder, '.html',correctViewPort,spreadcorrectViewPort);
fromCSSTraverse(inputFolder, '.css');

$$$('table').text(errorReport);
fs.writeFileSync(root + "\\Red_Colored_Text_report_for_" + inputFolder.toString().replace(root + '\\','') + ".csv" ,errorReport1);
fs.writeFileSync(root + "\\Red_Colored_Text_report_for_" + inputFolder.toString().replace(root + '\\','') + ".html" ,$$$.html().toString().replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));

function fromDirCoverFile(startPath, filter) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDirCoverFile(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
			if(files[i] == 'cover.html'){
				var coverContent = readfile(filename);
				var $ = cheerio.load(coverContent);
				correctViewPort = $('meta[name="viewport"]').attr('content');
				if(correctViewPort.toString().split(',')[0].toString().match('width')){
					width = correctViewPort.toString().split(',')[0].toString().replace('width','').replace(' ','').replace('=','').toString() * 2;
					spreadcorrectViewPort = 'width=' + width + ',' + correctViewPort.toString().split(',')[1];
				}
				else if(correctViewPort.toString().split(',')[1].toString().match('width')){
					width = correctViewPort.toString().split(',')[1].toString().replace('width','').replace(' ','').replace('=','').toString() * 2;
					spreadcorrectViewPort = correctViewPort.toString().split(',')[0] + ',' +  'width=' + width;
				}
			}
			else{}
        } else {};
    };
};
function fromDirOtherFile(startPath, filter,viewPortContent,spreadcorrectViewPort) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDirOtherFile(filename, filter,viewPortContent,spreadcorrectViewPort); //recurse
        } else if (filename.indexOf(filter) >= 0) {
			if(files[i] == 'cover.html'){}
			else{
				if(files[i].toString().match('page') && files[i].length >= 12 && files[i].length < 15){
					var content = readfile(filename);
					var $$ = cheerio.load(content);
					$$('meta[name="viewport"]').attr('content',viewPortContent);
					fs.writeFileSync(filename, $$.html());
				}
				else if(files[i].toString().match('page') && files[i].length >= 15){
					var content = readfile(filename);
					var $$ = cheerio.load(content);
					$$('meta[name="viewport"]').attr('content',spreadcorrectViewPort);
					fs.writeFileSync(filename, $$.html());
				}
				else{
					var content = readfile(filename);
					var $$ = cheerio.load(content);
					$$('meta[name="viewport"]').attr('content',viewPortContent);
					fs.writeFileSync(filename, $$.html());
				}
			}
        } else {};
    };
};

function fromCSSTraverse(startPath, filter) {

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromCSSTraverse(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
			cssCleanup(filename);
        } else {};
    };
};
function cssCleanup(inputFile){
	var cssContent = readfile(inputFile);
	cssDom = cssParser(cssContent);
	cssDom.stylesheet.rules.forEach(function(e,j){
		if(e.selectors){
			e.selectors.forEach(function(e2,k){
				e.declarations.forEach(function(e1,l){
					if(e1.property == 'color'){
					
						if(e1.value == 'rgb(255,23,33)' || e1.value == 'red' || e1.value == 'rgb(239,59,51)' || e1.value == '#FF0000' || e1.value == 'rgb(255,0,0)'){
							errorReport1 = errorReport1 + '\n' + '"' + inputFile + '"' + ',' + '"' + e.selectors + '"' + ',' +  '"' + e1.value + '"' + ',' + 'Found as Red Color';		
							errorReport = errorReport + '\n' + '<tr style="border-top:2px solid; border-right:2px solid;">\n<td style="border-top:2px solid; border-right:2px solid; text-align:left">' + inputFile + '</td>\n<td style="border-top:2px solid; border-right:2px solid; text-align:left">' + e.selectors + '</td>\n<td style="border-top:2px solid; border-right:2px solid; text-align:left; background-color:' + e1.value + '">' + e1.value + '</td>\n<td style="border-top:2px solid; border-right:2px solid; text-align:left; background-color:' + e1.value + '">Found as Red Color</td>\n</tr>';		
						}
						else{
							errorReport1 = errorReport1 + '\n' + '"' + inputFile + '"' + ',' + '"' + e.selectors + '"' + ',' +  '"' + e1.value + '"' + ',' + 'Not a Red Color';
							errorReport = errorReport + '\n' + '<tr style="border-top:2px solid; border-right:2px solid;">\n<td style="border-top:2px solid; border-right:2px solid; text-align:left">' + inputFile + '</td>\n<td style="border-top:2px solid; border-right:2px solid; text-align:left">' + e.selectors + '</td>\n<td style="border-top:2px solid; border-right:2px solid; text-align:left; background-color:' + e1.value + '">' + e1.value + '</td>\n<td style="border-top:2px solid; border-right:2px solid; text-align:left;">Not a Red Color</td>\n</tr>';	
						}
					}
				});
			});
		}
	});
}

}
