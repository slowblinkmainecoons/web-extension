chrome.runtime.onInstalled.addListener(function () {
  try {
    chrome.storage.sync.set({dadColor: '', momColor: ''});
  } catch (error) {
    console.error('Error setting initial colors:', error);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'colorCalculated') {
    console.log('Color calculated, link opened');
  }
});
