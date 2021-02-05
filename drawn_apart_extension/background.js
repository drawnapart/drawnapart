//Extension variables
var uuid;
var nbEvol;
var lastSent;
var changesToSee;
var notifications;


function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function compute(uuid) {
    window.api.exec(uuid, urlPrefix);
}

function requestNbChanges(uuid, urlPrefix = urlPrefix){
    //Make request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urlPrefix + "/getNbEvol/"+uuid);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
            var newEvol = parseInt(xhr.responseText);

            //If the fingerprint has changed
            //We indicate it in the browser action
            if (newEvol > nbEvol) {
                nbEvol = newEvol;
                chrome.storage.local.set({'nbEvol': nbEvol});

                if(notifications != 'D'){
                    changesToSee = true;
                    chrome.storage.local.set({'changesToSee':true});
                    if(notifications == "E") chrome.browserAction.setBadgeText({text:"!"});
                }
            }

            //We update the time the last FP was sent
            lastSent = new Date();
            chrome.storage.local.set({'lastSent': lastSent});
        }
    };
}

function startLoop(uuid){
    //Send FP on startup
    compute(uuid);

    //Send the FP every 4 hours to the server
    setInterval(function() { compute(uuid); },
    4*60*60*1000
    );
}

function updateOptions(userChoice){
    if(notifications != userChoice){
        notifications = userChoice;
        chrome.storage.local.set({'notifications':notifications});
        if(notifications == "D"){
            changesToSee = false;
            chrome.storage.local.set({'changesToSee':false});
            chrome.browserAction.setBadgeText({text:""});
        } else if (notifications == "B"){
            chrome.browserAction.setBadgeText({text:""});
        }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.from == "content") {
            //Send ID back to content script
            sendResponse({data:uuid});

        } else if (request.from == "popup"){
            //If the user has clicked on the "View changes" button
            //or the "X" button, we reset the text the badge of the browser action
            chrome.browserAction.setBadgeText({text:""});
            changesToSee = false;
            chrome.storage.local.set({'changesToSee':false});

        }
    }
);


//Get the unique ID in Chrome storage
//If not present, generate it

(function() {
	chrome.storage.local.get(function(items) {
		uuid = items.uuid;
		nbEvol = items.nbEvol;
		changesToSee = items.changesToSee;
		lastSent = items.lastSent;
		notifications = items.notifications;
		if(uuid === undefined) {
		    uuid = generateUUID();
		    chrome.storage.local.set({'uuid': uuid});
		}
		if(nbEvol === undefined){
		    nbEvol = 0;
		    changesToSee = false;
		    lastSent = new Date();
		    notifications = 'E';
		    chrome.storage.local.set({
		        'nbEvol':nbEvol,
		        'changesToSee':changesToSee,
		        'lastSent': lastSent,
		        'notifications': notifications
		    });
		}
		if(changesToSee) chrome.browserAction.setBadgeText({text:"!"});
	
		//Start the main application loop when the variables are ready
		startLoop(uuid);
	});
})();
