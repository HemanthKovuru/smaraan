export const startVideo = () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { video: true },
      function (stream) {
        var video = document.querySelector("video");
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
          video.play();
        };
      },
      function (err) {
        console.log(err.name);
      }
    );
  } else {
    console.log("getUserMedia not supported");
  }
};

export const startAudio = () => {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: true },
      (stream) => {
        var audio = document.querySelector("#audio");
        audio.srcObject = stream;
        audio.onloadedmetadata = (e) => {
          audio.play();
        };
      },
      (err) => {
        console.log(err.name);
      }
    );
  } else {
    console.log("getUserMedia not supported");
  }
};

// get emotion from obj
export const prediction_string = (obj, setEmotion) => {
  if (!obj) return "neutral";
  obj = obj.expressions;
  const keys = Object.keys(obj);
  const values = Object.values(obj);
  const indexOfMax = (arr) => {
    if (arr.length === 0) {
      return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  };
  const emotion = keys[indexOfMax(values)];
  setEmotion(emotion);
  return emotion;
};
