
var results = [];
document.addEventListener('DOMContentLoaded', function() {
  var checkButton = document.getElementById('btn-opt1');
  checkButton.addEventListener('click', function() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      let msg = {
        request: "option1",
        value: document.getElementById('text-opt1').value,
      }
      chrome.tabs.sendMessage(tabs[0].id, msg, function(result){
        results = result;
      alert(result);
        /*let resultBox = document.getElementById('result');
        resultBox.innerHTML = results[0];
        let amount = document.getElementById('amount');
        amount.innerHTML = "0 of "+results.length+"results";*/
      })
  });
  }, false);
}, false);

/*chrome.runtime.onMessage.addListener(
  function myFunc(request, sender, sendResponse) {
      alert(request)
  });*/