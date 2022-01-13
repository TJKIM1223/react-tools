import React, { useEffect, useState } from "react";
import clsx from 'clsx';



export function DatePicker({type = "period", fdateSel}) {
    //////////
    // 년/월 값
    //////////
    const [monthlist, setMonthlist] = useState("년도를 설정해주세요.")
    const [yearlist, setYearlist] = useState("----")
    //////////
    // 현재 날짜값 저장
    //////////
    const [dateVal, setDateval] = useState(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]);
    //////////
    // page loading시 년도/월값 최신화
    //////////
    useEffect(() => {
        console.log("Reset Date value...", dateVal);
        setYearlist(+dateVal.split("-")[0]);
        setMonthlist(+dateVal.split("-")[1]);
    }, [])
    //////////
    // 전/현/후 달의 날짜 값
    //////////
    const [bfdaylist, setbfDaylist] = useState([])
    const [nowdaylist, setnowDaylist] = useState({})
    const [afdaylist, setafDaylist] = useState([])

    const [startDay, setStartDay] = useState(-1);
    const [endDay, setEndDay] = useState(type === "period" ? "" : -1);
    //////////
    // 날짜계산Function
    //////////
    const getDaysObj = (function() {
        return (year, month) => {
          const monthIndex = month - 1
          const date = new Date(year, monthIndex, 1);
          console.log(date);
          const result = {};
          while (date.getMonth() === monthIndex) {
            result[date.getDate()] = date.getDay();
          date.setDate(date.getDate() + 1);
          }
          return result;
        }
    })();
    const getDaysArray = (function() {
        //일 0 월 1 화 2 수 3 목 4 금 5 토 6
        return (year, month) => {
          const monthIndex = month - 1
          const date = new Date(year, monthIndex, 1);
          const result = [];
          while (date.getMonth() === monthIndex) {
            result.push(`${date.getDate()}`)
          date.setDate(date.getDate() + 1);
          }
          return result;
        }
    })();
    //////////
    // 년도/월값 갱신 시 해당년월 날짜목록 갱신
    //////////
    useEffect(() => {
        setnowDaylist(getDaysObj(yearlist, monthlist))
    }, [yearlist, monthlist])

    //////////
    // 빈 칸 없이 달력에 표시하기 위해 전달 날짜 삽입
    //////////
    useEffect(() => {
        if (monthlist === 1) {
            if (nowdaylist[1] === 0) {
                setbfDaylist(getDaysArray(yearlist - 1, 12).slice(-7))
            } else {
                setbfDaylist(getDaysArray(yearlist - 1, 12).slice(-nowdaylist[1]))
            }
        } else {
            if (nowdaylist[1] === 0) {
                setbfDaylist(getDaysArray(yearlist, monthlist - 1).slice(-7))
            } else {
                setbfDaylist(getDaysArray(yearlist, monthlist - 1).slice(-nowdaylist[1]))
            }
        }
    }, [nowdaylist])
    //////////
    // 7X6 배열의 남은공간을 다음달의 날짜로 채움
    //////////
    useEffect(() => {
        if (Object.keys(nowdaylist).length + bfdaylist.length < 42) {
            const restNum = 42 - (Object.keys(nowdaylist).length + bfdaylist.length);
            if (monthlist === 12) {
                setafDaylist(getDaysArray(yearlist + 1, 1).slice(0, restNum))
            } else {
                setafDaylist(getDaysArray(yearlist, monthlist + 1).slice(0, restNum))
            }
        }
    }, [bfdaylist])
    //////////
    // 날짜array function
    //////////
    function onRightClick(e) {
        if (e.target.id === "year") {
            setYearlist(yearlist + 1)
        } else if (e.target.id === "month") {
            if (monthlist === 12) {
                setYearlist(yearlist + 1)
                setMonthlist(1);
                return;
            }
            setMonthlist(monthlist + 1)
        } else {
            console.log("ERROR!");
        }
        console.log("UP!");
    }
    function onLeftClick(e) {
        if (e.target.id === "year") {
            if (yearlist < 1900) {
                alert("최소값입니다!");
                return;
            }
            setYearlist(yearlist - 1)
        } else if (e.target.id === "month") {
            if (monthlist === 1) {
                setYearlist(yearlist-1)
                setMonthlist(12);
                return;
            }
            setMonthlist(monthlist - 1)
        } else {
            console.log("ERROR!");
        }
        console.log("DOWN!");
    }
    function outDateClick(e) {
        if (e.target.id === "bf") {
            if (monthlist === 1) {
                setYearlist(yearlist - 1);
                setMonthlist(12);
            } else {
                setMonthlist(monthlist - 1)
            }
            if (type === "period") {
                setStartDay(e.target.dataset.date)
            } else { }
        } else if (e.target.id === "af") {
            if (monthlist === 12) {
                setYearlist(yearlist + 1);
                setMonthlist(1);
            } else {
                setMonthlist(monthlist + 1)
            }
            if (type === "period") {
                setStartDay(e.target.dataset.date)
            } else { }
        }
    }
    function DateClick(e) {
        if (startDay === -1) {
            setStartDay(e.target.dataset.date)
        } else if (startDay !== -1 && type === "period") {
            if (startDay === e.target.dataset.date) {
                setStartDay(-1);
                return;
            }
            setStartDay(e.target.dataset.date)
        } else if (startDay !== -1 && type !== "period") {
            setEndDay(e.target.dataset.date)
        } else {
            console.log("ERROR!");
        }
    }
    console.log("DATE: ", dateVal, bfdaylist, afdaylist,);
    return (
        <div className="DPbody DPperiod">
            <div className="DPheader">
                <div className="DPheadcell">
                    <button id="year" className="DPheadbt" onClick={onLeftClick}>〈</button>
                    <span>{yearlist}</span>
                    <button id="year" className="DPheadbt" onClick={onRightClick}>〉</button>
                </div>
                <div className="DPheadcell">
                    <button id="month" className="DPheadbt" onClick={onLeftClick}>〈</button>
                    <span>{monthlist}</span>
                    <button id="month" className="DPheadbt" onClick={onRightClick}>〉</button>
                </div>
            </div>
            <div className="DPcalender">
                <div className="DPcalarea">
                {bfdaylist.map((day) => (
                    <button key={day} id="bf" data-date={day} className="DPoutCell" onClick={outDateClick}>
                        {day}
                    </button>
                ))}
                {Object.keys(nowdaylist).map((day) => (
                    <button key={day} id="now" data-date={day} className={clsx("DPCalCell", (type === "period" && startDay===day ? "selected" : ""))} onClick={DateClick}>
                        {day}
                    </button>
                ))}
                {afdaylist.map((day) => (
                    <button key={day} id="af" data-date={day} className="DPoutCell" onClick={outDateClick}>
                        {day}
                    </button>
                ))}
                </div>
            </div>
            <div className="DPselDate">
                {startDay === -1 ? "" : "Date:" + yearlist + "-" + monthlist + "-" +  startDay}
            </div>
            <div className="DPbtbar">
                <button className="DPbtcell">OK</button>
                <button className="DPbtcell">CANCEL</button>
            </div>
        </div>
    )
}