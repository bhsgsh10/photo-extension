

/*TRYING SOMETHING WITH IFRAME, WHICH HASN'T WORKED */
//   var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
//     if (!location.ancestorOrigins.contains(extensionOrigin)) {
//         var iframe = document.createElement('iframe');
//         // Must be declared at web_accessible_resources in manifest.json
//         iframe.src = chrome.runtime.getURL('modal.html');

//         // Some styles for a fancy sidebar
//         iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
//                             'width:300px;height:100%;z-index:1000;';
//         document.body.appendChild(iframe);
//     }

/* ADD MODAL HTML CODE, BOOTSTRAP. HAD TO DISCARD THIS APPROACH FOR THE TIME BEING AS IT BROKE A LOT OF OTHER THINGS */
//     var modal = `<div class="modal fade" id="photoModal" tabindex="-1" role="dialog" aria-labelledby="photoModalTitle" aria-hidden="true">
//     <div class="modal-dialog modal-dialog-centered" role="document">
//       <div class="modal-content">
//         <div class="modal-header">
//           <h5 class="modal-title" id="photoModalLongTitle">Modal title</h5>
//           <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//             <span aria-hidden="true">&times;</span>
//           </button>
//         </div>
//         <div class="modal-body">
//           ...
//         </div>
//         <div class="modal-footer">
//             <div class="footer-text"></div>
//           <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
//         </div>
//       </div>
//     </div>
//   </div>`
    //$(document.body).append(modal);


