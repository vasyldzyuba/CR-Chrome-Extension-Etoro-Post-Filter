console.log("Background running");
chrome.browserAction.onClicked.addListener(IconClicked);
function IconClicked(tab)
{
    let msg = {
        txt : "Hi from Etoro filter"
    }
    chrome.tabs.sendMessage(tab.id,msg);
}