
var elements = document.getElementsByClassName('rectbox')
var elementClone = undefined
console.log(elements)

for(var z = 0; z < elements.length; z++) {
    //Trick to remove listeners
  var el = elements[z];
  elementClone = el.cloneNode(true);
  el.parentNode.replaceChild(elementClone, el);

  //Add listener again
  elements[z].addEventListener('click', function(){
    //Get username for that button
    // var userhandle = decodeURI(this.getAttribute("data-username"));
    // var usertwitid = this.getAttribute("data-user-id-twitter");
    var tweetid = this.getAttribute("id");
    console.log(tweetid)
    //Log
    // console.log('Donating to username: ', userhandle);

    //Send message to open prompt with QR code
    chrome.runtime.sendMessage({message: 'buttonClicked', tweet: tweetid});
  });
}