//Document ready
$(document).ready(function() {
    
    /* JQUERY DIALOG APPROACH. WORKS FINE, BUT NEEDS CHANGES TO CSS TO RENDER AS REQUIRED. Had to hide the native close button as it was rendering with a text instead of the icon
    Added custom close button */
    createDialogHtml()

    modifyTimeline();

    function createDialogHtml() {
        var dialog = `<div id="photoinfo-dialog" class="hidden" title="Here is some information on the photo">
                    <p class="msg-body">...</p></br>
                    <div class="footer">Look for our trust signals to identify genuine photos</div>
                </div>`
        $(document.body).append(dialog);
    }

    function addButtonToMediaLinkTweets(tweetid, mediaLinkContainer) {
        var infoButton = getInfoButtonHTML(tweetid)
        if (!mediaLinkContainer.hasClass("infoButtonAdded") && !mediaLinkContainer.hasClass("has-autoplayable-media")) {
            mediaLinkContainer.addClass("infoButtonAdded")
            mediaLinkContainer.append(infoButton)
        }
    }

    function addButtonToPosts(tweetid, outerContainer) {
        var infoButton = getInfoButtonHTML(tweetid)
        if (!outerContainer.hasClass("infoButtonAdded")) {
            outerContainer.addClass("infoButtonAdded")
            outerContainer.append(infoButton)
        }
    }

    function getInfoButtonHTML(tweetId) {
        var buttonText = "More info on the photo"
        var infoButton = "<button class='rectbox' id='"+tweetId+"'>"+buttonText+"</button>";
        return infoButton
    }

    function addOverlayToPosts(outerContainer) {
        //adding overlay to tweets with links in them - links that contain images
        var overlayHtml = getOverlayHtml()
        if (!outerContainer.hasClass("overlayAdded")) {
            outerContainer.addClass("overlayAdded")
            outerContainer.append(overlayHtml)
        }
    }

    function addOverlayToMediaLinks(mediaLinkContainer) {
        var overlayHtml = getOverlayHtml()
        if (!mediaLinkContainer.hasClass("overlayAdded") && !mediaLinkContainer.hasClass("has-autoplayable-media")) {
            mediaLinkContainer.addClass("overlayAdded")
            mediaLinkContainer.append(overlayHtml)
        }
    }

    function getOverlayHtml() {
        var overlay = `<div class="overlay">
                        <div><h3 class="header">Information about the photo(s) in the tweet</h3></div>
                        <div class="bullet-list"    
                            <ul class="info-list">
                                <li>Photographer: Nina Berman</li>
                                <li>Taken on: Jan. 20, 2017</li>
                                <li>Location: Washington DC, USA</li>
                                <li>Occasion: Political rally</li>
                                <li>Publication: The New York Times </li>
                            </ul>
                        </div>
                    </div>`
        return overlay
    }

    function showDialog(){
        $(function() {
            $("#photoinfo-dialog").dialog({
                modal: true,
                resizable: false,
                width: 'auto',
                maxWidth: 600,
                height: 'auto',
                buttons: [ 
                    { 
                        text: "Close",
                        "class": 'ui-state-default2', 
                        click: function() { 
                            $(this).dialog("close"); 
                        } 
                    }
                ]
            });
        });
    }


    /// BUTTON INJECTION
    // Add button to every tweet being shown
    function modifyTimeline(){
        var buttonText = "More info on the photo"
        $(".tweet, .js-tweet").each(function() {
            var username = $(this).attr('data-screen-name');
            var tweetid = $(this).attr('data-tweet-id');
            if (username != null) {
                var rectBox = "<button class='rectbox' id='"+tweetid+"'>"+buttonText+"</button>";
                var mediaLinkContainer = $(this).find(".card2")
                addButtonToMediaLinkTweets(tweetid, mediaLinkContainer)
                // addOverlayToMediaLinks()

                var outerContainer = $(this).find(".AdaptiveMediaOuterContainer")
                var mediaContainer = $(this).find(".AdaptiveMedia-photoContainer")
                if (mediaContainer.length) {
                    console.log("Photo found in link")
                   addButtonToPosts(tweetid, outerContainer)
                   // addOverlayToPosts(outerContainer)
                }
            }
        });

        /* handle click action on our button */
        $('.rectbox').click(function(event) {
            //instead of hardcoding the message, we'll send a message to the background script to execute an ajax call to our local server.
            // The server would return the data we are trying to query, which we will show on the dialog
            // For now the value we pass for photo_id is randomized, but we would need an approach to read informatiion from the post to pass on to our API
            var indexArray = ["1", "2", "3"]
            var randomIndex = indexArray[Math.floor(Math.random() * indexArray.length)]
            chrome.runtime.sendMessage({message: "getsource", value: randomIndex}, function(response) {
                //do something here if required
                console.log("Sent message to background")
                // add a spinner here

            })
        });

        //Notify to Background to run the listeners script
        //chrome.runtime.sendMessage({message: "listeners"});
    }

    
    //From time to time, reload list of Twitter users from Tippin. At least once every time a page is reload.
    //chrome.runtime.sendMessage({message: "reloadtdata"}); //TO MUCH LOAD. Maybe after they click on a tippin button

    // Listen for changes with MutationObserver
    // Select the target node (tweet modal)
    var target = $('.stream-items').get(0);
    
    // Create an observer instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //Log
            //console.log('Mutation took place!');
            //Call method to Inject button
            modifyTimeline();
        });
    });

    // Configuration of the observer
    var config = { childList:true, attributes:true, subtree: false, attributeFilter:['stream-items'] };

    // Pass in the target node, as well as the observer options
    observer.observe(target, config);

    //First call on Start
    modifyTimeline();

    /* This function takes in the source information of a photo received from the API in JSON format and constructs the message to be shown in the dialog box */
    function constructDialogText(source, headerText, showInfo=true) {
        if (showInfo == true) {
            var textDiv = `</br></br><ol>
                            <li>Photographer: ${source.photographer_name}</li>
                            <li>Taken on: ${source.time_date}</li>
                            <li>Location: ${source.location}</li>
                            <li>Original caption: ${source.original_caption}</li>
                            <li>Original caption: <a href="${source.original_url}" target="_blank">${source.original_url}</a></li>
                        </ol>`
            $('.msg-body').html(headerText + textDiv)
        } else {
            $('.msg-body').html(headerText)
        }
    }

    /// LISTENER
    // Listen for API callbacks and soft reloads messages
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message == 'readphotosource') {
            //handle the response here
            let positiveMsg = "Following is the source information on the photos:"
            let negativeMsg = "Source information for this photo is unavailable. Please proceed carefully before you share this photo on social media."
            if (request.value != undefined && request.value != "") {
                var source = request.value
                console.log(source.photographer_name)

                constructDialogText(source, positiveMsg, true)
            } else {
                constructDialogText(null, negativeMsg, false)
            }
            showDialog()
        }
        else if(request.message == 'softreload')
        {
            console.log('Doing soft reload...');
            //Stop and reset observer
            observer.disconnect();
            target = $('.stream-items').get(0);
            observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    //Log
                    //console.log('Mutation took place!');
                    //Call method to Inject button
                    modifyTimeline();
                });
            });
            observer.observe(target, config);
            //First try
            modifyTimeline();
        } 
    });
});