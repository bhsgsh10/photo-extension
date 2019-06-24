// make the ajax call here and send the response to content script
var url = "https://cors-anywhere.herokuapp.com/https://my-json-server.typicode.com/bhsgsh10/provenance-data/source_info/" + id
$.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    crossDomain: true,
    contentType: 'application/json',
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    },
    success: function(result){
        //send message back to content script
        chrome.runtime.sendMessage({message:"readsource", value: result})
    },
    error: function(request, status, error) {
        chrome.runtime.sendMessage({message:"readsource", value: ""})
        console.log("Error");
    }
})
