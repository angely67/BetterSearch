chrome.runtime.onMessage.addListener(gotMessage);

Element.prototype.documentOffsetTop = function () {
    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
  };

var all = document.querySelectorAll('*')
var root = all[0]
var list = root.innerText.split(/\r?\n/);
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

function gotMessage(request, sender, sendResponse){
    console.log(request.request)
    if(request.request === "option1"){

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
        results = [list[30], list[50], list[105]];
        highlightResults(results);
        sendResponse(results);
    }
    if(request.request === "next"){
        nextElement()
    }
    if(request.request === "prev"){
        prevElement()
    }

}


