var firstnames = [], lastnames = [], states = [], messages = [];
var slideAuthor, slideText, slideContent;
var backwardsSlide;
var nextMessageTimeout = null;
var current = -1;
var blocked = false;
var hovering = false;
var xmlResource = "https://www.staatsschutz.at/appsrv/messages";
var timeout = 15000;

$(function () {
    findElements();
})

function htmlColToArray(xml, tagName) {
    var i, x, xmlDoc, nodeArray = [];
    xmlDoc = xml.responseXML;
    x = xmlDoc.getElementsByTagName(tagName);
    for (i = 0; i < x.length; i++) {
        nodeArray = nodeArray.concat([$("<div/>").text(x[i].childNodes[0].nodeValue).html()]);
    }
    return nodeArray;
}

function findElements() {
    slideAuthor = document.getElementById("slideauthor");
    slideText = document.getElementById("slidetext");
    slideContent = document.getElementById("slideContent");
    backwardsSlide = document.getElementById("slideleft");
}

function setSlideScreen(index) {
    slideAuthor.innerHTML = firstnames[index] + " " + lastnames[index] + ", " + states[index];
    slideText.innerHTML = messages[index];
}

function getElements(xml) {
    firstnames = firstnames.concat(htmlColToArray(xml, "firstname"));
    lastnames = lastnames.concat(htmlColToArray(xml, "lastname"));
    states = states.concat(htmlColToArray(xml, "state"));
    messages = messages.concat(htmlColToArray(xml, "message"));
}

function openXML() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            getElements(xhttp); 
            findElements();
            autoSlide();
        }
    };
    xhttp.open("GET", xmlResource, true);
    xhttp.send();
}

function loadNext() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            getElements(xhttp);
        }
    };
    xhttp.open("GET", xmlResource, true);
    xhttp.send();
}

function slideForwards() {
    if (blocked == true)
        return;
    
    blocked = true;
    
    if (current == -1) {
        backwardsSlide.classList.add("slideUnselectable");
    } else if (current == 0) {
        backwardsSlide.classList.remove("slideUnselectable");
    } else if (current + 3 >= firstnames.length) {
        loadNext();
    }
    
    nextMessageTimeout && clearTimeout(nextMessageTimeout);
    nextMessageTimeout = setTimeout(autoSlide, timeout);
    
    current++;
    
    slideContent.classList.remove("slideBackwards");
    slideContent.classList.remove("slideForwards");
    slideContent.offsetWidth = slideContent.offsetWidth;
    slideContent.classList.add("slideForwards");
    
    setTimeout(function () {
        setSlideScreen(current);
        blocked = false;
    }, 300);
}

function slideBackwards() {
    if (blocked == true)
        return;
    
    blocked = true;
    
    if (current == 0) {
        blocked = false;
        return;
    } else if (current <= 1) {
        backwardsSlide.classList.add("slideUnselectable");
    }
    
    nextMessageTimeout && clearTimeout(nextMessageTimeout);
    nextMessageTimeout = setTimeout(autoSlide, timeout);

    current--;
    
    slideContent.classList.remove("slideBackwards");
    slideContent.classList.remove("slideForwards");
    slideContent.offsetWidth = slideContent.offsetWidth;
    slideContent.classList.add("slideBackwards");
    
    setTimeout(function () {
        setSlideScreen(current);
        blocked = false;
    }, 300);
}

function autoSlide() {
    if (!hovering) {
        slideForwards();
    }
}

$(document).ready(function(){
    $("#slider").hover(function () {
        hovering = true;
        slideText.classList.remove("sliderShrink");
        slideText.classList.add("sliderExpand");
    }, function () {
        hovering = false;
        slideText.classList.remove("sliderExpand");
        slideText.classList.add("sliderShrink");
    });
}); 

window.onload = function () {
    openXML();
};
