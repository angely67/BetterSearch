
var results;
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['request', 'value', 'loaded', 'total','index','text'], 
  function(items) {
    if(items.request === "option1"){
        let input = document.getElementById('text-opt1');
        input.value = items.value;
    }
    let text = document.getElementById('text');
    let amount = document.getElementById('amount');
 

    if(items.loaded){
      text.innerHTML = items.text.substring(0, 30);
      amount.classList.remove('hidden');
      amount.innerText = (items.index+1)+" of "+items.total+" results";
  
    }
    else{
      text.innerHTML = "Loading";
  
      amount.classList.add('hidden');
    }
  });
  var checkButton = document.getElementById('btn-opt1');
  checkButton.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      let text = document.getElementById('text');
      text.innerHTML = "Loading";
      let amount = document.getElementById('amount');
      amount.classList.add('hidden');
     

      let msg = {
        request: "option1",
        value: document.getElementById('text-opt1').value
      }

      chrome.tabs.sendMessage(tabs[0].id, msg, function(result){
        results = result;
        let text = document.getElementById('text');
        text.innerHTML = results.cur_text.substring(0, 30);
        let amount = document.getElementById('amount');
        amount.classList.remove('hidden');
        amount.innerText = (results.cur_index+1)+" of "+results.total+" results";
      })
  });
  }, false);

  var checkButton = document.getElementById('btn-opt2');
  checkButton.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      alert("clicked");
      let text = document.getElementById('text');
      text.innerHTML = "Loading";
      let amount = document.getElementById('amount');
      amount.classList.add('hidden');
     

      let msg = {
        request: "option2",
        value: document.getElementById('text-opt2').value
      }

      chrome.tabs.sendMessage(tabs[0].id, msg, function(result){
        alert(JSON.stringify(result));
        results = result;
        let text = document.getElementById('text');
        text.innerHTML = results.cur_text.substring(0, 30);
        let amount = document.getElementById('amount');
        amount.classList.remove('hidden');
        amount.innerText = (results.cur_index+1)+" of "+results.total+" results";
      })
  });
  }, false);

  var prev = document.getElementById('prev');
  prev.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      let msg = {
        request: "prev"
      }
      
      chrome.tabs.sendMessage(tabs[0].id, msg, function(result){
        results = result;
        let text = document.getElementById('text');
        text.innerHTML = results.cur_text.substring(0, 30);
        let amount = document.getElementById('amount');
        amount.classList.remove('hidden');
        amount.innerText = (results.cur_index+1)+" of "+results.total+" results";
      })
  });
  }, false);

  var next = document.getElementById('next');
  next.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      let msg = {
        request: "next"
      }
      
      chrome.tabs.sendMessage(tabs[0].id, msg, function(result){
        results = result;
        let text = document.getElementById('text');
        text.innerHTML = results.cur_text.substring(0, 30);
        let amount = document.getElementById('amount');
        amount.classList.remove('hidden');
        amount.innerText = (results.cur_index+1)+" of "+results.total+" results";
      })
  });
  }, false);

}, false);

/*chrome.runtime.onMessage.addListener(
  function myFunc(request, sender, sendResponse) {
      alert(request)
  });*/