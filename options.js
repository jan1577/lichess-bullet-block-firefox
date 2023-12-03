function saveOptions() {
  let block_blitz;
  if (document.getElementById('block_blitz').checked) {
    block_blitz = true;
  } else if (document.getElementById('do_not_block_blitz').checked) {
    block_blitz = false;
  }

  let block_racer = false;
  let block_streak = false;
  let block_storm = false;
  if (document.getElementById('block_racer').checked) {
    block_racer = true;
  }
  if (document.getElementById('block_streak').checked) {
    block_streak = true;
  }
  if (document.getElementById('block_storm').checked) {
    block_storm = true;
  }

  browser.storage.local.set({
    block_blitz_storage: block_blitz,
    block_puzzle_storm: block_storm,
    block_puzzle_racer: block_racer,
    block_puzzle_streak: block_streak,
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved. Refresh lichess to apply the changes.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}


// Restore options from local storage
function restoreOptions() {
  browser.storage.local.get(['block_blitz_storage'], function (item) {
    if (item['block_blitz_storage']) {
      document.getElementById('block_blitz').checked = true;
      document.getElementById('do_not_block_blitz').checked = false;
    } else {
      document.getElementById('block_blitz').checked = false;
      document.getElementById('do_not_block_blitz').checked = true;
    }
  });
  
  for (let i = 0; i < 5; i += 2) {
    restorePuzzles(puzzleArray[i], puzzleArray[i + 1])
  }
}


function restorePuzzles(storageValue, elementId) {
  browser.storage.local.get([storageValue], function (item) {
    if (item[storageValue]) {
      document.getElementById(elementId).checked = true;
    } else {
      document.getElementById(elementId).checked = false;
    }
  });
}

// used to restore selected options from local storage: first is the name of the variable
// in local storage, second the html id of the checkbox
const puzzleArray = ['block_puzzle_streak', 'block_streak', 'block_puzzle_storm', 'block_storm', 'block_puzzle_racer', 'block_racer']

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
  saveOptions);
