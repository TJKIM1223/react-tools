import react, { useEffect, useState } from "react";
import { TableComp } from "./ReactTable/ReactTable";
import { MDatePicker } from "./DatePicker/MDatePicker";
import { data, Column } from "./ReactTable/data";


function App() {
  const [tData, setTdata] = useState(data);
  const [mainsc, Setmainsc] = useState("TableComp");
  const [period, setPeriod] = useState(-1);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  // useEffect(() => {
  //   setTdata(data);
  // }, [data]);
  function TableClick() {
    // navigator.clipboard.writeText("Copy this text to clipboard").then(
    //   function () {
    //     console.log("SUCCESS!");
    //   },
    //   function () {
    //     console.log("FAILED...");
    //   }
    // );
    Setmainsc("TableComp")
  }
  function MdateClick() {
    //read clipboard and paste data
    // navigator.clipboard.readText().then((table) => console.log(table));
    Setmainsc("MDatePicker")
  }
  function ColorClick() {
    //add new data
  }
  function periodClick(value) {
    setPeriod(value)
  }
  function termClick(start, end) {
    setStart(start)
    setEnd(end)
  }
  return (
    <div className="App">
      <button onClick={TableClick}>TABLE</button>
      <button onClick={MdateClick}>MDATE</button>
      <button onClick={ColorClick}>COLOR</button>
      <div> period: {period}</div>
      <div> start: {start} end: {end} </div>
      {mainsc === "TableComp"
        ? <TableComp value={Object.values(tData)} column={Column} />
        : mainsc === "MDatePicker"
          ? <div>
              <MDatePicker fdateSel={periodClick}/>
              <MDatePicker type="term" fdateSel={termClick}/>
            </div>
          : <TableComp value={Object.values(tData)} column={Column} />}
    </div>
  );
}

export default App;
