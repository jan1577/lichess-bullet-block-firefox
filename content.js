function removeElementsFromQuickPairing(){
    let _bullet1 = document.querySelector('[data-id="1+0"]');
    let _bullet2 = document.querySelector('[data-id="2+1"]');
    _bullet1.remove();
    _bullet2.remove();

    browser.storage.local.get(['block_blitz_storage'], function(result) {
        if (result['block_blitz_storage']){
            let _blitz1 = document.querySelector('[data-id="3+0"]');
            let _blitz2 = document.querySelector('[data-id="3+2"]');
            let _blitz3 = document.querySelector('[data-id="5+0"]');
            let _blitz4 = document.querySelector('[data-id="5+3"]');
            _blitz1.remove();
            _blitz2.remove();
            _blitz3.remove();
            _blitz4.remove();
        };
    });
}


/**
 * Detect new games in the lobby
 */
function detectLobbyUpdates(){
    // add Mutation observer to <table class"hools__list"> to check if lobby is updated
    let gamesTable = document.querySelector(
        "#main-wrap > main > div.lobby__app.lobby__app-real_time > div.lobby__app__content.lreal_time > table"
    );

    const mutationObserverLobby = new MutationObserver(mutations => {
        removeElementsFromLobby(gamesTable);
    });

    mutationObserverLobby.observe(gamesTable, {childList: true, subtree: true})
}


function changeSliderMinimum(){
    let slider = document.querySelector(
        "#modal-wrap > div > div.setup-content > div.time-mode-config.optional-config > div.time-choice.range > input"
    );
    // minimum blitz value
    slider.min = 7;

    browser.storage.local.get(['block_blitz_storage'], function(result) {
        if (result['block_blitz_storage']){
            // minimum rapid value
            slider.min = 12;
        }
    });
}


function removeElementsFromLobby(gamesTable){
    let tbody = gamesTable.getElementsByTagName('tbody')[0];
    let tableRows = tbody.getElementsByTagName('tr');

    browser.storage.local.get(['block_blitz_storage'], function(result) {
        let block_blitz_games = result['block_blitz_storage'];
        
        // loop through all games in the lobby
        for (let row of tableRows){
            let game_title = row.title;
            // use substring bullet to remove both bullet, ultrabullet and blitz
            if (game_title.includes("Bullet") || (block_blitz_games && game_title.includes("Blitz"))){
                row.style.display = "none";
            }
        }
    });
}


/**
 * Remove the "New Opponent" Button if the current game matches the options
 * @param  substrings - an array of substrings, contains bullet or bullet and blitz
 * @param  link - the link of the button
 */
function compareStrings(substrings, link){
    if (substrings.some(str => link.includes(str))){
        document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a:nth-child(2)").style.display = "none";
    } else {
        document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a:nth-child(2)").style.display = "block";
    }
}


// first time use: set all values to false (only bullet blocked)
browser.storage.local.get(['block_blitz_storage'], function(result) {
    if (result == null) {
        browser.storage.local.set({'block_blitz_storage': false});
        browser.storage.local.set({'block_puzzle_storm': false});
        browser.storage.local.set({'block_puzzle_streak': false});
        browser.storage.local.set({'block_puzzle_racer': false});
    }
  });

// parent element with 4 different tabs: Quick Pairing, Lobby, Correspondence, Games in play
const parentLobby = document.querySelector("#main-wrap > main");

// detects when another tab in parentLobby is clicked
const mutationObserver = new MutationObserver(mutations => {
    // lobby is opened
    if (mutations[0].addedNodes[0].className == "lobby__app lobby__app-real_time"){
        detectLobbyUpdates();
    }
    // quick pairing is opened
    else if (mutations[0].addedNodes[0].className == "lobby__app lobby__app-pools"){
        removeElementsFromQuickPairing();
    }
});
mutationObserver.observe(parentLobby, {childList: true});

// div that contains the second "create a game" button
if (document.querySelector("#main-wrap > main > div.lobby__table")){
  const lobbyStart = document.querySelector("#main-wrap > main > div.lobby__table");

  // observing changes, as the button changes it's class name when clicked
  const mutationObserverLobbyStart = new MutationObserver(mutations => {
      // check whether the button was clicked or the div closed
      if (document.querySelector("#main-wrap > main > div.lobby__table > div.lobby__start > a.button.button-metal.config_hook.active")){
          changeSliderMinimum();
      }
  });
  mutationObserverLobbyStart.observe(lobbyStart, {childList: true});
}

// Check if Quick Pairing or Lobby is open when the page is loaded or refreshed
if (document.querySelector('[data-id="1+0"]')){
    removeElementsFromQuickPairing();
} else if (document.querySelector("#main-wrap > main > div.lobby__app.lobby__app-real_time > div.lobby__app__content.lreal_time > table > thead > tr > th:nth-child(2)")){
    detectLobbyUpdates();
}

// Change the min slider value based on options set.
if (document.querySelector("#modal-wrap > div > div.setup-content > div.time-mode-config.optional-config > div.time-choice.range > input")){
    changeSliderMinimum();
}

// Remove "New Opponent" Button if the current game is a Bullet or Blitz Game
if (document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div")){
    let new_opponent = document.querySelector(
        "#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a"
    );

    if (new_opponent){
        let link = new_opponent.href.toString();
        browser.storage.local.get(['block_blitz_storage'], function(result) {
            let substrings = [];
            if (result['block_blitz_storage']){

                substrings = ["1+0", "2+1", "3+0", "3+2", "5+0", "5+3"];
            } else {
                substrings = ["1+0", "2+1"]
            }
            compareStrings(substrings, link);
        })
    }
}
