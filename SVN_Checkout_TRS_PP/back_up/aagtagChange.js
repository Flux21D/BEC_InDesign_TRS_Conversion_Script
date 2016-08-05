var path = require('path'); //File System
var jsonQuery = require('json-query');
fs=require('fs'); //FileSystem
var argv=require('optimist').argv; //Arguments
var writetofile=require('./libs/writetofile'); //file writer
var readfile=require('./libs/readfile'); //file writer
var cheerio=require('cheerio');
var underscore=require('./libs/underscore.js'); //file writer
var input = argv.i;
var filepath = input.substr(0, input.lastIndexOf('\\'));

contentConversion(filepath,input);

function contentConversion(filepath,file){
	var frameContent = readfile(file);
	var $$ = cheerio.load(frameContent);
	var fileName = file.toString().replace(filepath + '\\','');
	
	if(fileName.toString().match('aag')){
	$$('div').find('div.aag-bb').each(function(index,elem){
		$$(this).html('\n<div class="English_Guide">\n' + $$(this).html() + '\n</div>\n');
		$$(this).find('div.English_Guide').each(function (ind,ele){
			$$(this).parent().html($$(this).html().toString().replace(/\<p class\=\"At\_A\_Glance\_B\-hd\"\>/g,'</div>\n<div class="English_Guide">\n<p class="At_A_Glance_B-hd">'));
		});
	});
		
	}
fs.writeFileSync(file.toString().replace(/\.html/g,'_updated.html'),$$.html());
}

