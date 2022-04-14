chrome.runtime.onMessage.addListener(gotMessage);

Element.prototype.documentOffsetTop = function () {
    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
  };

var all = document.querySelectorAll('*')
var root = all[0]
var list = root.innerText.split(/\r?\n/);
list = list.filter(block => block.split(' ').length >= 3);
console.log("Atlantic Ocean".split(' ').length);
console.log(list);
var result_elements = [];
var index = 0;

function scrollToElement(element) {
    console.log(element);
    element.scrollIntoView(); 
    var top = element.documentOffsetTop() - ( window.innerHeight / 2 );
    window.scrollTo( 0, Math.max(top, window.pageYOffset - (window.innerHeight/2))) ;
}

function highlightResults(results){
    let copy = [...results];
    document.querySelectorAll('*').forEach(e => {
        if(copy.includes(e.innerText)){
            copy.splice(copy.indexOf(e.innerText), 1);
            e.style.background = "yellow";
            result_elements.push(e);
        }
    });
        scrollToElement(result_elements[0]);
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

async function processMessage(msg) {
    var r = await fetch('http://localhost:5000/api/semantic', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                    },
            body: JSON.stringify(data)
        })
        var result = await r.json();
            //console.log("done");
            //console.log(result);
            //results = [list[30], list[50], list[105]];
        highlightResults(result);
            //sendResponse(result);
  }

function gotMessage(request, sender, sendResponse){
    console.log(request.request)
    if(request.request === "option1"){
        if(!request.value){
            sendResponse();
            return;
        }
        /*var para = document.getElementsByTagName('p')
        for (elt of para){
            elt.style['background-color'] = '#FF00FF'
        }*/
        /*if(request.value){
            let re = new RegExp(request.value,"g"); // search for all instances
		    let newText = text.replace(re, `<mark>${request.value}</mark>`);
		    document.body.innerHTML = newText;
        }*/
        //using the request.value and list (data) fetch from backend
        result_elements = [];
        index = 0;

        let data = {data: list, query: request.value}
        console.log("start");
        /*fetch('http://localhost:5000/api/semantic', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                    },
            body: JSON.stringify(data)
        }).then(r => r.json())
        .then(result => {
            //console.log("done");
            //console.log(result);
            //results = [list[30], list[50], list[105]];
            highlightResults(result);
            //sendResponse(result);
        });*/
    }
    if(request.request === "next"){
        nextElement()
    }
    if(request.request === "prev"){
        prevElement()
    }

}


