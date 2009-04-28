//    Openbravo POS is a point of sales application designed for touch screens.
//    Copyright (C) 2007-2009 Openbravo, S.L.
//    http://sourceforge.net/projects/openbravopos
//
//    This file is part of Openbravo POS.
//
//    Openbravo POS is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    Openbravo POS is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with Openbravo POS.  If not, see http://www.gnu.org/licenses/.

var req;
var place;
var indexGlobal;
var category
var notification;
var mem = new Array;
var count = 0;

  function ajaxCall(mode, aplace, index){
       indexGlobal = index;
       var url = 'showPlace.do?id=';
       var params;
       switch(mode) {
        //add
        case 3: params = aplace + '&mode=3&parameters='+index;
                break;
        //remove
        case 1: if(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[parseInt(index)+1].getElementsByTagName('td')[2].getElementsByTagName('input')[0].value == 0){
                    params = aplace + '&mode=4&parameters='+index;
                    window.location = url + params
                } else {
                    params = aplace + '&mode=1&parameters='+index;
                    break;
                }
       }
      if (window.XMLHttpRequest) { // Non-IE browsers
        req = new XMLHttpRequest();
        req.onreadystatechange = startWorking;
        try {
            req.open("GET", url + params, true); //was get
        } catch (e) {
            alert("Problem Communicating with Server\n"+e);
        }
        req.send(null);
        }
  }

  function startWorking(){     
      if (req.readyState == 4) { // Complete
               if (req.status == 200) {
                   spanelem = splitTextIntoSpan(req.responseText);
                   updatePlace(spanelem, 'value'+indexGlobal, 'atotal');
                } else {
                        alert("Problem with server response:\n " + req.statusText);
                }
      }
  }


function updatePlace(newTextElements, place, place3){
        
        //loop through newTextElements
        for ( var i=newTextElements.length-1; i>=0; --i ){
                
                //check that this begins with
                if(newTextElements[i].indexOf('<span')>-1){

                        //get the name - between the 1st and 2nd quote mark
                        startNamePos=newTextElements[i].indexOf('"')+1;
                        endNamePos=newTextElements[i].indexOf('"',startNamePos);
                        name=newTextElements[i].substring(startNamePos,endNamePos);

                        //get the content - everything after the first > mark
                        startContentPos=newTextElements[i].indexOf('>')+1;
                        content=newTextElements[i].substring(startContentPos);
                        //Now update the existing Document with this element
                        
                        switch(i) {
                            case 2:     document.getElementById(place3).innerHTML = content;
                                        break;
                            case 1:     document.getElementById(place3).innerHTML = content;
                                        break;
                            case 0:     document.getElementById(place).innerHTML = content;
                                        break;
                        }
                }
        }
 }

 function retrieveURL(url, place2) {

    //get the (form based) params to push up as part of the get request
    //url=url+getFormAsString(nameOfFormToPost);
    place = place2;
    //Do the Ajax call
    if (window.XMLHttpRequest) { // Non-IE browsers
      req = new XMLHttpRequest();
      req.onreadystatechange = processStateChange;
      try {
        req.open("GET", url, true); //was get
      } catch (e) {
        alert("Problem Communicating with Server\n"+e);
      }
      req.send(null);
    } else if (window.ActiveXObject) { // IE

      req = new ActiveXObject("Microsoft.XMLHTTP");
      if (req) {
        req.onreadystatechange = processStateChange;
        req.open('POST', url, true);
        req.send();
      }
    }
  }
 
  function retrieveURLforCategories(url, place2) {
    
    //get the (form based) params to push up as part of the get request
    //url=url+getFormAsString(nameOfFormToPost);
    if(wrapupCategories(place2) == 1){
        place = place2;
        //Do the Ajax call
        if (window.XMLHttpRequest) { // Non-IE browsers
            req = new XMLHttpRequest();
            req.onreadystatechange = processStateChange;
            try {
                req.open("GET", url, true); //was get
            } catch (e) {
                alert("Problem Communicating with Server\n"+e);
            }
            req.send(null);
        }
    }
     else {
         
         text = new Array();
         text[0]='<span>';
         replaceExistingWithNewHtml(text, place2);
     }
    
  }

  function wrapupCategories(cat) {
      if(mem.length == 0){
          mem[0] = cat;
          return 1;
      }
      for(i = 0; i < mem.length; i++) {
        if(mem[i] == cat) {
            mem[i] = '';
            return 0;
        } 
      }
      mem[mem.length] = cat;
      return 1;
  }

