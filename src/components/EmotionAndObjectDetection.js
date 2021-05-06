import React, { useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Slider from "./Slider";
import "./emotion.css";

import Mic from "./../SVG/mic.svg";
import Video from "./../SVG/video.svg";

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

  const questions = ["Question-1", "Question-2", "Question-3"];

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
    const MODEL_URL = process.env.PUBLIC_URL + "/models";

    //  load models
    const net = await cocoSsd.load();

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])
      .then(startVideo)
      .catch((err) => {
        console.log(err);
      });

    // on video play
    video.addEventListener("play", () => {
      setInterval(async () => {
        const predictions = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const obj = await net.detect(video);
        setObjects(obj.length);

        prediction_string(predictions[0], setEmotion);
      }, 100);
    });
  };

  // continue button
  const handleYes = () => {
    setStep("three");
    if (videoPer) {
      handleClick();
    }
  };

  // arrow left button
  const handleRightArrow = () => {
    const doc = document.querySelector(".slider");
    doc.scrollLeft = doc.scrollLeft + window.screen.width;
    const currentTime = new Date().getTime();
    setTime(currentTime);
    console.log({
      emotion,
      timeTaken: currentTime - time,
      distranctions: objects,
    });
  };

  // arrow right button
  const handleLeftArrow = () => {
    const doc = document.querySelector(".slider");
    doc.scrollLeft = doc.scrollLeft - window.screen.width;
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
          <Slider
            handleRightArrow={handleRightArrow}
            handleLeftArrow={handleLeftArrow}
            questions={questions}
          />
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
