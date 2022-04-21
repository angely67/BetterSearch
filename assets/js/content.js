const API_URL = "http://localhost:5000"

chrome.runtime.onMessage.addListener(gotMessage);

Element.prototype.documentOffsetTop = function () {
    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
  };

//scraping from html
var ALL_ELE = document.querySelectorAll('*')
var temp = ALL_ELE[0].innerText.split(/\r?\n/);
temp = temp.filter(block => block.split(' ').length >= 2); //only take lines with more than 1 words
var LIST_TEXT = [];
var LIST_ELE = [];
//Find elements that perfectly holds the words in temp or contains the line all text (not in some child)
temp.forEach(r => {
    for (let i = ALL_ELE.length - 1; i >= 0; i--) {
        let e = ALL_ELE[i];
        if((e.innerText === r || e.innerHTML.includes(r)) && !LIST_TEXT.includes(r)){
            LIST_TEXT.push(r);
            if(e.innerText === r){
                LIST_ELE.push(e);
            }
            else{
                e.innerHTML = e.innerHTML.replace(r, "<span>"+r+"</span>");
                e.childNodes.forEach(c => {
                    if(c.innerText === r){
                        LIST_ELE.push(c);
                    }
                })
            }
        }
    }
})

//global variables for results
var RESULT_TEXT = [];
var RESULT_ELEMENTS = [];
var INDEX = 0;

//request values
var REQUEST, VALUE;
var LOADED = false;

//get the info from storage and use if the url matches
chrome.storage.local.get(['loaded', 'all_text', 'cur_index','url', 'request'], 
  function(items) {      
        if(items.loaded && document.location.href===items.url){
            REQUEST = items.request;
            RESULT_TEXT = items.all_text;
            INDEX = items.cur_index;
            LOADED = items.loaded;
            getElementsAndText(RESULT_TEXT);
            highlightResults(INDEX);
        }
  });

function scrollToElement(element) {
    element.scrollIntoView(); 
    var top = element.documentOffsetTop() - ( window.innerHeight / 2 );
    window.scrollTo( 0, Math.max(top, window.pageYOffset - (window.innerHeight/2))) ;
}

//with the results given, find the matching html elements and text, store in global
function getElementsAndText(results){
    RESULT_ELEMENTS = [];
    RESULT_TEXT = [];
    results.forEach(r => {
        for (let i = LIST_ELE.length - 1; i >= 0; i--) {
            let e = LIST_ELE[i];
            if(e.innerText === r && !RESULT_TEXT.includes(r)){
                RESULT_TEXT.push(r);
                RESULT_ELEMENTS.push(e);
            }
        }
    })
}

//highlight all elements in result_elements and focus on the given index
function highlightResults(index){
    RESULT_ELEMENTS.forEach(e => {
            e.style.background = "yellow";
    });
    focusElement(RESULT_ELEMENTS[index]);
}

//unhighlight all the results from the result_elements
function unhighlightResults(){
    RESULT_ELEMENTS.forEach(e => {
            e.style.background = "none";
    });
}

function focusElement(element){
    element.style.background = "orange";
    scrollToElement(element);
}

function nextElement(){
    INDEX++;
    if(INDEX >= RESULT_TEXT.length){
        INDEX = 0
    }
    highlightResults(INDEX);
}

function prevElement(){
    INDEX--;
    if(INDEX < 0){
        INDEX = RESULT_TEXT.length-1;
    }
    highlightResults(INDEX);
}

async function fetchSemantic(data) {
    unhighlightResults();
    var r = await fetch(API_URL+'/api/semantic', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                    },
            body: JSON.stringify(data)
        })
        var result = await r.json();
        INDEX = 0;
        LOADED = true;
        getElementsAndText(result);
        highlightResults(0);
  }

  async function fetchQA(data) {
    unhighlightResults();
    var r = await fetch(API_URL+'/api/qa', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                    },
            body: JSON.stringify(data)
        })
        var result = await r.json();
        INDEX = 0;
        LOADED = true;
        getElementsAndText(result.evidence);
        highlightResults(0);
  }

function setStorage(data){
    let setData = {};
    if(data.request){
        setData.request = {request: data.request, value: data.value}
        setData.url = document.location.href
        setData.loaded = data.loaded
    }
    if(data.cur_index){
        setData.cur_index = data.cur_index
    }
    if(data.text){
        setData.text = data.text
    }
    if(data.all_text){
        setData.all_text = data.all_text
        setData.loaded = data.loaded
        setData.total = data.total
    }
    chrome.storage.local.set(setData, function(result) {});
}  

function gotMessage(request, sender, sendResponse){
    if(request.request === "getInfo"){
        let data = request? {request: REQUEST.request, loaded: LOADED, 
            total: RESULT_TEXT.length, index: INDEX, 
            value: REQUEST.value, text: RESULT_TEXT[INDEX]} : null;
        sendResponse(data);
        return;
    }
    if(request.request === "next"){
        nextElement();
        setStorage({cur_index : INDEX, 'text' : RESULT_TEXT[INDEX]});
        let ret = {cur_text:RESULT_TEXT[INDEX], total:RESULT_TEXT.length, cur_index:INDEX};
        sendResponse(ret);
    }
    if(request.request === "prev"){
        prevElement();
        setStorage({cur_index : INDEX, 'text' : RESULT_TEXT[INDEX]});
        let ret = {cur_text:RESULT_TEXT[INDEX], total:RESULT_TEXT.length, cur_index:INDEX};
        sendResponse(ret);
    }
    if(request.request === "option1" || request.request === "option2"){
        if(!request.value){
            sendResponse();
            return;
        }
        REQUEST = {request: request.request, value: request.value};
        LOADED = false;

        setStorage({request : request.request, value:request.value, loaded: false});

        (async () => {
            if(request.request === "option1"){
                let data = {data: LIST_TEXT, query: request.value}
                 await fetchSemantic(data);
            }else{
                let data = {data: LIST_TEXT, question: request.value}
                await fetchQA(data);
            }
    
        let ret = {cur_text:RESULT_TEXT[0], total:RESULT_TEXT.length, cur_index:0};
            
        setStorage({all_text : RESULT_TEXT, 
            loaded: true,
            total: ret.total,
            cur_index: 0,
            text: RESULT_TEXT[0]});
        sendResponse(ret);
        })();
        return true; 
    }

}


