/* Convert link to plain text
 * @param element: html element where attributes are removed
 */
function removeHref(element){
    element.removeAttribute('href');
    // change styling to plain text
    element.style.color = "inherit";
    element.style.pointerEvents = "none";
}


let links = document.getElementsByTagName('a'),
    holdarray = [];

/* check all href for links to puzzle variants */ 
Array.from(links, elem => {
  let hrefValue = elem.getAttribute('href');
  if (hrefValue == "/storm") {
    browser.storage.local.get(['block_puzzle_storm'], function(result) {
        if (result['block_puzzle_storm']) {
            if (elem.parentElement.getAttribute('role') || elem.className == "storm-play-again button") {
                elem.style.display = 'none';
            } else {
                removeHref(elem);
            }
        }  
    });
  } else if (hrefValue == "/racer" || hrefValue == "/streak") {
    let storageVariableName = "block_puzzle_" + hrefValue.substring(1);
    browser.storage.local.get([storageVariableName], function(result) {
        if (result[storageVariableName]){
            if (elem.parentElement.getAttribute('role') == "group") {
                elem.style.display = 'none';
            } else {
                removeHref(elem);
                // remove small icon next to span on left menu bar
                if (elem.children[1]){
                    elem.children[1].remove();
                }
            } 
        }
    });
  }
});
