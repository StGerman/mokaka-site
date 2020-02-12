
setInterval(get_news, 1000);
setInterval(clear_news_line, 600000);
prev_message =  ''

function clear_news_line() {
  logElem.innerHTML = '';
}

function get_news() {
    resp = jQuery.get(
      'news',
      '', 
      parse_response,
      'json'
    );
  return resp;
}

function parse_response(data, status, xhr) {
  console.log('data', data);
  if (prev_message != data.data) {
    if (data.type == 'text') {
      prev_message = data.data
      log(data.data);
    } else {
      prev_message = data.data
      audio_news(data.data);
    }
  }
}

function audio_news(base64_string) {
  audio = document.getElementById('audio_message')
  audio.play
}

function log(msg) {
  logElem.innerHTML += "   ###   " + msg;
  document.documentElement.scrollTop = 99999999;
}
