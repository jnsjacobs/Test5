import React, { useState, createRef } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import CheckboxButton from "./CheckboxButton";
import options from "./data2";
import Icon from "./Icon";
import { motion, AnimatePresence } from "framer-motion";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";

const ConfigurationSelector = ({
  parameters,
  selectedParameters,
  checked,
  onCheck
}) => {
  const [filter, setFilter] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectCounter, setSelectCounter] = useState(0);
  let _typeahead = createRef();
  const handleClick = id => {
    if (selectAll) setSelectAll(false);
    const index = checked.findIndex(
      item => item.value === parameters[id].value
    );
    // check if index is founded in checked
    if (index === -1) {
      if (selectCounter + 1 === parameters.length) setSelectAll(true);
      onCheck([...checked, parameters[id]]);
      setSelectCounter(selectCounter + 1);
    } else {
      setSelectCounter(selectCounter - 1);
      checked.splice(index, 1);
      onCheck([...checked]);
    }
  };
  const handleSelectAll = () => {
    if (selectAll) {
      for (let i = parameters.length - 1; i >= 0; i--) {
        let indexChecked = checked.findIndex(
          item => parameters[i].value === item.value
        );
        if (indexChecked > -1) {
          checked.splice(indexChecked, 1);
        }
      }
      setSelectCounter(selectCounter - parameters.length);
    } else {
      for (let i = parameters.length - 1; i >= 0; i--) {
        if (!checked.some(item => parameters[i].value === item.value)) {
          checked.push(parameters[i]);
        }
      }
      setSelectCounter(selectCounter + parameters.length);
    }
    setSelectAll(!selectAll);
    onCheck([...checked]);
  };
  return (
    <React.Fragment>
      {/* {selectCounter} */}
      <div
        style={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center"
          // margin: "5px"
        }}
      >
        <span style={{ marginTop: 0, fontSize: "13px" }}>Configuratie</span>
        <div style={{ display: "flex", height: "30px" }}>
          {parameters.length > 0 && (
            <div
              style={{
                alignItems: "center",
                display: "flex",
                marginLeft: "5px"
              }}
            >
              {/* <Icon
                iconClass={"fa fa-search"}
                label="search"
                clicked={filter}
                onClick={() => {
                  setFilter(!filter);
                  console.log(_typeahead);
                  _typeahead.clear();
                }}
              /> */}
              <Icon
                icon={faCheckDouble}
                label="select all"
                clicked={selectAll}
                onClick={handleSelectAll}
              />
            </div>
          )}{" "}
        </div>
      </div>
      <AnimatePresence>
        {filter && (
          <motion.div
            animate={{ height: "40px" }}
            exit={{ height: "0px" }}
            style={{
              height: "0px",
              overflow: "hidden"
            }}
          >
            <Typeahead
              // {...this.state}
              ref={_typeahead}
              id="parameter-filter"
              // onChange={selected => this.handleSearchSelect.bind(this)(selected)}
              options={options}
              placeholder="Choose a cell..."
              highlightOnlyResult={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{
          // background: "#f0f0f0",
          padding: "6px",
          // marginTop: "5px",
          // border: "dashed 1px #bfbfbf",
          // borderRadius: "5px",
          height: "80px",
          overflow: "hidden",
          overflowY: "scroll",
          transition: {
            when: "beforeChildren"
          }
        }}
        animate={{ height: filter ? "40px" : "80px" }}
      >
        {parameters.length === 0 ? (
          <span style={{ fontSize: "13px", color: "#bfbfbf" }}>
            Selecteer cel of variabele...
          </span>
        ) : (
          parameters.map((param, index) => {
            return (
              <CheckboxButton
                id={index}
                value={param.value}
                isSelected={checked.some(item => param.value === item.value)}
                label={param.label}
                onClick={handleClick.bind(this)}
              />
            );
          })
        )}
      </motion.div>
    </React.Fragment>
  );
};

export default ConfigurationSelector;
