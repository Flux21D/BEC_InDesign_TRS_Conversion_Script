#target 'indesign'
var GradeRegex = /Grade%20[K0-9]+/g;
var GradeRegex1 = /grade[k0-9]+/g;
var GradeRegex2 = /grade [k0-9]+/g;
var GradeRegex3 = /grade_[k0-9]+/g;
var GradeRegex4 = /gr[k0-9]+/g;
var GradeRegex5 = /gr [k0-9]+/g;
var GradeRegex6 = /gr_[k0-9]+/g;
var GradeRegex7 = /g[k0-9]+/g;
var GradeRegex8 = /g [k0-9]+/g;
var GradeRegex9 = /g_[k0-9]+/g;

var UnitRegex = /u[0-9]+/g;
var UnitRegex1 = /u [0-9]+/g;
var UnitRegex2 = /u_[0-9]+/g;
var UnitRegex3 = /unit[0-9]+/g;
var UnitRegex4 = /unit [0-9]+/g;
var UnitRegex5 = /unit_[0-9]+/g;

var WeekRegex = /w[0-9]+/g;
var WeekRegex1 = /w [0-9]+/g;
var WeekRegex2 = /w_[0-9]+/g;
var WeekRegex3 = /wk[0-9]+/g;
var WeekRegex4 = /wk [0-9]+/g;
var WeekRegex5 = /wk_[0-9]+/g;
var WeekRegex6 = /week[0-9]+/g;
var WeekRegex7 = /week [0-9]+/g;
var WeekRegex8 = /week_[0-9]+/g;

var DayRegex = /d[0-9]+/g;
var DayRegex1 = /d [0-9]+/g;
var DayRegex2 = /d_[0-9]+/g;
var DayRegex3 = /day[0-9]+/g;
var DayRegex4 = /day [0-9]+/g;
var DayRegex5 = /day_[0-9]+/g;

var LessonRegex = /l[0-9]+/g;
var LessonRegex1 = /l [0-9]+/g;
var LessonRegex2 = /l_[0-9]+/g;
var LessonRegex3 = /lesson[0-9]+/g;
var LessonRegex4 = /lesson [0-9]+/g;
var LessonRegex5 = /lesson_[0-9]+/g;

var unitBookFiles = [];
var GradeFolder = [];

var myFolders = Folder.selectDialog( "Select a folder with InDesign files" );  

if (myFolders != null ) {
     if(myFolders.toString().match(GradeRegex) != null) {
        var myFolder = myFolders;
        GetSubFoldersBook(myFolder);
        unitBkFileProcess(unitBookFiles);
     }
     else{
        rootFolder(myFolders );    
        for(var i=0; i<GradeFolder.length; i++){
            var myFolder = new Folder(GradeFolder[i]);
            GetSubFoldersBook(myFolder);
            unitBkFileProcess(unitBookFiles);
        }
     }
}

else{
        exit(0);
}


alert("completed");

function rootFolder(theFolder) {
var myFileList = theFolder.getFiles();     
    for (var i = 0; i < myFileList.length; i++) {  
        var myFile = myFileList[i];  
        if(myFile.toString().match('__MACOSX')!=null){}
        else{
                GradeFolder.push(myFile);
            }
    }
}

