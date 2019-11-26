import React from "react";
import { motion } from "framer-motion";

const CellButton = ({
  value,
  status,
  id,
  label,
  onClick,
  type,
  number,
  onClickIcon,
  focusedMode
}) => {
  let buttonClass = "btn btn-outline-primary btn-sm";
  if (status === "selected") buttonClass = "btn btn-primary btn-sm";
  else if (status === "inactive")
    buttonClass = "btn btn-outline-secondary btn-sm";
  const list = {
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: (id + 1) * 0.02
      }
    },
    hidden: { opacity: 0, scale: 0 }
  };
  console.log(type, id, status, status !== "selected" ? "#ffffff" : "#0061AA");
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={list}
      key={value + id}
      // className={buttonClass}
      style={{
        border: "1px solid #0061AA",
        borderRadius: "5px",
        marginLeft: "3px",
        marginBottom: "3px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: "0px",
        zIndex: focusedMode === id ? "50" : "10",
        cursor: "pointer",
        backgroundColor: status === "selected" ? "#0061AA" : "white",
        color: status !== "selected" ? "#0061AA" : "white"
      }}
      whileTap={{ scale: 0.9 }}
      // whileHover={{
      //   backgroundColor: status === "selected" ? "#ffffff" : "#0061AA",
      //   color: status !== "selected" ? "#ffffff" : "#0061AA"
      // }}
    >
      <div
        style={{ height: "100%", padding: "3px" }}
        onClick={event => onClick(type, id)}
      >
        <span>{label}</span>
      </div>
      {type === "cell" && (
        <motion.div
          style={{
            color: status !== "selected" ? "#0061AA" : "white",
            backgroundColor: status === "selected" ? "#0061AA" : "white",
            // margin: "4px",
            // width: "20px",
            padding: "0px 6px 0px 6px",
            margin: "2px 2px 2px 2px",
            border: "solid 1px",
            borderRadius: "20px"
          }}
          onClick={() => onClickIcon(type, id)}
          whileHover={{ scale: 0.9 }}
        >
          {number}
        </motion.div>
      )}
      {status && (
        <div
          style={{
            width: "10px",
            display: "inline-block",
            marginRight: "10px"
          }}
        >
          <i
            key={id}
            style={{ cursor: "pointer" }}
            className={status === "selected" ? "fa fa-check" : "fa fa-plus"}
          />
        </div>
      )}
    </motion.div>
  );
};

export default CellButton;
