import React from "react";
import "./slider.css";
import Arrow from "./../SVG/arrow-right-circle.svg";

const Slider = ({ question, handleLeftArrow, handleRightArrow }) => {
  return (
    <div className='slider'>
      <div className='wrapper'>
        <div className='box'>{question}</div>
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
  );
};

export default Slider;
