

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

//Document ready
$(document).ready(function() {
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

    /* JQUERY DIALOG APPROACH. WORKS FINE, BUT NEEDS CHANGES TO CSS TO RENDER AS REQUIRED. Had to hide the native close button as it was rendering with a text instead of the icon
    Added custom close button */

    var dialog = `<div id="photoinfo-dialog" class="hidden" title="Here is some information on the photo">
                    <p class="msg-body">...</p></br>
                    <div class="footer">Look for our trust signals to identify genuine photos</div>
                </div>`
    $(document.body).append(dialog);

    modifyTimeline();

    /// BUTTON INJECTION
    // Add button to every tweet being shown
    function modifyTimeline(){
        var buttonText = "More info on the photo"
        $(".tweet, .js-tweet").each(function() {
            var username = $(this).attr('data-screen-name');
            var useridtwitter = $(this).attr('data-user-id');
            var tweetid = $(this).attr('data-tweet-id');
            if (username != null) {
                var rectBox = "<button class='rectbox' id='"+tweetid+"'>"+buttonText+"</button>";
                var card2 = $(this).find(".card2")
                if (!card2.hasClass("infoButtonAdded")) {
                    card2.addClass("infoButtonAdded")
                    card2.append(rectBox)
                }

                var outerContainer = $(this).find(".AdaptiveMediaOuterContainer")
                var mediaContainer = $(this).find(".AdaptiveMedia-photoContainer")
                if (mediaContainer.length) {
                    console.log("Photo found in link")
                    if (!outerContainer.hasClass("infoButtonAdded")) {
                        outerContainer.addClass("infoButtonAdded")
                        outerContainer.append(rectBox)
                    }
                }
                
            }
        });

        /* handle click action on our button */
        $('.rectbox').click(function(event) {
            var modalText = ""
            var id = parseInt(event.target.id, 10)
            console.log(id)
            /* RANDOMIZE THE MESSAGE TO BE SHOWN TO THE USER */
            let positiveMsg = "Following is the source information on the photos:"
            let negativeMsg = "Source information for this photo is unavailable. Please proceed carefully before you share this photo on social media."
            let messageArray = [positiveMsg, negativeMsg]
            var randomIndex = Math.floor(Math.random() * messageArray.length)
            if (randomIndex == 0) {
                //the following information would be drawn from the photo attached to the tweet, but for now using hardcoded information
                var textDiv = `<ul>
                                    <li>Photographer: Nina Berman</li>
                                    <li>Taken on: Jan. 20, 2017</li>
                                    <li>Location: Washington DC, USA</li>
                                    <li>Occasion: Political rally</li>
                                </ul>`
                //append this div to the dialog
                $('.msg-body').text(positiveMsg)
                $('.msg-body').append(textDiv)
            } else {
                $('.msg-body').text(negativeMsg)
            }

            //Customize appearance of the dialog. Adding Close button
            $( function() {
                $("#photoinfo-dialog").dialog({
                    modal: true,
                    resizable: false,
                    width: 500,
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
            } );


            // $("#photoModalLongTitle").text("Here is some information on the photos")
            // var text = modalText
            // $(".modal-body").text(text)
            // $(".footer-text").text("Look for our trust signals to identify genuine photos")
            // $('#photoModal').modal('show')
            
            // var alertText = (this.id % 2 == 0) ? "Photos in this tweet are verified to be from a reliable source" : "One or more photos in this tweet are missing source information and may be misleading."
            // alert(alertText)
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

    

    /// LISTENER
    // Listen for soft reloads messages
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        //this condition is not being utilized right now as background script is not getting called
        if (request.message == 'show_alert') {
            console.log("Alert being initiated")
            
        } else if(request.message == 'softreload')
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