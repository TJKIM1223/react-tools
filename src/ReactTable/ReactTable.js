import React, { useEffect, useState } from "react";

//////////////////////////////////////////////////////////////////////////////////////
///table cell
//////////////////////////////////////////////////////////////////////////////////////
function TableCell({ type = "none", index, value, width, fchange, fClick }) {
  const [cell, setCell] = useState(<td></td>);
  useEffect(() => {
    if (type === "value") {
      setCell(
        <td onClick={fClick} id={index} className="RTCell" style={{ width: width }}>{value}</td>
      );
    } else if (type === "text") {
      setCell(
        <td onClick={fClick} id={index} className="RTCell" style={{ width: width }}>
          <input
            type="text"
            value={value}
            id={index}
            className="RTinput"
            onChange={fchange}
          />
        </td>
      );
    } else {
      setCell(
        <td style={{ border: "0.5px solid black", width: width }}>ERROR</td>
      );
    }
  }, [type, value, width, index, fchange, fClick]);
  return cell;
}


//////////////////////////////////////////////////////////////////////////////////////
///table header
//////////////////////////////////////////////////////////////////////////////////////
function TableHeader({column = "none"}) {
    const [cell, setCell] = useState(
    <tr>
        <th>
            NULL
        </th>
    </tr>
    );
    useEffect(() => {
        if (column !== "none") {
            setCell
        (
            <tr className="RTheader">
            {column.map((col, key) => (
                <th
                key={key}
                style={{ width: col.width }}
                className="RTheadcell"
                >
                {col.text}
                </th>
            ))}
            </tr>
        )
        } else {
            setCell(
                <tr>
                    <th>
                        DATA ERROR
                    </th>
                </tr>
            )
        }
    }, [column])
    return cell;
}

//////////////////////////////////////////////////////////////////////////////////////
///table component
//////////////////////////////////////////////////////////////////////////////////////
export function TableComp({ column = null, value = null }) {
  const [cellVal, setCellVal] = useState(value);
  useEffect(() => {
    setCellVal(value);
  }, [value]);
  function fonChange(e) {
    console.log("onCHANGE: ", e.target.id, cellVal);
  }
  function fRowClick(e) {
    console.log("onclick: ", e.target.id, cellVal); }
  return (
    <table
        className="RTtable"
    >
      <thead>
        <TableHeader column={column}/>
      </thead>
      {column !== null && cellVal !== null ? (
        <tbody className="RTbody">
          {cellVal.map((val, key) => (
            <tr className="RTrow" key={key}>
              {column.map((col, key) => (
                <TableCell
                  key={key}
                  index={val["id"]}
                  type={col.type}
                  value={val[col.id]}
                  width={col.width}
                  fchange={fonChange}
                  fClick={fRowClick}
                />
              ))}
            </tr>
          ))}
        </tbody>
      ) : (
        "NO DATA"
      )}
    </table>
  );
}
