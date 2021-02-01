// ==UserScript==
// @name         Schoology Courses Menu QOL
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       Jack Vega
// @match        *://*.schoology.com
// @match        *://*.schoology.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==


'use strict';
//DETECT IF THE COURSES MENU IS OPENED
let CLASSES_UNSORTED = [];
let CLASSES_SORTED = [];
let BUTTON_ = document.querySelector("[role='navigation'] > ul:nth-child(1) > li:nth-child(2) > div > button");
let NUM = 0;

//THEY DO AN AUTH THING THAT RUNS THE SCRIPT TWICE AND CAUSES THE SCRIPT TO ERROR ON THE SECOND RUN (APPLY FIRST RUN THOUGH)
//PUTTING A TRY/CATCH STATEMENT TO IGNORE THAT ERROR SINCE THERE'S NOT MUCH I CAN DO ABOUT IT
try { BUTTON_.addEventListener("click", run) } catch { };

//FUNCTION TO RUN WHEN COURSE MENU IS OPENED
function run() {

    //DOUBLE CHECK THAT THE MENU IS BEING OPENED AND NOT CLOSED (DON'T RUN ON MENU CLOSE)
    if (BUTTON_.getAttribute("aria-expanded") == "true") {
        let ROWS = document.querySelector("[role='navigation'] > ul:nth-child(1) > li:nth-child(2) > div > div").querySelector("div > div > div > div");

        //GET ALL CLASSES IN THE MENU
        for (var i = 1; i < ROWS.childElementCount; i++) {
            for (var v = 0; v <= ROWS.children[i].childElementCount; v++) {
                //CATCH THE RANDOM undefined OBJECT THAT DON'T REALLY EXIST (idk what's causing it so i can't fix it)
                try {
                    if (ROWS.children[i].children[v].children.length > 0) {
                        CLASSES_UNSORTED.push(ROWS.children[i].children[v]);
                    };
                } catch { };
            };
        };

        //CLOSE THE COURSES MENU IF PARTICULAR BUG IS FOUND
        //THE BUG MAKES AND KEEPS THE LIST LENGTH 0 FOR NO REASON (aka idk whats causing it so i can't solve it)
        if (CLASSES_UNSORTED.length == 0) {
            BUTTON_.click();
            BUTTON_.click();
            return;
        };

        //SORT CLASSES BASED ON CLASS PERIOD (Not including AB schedule)
        for (i = 0; i < CLASSES_UNSORTED.length; i++) {
            var TEXT = CLASSES_UNSORTED[i].querySelector("article > a > div:nth-child(2) > div > div:nth-child(2)").innerText;
            if (CLASSES_SORTED.length < 1 && TEXT[0] == "1") {
                CLASSES_SORTED.push(CLASSES_UNSORTED[i]);
            };
        };
        while (CLASSES_SORTED.length < CLASSES_UNSORTED.length) {
            for (v = 0; v < 4; v++) {
                for (i = 0; i < CLASSES_UNSORTED.length; i++) {
                    TEXT = CLASSES_UNSORTED[i].querySelector("article > a > div:nth-child(2) > div > div:nth-child(2)").innerText;
                    //CHECK FOR 20 DIFFERENT CLASS PERIODS, AFTER THAT, ADD THE REST OF THE CLASSES IN NO PARTICULAR ORDER
                    if (Number(TEXT.split("(")[0]) == NUM && !CLASSES_SORTED.includes(CLASSES_UNSORTED[i]) && NUM < 20) {
                        CLASSES_SORTED.push(CLASSES_UNSORTED[i]);
                    } else if (NUM > 20 && !CLASSES_SORTED.includes(CLASSES_UNSORTED[i])) {
                        CLASSES_SORTED.push(CLASSES_UNSORTED[i]);
                    };
                };
            };
            NUM++;
        };


        //NOW PUT THEM IN ORDER ON THE SCREEN
        let RowCount = ROWS.childElementCount - 1;
        let AmountPerRow = document.querySelector("[role='navigation'] > ul:nth-child(1) > li:nth-child(2) > div > div > div > div > div:nth-child(2)").childElementCount;


    };
};











































