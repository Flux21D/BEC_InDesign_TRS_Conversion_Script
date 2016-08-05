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
	var rootpath = filepath.substr(0, filepath.lastIndexOf('\\'));
	var weekpath = rootpath.substr(0, rootpath.lastIndexOf('\\'));
	var unitpath = weekpath.substr(0, weekpath.lastIndexOf('\\'));
	if (!fs.existsSync(weekpath + '\\' + cssFileName)){}
	else{
		cssFile = weekpath + '\\' + cssFileName;
	}
	
	var frameContent = readfile(file);
	var $ = cheerio.load(frameContent);
	$('b').removeAttr('style');
	$('i').removeAttr('style');
	$('u').removeAttr('style');
	var cssContent = readfile(cssFile);
	var cssContents = cssContent;
	cssUpdated('span',cssContent);
	cssUpdated('strong',cssContents);
	//cssContents = cssUpdated('b',cssContents);
	//cssContents = cssUpdated('i',cssContents);
	//cssContents = cssUpdated('u',cssContents);
	cssUpdated('p',cssContents);
	cssUpdated('h1',cssContents);
	cssUpdated('h2',cssContents);
	cssUpdated('h3',cssContents);
	cssUpdated('ul',cssContents);
	cssUpdated('li',cssContents);
	cssUpdated('table',cssContents);
	cssUpdated('td',cssContents);
	cssUpdated('tr',cssContents);
	cssUpdated('tbody',cssContents);
	cssUpdated('thead',cssContents);
	cssUpdated('figcaption',cssContents);
	if(cssContents.toString().match('b, strong {font-family: inherit !important;}') == null){
		cssContents = cssContents + '\r\n' + 'b, strong {font-family: inherit !important;}';
	}
	if(cssContents.toString().match('.sample_modeling b {font-style: normal !important;}') == null){
		cssContents = cssContents + '\r\n' + '.sample_modeling b {font-style: normal !important;}';
	}
	if(cssContents.toString().match('td {vertical-align: top !important;}') == null){
		cssContents = cssContents + '\r\n' + 'td {vertical-align: top !important;}';
	}
	$('article.row').find('br').each(function(elem,index){
		$(this).remove();
	});
	fs.writeFileSync(weekpath + '\\' + cssFileName,cssContents);
	fs.writeFileSync(file,$.html().toString().replace(/data\-extlink/g,'data-extLink').replace(/\<\/b\>\<\/figcaption\>\n\<figcaption class\=\"padding\-bottom\-10\"\>\<b\>/g,'<br/>').replace(/\<\/figcaption\>\n\<figcaption class\=\"padding\-bottom\-10\"\>/g,'<br/>').replace(/\<h2\>Productive Engagement/g,'	<h2 class=”productive_engagement”>Productive Engagement').replace(/\<h3\>Productive Engagement/g,'	<h3 class=”productive_engagement”>Productive Engagement').replace(/\<h2\>Participación productiva/g,'	<h2 class=”productive_engagement”>Participación productiva').replace(/\<h3\>Participación productiva/g,'	<h3 class=”productive_engagement”>Participación productiva').replace(/\<h2\>Write Independently/g,'	<h2 class=”assesment>Write Independently').replace(/\<h3\>Write Independently/g,'	<h3 class="assesment">Write Independently').replace(/\<li\>Presentación de la semana\<\/li\>/g,'<p>Presentación de la semana</p>').replace(/\"assesment_iELD assesment\"/g,'"assesment').replace(/\<h2\>Escribir de forma independiente/g,'<h2 class="assessment">Escribir de forma independiente').replace(/\<h3\>Escribir de forma independiente/g,'<h3 class="assessment">Escribir de forma independiente').replace(/\<h3 class\=\"collaborative\"\>Escribir de forma independiente/g,'<h3 class="assessment">Escribir de forma independiente').replace(/\<h2 class\=\"collaborative\"\>Escribir de forma independiente/g,'<h2 class="assessment">Escribir de forma independiente').replace(/\<h2\>Show Your Word Knowledge/g,'<h2 class="assessment">Show Your Word Knowledge').replace(/\<h3\>Show Your Word Knowledge/g,'<h3 class="assessment">Show Your Word Knowledge').replace(/\<i\>Seré capaz de:\<\/i\>/g,'Seré capaz de:').replace(/\<li\>\• /g,'<li> '));
	function cssUpdated(tagName,cssContent){
		var i =0;
		$('article.row').find(tagName + '[style]').each(function (index,element){
						
			if($(this).attr('class') != undefined){
				if($(this).attr('class').toString().match(' ')){
					var className = $(this).attr('class').toString().split(' ')[0];
				}
				else{
					var className = $(this).attr('class');
				}
				var style = $(this).attr('style').toString().replace(';','');
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
				if(cssContent.toString().match(parentClass + ' ' + tagName+'.'+className + '{\r\n' + style + ' !important;\r\n}') == null){
					//cssContent = cssContent + '\r\n' + parentClass + ' ' + tagName+'.'+className + '{\r\n' + style + ' !important;\r\n}';
					if(className.toString().match('collaborative') != null || className.toString().match('Multimedia') != null || className.toString().match('productive_engagement') != null || className.toString().match('assesment') != null){
						//cssContent = cssContent + '\r\n' + parentClass + ' ' + tagName+'.'+className + '::before' + '{\r\n' + style + ' !important;\r\n}';
					}
					$(this).removeAttr('style');
				}
				else{
					$(this).removeAttr('style');
				}
			}
			else{
				var style = $(this).attr('style').toString().replace(';','');
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
					if($(this).parent().parent().attr('class')){
						var parentparentTag = $(this).parent().parent()[0].name;
						if($(this).parent().parent().attr('class').toString().match(' ')){
							var parentparentClass = parentparentTag + '.' + $(this).parent().parent().attr('class').toString().split(' ')[0];
						}
						else{
							var parentparentClass = parentparentTag + '.' + $(this).parent().parent().attr('class');
						}
					}
					else{
						var parentparentClass = parentparentTag;
					}
					var parentClass = parentparentClass + ' ' + parentTag;
				}
				if(cssContent.toString().match(parentClass + ' ' + tagName + '{\r\n' + style + ' !important;\r\n}') == null){
					//cssContent = cssContent + '\r\n' + parentClass + ' ' + tagName + '{\r\n' + style + ' !important;\r\n}';
					$(this).removeAttr('style');
				}
				else{
					$(this).removeAttr('style');
				}
			}
		});
		//return cssContent;
		
		
	}

}
