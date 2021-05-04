chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendresponse) {
    let paragraphs = document.querySelectorAll('[automation-id="show-hide-post-main-body"]');
    for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].querySelectorAll('[class="et-link"]').length > 5) {
            let parentNodes = paragraphs[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            parentNodes.innerHTML = ` 
          <span  automation-id="show-hide-post-main-body" style="display: block;
            padding: 27px;
            margin-bottom: 16px;"
                class="show-hide-text ng-star-inserted">Post from USER hidden by eToro Content Filter -
                <a   style="color: #2999f5;cursor: pointer;" class="et-link" target="_blank"
                 href='/posts/${parentNodes.parentNode.parentNode.id !== null ? parentNodes.parentNode.parentNode.id : "no_link"}'>Show Post</a>
    </span>
`;
        }
    }
}

let observer = new MutationObserver(
    function () {
        gotMessage();
    }
);

observer.observe(
    document.querySelector('body'), {subtree: true, characterData: true}
);
