### Chrome extension for the image provenance project

* This Google Chrome extension is designed to run on Twitter. It adds a button to all those tweets in the feed that have images or videos in them. These media may have been shared by users directly, or they may have shared links that contain media. By clicking on the button, users can view more information on the source of the photo. As of now we don't have an API that can give use that information, so the messages shown to the users have been hard-coded.
* Steps to launch the extension:
    * Go to the Chrome browser and type in chrome://extensions
    * Enable the developer mode switch on the top right-hand corner
    * Click on Load Unpacked and navigate to the folder that contains the extension code. Click select to enable the extension.

* Code was borrowed from Tippin's chrome extension. Some of that code is being used, some of it is not. This project is still under development, so redundant/unncessary code will be removed as the project matures.

* Added an overlay that appears over images when users hover over them. This works well for single images, but we need to think about scenarios where there could be multiple images in a post, and only one or two may be unsourced. 

* Added an API call to get the source information for the photos. Using typicode.com for the API response and cors-anywhere.herokuapp.com to overcome cross domain restrictions.

* Image overlay is dissabled for now. It will be enabled again when I implement the API call on hovering over an image. Spinner should be added when the API call starts.

