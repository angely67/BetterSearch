chrome.runtime.onMessage.addListener(gotMessage);

Element.prototype.documentOffsetTop = function () {
    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
  };

var all = document.querySelectorAll('*')
var root = all[0]
var list = root.innerText.split(/\r?\n/);
list = list.filter(block => block.split(' ').length >= 2);
var result_elements = [];
var index = 0;

chrome.storage.local.get(['loaded', 'all', 'index','url'], 
  function(items) {      
        if(items.loaded && document.location.href===items.url){
            getElements(items.all);
            highlightResults(items.index);
        }
  });

function scrollToElement(element) {
    element.scrollIntoView(); 
    var top = element.documentOffsetTop() - ( window.innerHeight / 2 );
    window.scrollTo( 0, Math.max(top, window.pageYOffset - (window.innerHeight/2))) ;
}

function getElements(results){
    result_elements = [];
    results.forEach(r => {
        document.querySelectorAll('*').forEach(e => {
            if(e.innerText === r){
                result_elements.push(e);
            }
        });
    })
    return result_elements;
}
function highlightResults(index){
    result_elements.forEach(e => {
            e.style.background = "yellow";
    });
    focusElement(result_elements[index]);
    scrollToElement(result_elements[index]);
}

function focusElement(element){
    element.style.background = "orange"
}
function nextElement(){
    index++;
    if(index >= result_elements.length){
        index = 0
    }
    scrollToElement(result_elements[index]);
}

function prevElement(){
    index--;
    if(index < 0){
        index = result_elements.length-1;
    }
    scrollToElement(result_elements[index]);
}

async function fetchSemantic(data) {
    var r = await fetch('http://localhost:5000/api/semantic', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                    },
            body: JSON.stringify(data)
        })
        var result = await r.json();
            //results = [list[30], list[50], list[105]];
        getElements(result);
        highlightResults(0);
        return result;
            //sendResponse(result);
  }

function gotMessage(request, sender, sendResponse){
    console.log(request.request)
    if(request.request === "option1"){
        if(!request.value){
            sendResponse();
            return;
        }
        chrome.storage.local.set({
            'request' : "option1",
            'value' : request.value,
            'url' : document.location.href,
            'loaded' : false}, 
            function(result) {});

        (async () => {
        result_elements = [];
        index = 0;

        let data = {data: list, query: request.value}
        console.log("start");
        const r = await fetchSemantic(data);
        let ret = {cur_text:r[0], total:r.length, cur_index:0};
        console.log(ret);
        chrome.storage.local.set({
            'all' : r,
            'loaded' : true,
            'total' : ret.total,
            'index' : 0,
            'text' : r[0]}, 
            function(result) {});
        sendResponse(ret);
        })();
        return true; 
    }
    if(request.request === "next"){
        nextElement()
    }
    if(request.request === "prev"){
        prevElement()
    }

}


