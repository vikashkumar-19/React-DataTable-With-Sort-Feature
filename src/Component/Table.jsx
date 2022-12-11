import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import tableDataCSV from "../Data/tableData.csv";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

function StringToInt(str) {
  return parseInt(str, 10);
}

function sortTable(column, type) {
  if (column === "id") {
    if (type === "ASC") {
      return (a, b) =>
        StringToInt(a[column]) > StringToInt(b[column]) ? 1 : -1;
    } else if (type === "DESC") {
      return (a, b) =>
        StringToInt(b[column]) < StringToInt(a[column]) ? -1 : 1;
    }
    return (a, b) => 1;
  }
  if (type === "ASC") {
    return (a, b) => (a[column] > b[column] ? 1 : -1);
  } else if (type === "DESC") {
    return (a, b) => (b[column] < a[column] ? -1 : 1);
  }
  return (a, b) => 1;
}

export function TableComponent(props = {}) {
  const [CSVData, setCSVData] = useState([]);
  const [currentSort, setCurrentSort] = useState("default");
  const [currentColumn, setCurrentColumn] = useState("default");
  
  var titles = [
    "id",
    "first_name",
    "last_name",
    "email",
    "gender",
    "ip_address",
    "airport code",
    "time",
    "status",
    "mobile",
    "area",
    "show",
    "edit",
  ];

  function onSortChange(col, type) {
    setCurrentSort(type);
    setCurrentColumn(col);
  }

  function parseCSVData() {
    Papa.parse(tableDataCSV, {
      header: true,
      download: true,
      complete: (result) => {
        setCSVData(result.data);
      },
    });
  }



  useEffect(() => {
    parseCSVData();
  }, []);

  
  return (
    <table className="table">
      <thead className="">
        <tr>
          {titles.map(function (obj, ind) {
            return (
              <>
                <th className="d-md-table-cell" key={ind}>
                  <div className="flex">
                    {obj}
                    <Menu
                      menuButton={
						<button className="threedots">  <ThreeDotsVertical></ThreeDotsVertical> </button>
                          
                      }
                      transition
                    >
                      <MenuItem
                        onClick={() => {
                          onSortChange("default", "default");
                        }}
                        disabled={currentSort === "default"}
                      >
                        UnSort
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onSortChange(obj, "ASC");
                        }}
                        disabled={
                          currentSort === "ASC" && currentColumn === obj
                        }
                      >
                        Sort by ASC
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onSortChange(obj, "DESC");
                        }}
                        disabled={
                          currentSort === "DESC" && currentColumn === obj
                        }
                      >
                        Sort by DeSC
                      </MenuItem>
                    </Menu>
                  </div>
                </th>
              </>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {[...CSVData]
          .sort(sortTable(currentColumn, currentSort))
          .map(function (obj, ind) {
            return <RowComponent data={obj} key={ind}/>;
          })}
      </tbody>
    </table>
  );
}

function RowComponent(props = {}) {
  const [activeRow, setactiveRow]=useState(false);
  return (
    <tr style={{backgroundColor:activeRow?"#ffffaa":"white"}} onClick={()=>{setactiveRow(!activeRow);}}>
      <td className=" d-md-table-cell">{props.data.id}</td>
      <td className="d-md-table-cell">{props.data.first_name}</td>
      <td className="d-md-table-cell">{props.data.last_name}</td>
      <td className="d-md-table-cell">{props.data.email}</td>
      <td className=" d-md-table-cell">{props.data.gender}</td>
      <td className=" d-md-table-cell">{props.data.ip_address}</td>
      <td className=" d-md-table-cell">{props.data["airport code"]}</td>
      <td className=" d-md-table-cell">{props.data.time}</td>
      {props.data.status === "true" && (
        <td className="d-none d-md-table-cell" style={{ color: "green" }}>
          {props.data.status}
        </td>
      )}
      {props.data.status === "false" && (
        <td className="d-none d-md-table-cell" style={{ color: "red" }}>
          {props.data.status}
        </td>
      )}
      <td className="d-none d-md-table-cell">{props.data.mobile}</td>
      <td className="d-none d-md-table-cell">{props.data.area}</td>
      <td className="d-none d-md-table-cell">{props.data.show}</td>
      <td className="d-none d-md-table-cell">{props.data.edit}</td>
    </tr>
  );
}
