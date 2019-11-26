import React, { useState } from "react";
import IconLabel from "./IconLabel";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Icon = ({ clicked, onClick, iconClass, label, icon }) => {
  const [hovered, setHover] = useState(false);
  const propsIcon = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30px",
    height: "30px",
    borderRadius: "30px",
    cursor: "pointer",
    background: clicked ? "#0061AA" : "white",
    color: clicked ? "white" : "black",
    // boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    position: "relative"
  };
  const propsBackground = {
    background: "#D1E7F6",
    width: "30px",
    height: "30px",
    borderRadius: "50px",
    position: "absolute",
    scale: 0,
    opacity: 0
  };
  return (
    <motion.div
      onHoverStart={() => setHover(!hovered)}
      onHoverEnd={() => {
        setHover(!hovered);
      }}
      onClick={onClick}
      style={propsIcon}
    >
      <motion.div
        style={propsBackground}
        animate={{
          scale: hovered ? 1 : 0,
          opacity: clicked ? 0 : hovered ? 1 : 0
        }}
      />
      {icon ? (
        <FontAwesomeIcon
          icon={icon}
          style={{ color: "inherit", position: "absolute" }}
        />
      ) : (
        <i
          className={iconClass}
          style={{ color: "inherit", position: "absolute" }}
        />
      )}
      <IconLabel hovered={hovered} label={label} />
    </motion.div>
  );
};

export default Icon;
