import React from "react";
import { useSpring, animated } from "react-spring";

const IconLabel = ({ hovered, label }) => {
  const propsLabel = useSpring({
    textAlign: "center",
    left: "50%",
    transform: "translateX(-50%)",
    opacity: hovered ? "1" : "0",
    top: hovered ? "-21px" : "-10px",
    display: "block",
    position: "absolute",
    background: "#929aa3",
    color: "#fff",
    fontSize: "9px",
    letterSpacing: "1px",
    lineHeight: "1",
    textTransform: "uppercase",
    padding: "4px 7px",
    borderRadius: "12px",
    whiteSpace: "nowrap",
    config: { mass: 1, tension: 210, friction: 20 }
  });
  return (
    <animated.span className="iconlabel" style={propsLabel}>
      {label}
    </animated.span>
  );
};

export default IconLabel;
