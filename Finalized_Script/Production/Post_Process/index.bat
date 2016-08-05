node cssAnalysis.js -i %1
node LessonWiseHTMLPreprocess.js -i %1
node LessonWiseHTML.js -i %1 -l %2
node lessonContentUpdate.js -i %1
node xcode_update.js -i %1 -x %3
node ColorUpdate.js -i %4 -c %5
node footer_bold.js -i %4
node ways_Scaffold_Table -i %4
node xCode_Report -i %4
rem BEC-File-Copying.exe %4 %6
rem Splitting_to_weeks.exe %6
rem node week_files.js %6
rem BEC-Global.exe %