/*
   * Set as the callback method for when XmlHttpRequest State Changes 
   * used by retrieveUrl
  */
  function processStateChange() {
  //document.getElementById("jsLog").innerHTML += req.responseText;
  
          if (req.readyState == 4) { // Complete
                if (req.status == 200) { // OK response
                        //Split the text response into Span elements
                        spanElements = splitTextIntoSpan(req.responseText);
                        
                        //Use these span elements to update the page
                        replaceExistingWithNewHtml(spanElements, place);
                } else {
                        alert("Problem with server response:\n " + req.statusText);
                }
      }
  }

 function splitTextIntoSpan(textToSplit){

        //Split the document
        returnElements=textToSplit.split('</span>')
      
        //Process each of the elements  
        for ( var i=returnElements.length-1; i>=0; --i ){                
                //Remove everything before the 1st span
                aspanPos = returnElements[i].indexOf('<span');
                //if we find a match , take out everything before the span
                if(aspanPos>0){
                        subString=returnElements[i].substring(aspanPos);
                        returnElements[i]=subString;
                
                } 
        }
      return returnElements;
 }
 
 /*
  * Replace html elements in the existing (ie viewable document)
  * with new elements (from the ajax requested document)
  * WHERE they have the same name AND are  elements
  * @param newTextElements (output of splitTextIntoSpan)
  *                                     in the format id=name>texttoupdate
  */
 function replaceExistingWithNewHtml(newTextElements, place){
        //loop through newTextElements
        for ( var i=newTextElements.length-1; i>=0; --i ){
                //check that this begins with 
                if(newTextElements[i].indexOf('<span')>-1){
                        
                        //get the name - between the 1st and 2nd quote mark
                        startNamePos=newTextElements[i].indexOf('"')+1;
                        endNamePos=newTextElements[i].indexOf('"',startNamePos);
                        name=newTextElements[i].substring(startNamePos,endNamePos);
                        
                        //get the content - everything after the first > mark
                        startContentPos=newTextElements[i].indexOf('>')+1;
                        content=newTextElements[i].substring(startContentPos);
                        
                        //Now update the existing Document with this element
                                //check that this element exists in the document
                                if(document.getElementById(place)){
                                
                                        //alert("Replacing Element:"+name);
                                        document.getElementById(place).innerHTML = content;
                                } else {
                                        //alert("Element:"+name+"not found in existing document");
                                }
                }
        }
 }

// function ajaxAddProduct(plac, index, not, cat){
//      var url = 'addProduct.do?place=' + plac +'&cat=' + cat + '&parameters=' + index;
//      indexGlobal = index;
//      if (window.XMLHttpRequest) { // Non-IE browsers
//        req = new XMLHttpRequest();
//        req.onreadystatechange = startWorkingAuxiliars;
//        try {
//            req.open("GET", url, true); //was get
//        } catch (e) {
//            alert("Problem Communicating with Server\n"+e);
//        }
//        req.send(null);
//        }
//
//        showNotifications(index, not);
//  }
var mode;
 function ajaxAddProduct(plac, index, not, productId, mod){
      var url = 'addProduct.do?place=' + plac +'&productId=' + productId ;
      mode = mod;
      indexGlobal = index;
      if (window.XMLHttpRequest) { // Non-IE browsers
        req = new XMLHttpRequest();
        req.onreadystatechange = startWorkingAuxiliars;
        try {
            req.open("GET", url, true); //was get
        } catch (e) {
            alert("Problem Communicating with Server\n"+e);
        }
        req.send(null);
        }

        showNotifications(index, not);
  }

   function startWorkingAuxiliars(){
      if (req.readyState == 4) { // Complete
               if (req.status == 200) {
                   spanelem = splitTextIntoSpan(req.responseText);
                   if(mode != 1){
                        updatePlace(spanelem, 'aux'+indexGlobal, '');
                   }
                } else {
                        alert("Problem with server response:\n " + req.statusText);
                }
      }
  }

  function showNotifications(index, not) {
      document.getElementById('notification').innerHTML = not + ' has been added to the receipt';
     // alert(document.getElementsByTagName('table')[0].getElementsByTagName('tr')[index + 1].getElementsByTagName('td')[3].innerHTML+' co kets');
    // row = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[index + 1].getElementsByTagName('td')[2];
    
      if(row.value == null) {
           row.value = 1;
           row.innerHTML = 1;
      } else {
          row.innerHTML = parseInt(row.innerHTML) + 1;
      }
  }

 function rememberCategory(cat){
      category = cat;
 }

function confirmDeleting(floor, place) {
    if(confirm('Are you sure you want to delete the current receipt?'))
        window.location = '../showFloors.do?floorId=' + floor +'&place=' + place;
}

function refreshListDelete(plac, line) {
 //   ajaxCall(1, plac, (line-1).toString());
// count = 0;
// var licz = 0;
//    if(unit <= 1){
//        rows = document.getElementById('table').getElementsByTagName('tr');
//        document.getElementById('table').deleteRow(line);
//        mem[line] = 1;
//    }
//    alert(rows.length);
//    for(i=0; i < rows.length ; i++){
//        if(mem[i] == 1){
//            alert('jest' + count);
//            count++;
//        }
//        licz++;
//    }
//    alert(line-count + ' ' + rows[line].getElementsByTagName('td')[0].value + ' ' +licz);
//   // ajaxCall(1, plac, (line-count).toString());

    window.location = 'showPlace.do?id='+plac+'&mode=1&parameters='+line;
    //window.location = 'showPlace.do?id='+plac+'&mode=0';
}

function refreshListIncementing(plac, line) {
    window.location = 'showPlace.do?id='+plac+'&mode=3&parameters='+line;
}
 