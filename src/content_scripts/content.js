chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'calculateColor') {
    sendResponse({status: 'Color Calculated'});
  }
});
