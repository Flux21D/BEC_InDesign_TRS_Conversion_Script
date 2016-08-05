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
        var Result = OutputFolderStructureCreation(myFolder);
        var outputFolder = Result[0];
        var finalOutputFolder = Result[2];
        var Grade = Result[1].toString().replace(/%20/g,' ');
        unitBkFileProcess(unitBookFiles,Grade,outputFolder,finalOutputFolder);
     }
     else{
        rootFolder(myFolders );    
        for(var i=0; i<GradeFolder.length; i++){
            var myFolder = new Folder(GradeFolder[i]);
            GetSubFoldersBook(myFolder);
            var Result = OutputFolderStructureCreation(myFolder);
            var outputFolder = Result[0];
            var finalOutputFolder = Result[2];
            var Grade = Result[1].toString().replace(/%20/g,' ');
            unitBkFileProcess(unitBookFiles,Grade,outputFolder,finalOutputFolder);
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

function OutputFolderStructureCreation(myFolder){
    if(myFolder.toString().match(GradeRegex) != null) {
        var Grade = myFolder.toString().match(GradeRegex);
        var RootFolder = new Folder(myFolder + '/Output');
        if(RootFolder.exists){}
        else{
            RootFolder.create();
        }
       var OutputFolder = new Folder(RootFolder + '/' + 'InDesign_Output');
        if(OutputFolder.exists){}
        else{
            OutputFolder.create();
        }
       var FinalOutputFolder = new Folder(RootFolder + '/' + 'Final_Output');
        if(FinalOutputFolder.exists){}
        else{
            FinalOutputFolder.create();
        }
       var FinalOutputFolder = new Folder(FinalOutputFolder + '/' + Grade);
        if(FinalOutputFolder.exists){}
        else{
            FinalOutputFolder.create();
        }
       var OutputFolder = new Folder(OutputFolder + '/' + Grade);
        if(OutputFolder.exists){}
        else{
            OutputFolder.create();
        }
    }
    else{
        alert('Folder Name should have "Grade K||Grade 1||Grade 2||Grade 3||Grade 4||Grade 5||Grade 6". Please rename the folder and rerun the same');
    }
    return [OutputFolder,Grade,FinalOutputFolder];
}


function unitBkFileProcess(books,Grade,outputFolder,finalOutputFolder){

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
                Relink_File(LinkFolder);
                //removeAnchoredObject();
                fontUpdate();
                if((doc.name.toString().toLowerCase().match(DayRegex) != null || doc.name.toString().toLowerCase().match(DayRegex1) != null || doc.name.toString().toLowerCase().match(DayRegex2) != null || doc.name.toString().toLowerCase().match(DayRegex3) != null || doc.name.toString().toLowerCase().match(DayRegex4) != null || doc.name.toString().toLowerCase().match(DayRegex5) != null) && (doc.name.toString().toLowerCase().match('d0') == null && doc.name.toString().toLowerCase().match('d 0') == null && doc.name.toString().toLowerCase().match('d_0') == null && doc.name.toString().toLowerCase().match('day0') == null && doc.name.toString().toLowerCase().match('day 0') == null && doc.name.toString().toLowerCase().match('day_0') == null)){
                    lowerLessonFileConversion(doc,outputFolder,finalOutputFolder);
                }
                else if((doc.name.toString().toLowerCase().match(LessonRegex) != null || doc.name.toString().toLowerCase().match(LessonRegex1) != null || doc.name.toString().toLowerCase().match(LessonRegex2) != null || doc.name.toString().toLowerCase().match(LessonRegex3) != null || doc.name.toString().toLowerCase().match(LessonRegex4) != null || doc.name.toString().toLowerCase().match(LessonRegex5) != null) && (doc.name.toString().toLowerCase().match('l0') == null && doc.name.toString().toLowerCase().match('l 0') == null && doc.name.toString().toLowerCase().match('l_0') == null && doc.name.toString().toLowerCase().match('lesson0') == null && doc.name.toString().toLowerCase().match('lesson 0') == null && doc.name.toString().toLowerCase().match('lesson_0') == null)){
                    upperLessonFileConversion(doc,outputFolder,finalOutputFolder);
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

function lowerLessonFileConversion(Doc,OutputFolder,finalOutputFolder){
    var pages = Doc.pages;
    var i=0;
    var LessonOutputFolder = "";
    var Unit = Doc.name.toString().toLowerCase().match(UnitRegex).toString().replace('u','unit');
    var Week = Doc.name.toString().toLowerCase().match(WeekRegex).toString().replace('w','week');
    var Day = Doc.name.toString().toLowerCase().match(DayRegex).toString().replace('d','day');
    Doc.htmlExportPreferences.imageExportOption = ImageExportOption.ORIGINAL_IMAGE;
    Doc.htmlExportPreferences.numberedListExportOption = NumberedListExportOption.AS_TEXT;
    OutputFolder = new Folder(OutputFolder + '/' + Unit);
    if(OutputFolder.exists){}
    else{
        OutputFolder.create();
    }

    OutputFolder = new Folder(OutputFolder + '/' + Week);
    if(OutputFolder.exists){}
    else{
        OutputFolder.create();
    }
    OutputFolder = new Folder(OutputFolder + '/' + Day);
    if(OutputFolder.exists){}
    else{
        OutputFolder.create();
    }

    finalOutputFolder = new Folder(finalOutputFolder + '/' + Unit);
    if(finalOutputFolder.exists){}
    else{
        finalOutputFolder.create();
    }

    finalOutputFolder = new Folder(finalOutputFolder + '/' + Week);
    if(finalOutputFolder.exists){}
    else{
        finalOutputFolder.create();
    }

    finalOutputFolder = new Folder(finalOutputFolder + '/' + Day);
    if(finalOutputFolder.exists){}
    else{
        finalOutputFolder.create();
    }
    for (var p=0; p<pages.length; p++) {
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "Lesson");
        if (followPageConnector1 != $.global.undefined) {
            i++;
            LessonOutputFolder = new Folder(OutputFolder + "/lesson" + i);
            if(LessonOutputFolder.exists){}
            else{
                LessonOutputFolder.create();
            }
            var myFile = new File (LessonOutputFolder + '/Lesson' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "student_objectives");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/student_objectives' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "MSRCT");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/MSRCT' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "MSCRT");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/MSRCT' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "ELD");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/ELD' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "aag");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/aag' + pages[p].name + '.html');
            
            app.select(followPageConnector1);
            app.copy();
            GeneratingAAGhtml(myFile);
            //followPageConnector1.select();
            //followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "standards");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/standards' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "observation_checklist");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/observation_checklist' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "additional_materials");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/additional_materials' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "Small_group_diff_instr");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/Small_group_diff_instr' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "Ways_to_scaffold");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/Ways_to_scaffold' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var seq = 0;
        for(var a=0; a<pages[p].allPageItems.length; a++) {
            var frames = pages[p].allPageItems[a];
            if(frames instanceof Group && frames.isValid) {
                for(var b=0; b<frames.allPageItems.length; b++) {
                    var GroupFrames = frames.allPageItems[b];
                    if(GroupFrames instanceof Image) {
                        if(GroupFrames.parent instanceof Group) {
                            GroupFrames.parent.select();
                            seq++;
                            var myFile = new File (LessonOutputFolder + '/thumbnailImages_' + seq + '_' + pages[p].name + '.html');
                            GroupFrames.exportFile(ExportFormat.HTML, myFile, false); 
                        }
                        else if(GroupFrames.parent.parent instanceof Group) {
                                GroupFrames.parent.parent.select();
                                seq++;
                                var myFile = new File (LessonOutputFolder + '/thumbnailImages_' + seq + '_' + pages[p].name + '.html');
                                GroupFrames.exportFile(ExportFormat.HTML, myFile, false); 
                        }
                    }
                }
            }
        }             

    }

}

function upperLessonFileConversion(Doc,OutputFolder,finalOutputFolder){
    var pages = Doc.pages;
    var i=0;
    var LessonOutputFolder = "";
Doc.htmlExportPreferences.imageExportOption = ImageExportOption.ORIGINAL_IMAGE;
Doc.htmlExportPreferences.numberedListExportOption = NumberedListExportOption.AS_TEXT;
    var Unit = Doc.name.toString().toLowerCase().match(UnitRegex).toString().replace('u','unit');
    var Week = Doc.name.toString().toLowerCase().match(WeekRegex).toString().replace('w','week');
    var Lesson = Doc.name.toString().toLowerCase().match(LessonRegex).toString().replace('l','lesson');
    
    OutputFolder = new Folder(OutputFolder + '/' + Unit);
    if(OutputFolder.exists){}
    else{
        OutputFolder.create();
    }

    OutputFolder = new Folder(OutputFolder + '/' + Week);
    if(OutputFolder.exists){}
    else{
        OutputFolder.create();
    }

    OutputFolder = new Folder(OutputFolder + '/' + 'lessons');
    if(OutputFolder.exists){}
    else{
        OutputFolder.create();
    }
    
    finalOutputFolder = new Folder(finalOutputFolder + '/' + Unit);
    if(finalOutputFolder.exists){}
    else{
        finalOutputFolder.create();
    }

    finalOutputFolder = new Folder(finalOutputFolder + '/' + Week);
    if(finalOutputFolder.exists){}
    else{
        finalOutputFolder.create();
    }

    finalOutputFolder = new Folder(finalOutputFolder + '/' + 'lessons');
    if(finalOutputFolder.exists){}
    else{
        finalOutputFolder.create();
    }

    LessonOutputFolder = new Folder(OutputFolder + '/' + Lesson);
    if(LessonOutputFolder.exists){}
    else{
        LessonOutputFolder.create();
    }
    
    for (var p=0; p<pages.length; p++) {
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "Lesson");
        if (followPageConnector1 != $.global.undefined) {
            var myFile = new File (LessonOutputFolder + '/Lesson' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "student_objectives");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/student_objectives' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "MSRCT");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/MSRCT' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "aag");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/aag' + pages[p].name + '.html');
            app.select(followPageConnector1);
            app.copy();
            GeneratingAAGhtml(myFile);
            //followPageConnector1.select();
            //followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "ELD");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/ELD' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "standards");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/standards' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "observation_checklist");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/observation_checklist' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "additional_materials");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/additional_materials' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "Small_group_diff_instr");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/Small_group_diff_instr' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
    
        var followPageConnector1 = getObjectByLabelUnq(pages[p], "Ways_to_scaffold");
        if(followPageConnector1 != $.global.undefined){
            var myFile = new File (LessonOutputFolder + '/Ways_to_scaffold' + pages[p].name + '.html');
            followPageConnector1.select();
            followPageConnector1.exportFile(ExportFormat.HTML, myFile, false); 
        }
        for(var a=0; a<pages[p].allPageItems.length; a++) {
            var frames = pages[p].allPageItems[a];
            var myFile = new File (LessonOutputFolder + '/thumbnailImages' + pages[p].name + '.html');
            if(frames instanceof Group && frames.isValid) {
                for(var b=0; b<frames.allPageItems.length; b++) {
                    var GroupFrames = frames.allPageItems[b];
                    if(GroupFrames instanceof Image) {
                        if(GroupFrames.parent instanceof Group) {
                            GroupFrames.parent.select();
                            GroupFrames.exportFile(ExportFormat.HTML, myFile, false); 
                        }
                        else if(GroupFrames.parent.parent instanceof Group) {
                                GroupFrames.parent.parent.select();
                                //app.select(GroupFrames.parent.parent.allPageItems);
                                GroupFrames.exportFile(ExportFormat.HTML, myFile, false); 
                        }
                    }
                }
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



function Relink_File(LinkFolder) {
    var AllLinks = app.activeDocument.links;
    for (var Li = 0; Li < AllLinks.length; Li++)
    {
        var ItemLink = new File(AllLinks[Li].filePath);
       
        var RelinkFile = new File(LinkFolder+ "/" + ItemLink.name);
       
        if (RelinkFile.exists)
        {
           AllLinks[Li].relink(RelinkFile);
        }
        else{}
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


function removeAnchoredObject() {
    var pages = app.activeDocument.pages;
    var searchContent="";
    for (var p=0; p<pages.length; p++) {

    var followPageConnector1 = getObjectByLabelUnq(pages[p], "aag-bb");
            if (followPageConnector1 == $.global.undefined) {}
            else {
                    //var myFile = new File (LessonOutputFolder + '/aag' + pages[p].name + '.html');
                    followPageConnector1.select();
                    for(var a=0; a<followPageConnector1.allPageItems.length; a++) {
                        if(followPageConnector1.allPageItems[a] instanceof TextFrame) {
                            try{
                                if(followPageConnector1.allPageItems[a] == undefined){}
                                else{
                                    for(var b=0; b<followPageConnector1.allPageItems[a].texts[0].paragraphs.length; b++) {
                                        searchContent = followPageConnector1.allPageItems[a].texts[0].paragraphs[b].contents;
                                        main(searchContent);
                                    }
                                }
                           }
                           catch(e){
                                    removeAnchoredObject();
                           }
                        }
                    }
            }
    }
}

function main(searchContent){
   var d, fs, i, f, p;
   d = app.activeDocument;
   
app.findGrepPreferences = NothingEnum.nothing;
app.changeGrepPreferences = NothingEnum.nothing;
app.findChangeGrepOptions.includeFootnotes = false;
app.findChangeGrepOptions.includeHiddenLayers = false;
app.findChangeGrepOptions.includeLockedLayersForFind = true;
app.findChangeGrepOptions.includeLockedStoriesForFind = true;
app.findChangeGrepOptions.includeMasterPages = false;
app.findGrepPreferences.findWhat = searchContent;

 fs=  app.activeDocument.findGrep();
    for (i = 0; i < fs.length; i++){
      f = fs[i];
      if ((p = f.parentTextFrames[0].parent) instanceof Character){
         f.parent.texts.everyItem().move(LocationOptions.BEFORE, p);
         p.contents = "";
      }
   }

}
function GeneratingAAGhtml(myFile)
{  
    
      
          var mydocment=app.documents.add();
            app.paste();
            
                     var pI=app.activeDocument.allPageItems;
   for(var PI=0;PI<pI.length;PI++)
            {
                if(pI[PI] instanceof TextFrame) 
                {
                   if(pI[PI].overflows==true)
                 {
                    
                 pI[PI].fit(FitOptions.FRAME_TO_CONTENT); 
                 
                  }
                    }
                }
        
               
            var myDocument=app.activeDocument;
             var TextFrameArray=[];
               var GroupObjArray=[];
               var pages = app.activeDocument.pages;
               
                var followPageConnector1 = getObjectByLabelUnq(pages[0], "aag-bb");
                 for(var tf=0;tf<followPageConnector1.textFrames.length;tf++)
                 {
                     followPageConnector1.textFrames[tf].label= tf+"_"+followPageConnector1.textFrames[tf].geometricBounds; 
                  
                     TextFrameArray.push(followPageConnector1.textFrames[tf].label);
                   
                    var myPlainTextObjectStyle = myDocument.objectStyles.add();  
                    myPlainTextObjectStyle.properties = {  
                         name : "aag-wb"+tf,  
                         enableFill : true,  
                         enableStroke : true,  
                         enableStrokeAndCornerOptions : false,  
                         enableTextFrameBaselineOptions : true,  
                         enableTextFrameGeneralOptions : true,  
                    }
              
                 }
                 
                 try
                 {
       
                 
   
          
          /* Starting of the  TextFrame Array */
                for(var TFL=0;TFL<TextFrameArray.length;TFL++)
                 {
        
                  var SplitArray=TextFrameArray[TFL].split("_")[1];
                  var followPageConnector1 = getObjectByLabelUnq(pages[0], TextFrameArray[TFL].toString());
               if (followPageConnector1 != $.global.undefined) {
                       followPageConnector1.appliedObjectStyle = myDocument.objectStyles.itemByName("aag-wb"+TFL);
                    if(followPageConnector1.parent instanceof Character)
                       {  
                              if(followPageConnector1 instanceof Image||followPageConnector1 instanceof Rectangle)
                                {
                                }else
                               {
                                 GroupObjArray.push(followPageConnector1);
                                  try
                                    {
                                    followPageConnector1.anchoredObjectSettings.anchoredPosition = AnchorPosition.anchored;  
                                    followPageConnector1.select();
                                    followPageConnector1.anchoredObjectSettings.releaseAnchoredObject(); 
                                    followPageConnector1.geometricBounds=SplitArray.split(",");
                                   }
                               catch(ert)
                                  {
                               
                                   }
                                }

                       }else
                        {
                            if(followPageConnector1 instanceof Image)
                            {
                                //followPageConnector1.
                                followPageConnector1.fit(FitOptions.CONTENT_TO_FRAME);
                                GroupObjArray.push(followPageConnector1);
                              
                             }

                       }
                }
              }
           /* End of  TextFrame Array */

           var followPageConnector1 = getObjectByLabelUnq(pages[0], "aag");
            if (followPageConnector1 != $.global.undefined) {
                followPageConnector1.ungroup();
            }
        // var myFile=new File(Folder.myDocuments+"/"+docName.toString().replace(".indd","")+".xhtml");
         
         app.select(NothingEnum.NOTHING);
         app.activeDocument.exportFile(ExportFormat.HTML, myFile, false); 
       //  $.writeln("Founded Files: "+myFile);
         app.activeDocument.close(SaveOptions.NO);
         
         }
     catch(ert)
     {
         
         $.writeln("Error:"+ert);
         }
 }
function fontUpdate(){
    var myFontStyles = null;
    var DocumentFonts = "";

    Array.prototype.unique = function (){
        var r = new Array();
        o:for(var i = 0, n = this.length; i < n; i++){
            for(var x = 0, y = r.length; x < y; x++){
                if(r[x]==this[i]) continue o;}
            r[r.length] = this[i];}
        return r;
    }


    Array.prototype.findIn = function(search){
        var r = Array();
        for (var i=0; i<this.length; i++)
            if (this[i].indexOf(search) != -1){
                r.push(this[i].substr(this[i].indexOf("\t") + 1, this[i].length));
            }
        return r;
    }


    var myFonts = app.activeDocument.fonts.everyItem();
    myFontsList = myFonts.fontFamily.unique();
    for(var i = 0; i < myFontsList.length; i++){
            var myFontStyles = myFonts.name.findIn(myFontsList[i]);
                for(var j = 0; j < myFontStyles.length; j++){
                    if(myFontStyles[j].toString().toLowerCase().match('medium condensed italic')){
                        app.findTextPreferences = NothingEnum.nothing;
                        app.changeTextPreferences = NothingEnum.nothing;
                        app.findTextPreferences.fontStyle = myFontStyles[j];
                        app.changeTextPreferences.fontStyle = 'BoldItalic';
                        app.activeDocument.changeText();
                    }
                    else if(myFontStyles[j].toString().toLowerCase().match('condensed italic')){
                        app.findTextPreferences = NothingEnum.nothing;
                        app.changeTextPreferences = NothingEnum.nothing;
                        app.findTextPreferences.fontStyle = myFontStyles[j];
                        app.changeTextPreferences.fontStyle = 'Italic';
                        app.activeDocument.changeText();
                    }
                    else if(myFontStyles[j].toString().toLowerCase().match('medium condensed')){
                        app.findTextPreferences = NothingEnum.nothing;
                        app.changeTextPreferences = NothingEnum.nothing;
                        app.findTextPreferences.fontStyle = myFontStyles[j];
                        app.changeTextPreferences.fontStyle = 'Bold';
                        app.activeDocument.changeText();
                    }
                }
    }

}