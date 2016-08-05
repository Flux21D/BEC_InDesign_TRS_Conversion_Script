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

    GetSubFoldersBook(myFolder);
    assetAnalysis();
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

function assetAnalysis() {
    if(GradeRoot){
        if(unitBookFiles.length == 0){
            nofilesFound = true;
            nofilesDetails = nofilesDetails + '\n' + 'Unit Level Book Files';
        }
        else{
            if(unitBookFiles.length == 10){
                bookFileProcess(unitBookFiles);
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
                bookFileProcess(additionalResourcesBookFiles);
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
                docFileProcess(FOLDInddFiles);
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
                docFileProcess(tabsInddFiles);
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
                docFileProcess(fcInddFiles);
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
                docFileProcess(bcInddFiles);
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
                docFileProcess(fmInddFiles);
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
                docFileProcess(RRInddFiles);
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
                bookFileProcess(unitBookFiles);
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
                bookFileProcess(additionalResourcesBookFiles);
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
                docFileProcess(FOLDInddFiles);
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
                docFileProcess(tabsInddFiles);
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
                docFileProcess(fcInddFiles);
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
                docFileProcess(bcInddFiles);
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
                docFileProcess(fmInddFiles);
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
                docFileProcess(RRInddFiles);
            }
            else{
                assetReport = assetReport + '\n' + '"' + RRInddFileName + '"' + ',' + '' + ',' + '' + ',' + '' + ',' + 'No' + ',' +  'Current Volume Folder has ' + RRInddFiles.length + ' Number of RR Document Files';               
            }
        } // RR File Check Ends Here
    } // Volume Root Check Ends Here
}

function docFileProcess(docs) {
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

function bookFileProcess(books) {
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

