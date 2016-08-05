var GradeRegex = /Grade%20[K0-9]+/g;
var DayRegex = /d[1-9]+/g;
var WeekRegex = /w[1-9]+/g;
var UnitRegex = /u[1-9]+/g;
var UnitRegex1 = /unit[1-9]+/g;
var LessonRegex = /l[1-9]+/g;

var unitBookFiles=[];
var additionalResourcesBookFiles = [];
var RRInddFiles=[];
var FOLDInddFiles=[];
var tabsInddFiles=[];
var fcInddFiles=[];
var bcInddFiles=[];
var fmInddFiles=[];
var otherInddFiles=[];
var bookinddFiles = [];

var unitBookFileName=[];
var additionalResourcesBookFileName=[];
var RRInddFileName=[];
var FOLDInddFileName=[];
var tabsInddFileName=[];
var fcInddFileName=[];
var bcInddFileName=[];
var fmInddFileName=[];

var VolumeRoot = false;
var GradeRoot = false;
var LowerGrade = false;
var UpperGrade =- false;
var nofilesFound = false;
var nofilesDetails = '';
var additionalResourcesBookFileFound = false;
var unitBookFileFound = false;
var FOLDInddFilesFound = false;
var tabsInddFilesFound = false;
var fcInddFilesFound = false;
var bcInddFilesFound = false;
var fmInddFilesFound = false;
var RRInddFilesFound = false;


var assetReport = 'Document Name,Book File (Y/N),Book File Name (If Yes on Previous Column),Page Count,Missing Files/Links (Yes/No),Missing File/Link Description';
var errorReport = 'Document Name, Missing Frame Name,Missing Frame Description';
var myFolder = Folder.selectDialog( "Select a folder with InDesign files" );  

if ( myFolder != null ) {  
    var root = myFolder.toString().replace(myFolder.toString().substr(0,myFolder.toString().lastIndexOf('/')) + '/','');
    if(root.toString().toLowerCase().match('volume')!=null || root.toString().toLowerCase().match('vol')!=null){
        VolumeRoot = true;
    }
    else if(root.toString().toLowerCase().match('grade')!=null){
        GradeRoot = true;
    }
    else{
       alert('Please select either Grade/Volume folder');
       exit(0);
    }

    var Grade = myFolder.toString().match(GradeRegex);
    Grade = Grade.toString().replace(/\%20/g,' ');
    if(Grade.toString().toLowerCase().replace(/\s/g,'').match('gradek') || Grade.toString().toLowerCase().replace(/\s/g,'').match('grade1') || Grade.toString().toLowerCase().replace(/\s/g,'').match('grade2')){
        LowerGrade = true;
    }
    if(Grade.toString().toLowerCase().replace(/\s/g,'').match('grade3') || Grade.toString().toLowerCase().replace(/\s/g,'').match('grade4') || Grade.toString().toLowerCase().replace(/\s/g,'').match('grade5') || Grade.toString().toLowerCase().replace(/\s/g,'').match('grade6')){
        UpperGrade = true;
    }

    var labelCSVfile = new File(new Folder($.fileName).parent + '/libs/Frame_Label.csv');
    labelCSVfile.open('r');
    var csvFileContent = labelCSVfile.read();
    labelCSVfile.close();
    GetSubFoldersBook(myFolder);
    var outputFolder = OutputFolderStructureCreation(myFolder);
    assetAnalysis(csvFileContent,outputFolder);
    if(nofilesFound){
        assetReport = assetReport + '\n' + '"' + nofilesDetails + '"' + ',' + '' + ',' +'' + ',' + '' + ',' + 'Missing File' + ',' + '"' + nofilesDetails + ' are Missing ' + '"';
     }
}
else{
        exit(0);
}

var reportFolder = new Folder(myFolder + '/Report');
if(reportFolder.exists){}
else{
    reportFolder.create();
}
var assetReportFile = new File(reportFolder + '/BEC - TRS - Asset Analysis Report for ' + Grade + '.csv');
assetReportFile.open('w');
assetReportFile.writeln(assetReport);
assetReportFile.close();

alert("completed");

