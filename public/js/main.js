setInterval(get_news, 3000);
setInterval(clear_news_line, 600000);

player = false;
playerReady = false;

prev_message = "";
curr_inx_message = 0;
audio = new Audio();
audio.addEventListener("ended", audio_ended);
audios = [];
firevideoids = [
  "Ams_4N0MecY",
  "3cSqRMioRik",
  "tXug39t8lx4",
  "Va54xMmvKKI",
  "rw9-Nd6u5KA",
  "rPVz3aJtYYs",
  "2Z-ffUnxcLs",
  "26k46kr-PFw",
  "SUBO8YPmGdE",
  "HzqW5CfKVLE"
];

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
    width: "1024",
    height: "768",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  var videoId = firevideoids[Math.floor(Math.random() * firevideoids.length)];
  event.target.loadVideoById(videoId);
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    var videoId = firevideoids[Math.floor(Math.random() * firevideoids.length)];
    event.target.loadVideoById(videoId);
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

particlesJS("particles-js", {
  particles: {
    number: { value: 160, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 }
    },
    opacity: {
      value: 1,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0, sync: false }
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: false, speed: 4, size_min: 0.3, sync: false }
    },
    line_linked: {
      enable: false,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 600 }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "bubble" },
      onclick: { enable: true, mode: "repulse" },
      resize: true
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 3 },
      repulse: { distance: 400, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
});
