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
require('prototypes');
var input = argv.i;

contentConversion(input);

function contentConversion(file){
var tagArray=[];

var cssContent = readfile(file);
cssDom = cssParser(cssContent);
cssDom.stylesheet.rules.forEach(function(e,j){
	if(e.selectors){
		if(e.selectors.toString().contains('.') == true){
			if(e.selectors.toString().contains('article') == false){
				if(e.selectors.toString().contains('::') == false){
					if(e.selectors.toString().match(' ') != undefined){
						if(tagArray.indexOf(e.selectors.toString().substringFrom('.').toString().replace(/logrades_d1 /g,'').toString().split(' ')[0])<0){
							tagArray.push(e.selectors.toString().substringFrom('.').toString().replace(/logrades_d1 /g,'').toString().split(' ')[0]);
						}
					}
				}
			}
		}
		if(e.selectors.toString().contains('article') == true){
			if(e.selectors.toString().split('article.')[1] != undefined){
				if(e.selectors.toString().split('article.')[1].toString().match(' ') != undefined){
					if(tagArray.indexOf(e.selectors.toString().split('article.')[1].toString().split(' ')[0])<0){
						tagArray.push(e.selectors.toString().split('article.')[1].toString().split(' ')[0]);
					}
				}
				else{
					if(tagArray.indexOf(e.selectors.toString().split('article.')[1])<0){
						tagArray.push(e.selectors.toString().split('article.')[1]);
					}
				}
			}
		}
	}
});
fs.writeFileSync(file.toString().replace('.css','.txt'),tagArray.toString().replace(/,/g,'\n'));
}