function assetAnalysis(csvFileContent,outputFolder) {
    if(GradeRoot){
        if(unitBookFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Unit Level Book Files';
        }
        else{
            if(unitBookFiles.length == 10){
                bookFileProcess(unitBookFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + unitBookFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'Yes' + ',' +  'Current Grade Folder has ' + unitBookFiles.length + ' Number of Unit Level Book Files';
            }
        } //Unit Book File Check Ends Here
        if(additionalResourcesBookFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Additional Resources Book Files';
        }
        else{
            if(additionalResourcesBookFiles.length == 5){
                bookFileProcess(additionalResourcesBookFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + additionalResourcesBookFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'Yes' + ',' +  'Current Grade Folder has ' + additionalResourcesBookFiles.length + ' Number of Additional Resources Book Files';               
            }
        } //Additional Resource Book File Check Ends Here
        if(FOLDInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Fold Document Files';
        }
        else{
            if(FOLDInddFiles.length == 10){
                docFileProcess(FOLDInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + FOLDInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Grade Folder has ' + FOLDInddFiles.length + ' Number of Fold Document Files';               
            }
        } //FOLD Document File Check Ends Here
        if(tabsInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Tabs Document Files';
        }
        else{
            if(tabsInddFiles.length == 5){
                docFileProcess(tabsInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + tabsInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Grade Folder has ' + tabsInddFiles.length + ' Number of Tabs Document Files';               
            }
        } //Tabs Document File Check Ends Here
        if(fcInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'FC Document Files';
        }
        else{
            if(fcInddFiles.length == 5){
                docFileProcess(fcInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + fcInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Grade Folder has ' + fcInddFiles.length + ' Number of FC Document Files';               
            }
        } //FC Document File Check Ends Here
        if(bcInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'BC Document Files';
        }
        else{
            if(bcInddFiles.length == 5){
                docFileProcess(bcInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + bcInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Grade Folder has ' + bcInddFiles.length + ' Number of BC Document Files';               
            }
        } //BC Document File Check Ends Here
        if(fmInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'FM Document Files';
        }
        else{
            if(fmInddFiles.length == 5){
                docFileProcess(fmInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + fmInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Grade Folder has ' + fmInddFiles.length + ' Number of FM Document Files';               
            }
        } //FM Document File Check Ends Here
        if(RRInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'RR Document Files';
        }
        else{
            if(RRInddFiles.length == 1){
                docFileProcess(RRInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + RRInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Grade Folder has ' + RRInddFiles.length + ' Number of RR Document Files';               
            }
        } //Review Routines Document File Check Ends Here
    } // Grade Root Check Ends Here
    else if(VolumeRoot){
        if(unitBookFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Unit Level Book Files';
        }
        else{
            if(unitBookFiles.length == 2){
                bookFileProcess(unitBookFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + unitBookFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'Yes' + ',' +  'Current Volume Folder has ' + unitBookFiles.length + ' Number of Unit Level Book Files';
            }
        } //Unit Book File Check Ends Here
        if(additionalResourcesBookFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Additional Resources Book Files';
        }
        else{
            if(additionalResourcesBookFiles.length == 1){
                bookFileProcess(additionalResourcesBookFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + additionalResourcesBookFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'Yes' + ',' +  'Current Volume Folder has ' + additionalResourcesBookFiles.length + ' Number of Additional Resources Book Files';
            }
        } // Additional Resource Book File Check Ends Here
        if(FOLDInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Fold Document Files';
        }
        else{
            if(FOLDInddFiles.length == 2){
                docFileProcess(FOLDInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + FOLDInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Volume Folder has ' + FOLDInddFiles.length + ' Number of Fold Document Files';               
            }
        } // FOLD File Check Ends Here
        if(tabsInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Tabs Document Files';
        }
        else{
            if(tabsInddFiles.length == 1){
                docFileProcess(tabsInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + tabsInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Volume Folder has ' + tabsInddFiles.length + ' Number of Tabs Document Files';               
            }
        } // Tabs File Check Ends Here
        if(fcInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'FC Document Files';
        }
        else{
            if(fcInddFiles.length == 1){
                docFileProcess(fcInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + fcInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Volume Folder has ' + fcInddFiles.length + ' Number of FC Document Files';               
            }
        } // FC File Check Ends Here
        if(bcInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'BC Document Files';
        }
        else{
            if(bcInddFiles.length == 1){
                docFileProcess(bcInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + bcInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Volume Folder has ' + bcInddFiles.length + ' Number of BC Document Files';               
            }
        } // BC File Check Ends Here
        if(fmInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'FM Document Files';
        }
        else{
            if(fmInddFiles.length == 1){
                docFileProcess(fmInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + fmInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Volume Folder has ' + fmInddFiles.length + ' Number of FM Document Files';               
            }
        } // FM File Check Ends Here
        if(RRInddFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'RR Document Files';
        }
        else{
            if(RRInddFiles.length == 1){
                docFileProcess(RRInddFiles,csvFileContent,outputFolder);
            }
            else{
                assetReport = assetReport + '\n' + '"' + RRInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Volume Folder has ' + RRInddFiles.length + ' Number of RR Document Files';               
            }
        } // RR File Check Ends Here
    } // Volume Root Check Ends Here
}

function docFileProcess(docs,csvFileContent,outputFolder) {
    for(var a=0; a<docs.length; a++) {
        var documentName = new File(docs[a].fullName);
        try{
                var oldInteractionPrefs = app.scriptPreferences.userInteractionLevel;
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.open(documentName);
                var LinkFolder = new Folder(Folder.decode(app.activeDocument.fullName.parent) + '/Links');
                LinkFolder = decodeURI(LinkFolder);
                var missingLink = Relink_File(LinkFolder);
                if(missingLink){
                    assetReport = assetReport + '\n' + app.activeDocument.name + ',' + 'No' + ',' + '' + ',' + app.activeDocument.pages.length + ',' + 'Missing Link' + ',' + '"' + missingLink + '"';
                }
                else {
                    var lines = csvFileContent.toString().split('\n');
                    for(var l=1; l<lines.length; l++){
                        if(app.activeDocument.name.toString().toLowerCase().match('fold') != null){
                            childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                            FoldHTMLCreation(app.activeDocument,'FoldFile',lines[l].toString(),childFolder);
                        }
                        else if(app.activeDocument.name.toString().toLowerCase().match('tabs') != null){
                            childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                            for(var i=0; i<childFolder.length; i++) {
                                TabHTMLCreation(app.activeDocument,'TabsFile',lines[l].toString(),childFolder[i]);
                            }
                        }
                        else if(app.activeDocument.name.toString().toLowerCase().match('fm') != null){
                            childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                            for(var i=0; i<childFolder.length; i++) {
                                FMHTMLCreation(app.activeDocument,'FMFile',lines[l].toString(),childFolder[i]);
                            }
                        }
                        else if(app.activeDocument.name.toString().toLowerCase().match('fc') != null){
                            childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                            for(var i=0; i<childFolder.length; i++) {
                                FCHTMLCreation(app.activeDocument,'FCFile',lines[l].toString(),childFolder[i]);
                            }
                        }
                        else if(app.activeDocument.name.toString().toLowerCase().match('bc') != null){
                            childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                            for(var i=0; i<childFolder.length; i++) {
                                BCHTMLCreation(app.activeDocument,'BCFile',lines[l].toString(),outputFolder,childFolder[i]);
                            }
                        }
                        else if(app.activeDocument.name.toString().toLowerCase().match('rr') != null){
                            childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                            for(var i=0; i<childFolder.length; i++) {
                                RRHTMLCreation(app.activeDocument,'RRFile',lines[l].toString(),outputFolder,childFolder[i]);
                            }
                        }
                    }
                    assetReport = assetReport + '\n' + app.activeDocument.name + ',' + 'No' + ',' + '' + ',' + app.activeDocument.pages.length + ',' + 'No Issue' + ',' + '';
                }
                app.activeDocument.close(SaveOptions.NO);
                app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
            }
            catch(e) {
                assetReport = assetReport + '\n' + docs[a].name + ',' + 'No' + ',' + '' + ',' + '' + ',' + 'Document Corrupted' + ',' + '"' + 'Document synced in the book either it is not present in the desired location or corrupted' + '"';
            }
    }
}

function bookFileProcess(books,csvFileContent,outputFolder) {
      for(var a=0; a<books.length; a++) {
        var oldInteractionPrefs = app.scriptPreferences.userInteractionLevel;
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
        app.open(books[a]);
        var book=app.activeBook;
        for(var b=0;b<book.bookContents.length;b++) {
            var  documentName = book.bookContents[b].fullName;
            bookinddFiles.push(documentName);
            try{
                var oldInteractionPrefs = app.scriptPreferences.userInteractionLevel;
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.open(documentName);
                var LinkFolder = new Folder(Folder.decode(app.activeDocument.fullName.parent) + '/Links');
                LinkFolder = decodeURI(LinkFolder);
                var missingLink = Relink_File(LinkFolder);
                if(missingLink){
                    assetReport = assetReport + '\n' + app.activeDocument.name + ',' + 'Yes' + ',' + book.name + ',' + app.activeDocument.pages.length + ',' + 'Missing Link' + ',' + '"' + missingLink + '"';
                }
                else {
                        var lines = csvFileContent.toString().split('\n');
                        for(var l=1; l<lines.length; l++){
                            if(app.activeDocument.name.toString().toLowerCase().match(LessonRegex) != null){
                                childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                                LessonHTMLCoreFrameCreation(app.activeDocument,'DayFile',lines[l].toString(),childFolder);
                            }
                            else if(app.activeDocument.name.toString().toLowerCase().match(DayRegex) != null){
                                childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                                DayHTMLCoreFrameCreation(app.activeDocument,'DayFile',lines[l].toString(),childFolder);
                            }
                            else if((app.activeDocument.name.toString().toLowerCase().match(LessonRegex) == null|| app.activeDocument.name.toString().toLowerCase().match(DayRegex) == null) && (app.activeDocument.name.toString().toLowerCase().match(WeekRegex) != null) &&  (app.activeDocument.name.toString().toLowerCase().match('res') != null)){
                                childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                                WeekHTMLCoreFrameCreation(app.activeDocument,'WeekFile',lines[l].toString(),childFolder);
                            }
                            else if(app.activeDocument.name.toString().toLowerCase().match('res') != null){
                                childFolder = prepareforOutputFolders(app.activeDocument,outputFolder);
                                for(var i=0; i<childFolder.length; i++){
                                    AddResourceHTMLCoreFrameCreation(app.activeDocument,'AddtionalResourcesFile',lines[l].toString(),childFolder[i]);
                                }
                            }
                        }
                    assetReport = assetReport + '\n' + app.activeDocument.name + ',' + 'Yes' + ',' + book.name + ',' + app.activeDocument.pages.length + ',' + 'No Issue' + ',' + '';
                }
                app.activeDocument.close(SaveOptions.NO);
                app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;
            }
            catch(e) {
                assetReport = assetReport + '\n' + book.bookContents[b].name + ',' + 'Yes' + ',' + book.name + ',' + '' + ',' + 'Document Corrupted' + ',' + '"' + 'Document synced in the book either it is not present in the desired location or corrupted' + '"';
            }
        }
        app.activeBook.close(SaveOptions.NO);
        app.scriptPreferences.userInteractionLevel = oldInteractionPrefs;

    }
}

function ContentConversion(doc,fileInfo,csvLine,outputFolder){
    var pages = doc.pages;
    for(var p=0; p<pages.length; p++){
        if(csvLine.toString().match(',')){
            if(csvLine.toString().split(',')[3].toString().match(fileInfo)){
                if(csvLine.toString().split(',')[2].toString().match('Core')){
                    var coreFrame = getObjectByLabelUnq(pages[p], csvLine.toString().split(',')[1].toString().replace(/"/g,''));
                    if(coreFrame != $.global.undefined){
                        var myFile = new File(myFolder + '/' + coreFrame.label.toString() + '_' + page[p].name + '.html');
                        coreFrame.select();
                        coreFrame.exportFile(ExportFormat.HTML, myFile, false); 
                        $.writeln(myFile);
                    }
                    else{}
                }
                if(csvLine.toString().split(',')[2].toString().match('Compulsory')){
                    var secFrame = getObjectByLabelUnq(pages[p], csvLine.toString().split(',')[1].toString().replace(/"/g,''));
                    if(secFrame != $.global.undefined){
                        var myFile = new File(outputFolder + '/' + secFrame.label.toString() + '_' + page[p].name + '.html');
                        secFrame.select();
                        secFrame.exportFile(ExportFormat.HTML, myFile, false); 
                    }
                    else{}
                }
                else if(csvLine.toString().split(',')[2].toString().match('Optional')){
                    var otherFrame = getObjectByLabelUnq(pages[p], csvLine.toString().split(',')[1].toString().replace(/"/g,''));
                    if(otherFrame != $.global.undefined){
                        var myFile = new File(outputFolder + '/' + otherFrame.label.toString() + '_' + page[p].name + '.html');
                        otherFrame.select();
                        otherFrame.exportFile(ExportFormat.HTML, myFile, false); 
                    }
                    else{}
                }
            }
        }
    }
    
}

/* HTML Creation */

function LessonHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    var pages = doc.pages;
    if(csvLine.toString().match(',')){
        if(csvLine.toString().split(',')[3].toString().match(fileInfo)){
            if(csvLine.toString().split(',')[2].toString().match('Core')){
                var coreFrame = getObjectByLabelUnq(pages[0], csvLine.toString().split(',')[1].toString().replace(/"/g,''));
                if (coreFrame != $.global.undefined) {
                    ContentConversion(doc,'DayFile',csvLine,outputFolder);
                } //Frame Found Check
                else{
                    errorReport = errorReport + '\n' + '"' + doc.name + '"' + ',' + '"' + csvLine.toString().split(',')[1].toString().replace(/"/g,'') + '"' + ',' + 'Primary Label Not Found';
                } //Frame Not Found Check
            } //CoreFile Check
        } //Day File Column Checking
    } //Comma checking
}

function DayHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

function WeekHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

function AddResourceHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

function BCHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

function FCHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

function FMHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

function TabHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

function FoldHTMLCoreFrameCreation(doc,fileInfo,csvLine,outputFolder){
    
}

/* FIle Names & Count Asset Analysis */

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
                    if(myFile.name.toString().toLowerCase().match(UnitRegex) != null || myFile.name.toString().toLowerCase().match('unit') != null ){
                        unitBookFiles.push(myFile);  
                        unitBookFileName.push(myFile.name);
                    }
                    else if(myFile.name.toString().toLowerCase().match('resource') != null || myFile.name.toString().toLowerCase().match('res') != null) {
                        additionalResourcesBookFiles.push(myFile);  
                        additionalResourcesBookFileName.push(myFile.name);
                    }
                }  
                else if(myFile instanceof File && myFile.name.toString().toLowerCase().match(/\.indd$/i) && myFile.name.match(/\._/gi) == null) {
                    if(myFile instanceof File && myFile.name.toString().toLowerCase().match('_rr_')) {
                        RRInddFiles.push(myFile);
                        RRInddFileName.push(myFile.name);
                    }
                    else if(myFile instanceof File && myFile.name.toString().toLowerCase().match('fold')) {
                        FOLDInddFiles.push(myFile);
                        FOLDInddFileName.push(myFile.name);
                    }
                    else if(myFile instanceof File && myFile.name.toString().toLowerCase().match('tabs')) {
                        tabsInddFiles.push(myFile);
                        tabsInddFileName.push(myFile.name);
                    }
                    else if(myFile instanceof File && myFile.name.toString().toLowerCase().match('fc')) {
                        fcInddFiles.push(myFile);
                        fcInddFileName.push(myFile.name);
                    }
                    else if(myFile instanceof File && myFile.name.toString().toLowerCase().match('_bc')) {
                        bcInddFiles.push(myFile);
                        bcInddFileName.push(myFile.name);
                    }
                    else if(myFile instanceof File && myFile.name.toString().toLowerCase().match('fm')) {
                        fmInddFiles.push(myFile);
                        fmInddFileName.push(myFile.name);
                    }
                    else {
                        otherInddFiles.push(myFile);
                    }
                }
                else{}
            }
     }  
}  

/* Other Sub Functions */

function getObjectByLabelUnq(page, label) {
    var allPageItems = page.allPageItems;
    while ((pageItem = allPageItems.pop()) != null) {
        if (pageItem.label == label) {
            return pageItem;
        }
    }
}

/* Function to Relink */
function Relink_File(LinkFolder) {
    var AllLinks = app.activeDocument.links;
    for (var Li = 0; Li < AllLinks.length; Li++)
    {
        var ItemLink = new File(AllLinks[Li].filePath);
       
        var RelinkFile = new File(LinkFolder+ "/" + ItemLink.name);
       
        if (RelinkFile.exists)
        {
           AllLinks[Li].relink(RelinkFile);
           missingLinks = "";
        }
        else
        {
            missingLinks = missingLinks + '\n' + RelinkFile.fullName;
        }
    }
    return  missingLinks;
}


function CopyCommonfiles(input,output) {
    var files = input.getFiles();
    for(var a=0; a<files.length; a++) {
        if(files[a].toString().match('.svn')!=null){}
        else if(files[a] instanceof Folder){
        }
        else if(files[a] instanceof File){
            files[a].copy(output + '/'+ files[a].name);
        }
    }  
}

function parseCSV(filePath,OutputFolder,currentFolder){ // reads a CSV, returns an array of contents.  
     var csvfil;  
     var result;  
     var fileContent;            
     csvfil=new File(filePath);  
     csvfil.open('r');  
     fileContent = csvfil.read();  
     csvfil.close();  
     var lines=fileContent.split('\n');
     for(var l=0; l<lines.length; l++) {
        pCode = lines[l].split('->')[0];
        titleName = lines[l].split('->')[1].toString().replace(/BA/g,'').replace(/TRS/g,'').replace(/\s\s/g,' ').replace(/\s\s/g,' ').replace(/ Gr/g,'Grade').replace(/ - National Pilot/g,'').replace(/ HTML Natl/g,'');
            if(currentFolder.replace(/\_/g,' ').toString() == (titleName)){
                 return pCode;
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
       var OutputFolder = new Folder(RootFolder + '/' + Grade);
        if(OutputFolder.exists){}
        else{
            OutputFolder.create();
        }
    }
    else{
        alert('Folder Name should have "Grade K||Grade 1||Grade 2||Grade 3||Grade 4||Grade 5||Grade 6". Please rename the folder and rerun the same');
    }
    return OutputFolder;
}



function prepareforOutputFolders(Doc,outputFolder){
    var DocName = Doc.name;
    var Grade = outputFolder.toString().replace(outputFolder.toString().substr(0,outputFolder.toString().lastIndexOf('/')) + '/','');
    Grade = Grade.toString().replace('%20',' ');
    var VolumeRegex = /v[1-9]+/g;
    var filePath = new File(new Folder($.fileName).parent + '/pCode.txt');

    var supportingFilesPath = new File($.fileName).parent + "/libs/Supporting_Files";
    var cssPath = new Folder(supportingFilesPath + '/css'); 
    var jsPath = new Folder(supportingFilesPath + '/js'); 
    var fontscss = new Folder(cssPath + '/fonts'); 
    var gradescss = new Folder(cssPath + '/grades-clrs'); 
    var pagescss = new Folder(cssPath + '/pages'); 
    var daylevelcss = new Folder(cssPath + '/pages/daylevel'); 
    var gradelevelcss = new Folder(cssPath + '/pages/gradelevel'); 
    var unitlevelcss = new Folder(cssPath + '/pages/unitlevel'); 
    var additionalresourcescss = new Folder(cssPath + '/pages/unitlevel/additional_resources'); 
    var weeklevelcss = new Folder(cssPath + '/pages/weeklevel'); 
    var imageslevelcss = new Folder(supportingFilesPath + '/images/logos'); 
    
    var grHTMLfiles = new Folder(supportingFilesPath + '/html/' + Grade.toString().toLowerCase().replace(' ','') + '/grade-resources');
    var grARHTMLfiles = new Folder(supportingFilesPath + '/html/' + Grade.toString().toLowerCase().replace(' ','') + '/grade-resources/additional-resources');
    var RRHTMLfiles = new Folder(supportingFilesPath + '/html/' + Grade.toString().toLowerCase().replace(' ','') + '/review-and-routines');
    var DayLessonHTMLfiles = new Folder(supportingFilesPath + '/html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/week1/day1');
    var LessonHTMLfiles = new Folder(supportingFilesPath + '/html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/week1/lessons');
    var WeekHTMLfiles = new Folder(supportingFilesPath + '/html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/week1');
    var UnitHTMLfiles = new Folder(supportingFilesPath + '/html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1');
    
    if(DocName.toString().toLowerCase().match(UnitRegex)!=null && DocName.toString().toLowerCase().match(WeekRegex)!=null) {
        var Unit = DocName.toString().toLowerCase().match(UnitRegex).toString().replace('u','unit');
        var Week = DocName.toString().toLowerCase().match(WeekRegex).toString().replace('w','week');
        outputFolder = new Folder(outputFolder + '/' + Unit);
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        outputFolder = new Folder(outputFolder + '/' + Grade.toString().replace('K','k') + '_' + Unit.toString().replace('unit','Unit '));
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        var currentFolder = Grade + ' ' + Unit.toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder,currentFolder);

        outputFolder = new Folder(outputFolder + '/' + xCode);
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        
        var cssFolder = new Folder(outputFolder + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }
        var gradeImagesFolder = new Folder(imagesFolder + '/' + Grade.toString().toLowerCase().replace(' ',''));
        if(gradeImagesFolder.exists){}
        else{
            gradeImagesFolder.create();
        }
        var RRImagesFolder = new Folder(gradeImagesFolder + '/review-and-routines');
        if(RRImagesFolder.exists){}
        else{
            RRImagesFolder.create();
        }
        var ReviewImagesFolder = new Folder(gradeImagesFolder + '/review');
        if(ReviewImagesFolder.exists){}
        else{
            ReviewImagesFolder.create();
        }
        var ReferencesImagesFolder = new Folder(gradeImagesFolder + '/references');
        if(ReferencesImagesFolder.exists){}
        else{
            ReferencesImagesFolder.create();
        }
        var IntroductionImagesFolder = new Folder(gradeImagesFolder + '/introduction');
        if(IntroductionImagesFolder.exists){}
        else{
            IntroductionImagesFolder.create();
        }
        var GRImagesFolder = new Folder(gradeImagesFolder + '/grade-resources');
        if(GRImagesFolder.exists){}
        else{
            GRImagesFolder.create();
        }
        var GRThemesImagesFolder = new Folder(GRImagesFolder + '/5_Themes_of_Literacy_Instruction');
        if(GRThemesImagesFolder.exists){}
        else{
            GRThemesImagesFolder.create();
        }
        var GRDayImagesFolder = new Folder(GRImagesFolder + '/180_Day_Suggested_Pacing');
        if(GRDayImagesFolder.exists){}
        else{
            GRDayImagesFolder.create();
        }
        var GRARImagesFolder = new Folder(GRImagesFolder + '/Additional_Resources');
        if(GRARImagesFolder.exists){}
        else{
            GRARImagesFolder.create();
        }
        var GRARCCImagesFolder = new Folder(GRARImagesFolder + '/Collaborative_Conversation');
        if(GRARCCImagesFolder.exists){}
        else{
            GRARCCImagesFolder.create();
        }
        var GRARMIRImagesFolder = new Folder(GRARImagesFolder + '/Managing_Independent_Reading');
        if(GRARMIRImagesFolder.exists){}
        else{
            GRARMIRImagesFolder.create();
        }
        var GRARPDFImagesFolder = new Folder(GRARImagesFolder + '/pdf');
        if(GRARPDFImagesFolder.exists){}
        else{
            GRARPDFImagesFolder.create();
        }
        var GRAuthorsImagesFolder = new Folder(GRImagesFolder + '/Authors');
        if(GRAuthorsImagesFolder.exists){}
        else{
            GRAuthorsImagesFolder.create();
        }
        var GRCKAImagesFolder = new Folder(GRImagesFolder + '/Content_Knowledge_Alignment');
        if(GRCKAImagesFolder.exists){}
        else{
            GRCKAImagesFolder.create();
        }
        var GRGCImagesFolder = new Folder(GRImagesFolder + '/Grade_Components');
        if(GRGCImagesFolder.exists){}
        else{
            GRGCImagesFolder.create();
        }
        var GRReviewImagesFolder = new Folder(GRImagesFolder + '/review');
        if(GRReviewImagesFolder.exists){}
        else{
            GRReviewImagesFolder.create();
        }
        var GRUTImagesFolder = new Folder(GRImagesFolder + '/UnitTopic');
        if(GRUTImagesFolder.exists){}
        else{
            GRUTImagesFolder.create();
        }
        var ARgradeImagesFolder = new Folder(gradeImagesFolder + '/Additional_Resources');
        if(ARgradeImagesFolder.exists){}
        else{
            ARgradeImagesFolder.create();
        }
        var ARCCImagesFolder = new Folder(ARgradeImagesFolder + '/Collaborative_Conversation');
        if(ARCCImagesFolder.exists){}
        else{
            ARCCImagesFolder.create();
        }
        var ARMIRImagesFolder = new Folder(ARgradeImagesFolder + '/Managing_Independent_Reading');
        if(ARMIRImagesFolder.exists){}
        else{
            ARMIRImagesFolder.create();
        }
        var ARPDFImagesFolder = new Folder(ARgradeImagesFolder + '/pdf');
        if(ARPDFImagesFolder.exists){}
        else{
            ARPDFImagesFolder.create();
        }
        var UnitImagesFolder = new Folder(gradeImagesFolder + '/' + Unit);
        if(UnitImagesFolder.exists){}
        else{
            UnitImagesFolder.create();
        }
        var UnitOpenerImagesFolder = new Folder(UnitImagesFolder + '/unit-opener');
        if(UnitOpenerImagesFolder.exists){}
        else{
            UnitOpenerImagesFolder.create();
        }
        var UnitAtAGlanceImagesFolder = new Folder(UnitImagesFolder + '/unit_at_a_glance');
        if(UnitAtAGlanceImagesFolder.exists){}
        else{
            UnitAtAGlanceImagesFolder.create();
        }
        var SGIPImagesFolder = new Folder(UnitImagesFolder + '/small_group_instructional_planner');
        if(SGIPImagesFolder.exists){}
        else{
            SGIPImagesFolder.create();
        }
        var SGIPImagesFolder = new Folder(UnitImagesFolder + '/small_group_instructional_planner');
        if(SGIPImagesFolder.exists){}
        else{
            SGIPImagesFolder.create();
        }
        var ARUnitImagesFolder = new Folder(UnitImagesFolder + '/additional_resources');
        if(ARUnitImagesFolder.exists){}
        else{
            ARUnitImagesFolder.create();
        }
        var WeekImagesFolder = new Folder(UnitImagesFolder + '/' + Week);
        if(WeekImagesFolder.exists){}
        else{
            WeekImagesFolder.create();
        }
        if(Grade.toString().toLowerCase().replace(' ','') == 'gardek' || Grade.toString().toLowerCase().replace(' ','') == 'garde1' || Grade.toString().toLowerCase().replace(' ','') == 'garde2'){
            var skatImagesFolder = new Folder(WeekImagesFolder + '/skills_at_a_glance');
            if(skatImagesFolder.exists){}
            else{
                skatImagesFolder.create();
            }
        }
        else if(Grade.toString().toLowerCase().replace(' ','') == 'garde3' || Grade.toString().toLowerCase().replace(' ','') == 'garde4' || Grade.toString().toLowerCase().replace(' ','') == 'garde5' || Grade.toString().toLowerCase().replace(' ','') == 'garde6'){
            var skatImagesFolder = new Folder(WeekImagesFolder + '/Mini-Lessons');
            if(skatImagesFolder.exists){}
            else{
                skatImagesFolder.create();
            }
        }
        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Unit.toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder = new Folder(outputFolder + '/html');
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
    
        outputFolder = new Folder(outputFolder + '/' + Grade.toString().toLowerCase().replace(' ',''));
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        outputFolder = new Folder(outputFolder + '/' + Unit);
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        CopyCommonfiles(UnitHTMLfiles,outputFolder);
        
        outputFolder = new Folder(outputFolder + '/' + Week);
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
         if(DocName.toString().toLowerCase().match(DayRegex)==null) {
            CopyCommonfiles(WeekHTMLfiles,outputFolder);
        }
    
        if(DocName.toString().toLowerCase().match(DayRegex)!=null) {
            var Day = DocName.toString().toLowerCase().match(DayRegex).toString().replace('d','day');
            outputFolder = new Folder(outputFolder + '/' + Day);
            if(outputFolder.exists){}
            else{
                outputFolder.create();
            }
            CopyCommonfiles(DayLessonHTMLfiles,outputFolder);
        }
        else if(DocName.toString().toLowerCase().match(LessonRegex)!=null) {
            outputFolder = new Folder(outputFolder + '/lessons');
            if(outputFolder.exists){}
            else{
                outputFolder.create();
            }
            CopyCommonfiles(LessonHTMLfiles,outputFolder);
        }
        return outputFolder;
        
    }

    else if(DocName.toString().toLowerCase().match('resource')!=null && Doc instanceof Book) {
        if(DocName.toString().toLowerCase().match('v1')!=null){
                var Units = ['unit1','unit2'];
        }
        else if(DocName.toString().toLowerCase().match('v2')!=null){
                var Units = ['unit3','unit4'];
        }
        else if(DocName.toString().toLowerCase().match('v3')!=null){
                var Units = ['unit5','unit6'];
        }
        else if(DocName.toString().toLowerCase().match('v4')!=null){
                var Units = ['unit7','unit8'];
        }
        else if(DocName.toString().toLowerCase().match('v5')!=null){
                var Units = ['unit9','unit10'];
        }
        var outputFolder1 = new Folder(outputFolder + '/' + Units[0]);
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().replace('K','k') + '_' + Units[0].toString().replace('unit','Unit '));
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        var currentFolder = Grade + ' ' + Units[0].toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder1,currentFolder);

        outputFolder1 = new Folder(outputFolder1 + '/' + xCode);
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        
        var cssFolder = new Folder(outputFolder1 + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder1 + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }

        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder1 + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder1 + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Units[0].toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder1 = new Folder(outputFolder1 + '/html');
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        
        outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().toLowerCase().replace(' ',''));
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        outputFolder1 = new Folder(outputFolder1 + '/grade-resources');
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        CopyCommonfiles(grHTMLfiles,outputFolder1);
        
        outputFolder1 = new Folder(outputFolder1 + '/additional-resources');
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        CopyCommonfiles(grARHTMLfiles,outputFolder1);
        
        var outputFolder2 = new Folder(outputFolder + '/' + Units[1]);
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        outputFolder2 = new Folder(outputFolder2 + '/' + Grade.toString().replace('K','k') + '_' + Units[1].toString().replace('unit','Unit '));
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        var currentFolder = Grade + ' ' + Units[1].toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder2,currentFolder);

        outputFolder2 = new Folder(outputFolder2 + '/' + xCode);
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        
        var cssFolder = new Folder(outputFolder2 + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder2 + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }

        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder2 + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder2 + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Units[1].toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder2 = new Folder(outputFolder2 + '/html');
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        
        outputFolder2 = new Folder(outputFolder2 + '/' + Grade.toString().toLowerCase().replace(' ',''));
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        outputFolder2 = new Folder(outputFolder2 + '/grade-resources');
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        CopyCommonfiles(grHTMLfiles,outputFolder2);
        outputFolder2 = new Folder(outputFolder2 + '/additional-resources');
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        CopyCommonfiles(grARHTMLfiles,outputFolder2);
        return [outputFolder1,outputFolder2];
    }
    else if(DocName.toString().toLowerCase().match(UnitRegex)!=null && DocName.toString().toLowerCase().match('fold')!=null) {
        var Unit = DocName.toString().toLowerCase().match(UnitRegex).toString().replace('u','unit');   
        outputFolder = new Folder(outputFolder + '/' + Unit);
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        outputFolder = new Folder(outputFolder + '/' + Grade.toString().replace('K','k') + '_' + Unit.toString().replace('unit','Unit '));
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        var currentFolder = Grade + ' ' + Unit.toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder,currentFolder);

        outputFolder = new Folder(outputFolder + '/' + xCode);
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        
        var cssFolder = new Folder(outputFolder + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }

        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Unit.toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder = new Folder(outputFolder + '/html');
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        
        outputFolder = new Folder(outputFolder + '/' + Grade.toString().toLowerCase().replace(' ',''));
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        outputFolder = new Folder(outputFolder + '/' + Unit);
        if(outputFolder.exists){}
        else{
            outputFolder.create();
        }
        return outputFolder;
    }

    else if(DocName.toString().toLowerCase().match('tabs')!=null) {
        if(DocName.toString().toLowerCase().match('v1')!=null){
                var Units = ['unit1','unit2'];
        }
        else if(DocName.toString().toLowerCase().match('v2')!=null){
                var Units = ['unit3','unit4'];
        }
        else if(DocName.toString().toLowerCase().match('v3')!=null){
                var Units = ['unit5','unit6'];
        }
        else if(DocName.toString().toLowerCase().match('v4')!=null){
                var Units = ['unit7','unit8'];
        }
        else if(DocName.toString().toLowerCase().match('v5')!=null){
                var Units = ['unit9','unit10'];
        }
         var outputFolder1 = new Folder(outputFolder + '/' + Units[0]);
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().replace('K','k') + '_' + Units[0].toString().replace('unit','Unit '));
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
        var currentFolder = Grade + ' ' + Units[0].toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder1,currentFolder);

        outputFolder1 = new Folder(outputFolder1 + '/' + xCode);
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        
        var cssFolder = new Folder(outputFolder1 + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder1 + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }

        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder1 + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder1 + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Units[0].toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder1 = new Folder(outputFolder1 + '/html');
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            
            outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().toLowerCase().replace(' ',''));
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            outputFolder1 = new Folder(outputFolder1 + '/' + Units[0]);
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            var outputFolder2 = new Folder(outputFolder + '/' + Units[1]);
            if(outputFolder2.exists){}
            else{
                outputFolder2.create();
            }
            outputFolder2 = new Folder(outputFolder2 + '/' + Grade.toString().replace('K','k') + '_' + Units[1].toString().replace('unit','Unit '));
            if(outputFolder2.exists){}
            else{
                outputFolder2.create();
            }
        var currentFolder = Grade + ' ' + Units[1].toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder2,currentFolder);

        outputFolder2 = new Folder(outputFolder2 + '/' + xCode);
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        
        var cssFolder = new Folder(outputFolder2 + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder2 + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }

        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder2 + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder2 + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Units[1].toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder2 = new Folder(outputFolder2 + '/html');
            if(outputFolder2.exists){}
            else{
                outputFolder2.create();
            }
        
            outputFolder2 = new Folder(outputFolder2 + '/' + Grade.toString().toLowerCase().replace(' ',''));
            if(outputFolder2.exists){}
            else{
                outputFolder2.create();
            }
            outputFolder2 = new Folder(outputFolder2 + '/' + Units[1]);
            if(outputFolder2.exists){}
            else{
                outputFolder2.create();
            }
            return [outputFolder1,outputFolder2];
    }
    else if(DocName.toString().toLowerCase().match('rr')!=null) {
        var Units = ['unit1','unit2','unit3','unit4','unit5','unit6','unit7','unit8','unit9','unit10'];
        var outputFolders = [];
        for(var u=0; u<Units.length; u++) {
         var outputFolder1 = new Folder(outputFolder + '/' + Units[u]);
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().replace('K','k') + '_' + Units[u].toString().replace('unit','Unit '));
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            var currentFolder = Grade + ' ' + Units[u].toString().replace('unit','U');
            var xCode = parseCSV(filePath,outputFolder1,currentFolder);

            outputFolder1 = new Folder(outputFolder1 + '/' + xCode);
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            
            var cssFolder = new Folder(outputFolder1 + '/css');
            if(cssFolder.exists){}
            else{
                cssFolder.create();
            }
            CopyCommonfiles(cssPath,cssFolder);
            
            var fontcssFolder = new Folder(cssFolder + '/fonts');
            if(fontcssFolder.exists){}
            else{
                fontcssFolder.create();
            }
            CopyCommonfiles(fontscss,fontcssFolder);
            
            var pagescssFolder = new Folder(cssFolder + '/pages');
            if(pagescssFolder.exists){}
            else{
                pagescssFolder.create();
            }
            
            var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
            if(daylevelcssFolder.exists){}
            else{
                daylevelcssFolder.create();
            }
            CopyCommonfiles(daylevelcss,daylevelcssFolder);
            
            var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
            if(gradelevelcssFolder.exists){}
            else{
                gradelevelcssFolder.create();
            }
            CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
            
            var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
            if(unitlevelcssFolder.exists){}
            else{
                unitlevelcssFolder.create();
            }
            CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
            
            var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
            if(weeklevelcssFolder.exists){}
            else{
                weeklevelcssFolder.create();
            }
            CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
            
            var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
            if(gradescssFolder.exists){}
            else{
                gradescssFolder.create();
            }
            CopyCommonfiles(gradescss,gradescssFolder);

            var imagesFolder = new Folder(outputFolder1 + '/images');
            if(imagesFolder.exists){}
            else{
                imagesFolder.create();
            }

            var logoImagesFolder = new Folder(imagesFolder + '/logos');
            if(logoImagesFolder.exists){}
            else{
                logoImagesFolder.create();
            }
            CopyCommonfiles(imageslevelcss,logoImagesFolder);
            
            var jsFolder = new Folder(outputFolder1 + '/js');
            if(jsFolder.exists){}
            else{
                jsFolder.create();
            }
            CopyCommonfiles(jsPath,jsFolder);
        
            var jsonFile = new File(outputFolder1 + '/toc.json');
            jsonFile.open('w');
            jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Units[u].toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
            jsonFile.close();
            
            outputFolder1 = new Folder(outputFolder1 + '/html');
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
        
            outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().toLowerCase().replace(' ',''));
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            outputFolder1 = new Folder(outputFolder1 + '/review-and-routines');
            if(outputFolder1.exists){}
            else{
                outputFolder1.create();
            }
            CopyCommonfiles(RRHTMLfiles,outputFolder1);
            outputFolders.push(outputFolder1);
        }
        return outputFolders;
    }

    else if(DocName.toString().toLowerCase().match('fc')!=null || DocName.toString().toLowerCase().match('bc')!=null || DocName.toString().toLowerCase().match('fm')!=null) {
        if(DocName.toString().toLowerCase().match('v1')!=null){
            var Units = ['unit1','unit2'];
        }
        else if(DocName.toString().toLowerCase().match('v2')!=null){
            var Units = ['unit3','unit4'];
        }
        else if(DocName.toString().toLowerCase().match('v3')!=null){
                var Units = ['unit5','unit6'];
        }
        else if(DocName.toString().toLowerCase().match('v4')!=null){
                var Units = ['unit7','unit8'];
        }
        else if(DocName.toString().toLowerCase().match('v5')!=null){
                var Units = ['unit9','unit10'];
        }
        var outputFolder1 = new Folder(outputFolder + '/' + Units[0]);
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().replace('K','k') + '_' + Units[0].toString().replace('unit','Unit '));
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        var currentFolder = Grade + ' ' + Units[0].toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder1,currentFolder);

        outputFolder1 = new Folder(outputFolder1 + '/' + xCode);
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        
        var cssFolder = new Folder(outputFolder1 + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder1 + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }

        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder1 + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder1 + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Units[0].toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder1 = new Folder(outputFolder1 + '/html');
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        
        outputFolder1 = new Folder(outputFolder1 + '/' + Grade.toString().toLowerCase().replace(' ',''));
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        outputFolder1 = new Folder(outputFolder1 + '/grade-resources');
        if(outputFolder1.exists){}
        else{
            outputFolder1.create();
        }
        var outputFolder2 = new Folder(outputFolder + '/' + Units[1]);
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        outputFolder2 = new Folder(outputFolder2 + '/' + Grade.toString().replace('K','k') + '_' + Units[1].toString().replace('unit','Unit '));
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        var currentFolder = Grade + ' ' + Units[1].toString().replace('unit','U');
        var xCode = parseCSV(filePath,outputFolder2,currentFolder);

        outputFolder2 = new Folder(outputFolder2 + '/' + xCode);
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        
        var cssFolder = new Folder(outputFolder2 + '/css');
        if(cssFolder.exists){}
        else{
            cssFolder.create();
        }
        CopyCommonfiles(cssPath,cssFolder);
        
        var fontcssFolder = new Folder(cssFolder + '/fonts');
        if(fontcssFolder.exists){}
        else{
            fontcssFolder.create();
        }
        CopyCommonfiles(fontscss,fontcssFolder);
        
        var pagescssFolder = new Folder(cssFolder + '/pages');
        if(pagescssFolder.exists){}
        else{
            pagescssFolder.create();
        }
        
        var daylevelcssFolder = new Folder(pagescssFolder + '/daylevel');
        if(daylevelcssFolder.exists){}
        else{
            daylevelcssFolder.create();
        }
        CopyCommonfiles(daylevelcss,daylevelcssFolder);
        
        var gradelevelcssFolder = new Folder(pagescssFolder + '/gradelevel');
        if(gradelevelcssFolder.exists){}
        else{
            gradelevelcssFolder.create();
        }
        CopyCommonfiles(gradelevelcss,gradelevelcssFolder);
        
        var unitlevelcssFolder = new Folder(pagescssFolder + '/unitlevel');
        if(unitlevelcssFolder.exists){}
        else{
            unitlevelcssFolder.create();
        }
        CopyCommonfiles(unitlevelcss,unitlevelcssFolder);
        
        var weeklevelcssFolder = new Folder(pagescssFolder + '/weeklevel');
        if(weeklevelcssFolder.exists){}
        else{
            weeklevelcssFolder.create();
        }
        CopyCommonfiles(weeklevelcss,weeklevelcssFolder);
        
        var gradescssFolder = new Folder(cssFolder + '/grades-clrs');
        if(gradescssFolder.exists){}
        else{
            gradescssFolder.create();
        }
        CopyCommonfiles(gradescss,gradescssFolder);

        var imagesFolder = new Folder(outputFolder2 + '/images');
        if(imagesFolder.exists){}
        else{
            imagesFolder.create();
        }

        var logoImagesFolder = new Folder(imagesFolder + '/logos');
        if(logoImagesFolder.exists){}
        else{
            logoImagesFolder.create();
        }
        CopyCommonfiles(imageslevelcss,logoImagesFolder);
        
        var jsFolder = new Folder(outputFolder2 + '/js');
        if(jsFolder.exists){}
        else{
            jsFolder.create();
        }
        CopyCommonfiles(jsPath,jsFolder);
    
        var jsonFile = new File(outputFolder2 + '/toc.json');
        jsonFile.open('w');
        jsonFile.writeln('{\n' + '	"launchPage":"html/' + Grade.toString().toLowerCase().replace(' ','') + '/unit1/unitopener.html",\n' + '	"title":"' + Grade.toString().replace('K','k') + ', ' + Units[1].toString().replace('unit','Unit ') + '",\n' + '	"vcode":"' + xCode.toString().replace(/ /g,'') + '"\n}');
        jsonFile.close();
        
        outputFolder2 = new Folder(outputFolder2 + '/html');
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }

        outputFolder2 = new Folder(outputFolder2 + '/' + Grade.toString().toLowerCase().replace(' ',''));
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        outputFolder2 = new Folder(outputFolder2 + '/grade-resources');
        if(outputFolder2.exists){}
        else{
            outputFolder2.create();
        }
        return [outputFolder1,outputFolder2];
    }
}