function unitBkFileProcess(books){

    for(var bk=0; bk<books.length; bk++){
        var oldInteractionPrefs = app.scriptPreferences.userInteractionLevel;
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        app.open(books[bk]);
        var book=app.activeBook;
        for(var b=0;b<book.bookContents.length;b++) {
            var  documentFullName = book.bookContents[b].fullName;
            try{
                var oldInteractionPrefs = app.scriptPreferences.userInteractionLevel;
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.open(documentFullName);
                var doc = app.activeDocument;
                 var LinkFolder = new Folder(Folder.decode(app.activeDocument.fullName.parent) + '/Links');
                LinkFolder = decodeURI(LinkFolder);
                if((doc.name.toString().toLowerCase().match(DayRegex) != null || doc.name.toString().toLowerCase().match(DayRegex1) != null || doc.name.toString().toLowerCase().match(DayRegex2) != null || doc.name.toString().toLowerCase().match(DayRegex3) != null || doc.name.toString().toLowerCase().match(DayRegex4) != null || doc.name.toString().toLowerCase().match(DayRegex5) != null) && (doc.name.toString().toLowerCase().match('d0') == null && doc.name.toString().toLowerCase().match('d 0') == null && doc.name.toString().toLowerCase().match('d_0') == null && doc.name.toString().toLowerCase().match('day0') == null && doc.name.toString().toLowerCase().match('day 0') == null && doc.name.toString().toLowerCase().match('day_0') == null)){
                    lowerLessonFileConversion(doc,LinkFolder);
                }
                else if((doc.name.toString().toLowerCase().match(LessonRegex) != null || doc.name.toString().toLowerCase().match(LessonRegex1) != null || doc.name.toString().toLowerCase().match(LessonRegex2) != null || doc.name.toString().toLowerCase().match(LessonRegex3) != null || doc.name.toString().toLowerCase().match(LessonRegex4) != null || doc.name.toString().toLowerCase().match(LessonRegex5) != null) && (doc.name.toString().toLowerCase().match('l0') == null && doc.name.toString().toLowerCase().match('l 0') == null && doc.name.toString().toLowerCase().match('l_0') == null && doc.name.toString().toLowerCase().match('lesson0') == null && doc.name.toString().toLowerCase().match('lesson 0') == null && doc.name.toString().toLowerCase().match('lesson_0') == null)){
                    upperLessonFileConversion(doc,LinkFolder);
                }
                
               // lowerLessonFileConversion(doc);
                app.activeDocument.close(SaveOptions.NO);
                app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
            }
            catch(e) {}
        }
        app.activeBook.close(SaveOptions.NO);
        app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
    }

}
function upperLessonFileConversion(Doc,LinkFolder)
{

    var pages = Doc.pages;
    
  /*page Loop Start*/
  for (var p=0; p<pages.length; p++) {
 app.jpegExportPreferences.exportResolution=150;
            app.jpegExportPreferences.jpegColorSpace=JpegColorSpaceEnum.CMYK;
            app.jpegExportPreferences.jpegQuality=JPEGOptionsQuality.MAXIMUM;
            app.jpegExportPreferences.jpegRenderingStyle=JPEGOptionsFormat.PROGRESSIVE_ENCODING;
            app.jpegExportPreferences.jpegExportRange=ExportRangeOrAllPages.EXPORT_RANGE;
            app.jpegExportPreferences.useDocumentBleeds=false;
        var seq = 0;
        for(var a=0; a<pages[p].allPageItems.length; a++) {
            var frames = pages[p].allPageItems[a];
            if(frames instanceof Group && frames.isValid) {
                for(var b=0; b<frames.allPageItems.length; b++) {
                    var GroupFrames = frames.allPageItems[b];
                    if(GroupFrames instanceof Image) {
                         GroupFrames.parent.select();
                         var imageName = GroupFrames.itemLink.name;
                         var imageFileName = new File(LinkFolder + '/' +imageName);
                         if(imageFileName.exists){
                             imageFileName.remove();
                         }
                        GroupFrames.parent.exportFile(ExportFormat.JPG, imageFileName, false); 
                         //GroupFrames.exportFile(ExportFormat.HTML, myFile, false); 
                        if(GroupFrames.parent instanceof Group) {
                           //GroupFrames.parent.select();
                            //seq++;
                            //var myFile = new File (LessonOutputFolder + '/thumbnailImages_' + seq + '_' + pages[p].name + '.html');
                            //GroupFrames.exportFile(ExportFormat.HTML, myFile, false); 
                        }
                        else if(GroupFrames.parent.parent instanceof Group) {
                              //  GroupFrames.parent.parent.select();
                                //seq++;
                                //var myFile = new File (LessonOutputFolder + '/thumbnailImages_' + seq + '_' + pages[p].name + '.html');
                                //GroupFrames.exportFile(ExportFormat.HTML, myFile, false); 
                        }
                    }
                }
            }
        }             

 
 
    }
}
function lowerLessonFileConversion(Doc){
    var pages = Doc.pages;
    var LessonCount = [];
    var aagCount = [];
    var student_objectivescount=[];
    var standardscount=[];
    var MSRCTcount=[];
    var MSCRTcount=[];
    var ELDcount=[];
    var observation_checklist=[];
    var additional_materials=[];
    var Small_group_diff_instr=[];
    var Ways_to_scaffold=[];
    var LessonPageArray=[];
    var LessonNumber = 0;
    var EmptyTextFrameArray=[];
    var EmptyFramePageArray=[];
    
      /*page Loop Start*/
    for (var p=0; p<pages.length; p++) {
        
  
           var followPageConnector1 = getObjectByLabelUnq(pages[p], "Lesson");
        if (followPageConnector1 != $.global.undefined) {
            LessonNumber++;
            LessonPageArray.push(pages[p].name+",");
            LessonCount.push(LessonNumber);
        }
    

/*AAG&AAG-bb Frame Report*/
    try
{
var followPageConnector1 = getObjectByLabelUnq(pages[p], "aag");
        if (followPageConnector1 != $.global.undefined) {
            
             if(followPageConnector1 instanceof Group)
             {
                  var aag_bbcheck=false;
                  //var followPageConnector1= app.selection[0];
                 for(var tf=0;tf<followPageConnector1.textFrames.length;tf++)
                   {
                        if(followPageConnector1.textFrames[tf].label.toString()=="aag-bb")
                          {
                              aag_bbcheck=true;
                          }

                   }
                if(aag_bbcheck==true)
                 {
                          // aag_bbFrameReport = aag_bbFrameReport + '\n' + Doc.name + ',' + '"' + pages[p].name + '"';

                   }else
                  {
                           aag_bbFrameReport = aag_bbFrameReport + '\n' + Doc.name + ',' + '"' + pages[p].name + '"';
                  }
                 
              }else
            {
                      aag_bbFrameReport = aag_bbFrameReport + '\n' + Doc.name + ',' + '"' + pages[p].name + '"';
             }
               
            // aagCount.push(pages[p].name+",");
        }
    }
catch(ert)
{
    $.writeln(ert);
}
/*AAG&AAG-bb Frame Report End*/

        /*PageItems Array Start*/
    for(var PI=0;PI<pages[p].allPageItems.length;PI++)
    {
        if(pages[p].allPageItems[PI].label!=$.global.undefined)
        {
            
            
        if( pages[p].allPageItems[PI] instanceof TextFrame)
              {
                 if(pages[p].allPageItems[PI].label.toString().length>0)
                 {
                    
                   //  $.writeln('\n' +Doc.name + ',' + '"' +pages[p].name+ '"'+ ',' + '"' +pages[p].allPageItems[PI].label+'"'+',' + '"' +pages[p].allPageItems[PI].contents+ '"');
                  //   AllLabelFrameReport =AllLabelFrameReport + '\n' +Doc.name + ',' + '"' +pages[p].name+ '"'+ ',' + '"' +pages[p].allPageItems[PI].label+'"'+',' + '"' +pages[p].allPageItems[PI].paragraphs[0].contents+ '"';
                      try
                     {
                     AllLabelFrameReport =AllLabelFrameReport + '\n' +Doc.name + ',' + '"' +pages[p].name+ '"'+ ',' + '"' +pages[p].allPageItems[PI].label+'"'+',' + '"' +"content Not Avail"+ '"';
                     }
                    catch(e)
                     {
                     AllLabelFrameReport =AllLabelFrameReport + '\n' +Doc.name + ',' + '"' +pages[p].name+ '"'+ ',' + '"' +pages[p].allPageItems[PI].label+'"'+',' + '"' +"content Not Avail"+ '"';

                     }
 
                  }else
                 {
                     EmptyTextFrameArray.push(pages[p].allPageItems[PI]);
                     EmptyFramePageArray.push(pages[p].name+",");
                  
                  }

              }
       
        }else
       {
             EmptyTextFrameArray.push(pages[p].allPageItems[PI]);
             EmptyFramePageArray.push(pages[p].name+",");
           
        }
        
     }
    /*PageItems End*/
    
    }
  /*page Loop End*/

/*----EmptyFrameReport------*/

if(EmptyTextFrameArray.length>0)
{  
    
     Array.prototype.unique = function (){  
    var r = new Array();  
    o:for(var i = 0, n = this.length; i < n; i++){  
        for(var x = 0, y = r.length; x < y; x++){  
            if(r[x]==this[i]) continue o;}  
        r[r.length] = this[i];}  
    return r;  
}

var modifiedArray=EmptyFramePageArray.unique();

    EmptyFrameReport =EmptyFrameReport + '\n' +Doc.name + ',' + '"' + EmptyTextFrameArray.length+ '"'+ ',' + '"' + modifiedArray+'"';
    }else
{
    }


/*----EmptyFrameReport-----*/

/*----Lesson Frame Count Report--------*/
    
//~          app.findGrepPreferences = NothingEnum.nothing;
//~          app.changeGrepPreferences = NothingEnum.nothing;
//~         app.findGrepPreferences = null  
//~         app.findGrepPreferences.appliedParagraphStyle = "Lesson_A-hd"  
//~         var Founds = app.activeDocument.findGrep() ;
//~         
//~          for(var Fi=0;Fi<Founds.length;Fi++)
//~         {
//~             
//~             $.writeln(Founds[Fi].parentTextFrames[0].name)
//~             
//~          }  
     
     
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences = null  
        app.findGrepPreferences.appliedParagraphStyle = "Lesson_A-hd"  
        var Founds = app.activeDocument.findGrep() ;
        for(var Fi=0;Fi<Founds.length;Fi++)
         { 
                if(Founds[Fi].parentTextFrames[0].label == 'Lesson' || Founds[Fi].parentTextFrames[0].label == 'Small_group_diff_instr'){}
                else{
                     LessonStyleIssueReport =LessonStyleIssueReport + '\n' +Doc.name + ',' + '"' +Founds[Fi].parentTextFrames[0].parentPage.name+ '"' + ',' + '"' +Founds[Fi].parentTextFrames[0].label+ '"' + ',' + Founds[Fi].length;
                }
            
            LessonStyleReport =LessonStyleReport + '\n' +Doc.name + ',' + '"' +Founds[Fi].parentTextFrames[0].parentPage.name+ '"' + ',' + '"' +Founds[Fi].parentTextFrames[0].label+ '"';
            
         } 
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;

        LessonFrameReport =LessonFrameReport + '\n' +Doc.name + ',' + '"' + LessonCount.length + '"' + ',' + '"' + Founds.length + '"'+ ',' + '"' + LessonPageArray+ '"' ;
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;

/*----Lesson Frame Count Report--------*/


    
app.activeDocument.close(SaveOptions.NO);
}

function GetSubFoldersBook(theFolder) {  
     var myFileList = theFolder.getFiles();  
     for (var i = 0; i < myFileList.length; i++) {  
          var myFile = myFileList[i];  
           
            if(myFile.toString().match('__MACOSX')!=null){}
            else{
                if (myFile instanceof Folder){  
                   GetSubFoldersBook(myFile);  
                }  
                else if (myFile instanceof File && myFile.name.match(/\.indb$/i) && myFile.name.match(/\._/gi) == null) {  
                    if(myFile.name.toString().toLowerCase().match(UnitRegex) != null || myFile.name.toString().toLowerCase().match(UnitRegex1) != null || myFile.name.toString().toLowerCase().match(UnitRegex2) != null || myFile.name.toString().toLowerCase().match(UnitRegex3) != null || myFile.name.toString().toLowerCase().match(UnitRegex4) != null || myFile.name.toString().toLowerCase().match(UnitRegex5) != null){
                        unitBookFiles.push(myFile);  
                    }
                }  
                else{}
            }
     }  
}  



function getObjectByLabelUnq(page, label) {
    var allPageItems = page.allPageItems;
    while ((pageItem = allPageItems.pop()) != null) {
        if (pageItem.label == label) {
            return pageItem;
        }
    }
}


