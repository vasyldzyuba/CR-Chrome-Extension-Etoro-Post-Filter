chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendresponse) {
    // console.log(message.txt);
    let paragraphs = document.querySelectorAll('[automation-id="show-hide-post-main-body"]');
    for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].querySelectorAll('[class="et-link"]').length > 1) {
            let ish = paragraphs[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            ish.innerHTML = `The post is hidden <a target="_blank" href='https://www.etoro.com/posts/${ish.parentNode.parentNode.id}'>Show Post</a>`;
        }
    }
    console.log("success");
}

let x = new MutationObserver(
    function () {
        gotMessage();
    }
);

x.observe(
    document.querySelector('body'), {subtree: true, characterData: true}
);


// document.addEventListener('DOMNodeInserted', gotMessage);
