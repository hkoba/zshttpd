function http_request() {
   return new XMLHttpRequest();
}

function http_call(url, value) {
   var req = http_request();
   req.open("GET", url + "?args=" + escape(value), false);
   req.send(null);
   return req.responseText;
}
