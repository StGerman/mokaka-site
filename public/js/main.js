setInterval(get_news, 3000);
setInterval(clear_news_line, 600000);

player = false;
playerReady = false;

prev_message = "";
curr_inx_message = 0;
audio = new Audio();
audio.addEventListener("ended", audio_ended);
audios = [];

function clear_news_line() {
	logElem.innerHTML = "";
}

function get_news() {
	resp = jQuery.get(
		"news?from=" + curr_inx_message,
		"",
		parse_response,
		"json"
	);

	return resp;
}

function parse_response(data, status, xhr) {
	data = data.data;

	if (data.length > 0) {
		curr_inx_message += data.length;

		for (var i = 0; i < data.length; i++) {
			el = data[i];

			switch (el[1]) {
				case "text":
					return log(el[0]);
				case "video":
					return video(el[0]);
				default:
					return audio_news(el[0]);
			}
		}
	}
}

function audio_news(base64_string) {
	if (audios.length > 0) {
		audios.unshift(base64_string);
	} else {
		audio.muted = "muted";
		audio.src = base64_string;
		audio.play();
		audio.muted = false;
	}
}

function audio_ended(event) {
	if (audios.length > 0) {
		audio.src = audios.pop();
		audio.play();
	}
}

function log(msg) {
	logElem.innerHTML += "\t###\t" + msg;
	document.documentElement.scrollTop = 99999999;
}

function initYoutube() {
	var tag = document.createElement("script");
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName("script")[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player("newroom", {
		width: "800",
		height: "600",
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	event.target.loadVideoById("3cSqRMioRik");
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		event.target.loadVideoById("3cSqRMioRik");
	}
}

function video(videoLink) {
	var params = new URL(videoLink).searchParams;
	var videoId = params.get("v");

	if (player) {
		player.stopVideo();
		player.loadVideoById(videoId);
	}
}

initYoutube();
