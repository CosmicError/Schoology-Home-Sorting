// ==UserScript==
// @name         Schoology_Home-Sorting
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sort Overdue and Upcoming Assignments by class
// @author       Jack Vega
// @match        *://*.schoology.com
// @match        *://*.schoology.com/home
// @match        *://*.schoology.com/home/recent-activity
// @match        *://*.schoology.com/home/course-dashboard
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {


        //FUCNTIONS
        function getClass(obj) {
            return obj.querySelector("h4 > span.infotip.sCommonInfotip-processed").getAttribute("aria-label").split(" :")[0].replaceAll("&amp;", "&");
        };

        function newHeader(str, obj, x) {
            let a = document.createElement("div");
            let b = document.createElement("h4");
            a.setAttribute("class", "date-header  "+x+" sEventUpcoming-processed");
            b.innerText = str;
            a.appendChild(b);
            obj.appendChild(a);
            return a;
        };


        // -- OVERDUE SECTION HANDLINE --
        let overdueCol = document.querySelector("#overdue-submissions > div");
        let overdueAssign = [];
        let className = [];
        let classElement = [];
        let upcomingCol = document.querySelector("#right-column-inner > div.upcoming-events.upcoming-events-wrapper.sEventUpcoming-processed > div");
        let upcomingAssign = [];
        let uclassName = [];
        let uclassElement = [];
        let i = 0;
        var date = String;
        var text = String;

        for (i = 0; i < document.querySelectorAll(".upcoming-event.course-event").length; i++) {
            if (document.querySelectorAll(".upcoming-event.course-event")[i].parentElement.parentElement.getAttribute("class") == "overdue-submissions overdue-submissions-wrapper") {
                if (document.querySelectorAll(".upcoming-event.course-event")[i].getAttribute("class") != "upcoming-event course-event  hidden") {

                    //SET DUE DATE & DUE TIME
                    text = document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText;
                    if (document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.getAttribute("class") == "date-header   sEventUpcoming-processed") {
                        date = document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.querySelector("h4").innerText;
                        document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText = date+' | '+text;
                    } else if (document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.getAttribute("class") == "date-header first  sEventUpcoming-processed") {
                        date = document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.querySelector("h4").innerText;
                        document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText = date+' | '+text;
                    } else {
                        date = document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.querySelector("h4 > span > span.upcoming-time.singleday").innerText.split(" | ")[0];
                        document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText = date+' | '+text;
                    };
                    overdueAssign.push(document.querySelectorAll(".upcoming-event.course-event")[i]);
                };
            } else if (document.querySelectorAll(".upcoming-event.course-event")[i].parentElement.parentElement.getAttribute("class") == "upcoming-events upcoming-events-wrapper sEventUpcoming-processed") {
                if (document.querySelectorAll(".upcoming-event.course-event")[i].getAttribute("class") != "upcoming-event course-event  hidden") {

                    //SET DUE DATE & DUE TIME
                    text = document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText;
                    if (document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.getAttribute("class") == "date-header  tomorrow sEventUpcoming-processed") {
                        date = document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.querySelector("h4").innerText;
                        document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText = date+' | '+text;
                    } else if (document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.getAttribute("class") == "date-header first tomorrow sEventUpcoming-processed") {
                        date = document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.querySelector("h4").innerText;
                        document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText = date+' | '+text;
                    } else {
                        date = document.querySelectorAll(".upcoming-event.course-event")[i].previousSibling.querySelector("h4 > span > span.upcoming-time.singleday").innerText.split(" | ")[0];
                        document.querySelectorAll(".upcoming-event.course-event")[i].querySelector("h4 > span > span.upcoming-time.singleday").innerText = date+' | '+text;
                    };
                    upcomingAssign.push(document.querySelectorAll(".upcoming-event.course-event")[i]);
                };
            };
        };

        for (i = 0; i < overdueAssign.length; i++) {

            if (!className.includes(getClass(overdueAssign[i]))) {
                className.push(getClass(overdueAssign[i]));
            };
        };

        //REMOVE OLD HEADERS
        while (overdueCol.querySelector("#overdue-submissions > div > div.date-header.sEventUpcoming-processed")) {
            overdueCol.querySelector("#overdue-submissions > div > div.date-header.sEventUpcoming-processed").remove();
        };

        //ASSIGN NEW HEADERS
        for (i = 0; i < className.length; i++) {
            classElement.push(newHeader(className[i], overdueCol, ""));
        };

        //SORT ASSIGNMENT INTO NEW HEADERS BY CLASS
        for (i = 0; i < overdueAssign.length; i++) {
            if (overdueAssign[i].parentElement.parentElement.getAttribute("class") == "overdue-submissions overdue-submissions-wrapper") {
                overdueCol.insertBefore(overdueAssign[i], classElement[className.indexOf(getClass(overdueAssign[i]))+1]);
            };
        };




        // -- UPCOMING SECTION HANDLING --

        for (i = 0; i < upcomingAssign.length; i++) {
            if (!uclassName.includes(getClass(upcomingAssign[i]))) {
                uclassName.push(getClass(upcomingAssign[i]));
            };
        };

        //REMOVE OLD HEADERS
        while (upcomingCol.querySelector("#right-column-inner > div.upcoming-events.upcoming-events-wrapper.sEventUpcoming-processed > div > div.date-header.tomorrow.sEventUpcoming-processed")) {
            upcomingCol.querySelector("#right-column-inner > div.upcoming-events.upcoming-events-wrapper.sEventUpcoming-processed > div > div.date-header.tomorrow.sEventUpcoming-processed").remove();
        };

        //ASSIGN NEW HEADERS
        for (i = 0; i < uclassName.length; i++) {
            uclassElement.push(newHeader(uclassName[i], upcomingCol, "tomorrow"));
        };

        //SORT ASSIGNMENT INTO NEW HEADERS BY CLASS
        for (i = 0; i < upcomingAssign.length; i++) {
            if (upcomingAssign[i].parentElement.parentElement.getAttribute("class") == "upcoming-events upcoming-events-wrapper sEventUpcoming-processed") {
                upcomingCol.insertBefore(upcomingAssign[i], uclassElement[uclassName.indexOf(getClass(upcomingAssign[i]))+1]);
            };
        };
    };
})();
