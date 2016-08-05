var path = require('path'); //File System
var jsonQuery = require('json-query');
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //file writer
var inputCSVFile = argv.x;
var input = argv.i;
var parse = require('csv-parse/lib/sync');
require('should');

var gradeRegex = /grade[k0-9]+/g;
var gradeUnitRegex = /grade[k0-9]+\/unit[0-9]+/g;

var csvContent = readfile(inputCSVFile);
csvContent = csvContent.toString().replace(/recursos/g,'recurso').replace(/Benchmark Adelante Sistema de recurso para maestros/g,'Benchmark Advance Teacher\'s Resource System').replace(/Grado /g,'Grade ').replace(/Unidad /g,'Unit ').replace(/Semana /g,'Week').replace(/Kindergarten/g,'Grade K').replace(/ HTML/g,' - HTML').replace(/ - /ig,"_").replace(/Catalog Title/g,'Title').replace(/Product Code/g,'SKU');

var records = parse(csvContent, {columns: true});
var finalOutputPath = input.toString().replace('InDesign_Output','Final_Output');
fromDir(finalOutputPath, '.html',records);



// Reading a input Directory
function fromDir(startPath, filter,records) {

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
			if(files[i].toString().match('lessons')){}
			else if(files[i].toString().match('day')){
				lessonFileTraverse(folderName,'html',records);
			}
			else{
				fromDir(filename, filter,records); //recurse
			}
        }else {};
    };
};


// Reading a input Directory
function lessonFileTraverse(rootPath, filter,records) {

    if (!fs.existsSync(rootPath)) {
        console.log("no dir ", rootPath);
        return;
    }

    var files = fs.readdirSync(rootPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(rootPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {}
		else if(filename.indexOf(filter) >= 0){
			xCodeHTMLReading(filename,files[i],records);
		}
		else {};
    };
};

function xCodeHTMLReading(file,fileName,records){

	var content = readfile(file);
	var $ = cheerio.load(content);
	$('div.grades').find('a').each(function(index,elem){
		if($(this).attr('href').toString().match('#')){}
		else{

			var gradeTitleName = $(this).attr('href').toString().match(gradeRegex).toString().replace('gradek','gradeK').replace('grade','Benchmark Advance Teacher\'s Resource System Grade ') + "_";
			var gradeXCODE = jsonQuery('[Title~/' + gradeTitleName+'/i].SKU', {
			  data: records,
			  allowRegexp: "enable",
			  
			}).value //=> {value: 'Matt', parents: [...], key: 0} ... etc 

			$(this).attr('data-code',gradeXCODE);
		}
		
	});
	$('div.nav-disc').find('a').each(function(index,elem){
		if($(this).attr('href').toString().match('#')){}
		else{

			var unitTitleName = $(this).attr('href').toString().match(gradeUnitRegex).toString().replace('gradek','gradeK').replace('grade','Benchmark Advance Teacher\'s Resource System Grade ').replace(/\/unit/g,' Unit ').replace(/unit/g,'Unit ') + "_";

			var unitXCODE = jsonQuery('[Title~/' + unitTitleName+'/i].SKU', {
			  data: records,
			  allowRegexp: "enable",
			  
			}).value //=> {value: 'Matt', parents: [...], key: 0} ... etc 
			$(this).attr('data-code',unitXCODE);
		}
		
	});
	$('[style*="display:none"]').remove();
	fs.writeFileSync(file,$.html().replace(/data\-extlink/g,'data-extLink'));
}
