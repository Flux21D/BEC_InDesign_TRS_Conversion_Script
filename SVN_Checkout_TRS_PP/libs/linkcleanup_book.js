fs = require('fs'); //FileSystem
var argv = require('optimist').argv; //Arguments
var writetofile = require('./writetofile'); //file writer
var readfile = require('./readfile'); //file writer
var cheerio = require('cheerio');
//var cssParser = require('css-parse');
var underscore = require('./underscore.js'); //file writer
var mkdirp = require('mkdirp'); //Creating Directory

module.exports = function(input, rootFolder) {
    var content = readfile(input);
    var $ = cheerio.load(content);
    var writableContent = "";
    var root = input.substr(0, input.lastIndexOf('\\'));

    // Regex to find the values in the root Folder 
    var GradeRegex = /\\grade [a-z0-9]\\/g;
    var UnitRegex = /\\unit[0-9_]+\\/g;
    var WeekRegex = /\\week[0-9]+\\/g;
    var DayRegex = /\\day[0-9]+\\/g;
    var LessonRegex = /\\lesson[0-9]+\.html/g;

    // Regex to find the values in the HTML 
    var htmlGradeRegex = /\/grade[A-z0-9]\//g;
    var htmlUnitRegex = /\/unit[0-9]+\//g;
    var htmlWeekRegex = /\/week[0-9]+\//g;
    var htmlDayRegex = /\/day[0-9]+\//g;
    var htmlLessonRegex = /\/lesson[0-9]+\//g;

    // Regex to find the values in the HTML 
    var htmlGradeContentRegex = /Grade [A-z0-9]/g;
    var htmlUnitContentRegex = /Unit [0-9]+/g;
    var htmlWeekContentRegex = /Week [0-9]+/g;
    var htmlDayContentRegex = /Day [0-9]+/g;
    var htmlLessonContentRegex = /Lesson [0-9]+/g;
    var actualUnit = "";

    //Current Grade, Unit, Week, Day //
    if (input.toLowerCase().match(GradeRegex) != null) {
        var actualGrade = input.toLowerCase().match(GradeRegex).toString().replace(/\\/g, "").replace(/ /g, "").replace(/_/g, "");
    }
    //Unit Regex
    if (input.match(UnitRegex) != null) {
        actualUnit = input.toLowerCase().match(UnitRegex).toString().replace(/\\/g, "").replace(/ /g, "").replace(/_/g, "").replace(/grade/, '');
    } else {
        var actualUnit1 = input.replace(rootFolder + "\\", "").toString();
        var actualUnit2 = actualUnit1.split("\\")[0];
        var GradeRegexx = /grade [A-z0-9]_/g;
        if (actualUnit2.toLowerCase().match('unit[_0-9]+') != null) {
            actualUnit = actualUnit2.toLowerCase().match('unit[_0-9]+').toString().replace('_', '').replace(GradeRegexx, "").replace(' ', '');
        } else if (actualUnit2.toLowerCase().match('unit[0-9]+') != null) {
            actualUnit = actualUnit2.toLowerCase().match('unit[0-9]+').toString().replace('_', '').replace(GradeRegexx, "").replace(' ', '');
        } else if (actualUnit2.toLowerCase().match('unit [0-9]+') != null) {
            actualUnit = actualUnit2.toLowerCase().match('unit [0-9]+').toString().replace('_', '').replace(GradeRegexx, "").replace(' ', '');
        }
    }
    if (actualUnit.match(',') != null) {
        actualUnit = actualUnit.split(',')[0];
    }
    //Week Regex
    if (input.match(WeekRegex) != null) {
        var actualWeek = input.match(WeekRegex).toString().replace(/\\/g, "").replace(/ /g, "").replace(/_/g, "");
    }
    //Day Regex
    if (input.match(DayRegex) != null) {
        var actualDay = input.match(DayRegex).toString().replace(/\\/g, "").replace(/ /g, "").replace(/_/g, "");
    }
    //Lesson Regex
    if (input.match(LessonRegex) != null) {
        var actualLesson = input.match(LessonRegex).toString().replace(/\\/g, "").replace(/ /g, "").replace(/_/g, "");
    }

    /* ---------------------------------------------------- Functions Declaration ---------------------------------------------------- */

    gradesLoop('div.grades');
    topBarLoop('section.top-bar-section');
    asideLoop('div.fadeInDown');


    /* -----------Function to loop through Grade Level which is located at the top left corner of the side (Grade Drop Down) ------------- */

    function gradesLoop(gradeTag) {
        $(gradeTag).children('ul').html('\n<li><a href="/html/gradek/unit1/unitopener.html" data-type="itrs" data-code="X24315" data-target="parent" data-extLink="/html/gradek/unit1/unitopener.html">Grade K</a></li>\n<li><a href="/html/grade1/unit1/unitopener.html" data-type="itrs" data-code="X24356" data-target="parent" data-extLink="/html/grade1/unit1/unitopener.html">Grade 1</a></li>\n<li><a href="/html/grade2/unit1/unitopener.html" data-type="itrs" data-code="X24397" data-target="parent" data-extLink="/html/grade2/unit1/unitopener.html">Grade 2</a></li>\n<li><a href="/html/grade3/unit1/unitopener.html" data-type="itrs" data-code="X24438" data-target="parent" data-extLink="/html/grade3/unit1/unitopener.html">Grade 3</a></li>\n<li><a href="/html/grade4/unit1/unitopener.html" data-type="itrs" data-code="X24479" data-target="parent" data-extLink="/html/grade4/unit1/unitopener.html">Grade 4</a></li>\n<li><a href="/html/grade5/unit1/unitopener.html" data-type="itrs" data-code="X24520" data-target="parent" data-extLink="/html/grade5/unit1/unitopener.html">Grade 5</a></li>\n<li><a href="/html/grade6/unit1/unitopener.html" data-type="itrs" data-code="X24561" data-target="parent" data-extLink="/html/grade6/unit1/unitopener.html">Grade 6</a></li>\n');
    }

    /* -------Function to loop through Unit Level which is located at the top left corner of the side (Top Bar of Unit Level) ----------- */

    function topBarLoop(topBarTag) {
        var gradeResourcesHref, gradeResourcesExtLink, gradeResourcesContent = "";
        var htmlName = "";
        var unitHref, unitExtLink, unitContent, unitClass = "";
        var actualUnitNo = "";

        //Loop for other list item except the unit Numbers.
        for (var a = 0; a < $(topBarTag).find('li').children('a').length; a++) {
            gradeResourcesHref = $(topBarTag).find('li').children('a').eq(a).attr('href');
            gradeResourcesExtLink = $(topBarTag).find('li').children('a').eq(a).attr('data-extlink');
            gradeResourcesContent = $(topBarTag).find('li').children('a').eq(a).text();

            if (gradeResourcesContent == 'Grade Resources') {
                htmlName = '/grade-resources/content-knowledge.html';
            } else if (gradeResourcesContent == 'Review and Routines') {
                htmlName = '/review-and-routines/day1.html';
            }
            //Correct Grade Name & URL
            if (actualGrade != undefined) {
                actualGrade = actualGrade.replace(/ /g, '');
            }
            var actualHref = '/html/' + actualGrade + htmlName;

            //href has been checked and updated the missing Links
            if (gradeResourcesHref == actualHref) {} else {
                if (actualHref == undefined) {
                    writableContent = writableContent + "\n" + 'href,Unit Top Bar,' + input + "," + gradeResourcesHref + "," + actualHref + "," + gradeResourcesContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                } else {
                    writableContent = writableContent + "\n" + 'href,Unit Top Bar,' + input + "," + gradeResourcesHref + "," + actualHref + "," + gradeResourcesContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                    $(topBarTag).find('li').children('a').eq(a).attr('href', actualHref);
                }
            }

            //data-extLink has been checked and updated the missing Links
            if (gradeResourcesExtLink == actualHref) {} else {
                if (actualHref == undefined) {
                    writableContent = writableContent + "\n" + 'data-extLink,Unit Top Bar,' + input + "," + gradeResourcesExtLink + "," + actualHref + "," + gradeResourcesContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                } else {
                    writableContent = writableContent + "\n" + 'data-extLink,Unit Top Bar,' + input + "," + gradeResourcesExtLink + "," + actualHref + "," + gradeResourcesContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                    $(topBarTag).find('li').children('a').eq(a).attr('data-extlink', actualHref);
                }
            }
        }

        //Loop for all the unit numbers.
        var unitCode, pCodetext, URL, pCode = "";
        for (var b = 0; b < $(topBarTag).find('div.nav-disc').find('a').length; b++) {
            unitHref = $(topBarTag).find('div.nav-disc').find('a').eq(b).attr('href');
            unitExtLink = $(topBarTag).find('div.nav-disc').find('a').eq(b).attr('data-extlink');
            unitContent = $(topBarTag).find('div.nav-disc').find('a').eq(b).text();
            unitClass = $(topBarTag).find('div.nav-disc').find('a').eq(b).attr('class');
            unitCode = $(topBarTag).find('div.nav-disc').find('a').eq(b).attr('data-code');

            pCodetext = readfile(__dirname + '\\' + 'pCode.txt');
            for (var pC = 0; pC < pCodetext.split('\r\n').length; pC++) {
                URL = pCodetext.split('\r\n')[pC].split('\t')[0];
                pCode = pCodetext.split('\r\n')[pC].split('\t')[1];

                //data-code has been checked and updated the missing Links

                if (unitHref == URL) {
                    if (unitCode == pCode) {} else {
                        if (pCode == undefined) {
                            writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + unitCode + "," + pCode + "," + unitContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + unitCode + "," + pCode + "," + unitContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(topBarTag).find('div.nav-disc').find('a').eq(b).attr('data-code', pCode);
                        }
                    }
                } else {}
            }


            if (actualGrade != undefined) {
                actualGrade = actualGrade.replace(/ /g, '');
            }
            actualHref = '/html/' + actualGrade + '/unit' + unitContent + '/unitopener.html'

            //href has been checked and updated the missing Links
            if (unitHref == actualHref) {} else {
                if (actualHref == undefined) {
                    writableContent = writableContent + "\n" + 'href,Unit Top Bar,' + input + "," + unitHref + "," + actualHref + "," + unitContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                } else {
                    writableContent = writableContent + "\n" + 'href,Unit Top Bar,' + input + "," + unitHref + "," + actualHref + "," + unitContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                    $(topBarTag).find('div.nav-disc').find('a').eq(b).attr('href', actualHref);
                }
            }

            //data-extLink has been checked and updated the missing Links
            if (unitExtLink == actualHref) {} else {
                if (actualHref == undefined) {
                    writableContent = writableContent + "\n" + 'data-extLink,Unit Top Bar,' + input + "," + unitExtLink + "," + actualHref + "," + unitContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                } else {
                    writableContent = writableContent + "\n" + 'data-extLink,Unit Top Bar,' + input + "," + unitExtLink + "," + actualHref + "," + unitContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                    $(topBarTag).find('div.nav-disc').find('a').eq(b).attr('data-extlink', actualHref);
                }
            }

            //class Checking
            /* 			actualUnitNo = actualUnit.replace(/unit/g,"");
            			if(unitContent == actualUnitNo) {
            				if(unitClass == 'activebutton'){}
            				else{
            					writableContent = writableContent + "\n" + 'class,Unit Top Bar,' + input + "," + unitClass + "," + 'activebutton' + "," + unitContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Fixed';
            					$(topBarTag).find('div.nav-disc').find('a').eq(b).attr('class','activebutton');
            				}
            			} */
        }
    }

    /* --------Function to loop through Side Bar which is located at the top left corner of the side (Top Bar of Unit Level) ------------- */

    function asideLoop(asideTag) {

        var lessonHtmlName, lessonHtmlMainContent, lessonHtmlHref, lessonHtmlExtLink, actualHtmlLink = "";
        var weekBtnHref, weekBtnContent, weekBtnExtLink, weekBtnClass, actualHTMLURL, actualLessonNo, htmlLessonNo, actualBtnlass = "";
        var weekHtmlClass, weekHtmlextLink, weekHtmlHref, weekHtmlHrefFileName, actualHref, weekHtmlContent, actualWeekclass, actualWeekNo = "";
        var weekHtmlBtnHref, weekHtmlBtnextLink, weekHtmlBtnContent, weekHtmlLessonNo, actualweekHtmlLessonURL = "";
        var BackUOHref, BackUOContent, BackUOextLink, actualBackUOHref = "";
        var currentWeekFolderRegex = /\\Grade [A-z0-9]_Unit [0-9]+_Week [0-9]\\/g;
        var currentUnitFolderRegex = /\\Grade [A-z0-9]_Unit [0-9]+\\/g;

        /* --------------------------------------------- Traverse Day Files Lesson files -----------------------------------------------------  */

        if ($(asideTag).children('a').length == 0) {

            //Lesson HTML fileName Declared
            lessonHtmlName = input.replace(root + '\\', "");

            /*---------------------------------Back Button Modificatin for the Lesson Html files-------------------------------------------------*/

            lessonHtmlMainContent = $(asideTag).children('div').eq(0).find('a').text();
            lessonHtmlHref = $(asideTag).children('div').eq(0).find('a').attr('href');
            lessonHtmlExtLink = $(asideTag).children('div').eq(0).find('a').attr('data-extlink');
            //actualHtmlLink = '/html/' + actualGrade + '/' + actualUnit + '/' + actualWeek + '/skills-at-a-glance.html';

            if (input.match(currentUnitFolderRegex) != null) {
                actualHtmlLink = '/html/' + actualGrade + '/' + actualUnit + '/' + actualWeek + '/skills-at-a-glance.html';
            } else if (input.match(currentWeekFolderRegex) != null) {
                actualHtmlLink = '/html/' + actualWeek + '/skills-at-a-glance.html';
            }


            //href has been checked and updated the missing Links
            if (lessonHtmlHref == actualHtmlLink) {} else {
                if (actualHtmlLink == undefined) {
                    writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + lessonHtmlHref + "," + actualHtmlLink + "," + lessonHtmlMainContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                } else {
                    writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + lessonHtmlHref + "," + actualHtmlLink + "," + lessonHtmlMainContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                    $(asideTag).children('div').eq(0).find('a').attr('href', actualHtmlLink);
                }
            }

            //data-extLink has been checked and updated the missing Links
            if (lessonHtmlHref == actualHtmlLink) {} else {
                if (actualHtmlLink == undefined) {
                    writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + lessonHtmlExtLink + "," + actualHtmlLink + "," + lessonHtmlMainContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                } else {
                    writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + lessonHtmlExtLink + "," + actualHtmlLink + "," + lessonHtmlMainContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                    $(asideTag).children('div').eq(0).find('a').attr('data-extlink', actualHtmlLink);
                }
            }

            /*------------------------------Lesson Buttons at side Modification for the Lesson Html files----------------------------------------*/

            for (var a = 0; a < $(asideTag).children('div.week-btn').find('a').length; a++) {

                weekBtnHref = $(asideTag).children('div.week-btn').find('a').eq(a).attr('href');
                weekBtnContent = $(asideTag).children('div.week-btn').find('a').eq(a).text();
                weekBtnExtLink = $(asideTag).children('div.week-btn').find('a').eq(a).attr('data-extlink');
                weekBtnClass = $(asideTag).children('div.week-btn').find('a').eq(a).attr('class');
                htmlLessonNo = a + 1;
                if (actualLesson != undefined) {
                    actualLessonNo = actualLesson.replace('lesson', "").replace('.html', "");
                }
                actualBtnlass = 'activebutton week-brd-clr button radius small medium-12 left-align';
                if (actualDay == undefined) {
                    actualDay = weekBtnContent.toString().toLowerCase().replace(/ /g, "");

                }
                if (input.match(currentUnitFolderRegex) != null) {
                    actualHTMLURL = '/html/' + actualGrade + '/' + actualUnit + '/' + actualWeek + '/' + actualDay + '/lesson' + htmlLessonNo + '.html';
                } else if (input.match(currentWeekFolderRegex) != null) {
                    actualHTMLURL = '/html/' + actualWeek + '/' + actualDay + '/lesson' + htmlLessonNo + '.html';
                }
                //href has been checked and updated the missing Links
                if (weekBtnHref == actualHTMLURL) {} else {
                    if (actualHTMLURL == undefined) {
                        writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + weekBtnHref + "," + actualHTMLURL + "," + weekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                    } else {
                        writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + weekBtnHref + "," + actualHTMLURL + "," + weekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                        $(asideTag).children('div.week-btn').find('a').eq(a).attr('href', actualHTMLURL);
                    }
                }

                //data-extLink has been checked and updated the missing Links
                if (weekBtnExtLink == actualHTMLURL) {} else {
                    if (actualHTMLURL == undefined) {
                        writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + weekBtnExtLink + "," + actualHTMLURL + "," + weekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                    } else {
                        writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + weekBtnExtLink + "," + actualHTMLURL + "," + weekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                        $(asideTag).children('div.week-btn').find('a').eq(a).attr('data-extlink', actualHTMLURL);
                    }
                }

                //class has been checked and updated the missing Links
                /* 			if(htmlLessonNo == actualLessonNo) {
                				if(weekBtnClass == actualBtnlass) {}
                				else{
                					if(actualBtnlass == undefined) {
                						writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + weekBtnClass + "," + actualBtnlass +  "," + weekBtnContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Not Fixed';
                					}
                					else {
                						writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + weekBtnClass + "," + actualBtnlass +  "," + weekBtnContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Fixed';
                						$(asideTag).children('div.week-btn').find('a').eq(a).attr('class',actualBtnlass);
                					}
                				}
                			}
                			else{} */

            }

        }

        /* -------------------------------------------------- Traverse other files -----------------------------------------------------  */
        else {
            var Weekroot = root.substr(0, root.lastIndexOf('\\'));
            String.prototype.endsWith = function(suffix) {
                return this.match(suffix + "$") == suffix;
            };

            var RootUnit, RootGrade;
            if (actualUnit != "") {
                RootUnit = actualUnit;
            } else {
                RootUnit = "No Unit Folder Found";
            }

            if (actualGrade != "") {
                RootGrade = actualGrade;
            } else {
                RootGrade = "No Unit Folder Found";
            }

            /*---------------------------------Lesson Html files for Grade K-3------------------------------------------------*/

            if (root.toString().endsWith('lessons') == true) {

                /*---------------------------------Back Button Modificatin for the Lesson Html files------------------------------------------------*/

                var BackaHref, BackextLink, BackCode, BackContent, actualaHref = "";

                BackaHref = $(asideTag).children('div').eq(0).find('a').attr('href');
                BackextLink = $(asideTag).children('div').eq(0).find('a').attr('data-extlink');
                BackCode = $(asideTag).children('div').eq(0).find('a').attr('data-code');
                BackContent = $(asideTag).children('div').eq(0).find('a').text();

                actualaHref = '/html/' + actualGrade + '/' + actualUnit + '/unitopener.html';

                var pCodetext, URL, pCode = "";

                pCodetext = readfile(__dirname + '\\' + 'pCode.txt');
                for (var pC = 0; pC < pCodetext.split('\r\n').length; pC++) {
                    URL = pCodetext.split('\r\n')[pC].split('\t')[0];
                    pCode = pCodetext.split('\r\n')[pC].split('\t')[1];

                    //data-code has been checked and updated the missing Links

                    if (BackaHref == URL) {
                        if (BackCode == pCode) {} else {
                            if (pCode == undefined) {
                                writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + BackCode + "," + pCode + "," + BackContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                            } else {
                                writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + BackCode + "," + pCode + "," + BackContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                                $(asideTag).children('div').eq(0).find('a').attr('data-code', pCode);
                            }
                        }
                    } else {}
                }

                //href has been checked and updated the missing Links
                if (BackaHref == actualaHref) {} else {
                    if (actualaHref == undefined) {
                        writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + BackaHref + "," + actualaHref + "," + BackContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                    } else {
                        writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + BackaHref + "," + actualaHref + "," + BackContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                        $(asideTag).children('div').eq(0).find('a').attr('href', actualaHref);
                    }
                }

                //data-extLink has been checked and updated the missing Links
                if (BackextLink == actualaHref) {} else {
                    if (actualaHref == undefined) {
                        writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + BackextLink + "," + actualaHref + "," + BackContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                    } else {
                        writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + BackextLink + "," + actualaHref + "," + BackContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                        $(asideTag).children('div').eq(0).find('a').attr('data-extlink', actualaHref);
                    }
                }

                /*---------------------------------Back Button Modification for the Lesson Html files-------------------------------------------------*/

                /*-------------------------------Immediate Child Modification for the Lesson Html files----------------------------------------------*/

                var BackChildaHref, BackChildextLink, BackChildaHtmlName, BackChildCode, BackChildContent, actualChildHref = "";

                for (var d = 0; d < $(asideTag).children('a').length; d++) {
                    BackChildaHref = $(asideTag).children('a').eq(d).attr('href');
                    BackChildextLink = $(asideTag).children('a').eq(d).attr('data-extlink');
                    BackChildContent = $(asideTag).children('a').eq(d).text();
                    BackChildCode = $(asideTag).children('a').eq(d).attr('data-code');
                    BackChildaHtmlName = BackChildaHref.replace(BackChildaHref.substr(0, BackChildaHref.lastIndexOf('/')) + '/', "");

                    if (input.match(currentUnitFolderRegex) != null) {
                        actualChildHref = '/html/' + actualGrade + '/' + actualUnit + '/' + actualWeek + '/' + BackChildaHtmlName;
                    } else if (input.match(currentWeekFolderRegex) != null) {
                        actualChildHref = '/html/' + actualWeek + '/' + BackChildaHtmlName;
                    }

                    if (BackChildaHref.endsWith('skills-at-a-glance.html') == true) {
                        var pCodetext, URL, pCode = "";
                        pCodetext = readfile(__dirname + '\\' + 'pCode.txt');
                        for (var pC = 0; pC < pCodetext.split('\r\n').length; pC++) {
                            URL = pCodetext.split('\r\n')[pC].split('\t')[0];
                            pCode = pCodetext.split('\r\n')[pC].split('\t')[1];

                            //data-code has been checked and updated the missing Links
                            var currentURL = '/' + actualGrade + '/' + actualUnit + '/' + actualWeek;
                            if (currentURL == URL) {
                                if (BackChildCode == pCode) {} else {
                                    if (pCode == undefined) {
                                        writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + BackChildCode + "," + pCode + "," + BackChildContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                                    } else {
                                        writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + BackChildCode + "," + pCode + "," + BackChildContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                                        $(asideTag).children('a').eq(d).attr('data-code', pCode);
                                    }
                                }
                            } else {}
                        }
                    }

                    //href has been checked and updated the missing Links
                    if (actualChildHref == BackChildaHref) {} else {
                        if (actualChildHref == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + BackChildaHref + "," + actualChildHref + "," + BackChildContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + BackChildaHref + "," + actualChildHref + "," + BackChildContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('a').eq(d).attr('href', actualChildHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (BackChildextLink == actualChildHref) {} else {
                        if (actualChildHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + BackChildextLink + "," + actualChildHref + "," + BackChildContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + BackChildextLink + "," + actualChildHref + "," + BackChildContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('a').eq(d).attr('data-extlink', actualChildHref);
                        }
                    }
                }

                /*-------------------------------Immediate Child Modification for the Lesson Html files----------------------------------------------*/
                var actualwkbtChildHref = "";
                for (var e = 0; e < $(asideTag).children('div.week-btn').find('a').length; e++) {
                    wkbtnaHref = $(asideTag).children('div.week-btn').find('a').eq(e).attr('href');
                    wkbtnextLink = $(asideTag).children('div.week-btn').find('a').eq(e).attr('data-extlink');
                    wkbtnContent = $(asideTag).children('div.week-btn').find('a').eq(e).text();
                    wkbtnClass = $(asideTag).children('div.week-btn').find('a').eq(e).attr('class');
                    actualClass = 'activebutton week-brd-clr button radius small medium-12 left-align';
                    No = e + 1;

                    htmlHreflessonFile = wkbtnaHref.replace(wkbtnaHref.substr(0, wkbtnaHref.lastIndexOf('/')) + '/', "");
                    currentHtmlFile = input.replace(root + "\\", "");

                    if (input.match(currentUnitFolderRegex) != null) {
                        actualwkbtChildHref = '/html/' + actualGrade + '/' + actualUnit + '/' + actualWeek + '/' + actualLesson + '/lesson' + No + '.html';
                    } else if (input.match(currentWeekFolderRegex) != null) {
                        actualwkbtChildHref = '/html/' + actualWeek + '/' + actualLesson + '/lesson' + No + '.html';
                    }

                    //href has been checked and updated the missing Links
                    if (wkbtnaHref == actualwkbtChildHref) {} else {
                        if (actualwkbtChildHref == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + wkbtnaHref + "," + actualwkbtChildHref + "," + wkbtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + wkbtnaHref + "," + actualwkbtChildHref + "," + wkbtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').find('a').eq(e).attr('href', actualwkbtChildHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (wkbtnextLink == actualwkbtChildHref) {} else {
                        if (actualwkbtChildHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + wkbtnextLink + "," + actualwkbtChildHref + "," + wkbtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + wkbtnextLink + "," + actualwkbtChildHref + "," + wkbtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').find('a').eq(e).attr('data-extlink', actualwkbtChildHref);
                        }
                    }

                    //class has been checked and updated the missing Links
                    if (currentHtmlFile == htmlHreflessonFile) {
                        if (actualClass == wkbtnClass) {} else {
                            if (actualClass == undefined) {
                                writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + wkbtnClass + "," + actualClass + "," + wkbtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                            } else {
                                writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + wkbtnClass + "," + actualClass + "," + wkbtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                                $(asideTag).children('div.week-btn').find('a').eq(e).attr('class', actualClass);
                            }
                        }
                    }


                }

                /*-------------------------------Week Button Modification for the Lesson Html files----------------------------------------------*/



                /*-------------------------------Week Button Modification for the Lesson Html files----------------------------------------------*/

            }

            /* ------------------------------------------------- Traverse Weeks Root html files ---------------------------------------------------  */

            if (Weekroot.toString().endsWith(RootUnit) == true) {

                /*------------------------------Other Buttons at side Modification for the Grade Root Html files---------------------------------------*/
                var weekHtmlCode, HTMLDay = "";
                for (var b = 0; b < $(asideTag).children('a').length; b++) {
                    weekHtmlHref = $(asideTag).children('a').eq(b).attr('href');
                    weekHtmlextLink = $(asideTag).children('a').eq(b).attr('data-extlink');
                    weekHtmlClass = $(asideTag).children('a').eq(b).attr('class');
                    weekHtmlCode = $(asideTag).children('a').eq(b).attr('data-code');
                    weekHtmlContent = $(asideTag).children('a').eq(b).text();
                    weekHtmlHrefFileName = weekHtmlHref.replace(weekHtmlHref.substr(0, weekHtmlHref.lastIndexOf('/')) + '/', "");
                    actualWeekclass = 'activebutton button radius small medium-12 left-align';

                    if (input.match(currentUnitFolderRegex) != null) {
                        actualHref = '/html/' + actualGrade + '/' + actualUnit + '/' + actualWeek + '/' + weekHtmlHrefFileName;
                    } else if (input.match(currentWeekFolderRegex) != null) {
                        actualHref = '/html/' + actualWeek + '/' + weekHtmlHrefFileName;
                    }

                    if (weekHtmlHref.endsWith('skills-at-a-glance.html') == true) {
                        var pCodetext, URL, pCode = "";
                        pCodetext = readfile(__dirname + '\\' + 'pCode.txt');
                        for (var pC = 0; pC < pCodetext.split('\r\n').length; pC++) {
                            URL = pCodetext.split('\r\n')[pC].split('\t')[0];
                            pCode = pCodetext.split('\r\n')[pC].split('\t')[1];

                            //data-code has been checked and updated the missing Links
                            var currentURL = '/' + actualGrade + '/' + actualUnit + '/' + actualWeek;
                            if (currentURL == URL) {
                                if (weekHtmlCode == pCode) {} else {
                                    if (pCode == undefined) {
                                        writableContent = writableContent + "\n" + 'data-code,Side Bar,' + input + "," + weekHtmlCode + "," + pCode + "," + weekHtmlContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                                    } else {
                                        writableContent = writableContent + "\n" + 'data-code,Side Bar,' + input + "," + weekHtmlCode + "," + pCode + "," + weekHtmlContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                                        $(asideTag).children('a').eq(b).attr('data-code', pCode);
                                    }
                                }
                            } else {}
                        }
                    }

                    //href has been checked and updated the missing Links
                    if (weekHtmlHref == actualHref) {} else {
                        if (actualHref == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + weekHtmlHref + "," + actualHref + "," + weekHtmlContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + weekHtmlHref + "," + actualHref + "," + weekHtmlContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('a').eq(b).attr('href', actualHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (weekHtmlextLink == actualHref) {} else {
                        if (actualHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + weekHtmlextLink + "," + actualHref + "," + weekHtmlContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + weekHtmlextLink + "," + actualHref + "," + weekHtmlContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('a').eq(b).attr('data-extlink', actualHref);
                        }
                    }

                    //class has been checked and updated the missing Links
                    /* 				actualWeekNo = actualWeek.replace('week',"");
                    				if(weekHtmlContent == 'Week ' + actualWeekNo +' Mini Lesson' && input.toString().endsWith('skills-at-a-glance.html')==true) {
                    					if(weekHtmlClass == actualWeekclass){}
                    					else {
                    						if(actualWeekclass == undefined) {
                    							writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + weekHtmlClass + "," + actualWeekclass + "," + weekHtmlContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Not Fixed';
                    						}
                    						else {
                    							writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + weekHtmlClass + "," + actualWeekclass + "," + weekHtmlContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Fixed';
                    							$(asideTag).children('a').eq(b).attr('class',actualWeekclass);
                    						}
                    					}
                    				}
                    				else{} */

                }

                /*------------------------------Other Buttons at side Modification for the Grade Root Html files---------------------------------------*/

                /*------------------------------Lesson Buttons at side Modification for the Grade Root Html files---------------------------------------*/

                for (var c = 0; c < $(asideTag).children('div.week-btn').find('a').length; c++) {

                    weekHtmlBtnHref = $(asideTag).children('div.week-btn').find('a').eq(c).attr('href');
                    weekHtmlBtnextLink = $(asideTag).children('div.week-btn').find('a').eq(c).attr('data-extlink');
                    weekHtmlBtnContent = $(asideTag).children('div.week-btn').find('a').eq(c).text();
                    weekHtmlLessonNo = c + 1;
                    HTMLDay = weekHtmlBtnContent.toLowerCase().replace(/ /g, "");
                    if (input.match(currentUnitFolderRegex) != null) {
                        actualweekHtmlLessonURL = '/html/' + actualGrade + '/' + actualUnit + '/' + actualWeek + '/' + HTMLDay + '/lesson1.html';
                    } else if (input.match(currentWeekFolderRegex) != null) {
                        actualweekHtmlLessonURL = '/html/' + actualWeek + '/' + HTMLDay + '/lesson1.html';
                    }
                    //href has been checked and updated the missing Links
                    if (weekHtmlBtnHref == actualweekHtmlLessonURL) {} else {
                        if (actualweekHtmlLessonURL == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + weekHtmlBtnHref + "," + actualweekHtmlLessonURL + "," + weekHtmlBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + weekHtmlBtnHref + "," + actualweekHtmlLessonURL + "," + weekHtmlBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').find('a').eq(c).attr('href', actualweekHtmlLessonURL);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (weekHtmlBtnextLink == actualweekHtmlLessonURL) {} else {
                        if (actualweekHtmlLessonURL == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + weekHtmlBtnextLink + "," + actualweekHtmlLessonURL + "," + weekHtmlBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + weekHtmlBtnextLink + "," + actualweekHtmlLessonURL + "," + weekHtmlBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').find('a').eq(c).attr('data-extlink', actualweekHtmlLessonURL);
                        }
                    }



                }

                /*------------------------------Lesson Buttons at side Modification for the Grade Root Html files----------------------------------------*/

                /*------------------------------Back to Unit Opener at side Modification for the Grade Root Html files-----------------------------------*/

                BackUOHref = $(asideTag).children('div').eq(0).find('a').attr('href');
                BackUOContent = $(asideTag).children('div').eq(0).find('a').text();
                BackUOextLink = $(asideTag).children('div').eq(0).find('a').attr('data-extlink');
                actualBackUOHref = '/html/' + actualGrade + '/' + actualUnit + '/unitopener.html';

                //href has been checked and updated the missing Links
                if (BackUOHref == actualBackUOHref) {} else {
                    if (actualBackUOHref == undefined) {
                        writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + BackUOHref + "," + actualBackUOHref + "," + BackUOContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                    } else {
                        writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + BackUOHref + "," + actualBackUOHref + "," + BackUOContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                        $(asideTag).children('div').eq(0).find('a').attr('href', actualBackUOHref);
                    }
                }

                //data-extLink has been checked and updated the missing Links
                if (BackUOextLink == actualBackUOHref) {} else {
                    if (actualBackUOHref == undefined) {
                        writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + BackUOextLink + "," + actualBackUOHref + "," + BackUOContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                    } else {
                        writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + BackUOextLink + "," + actualBackUOHref + "," + BackUOContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                        $(asideTag).children('div').eq(0).find('a').attr('data-extlink', actualBackUOHref);
                    }
                }

                /*------------------------------Back to Unit Opener at side Modification for the Grade Root Html files-----------------------------------*/

            }

            /* ------------------------------------------------ Travers Grade Root html files -----------------------------------------------------  */
            else if (Weekroot.toString().endsWith(RootGrade) == true) {

                /*------------------------------Lesson Buttons at side Modification for the Grade Root Html files----------------------------------------*/
                var unitWeekBtnContent, unitWeekBtnextLink, unitWeekBtnCode, unitWeekBtnHref = "";
                var pCodetext, URL, pCode = "";
                for (var a = 0; a < $(asideTag).children('div.week-btn').find('a').length; a++) {
                    unitWeekBtnContent = $(asideTag).children('div.week-btn').find('a').eq(a).text();
                    unitWeekBtnextLink = $(asideTag).children('div.week-btn').find('a').eq(a).attr('data-extlink');
                    unitWeekBtnHref = $(asideTag).children('div.week-btn').find('a').eq(a).attr('href');
                    unitWeekBtnCode = $(asideTag).children('div.week-btn').find('a').eq(a).attr('data-code');
                    actualWeekNo = unitWeekBtnContent.replace('Week ', "");
                    actualWeekBtnHref = '/html/' + actualGrade + '/' + actualUnit + '/week' + actualWeekNo + '/skills-at-a-glance.html';

                    pCodetext = readfile(__dirname + '\\' + 'pCode.txt');
                    for (var pC = 0; pC < pCodetext.split('\r\n').length; pC++) {
                        URL = pCodetext.split('\r\n')[pC].split('\t')[0];
                        pCode = pCodetext.split('\r\n')[pC].split('\t')[1];

                        //data-code has been checked and updated the missing Links

                        if (unitWeekBtnHref == URL) {
                            if (unitWeekBtnCode == pCode) {} else {
                                if (pCode == undefined) {
                                    writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + unitWeekBtnCode + "," + pCode + "," + unitWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                                } else {
                                    writableContent = writableContent + "\n" + 'data-code,Unit Top Bar,' + input + "," + unitWeekBtnCode + "," + pCode + "," + unitWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                                    $(asideTag).children('div.week-btn').find('a').eq(a).attr('data-code', pCode);
                                }
                            }
                        } else {}
                    }



                    //href has been checked and updated the missing Links
                    if (unitWeekBtnHref == actualWeekBtnHref) {} else {
                        if (actualWeekBtnHref == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + unitWeekBtnHref + "," + actualWeekBtnHref + "," + unitWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + unitWeekBtnHref + "," + actualWeekBtnHref + "," + unitWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').find('a').eq(a).attr('href', actualWeekBtnHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (unitWeekBtnextLink == actualWeekBtnHref) {} else {
                        if (actualWeekBtnHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + unitWeekBtnextLink + "," + actualWeekBtnHref + "," + unitWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + unitWeekBtnextLink + "," + actualWeekBtnHref + "," + unitWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').find('a').eq(a).attr('data-extlink', actualWeekBtnHref);
                        }
                    }
                }

                /*------------------------------Week Buttons at side Modification for the Grade Root Html files----------------------------------------*/

                /* --------------------------------------  Loop for a tag before div.week-btn tag -------------------------------------- */
                var unitBeforeButtonContent, unitBeforeButtonHref, unitBeforeButtonextLink, unitBeforeButtonClass, actualUnitBeforeButtonClass, actualHTMLFileName = "";

                for (var b = 0; b < $(asideTag).children('div.week-btn').prev().prevUntil(asideTag).length; b++) {
                    unitBeforeButtonContent = $(asideTag).children('div.week-btn').prev().prevUntil(asideTag).eq(b).text();
                    unitBeforeButtonHref = $(asideTag).children('div.week-btn').prev().prevUntil(asideTag).eq(b).attr('href');
                    unitBeforeButtonextLink = $(asideTag).children('div.week-btn').prev().prevUntil(asideTag).eq(b).attr('data-extlink');
                    unitBeforeButtonClass = $(asideTag).children('div.week-btn').prev().prevUntil(asideTag).eq(b).attr('class');

                    actualUnitBeforeButtonClass = 'activebutton button radius small medium-12 left-align';

                    if (unitBeforeButtonContent.match('Unit Opener') != null) {
                        actualHTMLFileName = 'unitopener.html';
                    } else if (unitBeforeButtonContent.match('Skills and Strategies') != null) {
                        actualHTMLFileName = 'skills-and-strategies.html';
                    } else if (unitBeforeButtonContent.match('Unit at a Glance') != null) {
                        actualHTMLFileName = 'unit-at-a-Glance.html';
                    } else if (unitBeforeButtonContent.match('Small Group Instructional Planner') != null) {
                        actualHTMLFileName = 'small-group-instructional.html';
                    }


                    actualUnitBeforeButtonHref = '/html/' + actualGrade + '/' + actualUnit + '/' + actualHTMLFileName;

                    //Class has been checked and updated the missing Links
                    /* 		if(unitBeforeButtonContent == 'Unit Opener' && input.toString().endsWith('unitopener.html')==true) {
                    			if(unitBeforeButtonClass == actualUnitBeforeButtonClass){}
                    			else{
                    				if(actualUnitBeforeButtonClass == undefined) {
                    					writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + unitBeforeButtonClass + "," + actualUnitBeforeButtonClass + "," + unitBeforeButtonContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Not Fixed';
                    				}
                    				else {
                    					writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + unitBeforeButtonClass + "," + actualUnitBeforeButtonClass + "," + unitBeforeButtonContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Fixed';
                    					$(asideTag).children('div.week-btn').prev().prevUntil(asideTag).eq(b).attr('class',actualUnitBeforeButtonClass);
                    				}
                    			}
                    		}
                    		 */
                    //Href has been checked and updated the missing Links
                    if (unitBeforeButtonHref == actualUnitBeforeButtonHref) {} else {
                        if (actualUnitBeforeButtonClass == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + unitBeforeButtonHref + "," + actualUnitBeforeButtonHref + "," + unitBeforeButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + unitBeforeButtonHref + "," + actualUnitBeforeButtonHref + "," + unitBeforeButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').prev().prevUntil(asideTag).eq(b).attr('href', actualUnitBeforeButtonHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (unitBeforeButtonextLink == actualUnitBeforeButtonHref) {} else {
                        if (actualUnitBeforeButtonHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + unitBeforeButtonextLink + "," + actualUnitBeforeButtonHref + "," + unitBeforeButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + unitBeforeButtonextLink + "," + actualUnitBeforeButtonHref + "," + unitBeforeButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').prev().prevUntil(asideTag).eq(b).attr('data-extlink', actualUnitBeforeButtonHref);
                        }
                    }
                }

                /* --------------------------------------  Loop for a tag before div.week-btn tag -------------------------------------- */


                /* --------------------------------------  Loop for a tag after div.week-btn tag -------------------------------------- */
                var unitAfterButtonContent, unitAfterButtonHref, unitAfterButtonextLink, actualUnitAfterButtonHref = "";

                for (var b = 0; b < $(asideTag).children('div.week-btn').next().next().nextUntil(asideTag).length; b++) {
                    unitAfterButtonContent = $(asideTag).children('div.week-btn').next().next().nextUntil(asideTag).eq(b).text();
                    unitAfterButtonHref = $(asideTag).children('div.week-btn').next().next().nextUntil(asideTag).eq(b).attr('href');
                    unitAfterButtonextLink = $(asideTag).children('div.week-btn').next().next().nextUntil(asideTag).eq(b).attr('data-extlink');
                    var c = b + 1;
                    actualUnitAfterButtonHref = '/html/' + actualGrade + '/' + actualUnit + '/additional-resources' + c + '.html';

                    //href has been checked and updated the missing Links
                    if (unitAfterButtonHref == actualUnitAfterButtonHref) {} else {
                        if (actualUnitAfterButtonHref == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + unitAfterButtonHref + "," + actualUnitAfterButtonHref + "," + unitAfterButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + unitAfterButtonHref + "," + actualUnitAfterButtonHref + "," + unitAfterButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').next().next().nextUntil(asideTag).eq(b).attr('href', actualUnitAfterButtonHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (unitAfterButtonextLink == actualUnitAfterButtonHref) {} else {
                        if (actualUnitAfterButtonHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + unitAfterButtonextLink + "," + actualUnitAfterButtonHref + "," + unitAfterButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + unitAfterButtonextLink + "," + actualUnitAfterButtonHref + "," + unitAfterButtonContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('div.week-btn').next().next().nextUntil(asideTag).eq(b).attr('data-extlink', actualUnitAfterButtonHref);
                        }
                    }
                }

                /* --------------------------------------  Loop for a tag after div.week-btn tag -------------------------------------- */

            }

            /* ------------------------------------------- Travers Review Routines Root html files -----------------------------------------------  */

            if (root.toString().endsWith('review-and-routines') == true) {
                for (var a = 0; a < $(asideTag).find('a').length; a++) {
                    b = a + 1;
                    RRdaysContent = $(asideTag).find('a').eq(a).text();
                    RRdaysHref = $(asideTag).find('a').eq(a).attr('href');
                    RRdaysextLink = $(asideTag).find('a').eq(a).attr('data-extlink');
                    RRdaysClass = $(asideTag).find('a').eq(a).attr('class');
                    actualDayNo = RRdaysContent.replace('Day ', "");
                    actualRRdaysURL = '/html/' + actualGrade + '/review-and-routines/day' + actualDayNo + '.html';
                    actualRRdaysClass = 'activebutton button radius small medium-12 left-align';
                    htmlFilenameNo = input.replace(root + "\\", "").replace('day', "");
                    //href has been checked and updated the missing Links
                    if (actualRRdaysURL == RRdaysHref) {} else {
                        if (actualRRdaysURL == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + RRdaysHref + "," + actualRRdaysURL + "," + RRdaysContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + RRdaysHref + "," + actualRRdaysURL + "," + RRdaysContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).find('a').eq(a).attr('href', actualRRdaysURL);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (actualRRdaysURL == RRdaysextLink) {} else {
                        if (actualRRdaysURL == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + RRdaysextLink + "," + actualRRdaysURL + "," + RRdaysContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + RRdaysextLink + "," + actualRRdaysURL + "," + RRdaysContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).find('a').eq(a).attr('data-extlink', actualRRdaysURL);
                        }
                    }

                    //class has been checked and updated the missing Links
                    /* 				if(htmlFilenameNo == actualDayNo) {
                    					if(actualRRdaysClass == RRdaysClass){}
                    					else {
                    						if(actualRRdaysClass == undefined) {
                    							writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + RRdaysClass + "," + actualRRdaysClass + "," + RRdaysContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Not Fixed';
                    						}
                    						else {
                    							writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + RRdaysClass + "," + actualRRdaysClass + "," + RRdaysContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Fixed';
                    							$(asideTag).find('a').eq(a).attr('class',actualRRdaysClass);
                    						}
                    					}
                    				} */

                }
            }

            /* ------------------------------------------- Travers grade-resources Root html files -----------------------------------------------  */

            if (root.toString().endsWith('grade-resources') == true || root.toString().endsWith('additional-resources') == true) {

                /* --------------------------------------  Loop for a tag before div.week-btn tag -------------------------------------- */
                var GRBeforeWeekBtnHref, GRBeforeWeekBtnExtLink, GRBeforeWeekBtnClass, GRBeforeWeekBtnContent, actualGRBeforeWeekBtnClass, currentHtmlFileName, actualGRBeforeWeekBtnHref, GRBeforeWeekBtnHtmlFileName = "";

                for (var a = 0; a < $(asideTag).children('h5').prev().prevUntil(asideTag).length; a++) {
                    GRBeforeWeekBtnHref = $(asideTag).children('h5').prev().prevUntil(asideTag).eq(a).attr('href');
                    GRBeforeWeekBtnExtLink = $(asideTag).children('h5').prev().prevUntil(asideTag).eq(a).attr('data-extlink');
                    GRBeforeWeekBtnClass = $(asideTag).children('h5').prev().prevUntil(asideTag).eq(a).attr('class');
                    GRBeforeWeekBtnContent = $(asideTag).children('h5').prev().prevUntil(asideTag).eq(a).text();
                    actualGRBeforeWeekBtnClass = 'activebutton button radius small medium-12 left-align';

                    GRBeforeWeekBtnHtmlFileName = GRBeforeWeekBtnHref.replace(GRBeforeWeekBtnHref.substr(0, GRBeforeWeekBtnHref.lastIndexOf('/')) + '/', "");
                    actualGRBeforeWeekBtnHref = '/html/' + actualGrade + '/grade-resources/' + GRBeforeWeekBtnHtmlFileName;

                    currentHtmlFileName = input.replace(input.substr(0, input.lastIndexOf('\\')) + '\\', "");

                    //class has been checked and updated the missing Links
                    /* 				if(GRBeforeWeekBtnHtmlFileName == currentHtmlFileName) {
                    					if(GRBeforeWeekBtnClass == actualGRBeforeWeekBtnClass) {}
                    					else {
                    						if(actualGRBeforeWeekBtnClass == undefined) {
                    							writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + GRBeforeWeekBtnClass + "," + actualGRBeforeWeekBtnClass + "," + GRBeforeWeekBtnContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Not Fixed';
                    						}
                    						else {
                    							writableContent = writableContent + "\n" + 'class,Side Bar,' + input + "," + GRBeforeWeekBtnClass + "," + actualGRBeforeWeekBtnClass + "," + GRBeforeWeekBtnContent.replace(/\n/g," ").replace(/\r\n/g," ").replace(/,/g," ") + ',Fixed';
                    							$(asideTag).children('h5').prev().prevUntil(asideTag).eq(a).attr('class',actualGRBeforeWeekBtnClass);
                    						}
                    					}
                    				} */

                    //href has been checked and updated the missing Links
                    if (actualGRBeforeWeekBtnHref == GRBeforeWeekBtnHref) {} else {
                        if (actualGRBeforeWeekBtnHref == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + GRBeforeWeekBtnHref + "," + actualGRBeforeWeekBtnHref + "," + GRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + GRBeforeWeekBtnHref + "," + actualGRBeforeWeekBtnHref + "," + GRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('h5').prev().prevUntil(asideTag).eq(a).attr('href', actualGRBeforeWeekBtnHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (actualGRBeforeWeekBtnHref == GRBeforeWeekBtnExtLink) {} else {
                        if (actualGRBeforeWeekBtnHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + GRBeforeWeekBtnExtLink + "," + actualGRBeforeWeekBtnHref + "," + GRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + GRBeforeWeekBtnExtLink + "," + actualGRBeforeWeekBtnHref + "," + GRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('h5').prev().prevUntil(asideTag).eq(a).attr('data-extlink', actualGRBeforeWeekBtnHref);
                        }
                    }



                }

                /* --------------------------------------  Loop for a tag before div.week-btn tag -------------------------------------- */

                /* --------------------------------------  Loop for a tag after div.week-btn tag -------------------------------------- */
                var AfterGRBeforeWeekBtnHref, AfterGRBeforeWeekBtnExtLink, AfterGRBeforeWeekBtnClass, AfterGRBeforeWeekBtnContent, actualAfterGRBeforeWeekBtnClass, AfterGRBeforeWeekBtnHtmlFileName, AfterGRBeforeWeekBtnHref, actualAfterGRBeforeWeekBtnHref, currentHtmlFileName = "";
                for (var b = 0; b < $(asideTag).children('h5').nextUntil(asideTag).length; b++) {

                    AfterGRBeforeWeekBtnHref = $(asideTag).children('h5').nextUntil(asideTag).eq(a).attr('href');
                    AfterGRBeforeWeekBtnExtLink = $(asideTag).children('h5').nextUntil(asideTag).eq(a).attr('data-extlink');
                    AfterGRBeforeWeekBtnClass = $(asideTag).children('h5').nextUntil(asideTag).eq(a).attr('class');
                    AfterGRBeforeWeekBtnContent = $(asideTag).children('h5').nextUntil(asideTag).eq(a).text();
                    actualAfterGRBeforeWeekBtnClass = 'activebutton button radius small medium-12 left-align';

                    AfterGRBeforeWeekBtnHtmlFileName = AfterGRBeforeWeekBtnHref.replace(AfterGRBeforeWeekBtnHref.substr(0, AfterGRBeforeWeekBtnHref.lastIndexOf('/')) + '/', "");
                    actualAfterGRBeforeWeekBtnHref = '/html/' + actualGrade + '/grade-resources/additional-resources/' + AfterGRBeforeWeekBtnHtmlFileName;

                    currentHtmlFileName = input.replace(input.substr(0, input.lastIndexOf('\\')) + '\\', "");


                    //href has been checked and updated the missing Links
                    if (actualAfterGRBeforeWeekBtnHref == AfterGRBeforeWeekBtnHref) {} else {
                        if (actualAfterGRBeforeWeekBtnHref == undefined) {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + AfterGRBeforeWeekBtnHref + "," + actualAfterGRBeforeWeekBtnHref + "," + AfterGRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'href,Side Bar,' + input + "," + AfterGRBeforeWeekBtnHref + "," + actualAfterGRBeforeWeekBtnHref + "," + AfterGRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('h5').nextUntil(asideTag).eq(a).attr('href', actualAfterGRBeforeWeekBtnHref);
                        }
                    }

                    //data-extLink has been checked and updated the missing Links
                    if (actualAfterGRBeforeWeekBtnHref == AfterGRBeforeWeekBtnExtLink) {} else {
                        if (actualAfterGRBeforeWeekBtnHref == undefined) {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + AfterGRBeforeWeekBtnExtLink + "," + actualAfterGRBeforeWeekBtnHref + "," + AfterGRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Not Fixed';
                        } else {
                            writableContent = writableContent + "\n" + 'data-extLink,Side Bar,' + input + "," + AfterGRBeforeWeekBtnExtLink + "," + actualAfterGRBeforeWeekBtnHref + "," + AfterGRBeforeWeekBtnContent.replace(/\n/g, " ").replace(/\r\n/g, " ").replace(/,/g, " ") + ',Fixed';
                            $(asideTag).children('h5').nextUntil(asideTag).eq(a).attr('data-extlink', actualAfterGRBeforeWeekBtnHref);
                        }
                    }

                }

                /* --------------------------------------  Loop for a tag after div.week-btn tag -------------------------------------- */

            }


        }
    }

    fs.writeFileSync(input, $.html().replace(/data\-extlink\=/g, 'data-extLink='));

    /* ---------- Report Generations ------------- */
    if (writableContent == '') {}

    //If error variable is not empty, then writting the variable into the xls sheet
    else {
        return writableContent;
    }

}