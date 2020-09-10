const wsUrl = location.origin.replace(/^(http:)|(https:)/, (...args) => {
  const isHttp = args[1];
  const isHttps = args[2];
  if (isHttp) return 'ws:';
  if (isHttps) return 'wss:';
});
function startWS() {

}
const ws = new WebSocket(wsUrl);
ws.onopen = function() {
  console.log('hello websocket');
}
ws.onmessage = function(evt) {
  console.log( "message: " + evt.data);
  // ws.send('hello');
  ws.close();
};
ws.onclose = function() {
  console.log('close websocket');
}
ws.onerror = function() {
  console.log('error websocket');
}
