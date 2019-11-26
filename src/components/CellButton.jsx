import React from "react";

const CellButton = ({ id, isSelected, label, onClick, onDelete }) => {
  const buttonClass = isSelected
    ? "btn btn-primary btn-sm"
    : "btn btn-outline-primary btn-sm";
  return (
    <div
      key={id}
      className={buttonClass}
      style={{ marginLeft: "3px", marginBottom: "3px" }}
    >
      <span style={{ cursor: "pointer" }} onClick={event => onClick(id)}>
        {label}
      </span>
      <span className="tab">
        <i
          key={id}
          style={{ cursor: "pointer" }}
          className="fa fa-close"
          onClick={() => onDelete(id)}
        />
      </span>
    </div>
  );
};

export default CellButton;
