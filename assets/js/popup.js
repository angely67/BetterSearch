
var results;
var TEXT, AMOUNT, PREV, NEXT, ANSWERBOX, ANSWER;

function loading(){
  TEXT.classList.remove("result-box");
  TEXT.innerHTML = "Loading... <img src=\"assets/loading.gif\" class=\"loading-gif\">";
  AMOUNT.classList.add('hidden');
  PREV.classList.add('hidden');
  NEXT.classList.add('hidden');
  ANSWERBOX.classList.add("hidden")
}

function displayResults(cur_text, cur_index, total, answer){
  TEXT.classList.add("result-box");
  if(answer){
    ANSWERBOX.classList.remove("hidden")
    ANSWER.innerText = answer;
  }
  else{
    ANSWERBOX.classList.add("hidden")
  }

  if(cur_text > 100){
    TEXT.innerHTML = "<strong>Results:</strong><br/>"+cur_text.substring(0, 50)+"...";
  }
  else{
    TEXT.innerHTML = "<strong>Results:</strong><br/>"+cur_text;
  }

    AMOUNT.classList.remove('hidden');
    AMOUNT.innerText = (cur_index+1)+" of "+total+" results";
    PREV.classList.remove('hidden');
    NEXT.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
  TEXT = document.getElementById('text');
  AMOUNT = document.getElementById('amount');
  PREV = document.getElementById('prev');
  NEXT = document.getElementById('next');
  ANSWER = document.getElementById('answer');
  ANSWERBOX = document.getElementById('answer-box');

  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {request: 'getInfo'}, function(items){
      if(items){
        if(items.request === "option1"){
          let input = document.getElementById('text-opt1');
          input.value = items.value;
        }
        else if(items.request === "option2"){
          let input = document.getElementById('text-opt2'); 
          input.value = items.value;
        }

      if(items.loaded){
        displayResults(items.text, items.index, items.total, items.answer);
      }
      else if(items.request){
        loading();
      }
      else{
        TEXT.innerHTML = "";
        TEXT.classList.remove("result-box");
        AMOUNT.classList.add('hidden');
        PREV.classList.add('hidden');
        NEXT.classList.add('hidden');
        ANSWERBOX.classList.add("hidden")
      }
      }
    })
  });

  var checkButton = document.getElementById('btn-opt1');
  checkButton.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      loading();
    
      let msg = {
        request: "option1",
        value: document.getElementById('text-opt1').value
      }

      chrome.tabs.sendMessage(tabs[0].id, msg, function(result){
        if(result){
          results = result;
          displayResults(results.cur_text, results.cur_index, results.total)
        }
        else{ 
          TEXT.innerHTML = "Something went wrong :(";
        }
      })
  });
  }, false);

  var checkButton = document.getElementById('btn-opt2');
  checkButton.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    
      loading();

      let msg = {
        request: "option2",
        value: document.getElementById('text-opt2').value
      }

      chrome.tabs.sendMessage(tabs[0].id, msg, function(result){
        if(result){
          results = result;
          displayResults(results.cur_text, results.cur_index, results.total, results.answer)
        }
        else{ 
          TEXT.innerHTML = "Something went wrong :(";
        }
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
        if(result){
          results = result;
          displayResults(results.cur_text, results.cur_index, results.total, results.answer)
        }
        else{ 
          TEXT.innerHTML = "Something went wrong :(";
        }
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
        if(result){
          results = result;
          displayResults(results.cur_text, results.cur_index, results.total, results.answer)
        }
        else{ 
          TEXT.innerHTML = "Something went wrong :(";
        }
      })
  });
  }, false);

}, false);
