import React from "react";

const Button = ({ id, label, onClick, outlined }) => {
  const buttonClass = !outlined
    ? "btn btn-primary btn-sm"
    : "btn btn-outline-primary btn-sm";
  return (
    <div
      key={id}
      className={buttonClass}
      style={{ marginLeft: "3px", marginBottom: "3px", cursor: "pointer" }}
      onClick={event => onClick(id)}
    >
      <span>{label}</span>
    </div>
  );
};

export default Button;
