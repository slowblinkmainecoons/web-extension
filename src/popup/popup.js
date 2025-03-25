const DEFAULT_OPTIONS = {
  view_mode: 'comfortable',
}

function calculateColorForInputsInner(options = {...DEFAULT_OPTIONS}) {
  // read the DOM
  const dadColor = document.getElementById('dadColor').value;
  const momColor = document.getElementById('momColor').value;

  // create URL
  const [dad, mom] = [dadColor, momColor].map(color =>
    encodeURIComponent(color)
  );
  const newUrlObj = new URL(`https://slowblinkmainecoons.com/color-calculator`);
  newUrlObj.searchParams.append('dadColor', dad);
  newUrlObj.searchParams.append('momColor', mom);
  newUrlObj.searchParams.append('view_mode', options.view_mode);
  const newUrl = newUrlObj.toString();

  // save inputs to storage
  try {
    chrome.storage.sync.set({dadColor, momColor});
  } catch (error) {
    console.error('Error saving to storage', error);
  }

  // update tab to go to color calculator
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.update(tabs[0].id, {url: newUrl});
    // send event / notify bg script
    chrome.runtime.sendMessage({action: 'colorCalculated'});
  });
}

function restoreInputs() {
  try {
    chrome.storage.sync.get(['dadColor', 'momColor'], function (result) {
      try {
        const [momInput, dadInput] = [document.getElementById('momColor'), document.getElementById('dadColor')];
        momInput.value = result.dadColor;
        dadInput.value = result.momColor;
      } catch (domError) {
        console.error('Error restoring inputs', domError);
      }
    });
  } catch (error) {
    console.error('Error restoring inputs (no storage permission?)', error);
  }
}

function calculateColorForInputs(options = {...DEFAULT_OPTIONS}) {
  try {
    calculateColorForInputsInner(options);
  } catch (error) {
    console.error('Error calculating color for inputs', error);
    alert('Sorry, something went wrong calculating the color. Please try again. If the problem persists, please contact the developer.');
  }
}


document.addEventListener('DOMContentLoaded', function () {
  restoreInputs();

  const submitComfortable = document.getElementById('submitCalculateColorComfortable');
  submitComfortable.addEventListener('click', function () {
    chrome.runtime.sendMessage({action: 'calculateColor', view_mode: 'comfortable'});
    calculateColorForInputs({view_mode: 'comfortable'});
  });

  const submitDense = document.getElementById('submitCalculateColorDense');
  submitDense.addEventListener('click', function () {
    chrome.runtime.sendMessage({action: 'calculateColor', view_mode: 'dense'});
    calculateColorForInputs({view_mode: 'dense'});
  });
});
