import React from "react";
import * as d3 from "d3";

const Arc = ({ data, onMouseOut, onMouseOver, onClick, ...props }) => {
  const handleOnMouseOver = e => {
    d3.select(e.target).attr("stroke-width", 5);
    onMouseOver(e);
  };

  const handleOnMouseOut = e => {
    d3.select(e.target).attr("stroke-width", 1);
    onMouseOut(e);
  };

  return (
    <path
      onMouseOver={handleOnMouseOver}
      onMouseOut={handleOnMouseOut}
      onClick={onClick}
      d={data}
      stroke="#000000"
      strokeWidth={1}
      {...props}
    />
  );
};

export default Arc;
