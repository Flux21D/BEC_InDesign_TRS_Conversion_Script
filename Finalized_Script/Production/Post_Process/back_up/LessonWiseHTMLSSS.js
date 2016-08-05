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
var templateHTML = __dirname + '\\supporting_files\\lessons.html';
var GradeRegex = /Grade [K0-9]+/g;
var UnitRegex = /unit[0-9]+/g;
var WeekRegex = /week[0-9]+/g;
var DayRegex = /day[0-9]+/g;
var tempContent = readfile(templateHTML);
var $ = cheerio.load(tempContent);

//fromDir(input, '.html');

var filepath = input.substr(0, input.lastIndexOf('\\'));

contentConversion(filepath,input);


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
            fromDir(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
			var filepath = filename.toString().replace('\\' + files[i],'');
			if(filepath.toString().match('InDesign_Output') != null){
				contentConversion(filepath,filename);
			}
			else{}
		} else {};
    };
};

function contentConversion(filepath,file){
	if(filepath.toString().match(GradeRegex) == null){}
	else{
		var rootpath = filepath.substr(0, filepath.lastIndexOf('\\'));
		var currentfileName = filepath.toString().replace(rootpath + '\\','') + '.html';

		var frameContent = readfile(file);
		var $$ = cheerio.load(frameContent);
		var fileName = file.toString().replace(filepath + '\\','');

		var currentUnit = filepath.toString().match(UnitRegex);
		var currentGrade = filepath.toString().match(GradeRegex).toString().replace('Grade ','grade').replace('K','k');
		var currentWeek = filepath.toString().match(WeekRegex);
		var currentDay = filepath.toString().match(DayRegex);

		if(fileName.toString().match('thumbnailImages')){
			var dataPages = "";
			var xCode = "";
			var thumbCoverRegex = /CV.jpg/g;
			var thumbpagesRegex = /[0-9\-]+.jpg/g;
			var thumbXCODERegex = /[A-Z0-9]+_/g;
			$$('div').find('img').each(function(index,elem){
				var imgSrc = $$(this).attr('src');
				var imageFileName = imgSrc.replace(imgSrc.substr(0, imgSrc.lastIndexOf('/')) + '/','');
				var actualimgSrc = '/images/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + imageFileName;
				$$(this).attr('src',actualimgSrc);
				var dimensions = sizeOf(rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrc.toString().replace(/\//g,'\\'));
				$$(this).attr('width',dimensions.width);
				$$(this).attr('height',dimensions.height);
				$$(this).attr('alt','thumbnail');
				
				/* Gathering Data-Pages from the image File Name */
				if(imageFileName.match(thumbpagesRegex)!=null) {
					dataPages = imageFileName.match(thumbpagesRegex).toString().replace('.jpg','');
				}
				else if(imageFileName.match(thumbCoverRegex) != null) {
					dataPages = imageFileName.match(thumbCoverRegex).toString().replace('.jpg','').replace('CV','cover');
				}
				else{}
				
				/* Gathering Data-Code from the image File Name */
				if(imageFileName.match(thumbXCODERegex)!=null) {
					xCode = imageFileName.match(thumbXCODERegex)[0].toString().replace('_','');
				}
				else{}
				
				var imageXCODE = imageFileName.toString().split('_')[0];
				$(this).removeAttr('style');
				var imagePath = rootpath.toString().replace('InDesign_Output','Final_Output');
				var currentImagefolder = rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrc.toString().replace(/\//g,'\\').replace(imageFileName,'');
				ncp(currentImagefolder, imagePath, function (err) {
				  if (err) { 
					console.log(err);
				  }
				  // done
				});	
				$('figure.thumbnail').append('<a data-code="' + xCode + '" data-name="TK" data-type="ebook" data-extLink="javascript" href="javascript" data-pages="' + dataPages + '">' + $$(this) + '</a>\n');
			});
			$$('div').find('p.table_label').each(function(ind,ele){
				$('figure.thumbnail').append('<figcaption class="padding-bottom-10">' + $$(this).html() +'</figcaption>\n');
			});
			
fs.writeFileSync(file.toString().replace('thumb','xxt'),$.html());
			
		}
	}
}