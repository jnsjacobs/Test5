import React, { useEffect, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import CellButton from "./CheckboxButton";
import ConfigurationSelector from "./ConfigurationSelector";
import { Typeahead } from "react-bootstrap-typeahead";
import { DateRange } from "react-date-range";
import moment from "moment";
import { motion } from "framer-motion";
import Icon from "./Icon";
import Button from "./Button";
import _ from "lodash";

import options from "./data2";

import "react-bootstrap-typeahead/css/Typeahead.css";

class Widget extends React.Component {
  state = {
    parameters: [],
    showCalendar: false,
    test: 1,
    checked: [],
    expanded: [],
    dateStart: "",
    dateEnd: "",
    dateRange: "",
    idSelected: 0,
    cells: [],
    parametersSelected: [],
    cellsSearch: [],
    showSettings: true,
    matches: false,
    handler: undefined,
    focusedMode: 0
  };

  componentDidMount() {
    const endDate = moment();
    const startDate = moment().subtract(5, "days");
    const daterange = `${startDate.format("DD/MM/YYYY")} - ${endDate.format(
      "DD/MM/YYYY"
    )}`;
    const cells = [...options];
    this.sortById(cells);

    let parameters = [];
    for (let i = 0; i < cells.length; i++) {
      parameters.push(...cells[i].parameters);
      cells[i].number = 0;
    }
    parameters = this.removeDuplicateObjectsOnId(parameters);

    this.sortById(parameters);
    const mediaMatch = false;
    // window.matchMedia("(max-width: 600px)");
    // const handler = e => this.setState({ matches: e.matches });
    // mediaMatch.addListener(handler);
    this.setState({
      startDate,
      endDate,
      daterange,
      cells,
      parameters,
      matches: mediaMatch.matches
    });
  }

  handleEvent() {
    this.setState({ showCalendar: !this.state.showCalendar });
  }

  sortById(array) {
    array.sort(function(a, b) {
      if (a.status === b.status) {
        if (a.label > b.label) {
          return 1;
        }
        if (b.label > a.label) {
          return -1;
        }
        return 0;
      } else if (a.status === "selected") return -1;
      else if ((b.status === "selected") & (a.status === "inactive")) return 1;
      else if (a.status === "inactive") return 1;
      else if (b.status === "inactive") return -1;
      // else if (b.status === "inactive") return -1;
      // else if ((a.status === "inactive") & (b.status !== "inactive")) return 1;
      // else if ((a.status === "selected") & (b.status !== "inactive")) return -1;
      // else if ((a.status === "inactive") & (b.status !== "inactive")) return 1;
    });
  }

  removeDuplicateObjectsOnId(array) {
    return array.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  }

  handleSearchSelect(selected) {
    const instance = this._typeahead;
    instance.blur();
    instance.clear();
    const cells = [...this.state.cells];
    const cellsSearch = [...this.state.cellsSearch];
    // console.log(selected,cellsSearch)
    for (let i = 0; i < cellsSearch.length; i++) {
      if (cellsSearch[i].id === selected[0].id) {
        cells.push(selected[0]);
        cellsSearch.splice(i, 1);
      }
    }
    let parameters = [];
    if (cells.length > 0) {
      parameters = cells.find(cell => cell.id === selected[0].id).nodes;
    }
    // console.log(cells, cellsSearch, selected[0].id, parameters);
    this.setState({
      cells,
      cellsSearch,
      idSelected: selected[0].id,
      parameters
    });
  }

  handleSelect(date) {
    const startDate = moment(date.startDate);
    const endDate = moment(date.endDate);
    const daterange = `${startDate.format("DD/MM/YYYY")} - ${endDate.format(
      "DD/MM/YYYY"
    )}`;
    if (this.state.test === 0) {
      this.setState({
        showCalendar: false,
        test: 1,
        daterange,
        startDate,
        endDate
      });
    } else this.setState({ test: 0 });
  }

  handleOnClick(type, id) {
    const cells = _.cloneDeep(this.state.cells);
    const parameters = _.cloneDeep(this.state.parameters);
    if (type === "cell") {
      let activeParameters = [];
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.id === id) {
          if (cell.status === "selected") cell.status = undefined;
          else cell.status = "selected";
        }
        if (cell.status === "selected")
          activeParameters.push(...cell.parameters);
      }
      activeParameters = this.removeDuplicateObjectsOnId(activeParameters);
      for (let i = 0; i < parameters.length; i++) {
        const parameter = parameters[i];
        let active = false;
        for (let j = 0; j < activeParameters.length; j++) {
          if (parameter.id === activeParameters[j].id) {
            active = true;
            break;
          }
        }
        if (active & (parameter.status === "inactive"))
          parameter.status = undefined;
        if (!active & (parameter.status !== "selected"))
          parameter.status = "inactive";
        if (activeParameters.length === 0) parameter.status = undefined;
      }
      // this.sortById(cells);
      // this.sortById(parameters);
    } else if (type === "parameter") {
      if (this.state.focusedMode === 0) {
        let activeCells = [];
        for (let j = 0; j < cells.length; j++) {
          if (cells[j].focused !== true) cells[j].number = 0;
        }
        for (let i = 0; i < parameters.length; i++) {
          const parameter = parameters[i];
          if (parameter.id === id) {
            if (parameter.status === "selected") parameter.status = undefined;
            else parameter.status = "selected";
          }
          if (parameter.status === "selected") {
            for (let j = 0; j < cells.length; j++) {
              const cellParam = cells[j].parameters.find(
                celparam => celparam.id === parameter.id
              );
              if (cellParam && cells[j].focused !== true) {
                cells[j].number = cells[j].number + 1;
                cellParam.status = "selected";
              }
              activeCells.push(cells[j]);
            }
          }
        }
        activeCells = this.removeDuplicateObjectsOnId(activeCells);
        console.log(activeCells);
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          let active = false;
          for (let j = 0; j < activeCells.length; j++) {
            if (cell.id === activeCells[j].id) {
              active = true;
              break;
            }
          }
          // for (let parami = 0; parami < cell.parameters.length; parami++) {
          //   cell.parameters[parami].id
          //   cell.parameters[parami].status = "selected"
          // }
          if (active & (cell.status === "inactive")) cell.status = undefined;
          if (!active & (cell.status !== "selected")) cell.status = "inactive";
          if (activeCells.length === 0) cell.status = undefined;
        }
        // this.sortById(parameters);
        // this.sortById(cells);
      } else {
        // Focus mode is on
        const cellFocused = cells.find(
          cell => cell.id === this.state.focusedMode
        );
        cellFocused.focused = true;
        const parameterSelected = cellFocused.parameters.find(
          param => param.id === id
        );
        if (parameterSelected.status === "selected") {
          parameterSelected.status = undefined;
          cellFocused.number = cellFocused.number - 1;
        } else {
          parameterSelected.status = "selected";
          cellFocused.number = cellFocused.number + 1;
        }
      }
    }
    this.setState({ cells, parameters });
  }

  handleDelete(id) {
    const cells = [...this.state.cells];
    const cellsSearch = _.clonedeep(this.state.cellsSearch);
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].id === id) {
        cellsSearch.push(cells[i]);
        cells.splice(i, 1);
      }
    }
    let idSelected = this.state.idSelected;
    let parameters = [];
    if (this.state.idSelected === id) {
      // console.log(cells, cells[idSelected]);
      // parameters = cells.find(cell => cell.id === idSelected).nodes
    }
    if (cells.length > 0) {
      idSelected = cells[cells.length - 1].id;
      // console.log(cells, cells[idSelected]);
      parameters = cells.find(cell => cell.id === idSelected).nodes;
    }
    if (cells.length === 0) {
      parameters = [];
    }
    this.setState({ cells, cellsSearch, idSelected, parameters });
  }

  handleFocus(type, id) {
    if (this.state.focusedMode === id) {
      this.setState({ focusedMode: 0 });
    } else {
      console.log(id);
      const cells = _.cloneDeep(this.state.cells);
      const cellSelected = cells.find(cell => cell.id === id);
      cellSelected.status = "selected";
      this.setState({ focusedMode: id, cells });
    }
  }

  handleReset() {
    console.log("reset");
    const cells = [...options];
    this.sortById(cells);

    let parameters = [];
    for (let i = 0; i < cells.length; i++) {
      parameters.push(...cells[i].parameters);
      cells[i].number = 0;
    }
    parameters = this.removeDuplicateObjectsOnId(parameters);

    this.sortById(parameters);
    this.setState({
      cells,
      parameters,
      idSelected: 0,
      parameters
    });
  }

  handleRenew() {
    this.setState({ showSettings: false });
  }

  render() {
    return (
      <div>
        <div
          style={{
            height: "152px",
            // width: "100vw",
            background: "black"
          }}
        />
        <motion.div
          style={{
            // width: "100vw",
            // height: "300px",
            display: "grid",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            borderRadius: "5px",
            margin: "5px"
            // gridTemplateRows: ""
          }}
          animate={{
            gridTemplate: this.state.showSettings
              ? this.state.matches
                ? "25px auto auto auto auto / 100%"
                : "32px repeat(2,auto) / 246px 25px auto"
              : "32px repeat(2,auto) / 1px 25px auto"
          }}
        >
          <div
            style={{
              gridColumn: 1 / 1,
              gridRowStart: 1,
              gridRowEnd: 4,
              margin: "5px",
              overflow: "hidden"
            }}
          >
            <div className="wrapper">
              <div className="subwrapper">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    id="Hernieuw"
                    outlined={false}
                    label="Hernieuw"
                    onClick={this.handleRenew.bind(this)}
                  />
                  <Button
                    id="Reset"
                    outlined={true}
                    label="Reset"
                    onClick={this.handleReset.bind(this)}
                  />
                </div>
              </div>
              <div className="subwrapper">
                {/* <h4>Selecteer cel of variabele</h4> */}
                {/* <Typeahead
                  {...this.state}
                  ref={typeahead => (this._typeahead = typeahead)}
                  id="basic-example"
                  onChange={selected =>
                    this.handleSearchSelect.bind(this)(selected)
                  }
                  options={this.state.cellsSearch}
                  placeholder="Selecteer cel of variabele                  "
                  highlightOnlyResult={true}
                /> */}
                <div
                  style={{
                    position: "relative"
                  }}
                >
                  <div
                    style={{
                      // background: "#f0f0f0",
                      position: "relative",
                      top: "0px",
                      left: "0px",
                      padding: "6px",
                      marginTop: "2px",
                      // border: "dashed 1px #bfbfbf",
                      // borderRadius: "5px",
                      height: "85px",
                      overflowY:
                        this.state.focusedMode === 0 ? "scroll" : "hidden"
                      // position: this.state.focusedMode === 0 ? "none" : "fixed",
                    }}
                  >
                    <div
                      style={{
                        background: "white",
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        padding: "6px",
                        marginTop: "2px",
                        opacity: "0.8",
                        // border: "dashed 1px #bfbfbf",
                        // borderRadius: "5px",
                        height: "100%",
                        width: "100%",
                        zIndex: this.state.focusedMode === 0 ? "0" : "20",
                        cursor: "pointer"
                      }}
                      onClick={() => this.setState({ focusedMode: 0 })}
                    />
                    {this.state.cells.map((cell, index) => {
                      return (
                        <CellButton
                          key={cell.id}
                          onClick={this.handleOnClick.bind(this)}
                          onDelete={this.handleDelete.bind(this)}
                          type={"cell"}
                          status={cell.status}
                          label={cell.label}
                          id={cell.id}
                          number={cell.number}
                          onClickIcon={this.handleFocus.bind(this)}
                          focusedMode={this.state.focusedMode}
                        />
                      );
                    })}
                    <div
                      style={{
                        content: "",
                        position: "absolute",
                        zIndex: "1",
                        top: "0px",
                        left: "0px",
                        // background: "black",
                        pointerEvents: "none",
                        backgroundImage:
                          "linear-gradient(to top, rgba(255,255,255, 0),rgba(255,255,255, 1) 90%)",
                        width: "100%",
                        height: "6px"
                        // boxShadow:  "inset 0px -11px 8px -10px #CCC,inset 0px 11px 8px -10px #CCC",
                      }}
                    />
                    <div
                      style={{
                        content: "",
                        position: "absolute",
                        zIndex: "1",
                        bottom: "0px",
                        left: "0px",
                        // background: "black",
                        pointerEvents: "none",
                        backgroundImage:
                          "linear-gradient(to bottom, rgba(255,255,255, 0),rgba(255,255,255, 1) 90%)",
                        width: "100%",
                        height: "6px"
                        // boxShadow:  "inset 0px -11px 8px -10px #CCC,inset 0px 11px 8px -10px #CCC",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="subwrapper">
                {/* <h4>Selecteer cel of variabele</h4> */}
                {/* <Typeahead
                  {...this.state}
                  ref={typeahead => (this._typeahead = typeahead)}
                  id="basic-example"
                  onChange={selected =>
                    this.handleSearchSelect.bind(this)(selected)
                  }
                  options={this.state.cellsSearch}
                  placeholder="Selecteer cel of variabele                  "
                  highlightOnlyResult={true}
                /> */}
                <div
                  style={{
                    position: "relative"
                  }}
                >
                  <div
                    style={{
                      // background: "#f0f0f0",
                      possition: "absolute",
                      bottom: "0px",
                      left: "0px",
                      padding: "6px",
                      marginTop: "2px",
                      // border: "dashed 1px #bfbfbf",
                      // borderRadius: "5px",
                      height: "85px",
                      overflowY: "scroll "
                    }}
                  >
                    {this.state.focusedMode === 0
                      ? this.state.parameters.map((parameter, index) => {
                          return (
                            <CellButton
                              key={parameter.id}
                              onClick={this.handleOnClick.bind(this)}
                              onDelete={this.handleDelete.bind(this)}
                              status={parameter.status}
                              type={"parameter"}
                              label={parameter.label}
                              id={parameter.id}
                            />
                          );
                        })
                      : this.state.cells
                          .find(cell => cell.id === this.state.focusedMode)
                          ["parameters"].map((parameter, index) => {
                            return (
                              <CellButton
                                key={parameter.id}
                                onClick={this.handleOnClick.bind(this)}
                                onDelete={this.handleDelete.bind(this)}
                                status={parameter.status}
                                type={"parameter"}
                                label={parameter.label}
                                id={parameter.id}
                              />
                            );
                          })}
                    <div
                      style={{
                        content: "",
                        position: "absolute",
                        zIndex: "1",
                        top: "0px",
                        left: "0px",
                        // background: "black",
                        pointerEvents: "none",
                        backgroundImage:
                          "linear-gradient(to top, rgba(255,255,255, 0),rgba(255,255,255, 1) 90%)",
                        width: "100%",
                        height: "6px"
                        // boxShadow:  "inset 0px -11px 8px -10px #CCC,inset 0px 11px 8px -10px #CCC",
                      }}
                    />
                    <div
                      style={{
                        content: "",
                        position: "absolute",
                        zIndex: "1",
                        bottom: "0px",
                        left: "0px",
                        // background: "black",
                        pointerEvents: "none",
                        backgroundImage:
                          "linear-gradient(to bottom, rgba(255,255,255, 0),rgba(255,255,255, 1) 90%)",
                        width: "100%",
                        height: "6px"
                        // boxShadow:  "inset 0px -11px 8px -10px #CCC,inset 0px 11px 8px -10px #CCC",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="subwrapper">
                {/* <h4>Periode</h4> */}
                <button
                  onClick={() => this.handleEvent()}
                  type="text"
                  className="form-control"
                >
                  {this.state.daterange}
                </button>
                {this.state.showCalendar ? (
                  <DateRange
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleSelect.bind(this)}
                    calendars={1}
                    theme={{
                      Calendar: {
                        width: "230px",
                        border: "solid 1px #ced4da",
                        borderRadius: "10px",
                        marginTop: "2px"
                      }
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="subwrapper">
                {/* <h4>Resolutie</h4> */}
                <button
                  // onClick={() => this.handleEvent()}
                  type="text"
                  className="form-control"
                >
                  {"1 uur"}
                </button>
              </div>
            </div>
          </div>
          <motion.div
            style={{
              gridColumn: 1 / 2,
              gridRowStart: 1,
              gridRowEnd: 4,
              margin: "5px 0px 5px 0px",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // background: 'grey',
              borderLeft: "1px solid #bfbfbf"
            }}
            animate={{
              borderLeft: this.state.showSettings
                ? "1px solid #bfbfbf"
                : "0px solid #bfbfbf"
            }}
          >
            <motion.i
              style={{ cursor: "pointer", color: "#bfbfbf" }}
              onClick={() =>
                this.setState({ showSettings: !this.state.showSettings })
              }
              animate={{ rotateY: this.state.showSettings ? 0 : 180 }}
              className="fa fa-chevron-left"
            />
          </motion.div>
          <div
            style={{
              gridColumn: this.state.matches ? 1 / 1 : 2 / 3,
              gridRow: this.state.matches ? 1 / 1 : 1 / 2,
              display: "grid",
              gridTemplateColumns: "3fr auto 1fr auto",
              gridTemplateRows: "auto",
              // alignItems: "center",
              margin: "2px"
            }}
          >
            <div />
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-primary">
                Grafiek
              </button>
              <button type="button" className="btn btn-sm btn-primary">
                Tabel
              </button>
              <button type="button" className="btn btn-sm btn-primary">
                Beide
              </button>
            </div>
            <div style={{ width: "50px" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon
                iconClass={"fa fa-close"}
                label="delete"
                clicked={false}
                onClick={() => {
                  console.log("clicked");
                }}
              />
            </div>
          </div>
          <div
            style={{
              gridColumn: 2 / 3,
              gridRowStart: 2,
              gridRowEnd: 3,
              margin: "2px"
              // border: "1px solid grey"
            }}
          />
          <div
            style={{
              gridColumn: 2 / 3,
              gridRowStart: 3,
              gridRowEnd: 3,
              margin: "2px"
              // border: "1px solid grey"
            }}
          />
        </motion.div>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Button id="AddView" outlined={false} label="Voeg toe" />
        </div>
      </div>
    );
  }
}

export default Widget;
