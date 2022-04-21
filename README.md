# BetterSearch

## Using BetterSearch Locally
### Backend
Backend is currently not deployed (due to the large size of the dependencies). To run locally:

Set up by
```
git clone https://github.com/angely67/BetterSearchAPI.git
virtualenv -p `which python3.8` env
source env/bin/activate
pip install -r requirements.txt
```
Run locally on http://localhost:5000
```
flask run
```

To run on another port change the value of port in the following line
```
app.run(threaded=True, port=5000)
```

The avaible end points <br/>
/api/semantic 
- POST request
- body should contain a json with {'data': array of strings, 'query': string for the queried data}
- returns an array of strings of semantic search results using txtai 

/api/qa
- POST request
- body should contain a json with {'data': array of strings, 'question': the question to be answered}
- returns an json with {'answer': answer of question, 'evidence': list of evidence for this question}. Using txtai

### Chrome Extension (this repo)
clone this repo and then go to chrome://extensions/ in your google chrome.
<br/>
Click on developer mode. <br/>
Click on load unpacked and choose the BetterSearch folder.<br/>
You should see BetterSearch appear in your list of extension and you can start using and testing it.