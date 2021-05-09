// to keep actual working methods of the class out of the object's instance whenever possible
// is a good practice, but since ECMAScript2015 (ES2015, ES6) does not support private methods
// (though does support private variables with "var" in constructors), IIFE (Immediately-invoked
// function expression) has to be used to encapsulate, isolate the full class definition:
let UpgradedMutationObserver = (function () {
    // private variable/property to store the instance's current status; WeakMap is used to improve memory
    // management as it sheds its value pairs as soon as the instance is not reference any more:
    const _targetsArrayWeakMap = new WeakMap(), // new WeakMap([[this, []]]) would not work as "this" here is a window object
        // private method-function wrapper that provides access for the object's instance to class prototype
        // methods as well as to an earlier-declared private variable;
        // this wrapper is designed as a function factory as it returns functions that get assigned to the object
        // instance's public methods:
        _callPrototypeMethod = function (prototypeMethod, instance, args) {
            // actual type of the private variable/property is set here; runs only once:
            if (typeof _targetsArrayWeakMap.get(instance) === 'undefined') {
                _targetsArrayWeakMap.set(instance, []);
            }
            return function () {
                const returnedObject = Object.getPrototypeOf(instance)[prototypeMethod](instance, _targetsArrayWeakMap.get(instance), ...arguments);
                _targetsArrayWeakMap.set(instance, returnedObject.privateVariable);
                return returnedObject.returnValue;
            }
        };

    class UpgradedMutationObserver {
        constructor(callback) {
            // an arrow function version of the way to attach the object's instance would not need .bind(this)
            // as there is no own "this" in arrow functions, "this" would mean the instance of the object
            this.MutationObserver = new MutationObserver(function (...args) {
                return callback(...args, this);
            }.bind(this));
            this.observe = _callPrototypeMethod('observe', this, arguments); // bind(this);
            this.disconnect = _callPrototypeMethod('disconnect', this, arguments); //.bind(this);
            this.isConnected = _callPrototypeMethod('isConnected', this, arguments); //.bind(this);
            // ... other standard methods like takeRecords() can also taken care of, if necessary
        }

        observe(instance, targetsArray, targetObserve, optionsObserve) {
            // many targets can be observed, though callback function is always the same
            // for the same instance of (Upgraded)MutationObserver:
            instance.MutationObserver.observe(targetObserve, optionsObserve);
            // before adding targetObserve to the list of observed,
            // it is checked that it exists (at least for now):
            if (document.contains(targetObserve)) {
                targetsArray.push(targetObserve);
            }
            return {privateVariable: targetsArray};
        }

        disconnect(instance, targetsArray) {
            // the method stops observation of all targets at once
            instance.MutationObserver.disconnect();
            targetsArray = [];
            return {privateVariable: targetsArray};
        }

        isConnected(instance, targetsArray, targetToCheck) {
            // in case of observed nodes removed from DOM (destroyed), they are filtered out:
            targetsArray = targetsArray.filter(function (e) {
                return document.contains(e);
            });
            // maximum versatily of return results is provided
            // all while maintaining false/"truthy" quasi-boolean dichotomy:
            return {
                privateVariable: targetsArray,
                returnValue: targetsArray.length == 0
                    ? false
                    : (targetToCheck
                        ? targetsArray.includes(targetToCheck)
                        : targetsArray)
            };
        }
    }

    return UpgradedMutationObserver;
})();

//main observer with all logic
const observer = new UpgradedMutationObserver(function (mutationsList, observer) {
    //getting span elements which consists elements to filter
    let posts = document.querySelectorAll('[automation-id="show-hide-post-main-body"]');
    let buttonsLength = posts.length; //initializing forLoop variables for better perfomance
    let i;
    for (i = 0; i < buttonsLength; i++) { //looping DOM elements
        //show-hide button `Show More`
        let showHideButton = posts[i].parentNode.querySelector('[automation-id="bio-info-toggle-show-button"]');

        if (typeof posts[i].className != 'undefined' && posts[i].className.includes("show-hide-text")) {
            if (showHideButton != null && showHideButton.textContent.trim() == "Show More" && !posts[i].classList.contains("processing")
                && !posts[i].classList.contains("processed")) {
                posts[i].classList.add('processing'); //adding processing classname if it does not contain it

                showHideButton.click(); //click on show more button if exists

                //replace post if tags are more than 5
                if (posts[i].querySelectorAll('[class="et-link"]').length > 5) {
                    //getting container of post
                    let parentNodes = posts[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    //user Post Link
                    let postID = parentNodes.parentNode.parentNode.id;
                    //user profile link
                    let userID = parentNodes.querySelector('.post-user-name.et-link').getAttribute("href");
                    //edit username
                    let editedUserName = userID.slice(8);
                    //replace to short placeholder
                    parentNodes.innerHTML = `
                         <span automation-id="show-hide-post-main-body" style="display: block;
                            padding: 27px;
                            margin-bottom: 16px;"
                                class="show-hide-text ng-star-inserted">Post from <a style="color: #2999f5; cursor: pointer;" 
                                class="et-link" target="_blank" 
                                href='${userID}'>@${editedUserName}</a> is hidden by eToro Content Filter -
                                <a style="color: #2999f5; cursor: pointer;" class="et-link" target="_blank"
                                 href='/posts/${postID !== null ? postID : " "}'>See Post</a>
                    </span>
                `;
                }

                //if show more clicked than => click on show less button if tags less than 5 and if it exists at all
                if (showHideButton.textContent != null && showHideButton.textContent.trim() == "Show Less" &&
                    posts[i].querySelectorAll('[class="et-link"]').length <= 5) {
                    showHideButton.click();
                }
            }
            //add/remove new/old classes
            posts[i].classList.add('processed');
            posts[i].classList.remove('processing');
        }
    }
});

//refresh observer funtion if posts container changed
if (!observer.isConnected()) {
    setTimeout(() => { //working trick that defers observe executing to the next tick in event loop. So DOM can render first!
        let postsContainer = document.querySelectorAll('ui-layout.ng-isolate-scope');
        if (typeof postsContainer[0] != 'undefined') {
            observer.observe(postsContainer[0], {childList: true, subtree: true});
        }
    }, 0);
}
