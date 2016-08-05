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
var GradeRegex = /Grade [K0-9]+/g;
var UnitRegex = /unit[0-9]+/g;
var WeekRegex = /week[0-9]+/g;
var DayRegex = /day[0-9]+/g;
var errorReport = 'FileName,Issue'
fromDir(input, '.html');

fs.writeFileSync(input + '\\' + 'xCodeReport.csv',errorReport);

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
        }  else if(filename.indexOf(filter) >= 0){
			if(filename.toString().match('lesson')){
			var filepath = filename.toString().replace('\\' + files[i],'');
			contentConversion(filepath,filename);
			}
		}
		else{};
    };
};


function contentConversion(filepath,file){
	if(filepath.toString().match(GradeRegex) == null){}
	else{
		var rootpath = filepath.substr(0, filepath.lastIndexOf('\\'));
		var weekpath = rootpath.substr(0, rootpath.lastIndexOf('\\'));
		var unitpath = weekpath.substr(0, weekpath.lastIndexOf('\\'));
		var currentfileName = filepath.toString().replace(rootpath + '\\','') + '.html';

		var frameContent = readfile(file);
		var $$ = cheerio.load(frameContent);
		var fileName = file.toString().replace(filepath + '\\','');

		var currentUnit = filepath.toString().match(UnitRegex);
		var currentGrade = filepath.toString().match(GradeRegex).toString().replace('Grade ','grade').replace('K','k');
		var currentWeek = filepath.toString().match(WeekRegex);
		var currentDay = filepath.toString().match(DayRegex);
		
		var thumbCoverRegex = /CV.jpg/g;
		var thumbpagesRegex = /[0-9\-]+.jpg/g;
		var thumbpagesRegex1 = /p[0-9\-]+/g;
		var thumbpagesRegex2 = /[0-9]+\_/g;
		var thumbXCODERegex = /[X0-9]+_/g;
		var thumbXCODERegex1 = /[Y0-9]+_/g;
		var thumbXCODERegex2 = /[NX0-9]+_/g;
			
		if($$('figure.thumbnail').html() == null){
			errorReport = errorReport + '\n' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName.toString().replace('.html','') + ',' + 'Figure Tag Not Found';
		}
		else{
			$$('figure.thumbnail').find('img').each(function (elem,index){
				var imgSrc = $$(this).attr('src');
				var imageFileName = imgSrc.replace(imgSrc.substr(0, imgSrc.lastIndexOf('/')) + '/','');
				
				/* Gathering Data-Pages from the image File Name */
				if(imageFileName.match(thumbpagesRegex1)!=null) {}
				else if(imageFileName.match(thumbpagesRegex) != null && imageFileName.match('_' + thumbpagesRegex) == null) {}
				else if(imageFileName.match(thumbCoverRegex) != null) {}
				else{
					errorReport = errorReport + '\n' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName.toString().replace('.html','') + ',' + '"' + imageFileName + '"' + ',' + 'data-Pages Not Found in the image File';
				}
				/* Gathering Data-Code from the image File Name */
				if(imageFileName.match(thumbXCODERegex)!=null) {}
				else if(imageFileName.match(thumbXCODERegex1)!=null) {}
				else if(imageFileName.match(thumbXCODERegex2) != null){}
				else{
					errorReport = errorReport + '\n' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName.toString().replace('.html','') + ',' + '"' + imageFileName + '"' + ',' + 'YCODE Not Found in the image File';
				}
				
			});
		}
		
	}
}