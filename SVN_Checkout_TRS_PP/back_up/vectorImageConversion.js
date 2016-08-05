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
            fromDir(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
			var filepath = filename.toString().replace('\\' + files[i],'');
			contentConversion(filepath,filename);
		} else {};
    };
};

function contentConversion(filepath,file){
var rootpath = filepath.substr(0, filepath.lastIndexOf('\\'));
var currentfileName = filepath.toString().replace(rootpath + '\\','') + '.html';

var frameContent = readfile(file);
var $$ = cheerio.load(frameContent);
var fileName = file.toString().replace(filepath + '\\','');

var currentUnit = filepath.toString().match(UnitRegex);
var currentGrade = filepath.toString().match(GradeRegex).toString().replace('Grade ','grade').replace('K','k');
var currentWeek = filepath.toString().match(WeekRegex);
var currentDay = filepath.toString().match(DayRegex);

$$('div').find('p.VectorImageStyle').each(function(index,elem){
	var content = $$(this).html().replace(/\&lt\;/g,'').replace(/img /g,'').replace(/src\=/g,'').replace(/\”/g,'').replace(/\”/g,'').replace(/\//g,'').replace(/\&gt\;/g,'');
	$$(this).before('<figure class="thumbnail">\n<a data-code="X24317" data-name="TK" data-type="ebook" data-extlink="javascript" href="#" data-pages="11">\n<img src="' + content + '" />' + '\n</a>\n' + '<figcaption class="padding-bottom-10"><strong>' + $$(this).next().html() + '</strong></figcaption>\n' + '</figure>\n');
	var imgSrc = $$(this).prev().find('img').attr('src');
	var imageFileName = imgSrc.replace(imgSrc.substr(0, imgSrc.lastIndexOf('\\')) + '\\','');
	var imagePath = rootpath.toString().replace('InDesign_Output','Final_Output');
	var currentImagefolder = rootpath + '\\Vectorimages';
	var dimensions = sizeOf(currentImagefolder + '\\' + imageFileName);
	$$(this).prev().find('img').attr('width',dimensions.width);
	$$(this).prev().find('img').attr('height',dimensions.height);
	$$(this).prev().find('img').attr('alt','thumbnails');
	var actualimgSrc = '/images/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + imageFileName;
	$$(this).prev().find('img').attr('src',actualimgSrc);
	ncp(currentImagefolder, imagePath, function (err) {
		  if (err) { 
			console.log(err);
		  }
		  // done
		});	
		$$(this).next().remove();
		$$(this).remove();
});

fs.writeFileSync(file,$$.html());

}