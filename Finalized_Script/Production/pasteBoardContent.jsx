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

var pasteBoardReport = 'FileName';


var myFolders = Folder.selectDialog( "Select a folder with InDesign files" );  

if (myFolders != null ) {
     if(myFolders.toString().match(GradeRegex) != null) {
        var myFolder = myFolders;
        GetSubFoldersBook(myFolder);
        unitBkFileProcess(unitBookFiles);
        var reportFolder = new Folder(myFolder + '/Report');
        if(reportFolder.exists){}
        else{
            reportFolder.create();
        }
        var assetReportFile = new File(reportFolder + '/BEC-TRS_PasteBoardIssue.csv');
        assetReportFile.open('w');
        assetReportFile.writeln(pasteBoardReport);
        assetReportFile.close();
     }
     else{
        rootFolder(myFolders );    
        for(var i=0; i<GradeFolder.length; i++){
            var myFolder = new Folder(GradeFolder[i]);
            GetSubFoldersBook(myFolder);
            unitBkFileProcess(unitBookFiles);
            var reportFolder = new Folder(myFolder + '/Report');
            if(reportFolder.exists){}
            else{
                reportFolder.create();
            }
            var assetReportFile = new File(reportFolder + '/BEC - TRS - FrameList.csv');
            assetReportFile.open('w');
            assetReportFile.writeln(errorReport);
            assetReportFile.close();
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
            var documentFullName = book.bookContents[b].fullName;
            try{
                var oldInteractionPrefs = app.scriptPreferences.userInteractionLevel;
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.open(documentFullName);
                var doc = app.activeDocument;
                
                if((doc.name.toString().toLowerCase().match(DayRegex) != null || doc.name.toString().toLowerCase().match(DayRegex1) != null || doc.name.toString().toLowerCase().match(DayRegex2) != null || doc.name.toString().toLowerCase().match(DayRegex3) != null || doc.name.toString().toLowerCase().match(DayRegex4) != null || doc.name.toString().toLowerCase().match(DayRegex5) != null) && (doc.name.toString().toLowerCase().match('d0') == null && doc.name.toString().toLowerCase().match('d 0') == null && doc.name.toString().toLowerCase().match('d_0') == null && doc.name.toString().toLowerCase().match('day0') == null && doc.name.toString().toLowerCase().match('day 0') == null && doc.name.toString().toLowerCase().match('day_0') == null)){
                    lowerLessonFileConversion(doc);
                }
                else if((doc.name.toString().toLowerCase().match(LessonRegex) != null || doc.name.toString().toLowerCase().match(LessonRegex1) != null || doc.name.toString().toLowerCase().match(LessonRegex2) != null || doc.name.toString().toLowerCase().match(LessonRegex3) != null || doc.name.toString().toLowerCase().match(LessonRegex4) != null || doc.name.toString().toLowerCase().match(LessonRegex5) != null) && (doc.name.toString().toLowerCase().match('l0') == null && doc.name.toString().toLowerCase().match('l 0') == null && doc.name.toString().toLowerCase().match('l_0') == null && doc.name.toString().toLowerCase().match('lesson0') == null && doc.name.toString().toLowerCase().match('lesson 0') == null && doc.name.toString().toLowerCase().match('lesson_0') == null)){
                    upperLessonFileConversion(doc);
                }
                
                app.activeDocument.close(SaveOptions.NO);
                app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
            }
            catch(e) {}
        }
        app.activeBook.close(SaveOptions.NO);
        app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
    }

}


function upperLessonFileConversion(doc){
    

var pages = doc.pages;

var width = app.activeDocument.documentPreferences.pageWidth;
    var pageItems = app.activeDocument.allPageItems;
    for(var pI=0; pI<pageItems.length; pI++){
        pageItems[pI].label = 'Frame' + pI;
        if(pageItems[pI].geometricBounds[1] >(width*2)){
            if(pasteBoardReport.toString().match(doc.name) == null){
                pasteBoardReport = pasteBoardReport + '\n' + doc.name;
            }
        }
        if((pageItems[pI].geometricBounds[1] <0)){
            
        }
    }    
    
}
function lowerLessonFileConversion(doc){
    

var pages = doc.pages;

var width = app.activeDocument.documentPreferences.pageWidth;
    var pageItems = app.activeDocument.allPageItems;
    for(var pI=0; pI<pageItems.length; pI++){
        pageItems[pI].label = 'Frame' + pI;
        if(pageItems[pI].geometricBounds[1] >(width*2)){
            pasteBoardReport = pasteBoardReport + '\n' + doc.name;
        }
        if((pageItems[pI].geometricBounds[1] <0)){
            
        }
    }    
    
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


