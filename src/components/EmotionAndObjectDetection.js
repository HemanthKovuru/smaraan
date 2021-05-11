import React, { useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "./emotion.css";

import Mic from "./../SVG/mic.svg";
import Video from "./../SVG/video.svg";
import Arrow from "./../SVG/arrow-right-circle.svg";

import { startVideo, prediction_string } from "./../utils/utilities";

const EmotionAndObjectDetection = () => {
  const [test, setTest] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [objects, setObjects] = useState(0);
  const [step, setStep] = useState("one");
  const [videoPer, setVidePer] = useState(false);
  const [auidoPer, setAudioPer] = useState(false);
  const [scrollNext, setScrollNext] = useState(false);
  const [time, setTime] = useState(0);
  const [minDecibal, setMinDecibal] = useState(0);
  const [maxDecibal, setMaxDecibal] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);

  const questions = ["Question-1", "Question-2", "Question-3"];
  let videoInterval;
  let audioInterval;
  let recorder;

  const handleScroll = () => {
    const terms = document.getElementsByClassName("terms")[0];
    const bottom = Math.round(terms.offsetHeight + terms.scrollTop);
    if (bottom === terms.scrollHeight) {
      setScrollNext(true);
    }
  };

  // handle test
  const handleTest = () => {
    setTest(true);
    setStep("two");
  };

  // analyze emototion and objects
  const handleClick = async () => {
    // get video element
    const video = document.getElementById("video");

    // face api models path
    const MODEl_URL = process.env.PUBLIC_URL + "/models";

    //  load models
    const net = await cocoSsd.load();

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEl_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEl_URL),
    ])
      .then(startVideo)
      .catch((err) => console.log(err));

    // on video play
    video.addEventListener("play", () => {
      videoInterval = setInterval(async () => {
        const predictions = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const obj = await net.detect(video);
        console.log(obj, predictions);
        setObjects(obj.length);
        prediction_string(predictions[0], setEmotion);
      }, 100);
    });
  };

  const getAudio = () => {
    return navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: false,
      },
      (stream) => {
        recorder = new MediaRecorder(stream);
      }
    );
  };

  // audio
  const handleAudio = async () => {
    if (navigator.getUserMedia) {
      // create audio context
      var audiocontext = new AudioContext();
      audiocontext.createAnalyser();

      // get audio from microphone

      const audio = await getAudio();
      console.log(audio);
      const source = audiocontext.createMediaStreamSource(audio);

      //Create analyser node
      const analyserNode = audiocontext.createAnalyser();
      analyserNode.fftSize = 256;

      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      //Set up audio node network
      source.connect(analyserNode);

      const draw = () => {
        //Schedule next redraw
        requestAnimationFrame(draw);

        //Get spectrum data
        analyserNode.getByteFrequencyData(dataArray);
      };
      draw();

      audioInterval = setInterval(() => {
        const min = Math.min(...dataArray);
        const max = Math.max(...dataArray);

        if (min > minDecibal) setMinDecibal(min);
        if (max > maxDecibal) setMaxDecibal(max);
      }, 5000);
    } else {
      console.log("getUserMedia not supported");
    }
  };

  const stopAnalyse = () => {
    if (videoPer) {
      const video = document.querySelector("video");
      const mediaStream = video.srcObject;
      const tracks = mediaStream.getTracks();
      tracks[0].stop();
      video.srcObject = null;
    }

    if (auidoPer) {
      console.log(recorder);
      clearInterval(audioInterval);
      recorder.stream.getAudioTracks().forEach(function (track) {
        track.stop();
      });
    }
    clearInterval(audioInterval);
    clearInterval(videoInterval);
  };

  // continue button
  const handleYes = () => {
    setStep("three");
    if (videoPer) {
      handleClick();
    }
    if (auidoPer) {
      handleAudio();
    }
  };

  // arrow left button
  const handleRightArrow = () => {
    // for question
    if (questionNum !== questions.length - 1) {
      setQuestionNum(questionNum + 1);
    }

    // time
    const currentTime = new Date().getTime();
    setTime(currentTime);
    let min;
    if (minDecibal === 0) {
      min = 1;
    } else {
      min = minDecibal;
    }

    // calculate audio
    let audioDistractions = ((maxDecibal - min) / min) * 100;
    let dist;
    if (audioDistractions > 40) {
      dist = true;
    } else {
      dist = false;
    }

    console.log({
      emotion,
      timeTaken: currentTime - time,
      videoDistranctions: objects,
      audioLevel: audioDistractions,
      audioDistraction: dist,
      minDecibal,
      maxDecibal,
    });
  };

  // arrow right button
  const handleLeftArrow = () => {
    if (questionNum > 0) {
      setQuestionNum(questionNum - 1);
    }
  };

  return (
    <div>
      <video
        className='video'
        autoPlay
        muted
        id='video'
        width='720'
        height='420'></video>
      {test && (
        <div className='middle'>
          {step === "two" && (
            <div>
              <h2>Camera Permissions</h2>
              <div className='permission-container'>
                <div className='permission-container-left'>
                  <img className='icon-per' src={Video} alt='video icon' />
                  <div onScroll={handleScroll} className='terms'>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore?
                    <div className='u-margin-small'>
                      <input
                        onClick={() => setVidePer(!videoPer)}
                        className='checkbox'
                        type='checkbox'
                      />{" "}
                      I agree to the terms and conditions
                    </div>
                  </div>
                </div>
                <div className='permission-container-right'>
                  <img className='icon-per' src={Mic} alt='mic icon' />
                  <div className='terms'>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore? Lorem ipsum, dolor sit amet consectetur adipisicing
                    elit. Labore consequuntur aliquid aut iusto? Omnis adipisci
                    placeat, neque molestias minima illo nostrum laudantium, ad
                    nulla accusamus ducimus aliquam, inventore voluptatibus
                    labore?
                    <div className='u-margin-small'>
                      <input
                        onClick={() => setAudioPer(!auidoPer)}
                        className='checkbox'
                        type='checkbox'
                      />{" "}
                      I agree to the terms and conditions
                    </div>
                  </div>
                </div>
              </div>

              {scrollNext ? (
                <button className='btn btn-cont' onClick={handleYes}>
                  Continue
                </button>
              ) : (
                <div className='btn-cont'>Please read tems and conditions</div>
              )}
            </div>
          )}
        </div>
      )}

      {step === "three" && (
        <div>
          <div className='slider'>
            <div className='wrapper'>
              <div className='box'>{questions[questionNum]}</div>
            </div>
            <img
              onClick={handleLeftArrow}
              className='arrow arrow1'
              src={Arrow}
              alt='arrow'
            />
            <img
              onClick={handleRightArrow}
              className='arrow arrow2'
              src={Arrow}
              alt='arrow'
            />
          </div>
          <button onClick={stopAnalyse}>stop</button>
        </div>
      )}

      {!test && (
        <div className='middle'>
          <button onClick={handleTest} className='btn btn-test'>
            Take Test
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionAndObjectDetection;
