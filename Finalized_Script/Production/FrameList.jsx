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


var errorReport = 'File Name,Page Number,Frame Sequence Number,Frame Label';


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
        var assetReportFile = new File(reportFolder + '/BEC - TRS - FrameList.csv');
        assetReportFile.open('w');
        assetReportFile.writeln(errorReport);
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
            var  documentFullName = book.bookContents[b].fullName;
            try{
                var oldInteractionPrefs = app.scriptPreferences.userInteractionLevel;
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.open(documentFullName);
                var doc = app.activeDocument;
                lowerLessonFileConversion(doc);
                app.activeDocument.close(SaveOptions.NO);
                app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
            }
            catch(e) {}
        }
        app.activeBook.close(SaveOptions.NO);
        app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
    }

}

function lowerLessonFileConversion(Doc){
    var pages = Doc.pages;
    
    for (var p=0; p<pages.length; p++) {
        for(var pI = 0; pI < pages[p].allPageItems.length; pI++){
            if(pages[p].allPageItems[pI].parent instanceof Spread || pages[p].allPageItems[pI].parent instanceof Page){
                errorReport = errorReport + '\n' + Doc.name + ',' + pages[p].name + ',' + pI + ',' + pages[p].allPageItems[pI].label;
            }
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


