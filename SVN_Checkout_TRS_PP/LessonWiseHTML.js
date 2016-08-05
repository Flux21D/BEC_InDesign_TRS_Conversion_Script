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
var language = argv.l;
var sizeOf = require('image-size');
var templateHTML = __dirname + '\\supporting_files\\lesson.html';
var GradeRegex = /Grade [K0-9]+/g;
var UnitRegex = /unit[0-9]+/g;
var WeekRegex = /week[0-9]+/g;
var DayRegex = /day[0-9]+/g;
var aagReport = 'fileName,issue';
var tempContent = readfile(templateHTML);
var $ = cheerio.load(tempContent);
var errorReport = 'FileName,Issue,'
fromDir(input, '.html');

//fs.writeFileSync(input.replace('InDesign_Output','Final_Output') + '\\xCodeReport.csv',errorReport);
fs.writeFileSync(input.replace('InDesign_Output','Final_Output') + '\\aagReport.csv',aagReport);

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
			if(files[i].toString().match('lesson') != null && files[i].toString().match('lessons') == null){
				$ = cheerio.load(tempContent);
				fromLessonDir(filename, filter); //recurse
			}
			else{
				fromDir(filename, filter); //recurse
			}
        }  else {};
    };
};

// Reading a input Directory
function fromLessonDir(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {}
		else if (filename.indexOf(filter) >= 0) {
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
		if(fileName.toString().match('thumbnailImages')){
			formatting('div');
			var dataPages = "";
			var xCode = "";
			var thumbCoverRegex = /CV.jpg/g;
			var thumbpagesRegex = /[0-9\-]+.jpg/g;
			var thumbpagesRegex1 = /p[0-9\-]+/g;
			var thumbpagesRegex2 = /[0-9]+\_/g;
			var thumbXCODERegex = /[X0-9]+_/g;
			var thumbXCODERegex1 = /[Y0-9]+_/g;
			$$('div').find('img').each(function(index,elem){
				var imgSrc = $$(this).attr('src');
				var imageFileName = imgSrc.replace(imgSrc.substr(0, imgSrc.lastIndexOf('/')) + '/','');
				var actualimageFileName = currentfileName.toString().replace('.html','') + '_' + imageFileName;
				var actualimgSrc = '/images/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + actualimageFileName;
				$$(this).attr('src',actualimgSrc);
				//var dimensions = sizeOf(rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrc.toString().replace(/\//g,'\\'));
				//$$(this).attr('width',dimensions.width);
				//$$(this).attr('height',dimensions.height);
				$$(this).attr('alt','thumbnail');
				
				/* Gathering Data-Pages from the image File Name */
				if(imageFileName.match(thumbpagesRegex1)!=null) {
					dataPages = imageFileName.match(thumbpagesRegex1).toString().replace('.jpg','').replace('p','');
				}
				else if(imageFileName.match(thumbpagesRegex) != null && imageFileName.match('_' + thumbpagesRegex) == null) {
					dataPages = imageFileName.match(thumbpagesRegex).toString().replace('.jpg','').replace('p','');
				}
				else if(imageFileName.match(thumbCoverRegex) != null) {
					dataPages = imageFileName.match(thumbCoverRegex).toString().replace('.jpg','').replace('CV','cover');
				}
				else{
					errorReport = errorReport + '\n' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName.toString().replace('.html','') + ',' + '"' + imageFileName + '"' + ',' + 'data-Pages Not Found in the image File';
				}
				
				/* Gathering Data-Code from the image File Name */
				if(imageFileName.match(thumbXCODERegex)!=null) {
					xCode = imageFileName.match(thumbXCODERegex)[0].toString().replace('_','');
				}
				else if(imageFileName.match(thumbXCODERegex1)!=null) {
					xCode = imageFileName.match(thumbXCODERegex1)[0].toString().replace('_','');
				}
				else{
					errorReport = errorReport + '\n' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName.toString().replace('.html','') + ',' + '"' + imageFileName + '"' + ',' + 'XCODE Not Found in the image File';
				}
				
				var imageXCODE = imageFileName.toString().split('_')[0];
				$(this).removeAttr('style');
				var imagePath = weekpath.toString().replace('InDesign_Output','Final_Output');
				var currentImagefolder = rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrc.toString().replace(/\//g,'\\').replace(imageFileName,'');
				ncp(currentImagefolder + imageFileName, imagePath + '\\' + actualimageFileName, function (err) {
				  if (err) { 
					console.log(err);
				  }
				  // done
				});
				$('figure.thumbnail').append('<a data-code="' + xCode + '" data-name="TK" data-type="ebook" data-extLink="javascript" href="javascript" data-pages="' + dataPages + '">' + $$(this) + '</a>\n');
				$('figure.thumbnail').removeAttr('style');
			});
			$$('div').find('p.table_label').each(function(ind,ele){
				$('figure.thumbnail').append('<figcaption class="padding-bottom-10">' + $$(this).html() +'</figcaption>\n');
			});
		}
		else if(fileName.toString().match('Lesson')){
			$$('div').find('span').each(function( index,elem ) {
			 
                   if($$(this).attr('class')=== undefined)
				   {
				  //console.log($$(this).attr('class'));
				   }
				   else
				   {
				if($$(this).attr('class').toLowerCase().match('eld')!=null){
					$$(this).parent().attr('class',$$(this).attr('class'));
				}
				}
			});	
			formatting('div');
			var headerContent = "";
			$$('div').find('p.Lesson_A-hd').each(function( index,elem ) {
			if(currentGrade=='grade3' || currentGrade=='grade4' || currentGrade=='grade5' || currentGrade=='grade6'){
				$$(this).replaceWith('<h1 class="lesson-hd aHead padding-bottom-20">' + '<span class="number">' + currentfileName.toString().replace('lesson','').replace('.html','') + '</span>' + $$( this ).html() + '</h1>');
			}
			else{
				$$(this).replaceWith('<h1 class="lesson-hd aHead padding-bottom-20">' + $$( this ).html() + '</h1>');
			}
				if(language == 'spanish'){
				headerContent = headerContent + $$(this).html();
				}
				else{
					headerContent = headerContent + $$(this).html();
				}
			});	
			if(currentGrade=='grade3' || currentGrade=='grade4' || currentGrade=='grade5' || currentGrade=='grade6'){
				$('h1.lesson-hd').html('<span class="number">' + currentfileName.toString().replace('lesson','').replace('.html','') + '</span>' + headerContent);
			}
			else{
				$('h1.lesson-hd').html('<span class="number">' + currentfileName.toString().replace('lesson','').replace('.html','') + '</span>' + headerContent);
			}
			if(currentGrade=='gradek' || currentGrade=='grade1' || currentGrade=='grade2'){
				var tempDom = cheerio.load(headerContent.toString().replace(/\&nbsp\;\<span/g,'<span'));
				
				tempDom('span.lesson_time').remove();
				tempDom('span.lesson_standards').remove();
				tempDom('span').each(function( index,elem ) {
					tempDom(this).before(tempDom(this).html());
					tempDom(this).remove();
				});
				$('div.week-btn').html('<a href="/html/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName + '" class="week-brd-clr button radius small medium-12 left-align" data-type="internal" data-extLink="/html/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName + '" ><span class="floatr icon-circle-right"></span>' + tempDom.html() + '</a>');
			}
			else if(currentGrade=='grade3' || currentGrade=='grade4' || currentGrade=='grade5' || currentGrade=='grade6'){
				var tempDom = cheerio.load(headerContent);
				tempDom('span.lesson_time').remove();
				tempDom('span.lesson_standards').remove();
				if(language == 'spanish'){
					$('div.week-btn').html('<a href="/html/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + 'lessons' + '/' + currentfileName + '" class="week-brd-clr button radius small medium-12 left-align" data-type="internal" data-extLink="/html/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + 'lessons' + '/' + currentfileName + '" ><span class="floatr icon-circle-right"></span>' + '<big>Lección ' + currentfileName.toString().replace('lesson','').replace('.html','') + '</big><br/><small>' + tempDom.html() + '</small></a>');
				}
				else{
					$('div.week-btn').html('<a href="/html/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + 'lessons' + '/' + currentfileName + '" class="week-brd-clr button radius small medium-12 left-align" data-type="internal" data-extLink="/html/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + 'lessons' + '/' + currentfileName + '" ><span class="floatr icon-circle-right"></span>' + '<big>Lesson ' + currentfileName.toString().replace('lesson','').replace('.html','') + '</big><br/><small>' + tempDom.html() + '</small></a>');
				}
			}
			lessons('div');
			$$('div').find('h1.lesson-hd').remove();
			$('article.Lesson').html($$('div').html());
			$('article.Lesson').removeAttr('style');
		}
		else if(fileName.toString().match('Small_group_diff_instr')){
			$$('div').find('p[class*="A-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h1 class="lesson-hd aHead" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h1>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h1 class="lesson-hd aHead">' + $$( this ).html() + '</h1>');
					$$(this).remove();
				}
			});	
			formatting('div');
			tagChanges('div');
			$$('div').find('h3').each(function (ele,ind){
				$$(this).addClass('standards');
			});
			$('article.Small_group_diff_instr').html($$('div').html());
			$('article.Small_group_diff_instr').removeAttr('style');
		}

		else if(fileName.toString().match('student_objectives')){
			$$('div').find('ul').each(function( index,elem ) {
				$$(this).before('<ul class="padding-10">' + $$(this).html() + '</ul>');
				$$(this).remove();
			});
			formatting('div');
			tagChanges('div');
			$('article.student_objectives').html($$('div').html());
			$('article.student_objectives').removeAttr('style');
		}
		else if(fileName.toString().match('additional_materials')){
			$$('div').find('li[class*="Bullets"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<li style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</li>');
					$$(this).remove();		
				}
				else{
					$$(this).before('<li>' + $$( this ).html() + '</li>');
					$$(this).remove();		
				}
			});
			$$('div').find('ul').each(function( index,elem ) {
				$$(this).before('<ul><a data-code="X13781" data-name="TK" data-type="ebook" data-extLink="javascript" href="javascript" data-pages="1">' + $$( this ).html() + '</a></ul>');
				$$(this).remove();		
			});

			formatting('div');
			tagChanges('div');
			$('article.additional_materials').html($$('div').html());
			$('article.additional_materials').removeAttr('style');
		}
		else if(fileName.toString().match('observation_checklist')){
			formatting('div');
			tagChanges('div');
			$$('div').find('span.objchklst_tracking').remove();
			$('article.observation_checklist').html($$('div').html());
			$('article.observation_checklist').removeAttr('style');
		}
		else if(fileName.toString().match('ELD')){
			formatting('div');
			tagChanges('div');
			$('article.ELD').html($$('div').html());
			$('article.ELD').removeAttr('style');
		}
		else if(fileName.toString().match('standards')){
			formatting('div');
			footer('div');
			$('footer.standards').html($$('div').html());
			$('footer.standards').removeAttr('style');
		}
		else if(fileName.toString().match('aag')){
			$$('div').find('p[class*="A-hd"]').each(function(index,elem){
				$$(this).find('span.aag-nobreak').each(function (ind,ele){
					$$(this).before('<br/>' + $$(this).html());
					$$(this).remove();
				});
				$$(this).before('<h2>' + $$(this).html() + '</h2>');
				$$(this).remove();
			});
			
			$$('div').find('p[class*="B-hd"]').each(function( index,elem ) {
				if($$(this).attr('class') == 'Multimedia_section_B-hd' || $$(this).attr('class') == 'At_A_Glance_MM_B-hd' || $$(this).attr('class') == 'Collaborative_section_B-hd' || $$(this).attr('class') == 'Assessment_section_B-hd' || $$(this).attr('class') == 'At_A_Glance_PE_B-hd' || $$(this).attr('class') == 'Productive_engagement_section_B-hd' || $$(this).attr('class') == 'At_A_Glance_COL_B-hd' || $$(this).attr('class') == 'At_A_Glance_AS_B-hd'){}
				else{
					if($$(this).attr('style')!=undefined){
						$$(this).before('<p class="At_A_Glance_B-hd" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
						$$(this).remove();
					}
					else{
						$$(this).before('<p class="At_A_Glance_B-hd">' + $$( this ).html() + '</p>');
						$$(this).remove();
					}
				}
			});
			
			$$('body').find('div[class*="aag-wb"]').each(function(inde,ele){
				$$(this).removeAttr('id');
				if($$(this).attr('class') == 'aag-wb' + inde){}
				else{
					aagReport = aagReport + '\n' + currentUnit + '/' + currentWeek + '/' + currentDay + '/' + currentfileName.toString().replace('.html','') + ',' + 'Order Mismatches';
				}
				$$(this).attr('class','English_guide');
			});
			formatting('div');
			tagChanges('div');
			$$('div[class*="_id"]').remove();
			$$('div[id*="_id"]').remove();
			$('article.At_a_glance').html('\r\n<h2> <span class="number">' + currentfileName.toString().replace('.html','').replace('lesson','') + '</span> At–A–Glance <break/>English Guide </h2>\r\n' + $$('body').html());
			$('article.At_a_glance').removeAttr('style');
		}
		else if(fileName.toString().match('Ways_to_scaffold')){
			formatting('div');
			tagChanges('div');
			$('article.Ways_to_scaffold').html($$('div').html());
			$('article.Ways_to_scaffold').removeAttr('style');
		}
		else if(fileName.toString().match('MSRCT')){
			formatting('div');
			tagChanges('div');
			$('article.MSRCT').html($$('div').html());
			$('article.MSRCT').removeAttr('style');
		}

		function tagChanges(tag) {	
		
			$$(tag).find('p[class*="Table_label_Body-txt"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<figcaption class="padding-bottom-10" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</figcaption>');
					$$(this).remove();
				}
				else{
					$$(this).before('<figcaption class="padding-bottom-10">' + $$( this ).html() + '</figcaption>');
					$$(this).remove();
				}
			});
			$$(tag).find('img').each(function( index,elem ) {
				var imgSrcInterior = $$(this).attr('src');
				var imageFileNameInterior = imgSrcInterior.replace(imgSrcInterior.substr(0, imgSrcInterior.lastIndexOf('/')) + '/','');
				var actualimageFileNameInterior = currentfileName.toString().replace('.html','') + '_' + imageFileNameInterior;
				var actualimgSrcInterior = '/images/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + actualimageFileNameInterior;
				$$(this).attr('src',actualimgSrcInterior);
				$$(this).attr('alt','thumbnail');
				//var dimensionsInterior = sizeOf(rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrcInterior.toString().replace(/\//g,'\\'));
				//$$(this).attr('width',dimensionsInterior.width);
				//$$(this).attr('height',dimensionsInterior.height);
				$(this).removeAttr('style');
				$(this).removeAttr('class');
				var imagePathInterior = weekpath.toString().replace('InDesign_Output','Final_Output');
				var currentImagefolderInterior = rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrcInterior.toString().replace(/\//g,'\\').replace(imageFileNameInterior,'');
				ncp(currentImagefolderInterior + imageFileNameInterior, imagePathInterior + '\\' + actualimageFileNameInterior, function (err) {
				  if (err) { 
					console.log(err);
				  }
				  // done
				});  
				$(this).before($$(this));
			});
			$$(tag).find('p[class*="Multimedia_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="Multimedia" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="Multimedia">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="MM_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="Multimedia" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="Multimedia">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});		
			$$(tag).find('p[class*="AS_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="assesment" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="assesment">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});		
			$$(tag).find('p[class*="Collaborative_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="collaborative" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="collaborative">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="Assessment_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="assesment" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="assesment">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="PE_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="productive_engagement" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="productive_engagement">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});		
			$$(tag).find('p[class*="Productive_engagement_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="productive_engagement" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="productive_engagement">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});		
			$$(tag).find('p[class*="COL_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="collaborative" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="collaborative">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="A-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2>' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3>' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="Body-txt"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p>' + $$( this ).html() + '</p>');
					$$(this).remove();		
				}
			});	
			$$(tag).find('p[class*="body-txt"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p>' + $$( this ).html() + '</p>');
					$$(this).remove();		
				}	
			});	
			$$(tag).find('p.Sample_modeling_Body-txt').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p class="sample_modeling" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p class="sample_modeling">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="Bullets"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<li style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</li>');
					$$(this).remove();
				}
				else{
					$$(this).before('<li>' + $$( this ).html() + '</li>');
					$$(this).remove();
				}
			});	
			$$(tag).find('p[class*="bb-leading"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p>' + $$( this ).html() + '</p>');
					$$(this).remove();		
				}
			});
			$$(tag).find('p[class*="CCSS"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p class="standards" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p class="standards">' + $$( this ).html() + '</p>');
					$$(this).remove();	
				}
			});	
			$$(tag).find('p[class*="Tchr-tlk"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p class="sample_modeling" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p class="sample_modeling">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});	
			$$(tag).find('table').each(function( index,elem ) {
				$$(this).children('colgroup').remove();
				$$(this).find('tr').removeAttr('class');
				$$(this).find('td').removeAttr('class');
				$$(this).find('p').removeAttr('class');
				if($$(this).find('thead').length == 0){
					if($$(this).find('tr').length > 1){
						$$(this).find('tr').eq(0).each(function( index,elem ) {
							$$(this).parent().before('<thead>\n<tr>' + $$(this).html() + '</tr>\n</thead>\n');
							$$(this).remove();
						});
					}
				}
				$$(this).before('<table>' + $$( this ).html() + '</table>');
				$$(this).remove();		
			});
		}

		function footer(footerTag) {
			$$(footerTag).find('p.CCSS').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p>' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});	
		}

		function lessons(lessonsTag) {
			$$(lessonsTag).find('p[class*="Table_label_Body-txt"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<figcaption class="padding-bottom-10" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</figcaption>');
					$$(this).remove();
				}
				else{
					$$(this).before('<figcaption class="padding-bottom-10">' + $$( this ).html() + '</figcaption>');
					$$(this).remove();
				}
			});
			$$(lessonsTag).find('img').each(function( index,elem ) {
				var imgSrcInterior = $$(this).attr('src');
				var imageFileNameInterior = imgSrcInterior.replace(imgSrcInterior.substr(0, imgSrcInterior.lastIndexOf('/')) + '/','');
				var actualimageFileNameInterior = currentfileName.toString().replace('.html','') + '_' + imageFileNameInterior;
				var actualimgSrcInterior = '/images/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/' + actualimageFileNameInterior;
				$$(this).attr('src',actualimgSrcInterior);
				$$(this).attr('alt','thumbnail');
				//var dimensionsInterior = sizeOf(rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrcInterior.toString().replace(/\//g,'\\'));
				//$$(this).attr('width',dimensionsInterior.width);
				//$$(this).attr('height',dimensionsInterior.height);
				$(this).removeAttr('style');
				$(this).removeAttr('class');
				var imagePathInterior = weekpath.toString().replace('InDesign_Output','Final_Output');
				var currentImagefolderInterior = rootpath + '\\' + filepath.toString().replace(rootpath + '\\','') + '\\' + imgSrcInterior.toString().replace(/\//g,'\\').replace(imageFileNameInterior,'');
				ncp(currentImagefolderInterior + imageFileNameInterior, imagePathInterior + '\\' + actualimageFileNameInterior, function (err) {
				  if (err) { 
					console.log(err);
				  }
				  // done
				});  
				$(this).before($$(this));
				//$(this).remove();
			});
			$$(lessonsTag).find('p[class*="AS_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 class="assesment" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3 class="assesment">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});		
			
			$$(lessonsTag).find('p[class*="ELD"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="iELD" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="iELD">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});
			$$(lessonsTag).find('p[class*="Sample_modeling_Body-txt"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p class="sample_modeling" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p class="sample_modeling">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});		
			$$(lessonsTag).find('p[class*="Tchr-tlk"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p class="sample_modeling" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p class="sample_modeling">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});		
			$$(lessonsTag).find('p.Essential_question_Body-txt').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p class="essential_question" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p class="essential_question">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});	
			$$(lessonsTag).find('p[class*="Multimedia_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="Multimedia" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="Multimedia">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});	
			$$(lessonsTag).find('p[class*="MM_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="Multimedia" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="Multimedia">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});		
			$$(lessonsTag).find('p[class*="Collaborative_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="collaborative" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="collaborative">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});	
			$$(lessonsTag).find('p[class*="Assessment_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="assesment" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="assesment">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});	
			$$(lessonsTag).find('p[class*="Productive_engagement_section_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="productive_engagement" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="productive_engagement">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});	
			$$(lessonsTag).find('p[class*="PE_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="productive_engagement" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="productive_engagement">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});		
			$$(lessonsTag).find('p[class*="COL_B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 class="collaborative" style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2 class="collaborative">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});	
			$$(lessonsTag).find('p[class*="Body-txt"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p>' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});	
			$$(lessonsTag).find('p[class*="body-txt"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<p style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
				else{
					$$(this).before('<p>' + $$( this ).html() + '</p>');
					$$(this).remove();
				}
			});		
			$$(lessonsTag).find('p[class*="B-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h2 style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h2>' + $$( this ).html() + '</h2>');
					$$(this).remove();
				}
			});		
			$$(lessonsTag).find('p[class*="C-hd"]').each(function( index,elem ) {
				if($$(this).attr('style')!=undefined){
					$$(this).before('<h3 style="' + $$(this).attr('style') + '">' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
				else{
					$$(this).before('<h3>' + $$( this ).html() + '</h3>');
					$$(this).remove();
				}
			});	
		}

		function formatting(formatTags) {
			$$(formatTags).find('span').each(function( index,elem ) {
			if($$(this).attr('class')=== undefined)
				   {
				  //console.log($$(this).attr('class'));
				   }
			else
			{
			
				if($$(this).attr('class').toLowerCase().match('lesson_time')!=null){
					if($$(this).attr('style')!=undefined){
						$$(this).children('br').before('&nbsp;');
						$$(this).children('br').remove();
						$$(this).before('&nbsp;<span class="lesson_time" style="' + $$(this).attr('style') + '">' + $$(this).html() + '</span>');
						$$(this).remove();
					}
					else{
						$$(this).children('br').before('&nbsp;');
						$$(this).children('br').remove();
						$$(this).before('&nbsp;<span class="lesson_time">' + $$(this).html() + '</span>');
						$$(this).remove();
					}
				}
				else if($$(this).attr('class').toLowerCase().match('lesson_standard')!=null){
					if($$(this).attr('style')!=undefined){
						$$(this).children('br').before('&nbsp;');
						$$(this).children('br').remove();
						$$(this).before('&nbsp;<span class="lesson_standards" style="' + $$(this).attr('style') + '">' + $$(this).html() + '</span>');
						$$(this).remove();
					}
					else{
						$$(this).children('br').before('&nbsp;');
						$$(this).children('br').remove();
						$$(this).before('&nbsp;<span class="lesson_standards">' + $$(this).html() + '</span>');
						$$(this).remove();
					}
				}
				else if($$(this).attr('class').toLowerCase().match('css_bolditalic')!=null){
					if($$(this).attr('style')!=undefined){
						$$(this).before('<b style="' + $$(this).attr('style') + '"><i>' + $$(this).html() + '</i></b>');
						$$(this).remove();
					}
					else{
						$$(this).before('<b><i>' + $$(this).html() + '</i></b>');
						$$(this).remove();
					}
				}
				else if($$(this).attr('class').toLowerCase().match('css_bold')!=null){
					if($$(this).attr('style')!=undefined){
						$$(this).before('<b style="' + $$(this).attr('style') + '">' + $$(this).html() + '</b>');
						$$(this).remove();
					}
					else{
						$$(this).before('<b>' + $$(this).html() + '</b>');
						$$(this).remove();
					}
				}
				else if($$(this).attr('class').toLowerCase().match('css_italic')!=null){
					if($$(this).attr('style')!=undefined){
						$$(this).before('<i style="' + $$(this).attr('style') + '">' + $$(this).html() + '</i>');
						$$(this).remove();
					}
					else{
						$$(this).before('<i>' + $$(this).html() + '</i>');
						$$(this).remove();
					}
				}
				else if($$(this).attr('class').toLowerCase().match('underline')!=null){
					if($$(this).attr('style')!=undefined){
						$$(this).before('<u style="' + $$(this).attr('style') + '">' + $$(this).html() + '</u>');
						$$(this).remove();
					}
					else{
						$$(this).before('<u>' + $$(this).html() + '</u>');
						$$(this).remove();
					}
				}
				else if($$(this).attr('class').toLowerCase().match('strikethrough')!=null){
					if($$(this).attr('style')!=undefined){
						$$(this).before('<strike style="' + $$(this).attr('style') + '">' + $$(this).html() + '</strike>');
						$$(this).remove();
					}
					else{
						$$(this).before('<strike>' + $$(this).html() + '</strike>');
						$$(this).remove();
					}
				}
				else if($$(this).attr('class').toLowerCase().match('icon')!=null){
					$$(this).find('img').remove();
					$$(this).before($$(this).html());
					$$(this).remove();
				}
				else{
						$$(this).before($$(this).html());
						$$(this).remove();
				}
			
			}
			});
			$$(formatTags).find('ul').each(function( index,elem ) {
				if($$(this).children('li').children('table').length > 0){
					$$(this).children('li').children('table').parent().parent().after('\n<table>\n' + $$(this).children('li').children('table').html() + '</table>');
					$$(this).children('li').children('table').remove();
				}
			});
			$$(formatTags).find('li').each(function( index,elem ) {
				
				if($$(this).attr('style')!=undefined){
					$$(this).before('<li style="' + $$(this).attr('style') + '">' + $$(this).html() + '</li>');
					$$(this).remove();
				}
				else{
					$$(this).before('<li>' + $$(this).html() + '</li>');
					$$(this).remove();
				}
			});
			$$(formatTags).find('table').each(function( index,elem ) {
				$$(this).children('colgroup').remove();
				$$(this).find('tr').removeAttr('class');
				$$(this).find('td').removeAttr('class');
				$$(this).find('p').removeAttr('class');
				if($$(this).find('thead').length == 0){
					if($$(this).find('tr').length > 1){
						$$(this).find('tr').eq(0).each(function( index,elem ) {
							$$(this).parent().before('<thead>\n<tr>' + $$(this).html() + '</tr>\n</thead>\n');
							$$(this).remove();
						});
					}
				}
				$$(this).before('<table>' + $$( this ).html() + '</table>');
				$$(this).remove();
			});	
			$$(formatTags).find('img[src*="base64"]').each(function(index,elem){
				$$(this).remove();
			});
		}

		/* Global Changes */
		
		var linkPath = '/html/' + currentGrade + '/' + currentUnit + '/' + currentWeek + '/';
		if(currentGrade=='gradek' || currentGrade=='grade1' || currentGrade=='grade2'){
			$('a.Grd1-clr').attr('href',linkPath + 'skills-at-a-glance.html');
			$('a.Grd1-clr').attr('data-extlink',linkPath + 'skills-at-a-glance.html');
			if(currentDay != null){
				$('link[href*="daylevel"]').attr('href','/css/pages/daylevel/' + currentDay.toString().replace('day','d') + '.css');
				if(language.toString().toLowerCase() == 'spanish'){
					$('h6.unitclr').find('strong').html(currentGrade.toString().replace('grade','Grado ').replace('k','K') + ' | ' + currentUnit.toString().replace('unit','Unidad ') + ' | ' + currentWeek.toString().replace('week','Semana ') + ' | ' + currentDay.toString().replace('day','Día '));
				}//spanish Language Updated the Header Content
				else{
					$('h6.unitclr').find('strong').html(currentGrade.toString().replace('grade','Grade ').replace('k','K') + ' | ' + currentUnit.toString().replace('unit','Unit ') + ' | ' + currentWeek.toString().replace('week','Week ') + ' | ' + currentDay.toString().replace('day','Day '));
				}//english Language Updated the Header Content
				$('div.nav-disc').find('a').each(function (index,elem){
					$(this).attr('href','/html/' + currentGrade + '/unit' + $(this).text() + '/unitopener.html');
					$(this).attr('data-extlink','/html/' + currentGrade + '/unit' + $(this).text() + '/unitopener.html');
					if('unit' + $(this).text() == currentUnit){
						$(this).attr('class','activebutton');
					}
				});
				$('section.top-bar-section').children('ul').children('li').children('a').eq(0).attr('src','/html/' + currentGrade + '/grade-resources/content-knowledge.html');
				$('section.top-bar-section').children('ul').children('li').children('a').eq(0).attr('data-extlink','/html/' + currentGrade + '/grade-resources/content-knowledge.html');
				$('section.top-bar-section').children('ul').children('li').children('a').eq(1).attr('src','/html/' + currentGrade + '/review-and-routines/day1.html');
				$('section.top-bar-section').children('ul').children('li').children('a').eq(1).attr('data-extlink','/html/' + currentGrade + '/review-and-routines/day1.html');
				if(language.toString().toLowerCase() == 'spanish'){
					$('section.top-bar-section').children('ul').children('li').children('a').eq(0).html('Recursos de Grado');
					$('section.top-bar-section').children('ul').children('li').children('a').eq(1).html('Repaso y Rutinas');
				}
				else{}
				$('div.logrades_d1').attr('class','logrades_d' + currentDay.toString().replace('day',''));
			}
			$('link[href*="grades-clrs"]').attr('href','/css/grades-clrs/' + currentGrade + '.css');
			if(language.toString().toLowerCase() == 'spanish'){
				var newContent = $.html().toString().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/Unit:/g,'Unidad:');
			}
			else{
				var newContent = $.html().toString().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"');
			}
		}
		else if(currentGrade=='grade3' || currentGrade=='grade4' || currentGrade=='grade5' || currentGrade=='grade6'){
			$('a.Grd1-clr').attr('href','/html/' + currentGrade + '/' + currentUnit + '/unitopener.html');
			$('a.Grd1-clr').attr('data-extlink','/html/' + currentGrade + '/' + currentUnit + '/unitopener.html');
			if(currentWeek != null){
				$('link[href*="daylevel"]').attr('href','/css/pages/daylevel/' + currentWeek.toString().replace('week','w') + '.css');
				if(language.toString().toLowerCase() == 'spanish'){
					$('h6.unitclr').find('strong').html(currentGrade.toString().replace('grade','Grado ').replace('k','K') + ' | ' + currentUnit.toString().replace('unit','Unidad ') + ' | ' + currentWeek.toString().replace('week','Semana ') + ' | ' + currentfileName.toString().replace('lesson','Lección ').replace('.html',''));
				} //Spanish Checking Over
				else{
					$('h6.unitclr').find('strong').html(currentGrade.toString().replace('grade','Grade ').replace('k','K') + ' | ' + currentUnit.toString().replace('unit','Unit ') + ' | ' + currentWeek.toString().replace('week','Week ') + ' | ' + currentfileName.toString().replace('lesson','Lesson ').replace('.html',''));
				} //English Checking Over
				$('div.nav-disc').find('a').each(function (index,elem){
					$(this).attr('href','/html/' + currentGrade + '/unit' + $(this).text() + '/unitopener.html');
					$(this).attr('data-extlink','/html/' + currentGrade + '/unit' + $(this).text() + '/unitopener.html');
					if('unit' + $(this).text() == currentUnit){
						$(this).attr('class','activebutton');
					}
				});
				$('section.top-bar-section').children('ul').children('li').children('a').eq(0).attr('src','/html/' + currentGrade + '/grade-resources/content-knowledge.html');
				$('section.top-bar-section').children('ul').children('li').children('a').eq(0).attr('data-extlink','/html/' + currentGrade + '/grade-resources/content-knowledge.html');
				$('section.top-bar-section').children('ul').children('li').children('a').eq(1).attr('src','/html/' + currentGrade + '/review-and-routines/day1.html');
				$('section.top-bar-section').children('ul').children('li').children('a').eq(1).attr('data-extlink','/html/' + currentGrade + '/review-and-routines/day1.html');
				if(language.toString().toLowerCase() == 'spanish'){
					$('section.top-bar-section').children('ul').children('li').children('a').eq(0).html('Recursos de Grado');
					$('section.top-bar-section').children('ul').children('li').children('a').eq(1).html('Repaso y Rutinas');
				} //Spanish Checking Over
				else{} //English Checking Over 
				$('div.logrades_d1').attr('class','higrades_w' + currentWeek.toString().replace('week',''));
			}
			$('link[href*="grades-clrs"]').attr('href','/css/grades-clrs/' + currentGrade + '.css');
			if(language.toString().toLowerCase() == 'spanish'){
				var newContent = $.html().replace('<div class="weekdivider','<a href="' + linkPath + 'mini-lesson.html" class="button radius small medium-12 left-align" data-type="internal" data-code="X24463" data-extLink="' + linkPath + 'mini-lesson.html" >Semana 1 Minileccione</a>\n' + '<a href="' + linkPath + 'suggested-pacing-guide.html" class="button radius small medium-12 left-align" data-type="internal" data-code="X24463" data-extLink="' + linkPath + 'suggested-pacing-guide.html" >Guía de Ritmo Sugerido</a>\n' + '<a href="' + linkPath + 'guide-to-text-complexity.html" class="button radius small medium-12 left-align" data-type="internal" data-extLink="' + linkPath + 'guide-to-text-complexity.html" >Guía de la Complejidad del Texto</a>\n' + '<a href="' + linkPath + 'formative-assesment.html" class="button radius small medium-12 left-align" data-type="internal" data-extLink="' + linkPath + 'formative-assesment.html" >Evaluación Formativa</a>\n<div class="weekdivider').replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/Unit:/g,'Unidad:');
			} //Spanish Checking Over
			else{
				var newContent = $.html().replace('<div class="weekdivider','<a href="' + linkPath + 'mini-lesson.html" class="button radius small medium-12 left-align" data-type="internal" data-code="X24463" data-extLink="' + linkPath + 'mini-lesson.html" >Week 1 Mini Lesson</a>\n' + '<a href="' + linkPath + 'suggested-pacing-guide.html" class="button radius small medium-12 left-align" data-type="internal" data-code="X24463" data-extLink="' + linkPath + 'suggested-pacing-guide.html" >Suggested Pacing Guide</a>\n' + '<a href="' + linkPath + 'guide-to-text-complexity.html" class="button radius small medium-12 left-align" data-type="internal" data-extLink="' + linkPath + 'guide-to-text-complexity.html" >Guide to Text Complexity</a>\n' + '<a href="' + linkPath + 'formative-assesment.html" class="button radius small medium-12 left-align" data-type="internal" data-extLink="' + linkPath + 'formative-assesment.html" >Formative Assesment Opportunities</a>\n<div class="weekdivider').replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"');
			}  //English Checking Over
		}

		$('div[id*="_idContainer"]').each(function(index,elem){
			$(this).before($(this).html());
			$(this).remove();
		});
		$('p').each(function (ind,ele){
			$$(this).children('br').before('&nbsp;');
			$(this).children('br').remove();
		});
		$('span').each(function (ind,ele){
			$$(this).children('br').before('&nbsp;');
			$(this).children('br').remove();
		});
		if(language.toString().toLowerCase() == 'spanish'){
			$('div.grades').find('a').each(function(index,elem){
				$(this).text($(this).text().toString().replace('Grade','Grado'));
			});
			$('div.grades').find('a').each(function(index,elem){
				$(this).text($(this).text().toString().replace('Grade','Grado'));
			});
			$('article.Lesson').find('h2').each(function(index,elem){
				if($(this).text().toString().toLowerCase().match('ver multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('participación productiva')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('productive engagement')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('view multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('demostrar tu conocimiento')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('show your knowledge')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('conversación colaborativa')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('collaborative conversation')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match(' apply ')){
					$(this).attr('class','assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Read to Apply the Strategy')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Apply Text Structure Knowledge')){
					$(this).addClass('assesment');
				}
			});
			$('article.At_a_glance').find('h3').each(function(index,elem){
				if($(this).text().toString().toLowerCase().match('ver multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('participación productiva')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('productive engagement')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('view multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('demostrar tu conocimiento')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('show your knowledge')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('conversación colaborativa')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('collaborative conversation')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match(' apply ')){
					$(this).attr('class','assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Read to Apply the Strategy')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Apply Text Structure Knowledge')){
					$(this).addClass('assesment');
				}
			});
			$('article.ELD').find('h3').each(function(index,elem){
				if($(this).text().toString().toLowerCase().match('ver multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match(' apply ')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('view multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('participación productiva')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('productive engagement')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('demostrar tu conocimiento')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('show your knowledge')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('conversación colaborativa')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('collaborative conversation')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('Read to Apply the Strategy')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Apply Text Structure Knowledge')){
					$(this).addClass('assesment');
				}
			});
		}
		else{
			$('article.Lesson').find('h2').each(function(index,elem){
				if($(this).text().toString().toLowerCase().match('ver multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('participación productiva')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('productive engagement')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('view multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('demostrar tu conocimiento')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('show your knowledge')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('conversación colaborativa')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('collaborative conversation')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match(' apply ')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Read to Apply the Strategy')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Apply Text Structure Knowledge')){
					$(this).addClass('assesment');
				}
			});
			$('article.At_a_glance').find('h3').each(function(index,elem){
				if($(this).text().toString().toLowerCase().match('ver multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('view multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match(' apply ')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('participación productiva')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('productive engagement')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('demostrar tu conocimiento')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('show your knowledge')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('escribir de forma independiente')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('write independently')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('conversación colaborativa')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('collaborative conversation')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('Read to Apply the Strategy')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Apply Text Structure Knowledge')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Organizar la escritura independiente')){
					$(this).removeClass('assesment');
				}
			});
			$('article.ELD').find('h3').each(function(index,elem){
				if($(this).text().toString().toLowerCase().match('ver multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match(' apply ')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('view multimedia')){
					$(this).addClass('Multimedia');
				}
				else if($(this).text().toString().toLowerCase().match('participación productiva')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('productive engagement')){
					$(this).addClass('productive_engagement');
				}
				else if($(this).text().toString().toLowerCase().match('demostrar tu conocimiento')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('show your knowledge')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('escribir de forma independiente')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('write independently')){
					$(this).removeClass('collaborative');
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('conversación colaborativa')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('collaborative conversation')){
					$(this).removeClass('collaborative');
					$(this).addClass('collaborative');
				}
				else if($(this).text().toString().toLowerCase().match('Read to Apply the Strategy')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Apply Text Structure Knowledge')){
					$(this).addClass('assesment');
				}
				else if($(this).text().toString().toLowerCase().match('Organizar la escritura independiente')){
					$(this).removeClass('assesment');
				}
			});
		}

		var finalOutputPath = rootpath.toString().replace('InDesign_Output','Final_Output');
		fs.writeFileSync(finalOutputPath + '\\' + currentfileName,newContent.toString().replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&amp\;quot\;/g,'"').replace(/\&quot\;/g,'"').replace(/data\-extlink/g,'data-extLink'));
	}
}