chrome.runtime.onMessage.addListener(hidePosts);

//main function which filters posts
function hidePosts() {
    //getting span elements which consists elements to filter
    let posts = document.querySelectorAll('[automation-id="show-hide-post-main-body"]');
    let buttonsLength = posts.length; //initializing forLoop variables for better perfomance
    let i;
    for (i = 0; i < buttonsLength; i++) { //looping DOM elements
        //show-hide button `Show More`
        let showHideButton = posts[i].parentNode.querySelector('[automation-id="bio-info-toggle-show-button"]');

        if (showHideButton != null && showHideButton.textContent.trim() == "Show More") {
            showHideButton.click(); //click on show more button if exists

            //if show more clicked than => click on show less button if tags less than 5 and if it exists at all
            if (showHideButton.textContent.trim() == "Show Less" &&
                posts[i].querySelectorAll('[class="et-link"]').length <= 5) {
                showHideButton.click();
            }
        }

        //replace post if tags are more than 5
        if (posts[i].querySelectorAll('[class="et-link"]').length > 5) {

            //getting container of post
            let parentNodes = posts[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            //replace to short placeholder
            parentNodes.innerHTML = `
                         <span automation-id="show-hide-post-main-body" style="display: block;
                            padding: 27px;
                            margin-bottom: 16px;"
                                class="show-hide-text ng-star-inserted">Post from USER is hidden by eToro Content Filter -
                                <a   style="color: #2999f5;cursor: pointer;" class="et-link" target="_blank"
                                 href='/posts/${parentNodes.parentNode.parentNode.id !== null ? parentNodes.parentNode.parentNode.id : "no_link"}'>Show Post</a>
                    </span>
                `;
        }

    }
}

//observer which calls main hidePosts() function
let observer = new MutationObserver(
    function () {
        //delay for preventing browser freezing and push function into the end of callstack, so it works afters DOM updates
        setTimeout(hidePosts, 0);
    }
);

//call the observer if body changed
observer.observe(
    document.querySelector('body'), {subtree: true, characterData: true}
);
