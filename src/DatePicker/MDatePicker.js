import React, { useEffect, useState } from "react";
import clsx from 'clsx';



////////////////////////////////////
/// period = 단일날짜, term = 기간
////////////////////////////////////
export function MDatePicker({type = "period", date, fdateSel}) {
    //////////
    // 년/월 값
    //////////
    const [cal1date, setCal1date] = useState({year: '오류' ,month: '오류'});
    const [cal2date, setCal2date] = useState({year: '오류' ,month: '오류'});
    
    //////////
    // 선택날짜 저장값(period)
    // 시작/종료일 저장값(term)
    //////////
    const [startDay, setStartDay] = useState({year: -1 ,month: -1, day: -1});
    const [endDay, setEndDay] = useState({year: -1 ,month: -1, day: -1});
    //////////
    // 현재 날짜값 저장(term 시 왼쪽캘린더 날짜)
    //////////
    const [dateVal, setDateval] = useState(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]);
    const [sDate, setSdate] = useState(-1);
    const [eDate, setEdate] = useState(-1);
    //////////
    // page loading시 년도/월값 최신화
    //////////
    useEffect(() => {
        console.log("Reset Date value...", dateVal);
        setCal1date({...cal1date, year: +dateVal.split("-")[0], month: +dateVal.split("-")[1]})
        if (type === "term") {
            if (+dateVal.split("-")[1] === 12) {
                setCal2date({...cal2date, year: +dateVal.split("-")[0] + 1, month: 1})
            } else {
                setCal2date({...cal2date, year: +dateVal.split("-")[0], month: +dateVal.split("-")[1] + 1})
            }
        }
    }, [])
    //////////
    // 좌측 캘린더 전/현/후 달의 날짜 값
    //////////
    const [bfday1list, setbfDay1list] = useState([])
    const [nowday1list, setnowDay1list] = useState({})
    const [afday1list, setafDay1list] = useState([])
    //////////
    // 우측 캘린더 전/현/후 달의 날짜 값
    //////////
    const [bfday2list, setbfDay2list] = useState([])
    const [nowday2list, setnowDay2list] = useState({})
    const [afday2list, setafDay2list] = useState([])

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
        setnowDay1list(getDaysObj(cal1date.year, cal1date.month))
        setnowDay2list(getDaysObj(cal2date.year, cal2date.month))
    }, [cal1date, cal2date, type])

    //////////
    // 빈 칸 없이 달력에 표시하기 위해 전달 날짜 삽입
    //////////
    useEffect(() => {
        if (cal1date.month === 1) {
            if (nowday1list[1] === 0) {
                setbfDay1list(getDaysArray(cal1date.year - 1, 12).slice(-7))
            } else {
                setbfDay1list(getDaysArray(cal1date.year - 1, 12).slice(-nowday1list[1]))
            }
        } else {
            if (nowday1list[1] === 0) {
                setbfDay1list(getDaysArray(cal1date.year, cal1date.month - 1).slice(-7))
            } else {
                setbfDay1list(getDaysArray(cal1date.year, cal1date.month - 1).slice(-nowday1list[1]))
            }
        }
        if (type === "term") {
            if (cal2date.month === 1) {
                if (nowday2list[1] === 0) {
                    setbfDay2list(getDaysArray(cal2date.year - 1, 12).slice(-7))
                } else {
                    setbfDay2list(getDaysArray(cal2date.year - 1, 12).slice(-nowday2list[1]))
                }
            } else {
                if (nowday2list[1] === 0) {
                    setbfDay2list(getDaysArray(cal2date.year, cal2date.month - 1).slice(-7))
                } else {
                    setbfDay2list(getDaysArray(cal2date.year, cal2date.month - 1).slice(-nowday2list[1]))
                }
            }
        }
    }, [nowday1list, nowday2list])
    //////////
    // 7X6 배열의 남은공간을 다음달의 날짜로 채움
    //////////
    useEffect(() => {
        if (Object.keys(nowday1list).length + bfday1list.length < 42) {
            const restNum = 42 - (Object.keys(nowday1list).length + bfday1list.length);
            if (cal1date.month === 12) {
                setafDay1list(getDaysArray(cal1date.year + 1, 1).slice(0, restNum))
            } else {
                setafDay1list(getDaysArray(cal1date.year, cal1date.month + 1).slice(0, restNum))
            }
        }
        if (Object.keys(nowday2list).length + bfday2list.length < 42) {
            const restNum = 42 - (Object.keys(nowday2list).length + bfday2list.length);
            if (cal2date.month === 12) {
                setafDay2list(getDaysArray(cal2date.year + 1, 1).slice(0, restNum))
            } else {
                setafDay2list(getDaysArray(cal2date.year, cal2date.month + 1).slice(0, restNum))
            }
        }
    }, [bfday1list, bfday2list])
    //////////
    // 선택한 날짜를 date값으로 저장
    //////////
    useEffect(() => {
        setSdate(new Date(startDay.year + "-" + startDay.month + "-" + startDay.day))
        setEdate(new Date(endDay.year + "-" + endDay.month + "-" + endDay.day)) 
    }, [startDay, endDay])

    //////////
    // 날짜array function
    //////////
    function onRightClick(e) {
        if (e.target.id === "year") {
            setCal1date({...cal1date, year: cal1date.year + 1})
            setCal2date({...cal2date, year: cal2date.year + 1})
        } else if (e.target.id === "month") {
            if (cal1date.month === 12) {
                setCal1date({...cal1date, year: cal1date.year + 1, month: 1})
            } else {
                setCal1date({...cal1date, month: cal1date.month + 1})
            } 
            if (cal2date.month === 12) {
                setCal2date({...cal2date, year: cal2date.year + 1, month: 1})
            } else {
                setCal2date({...cal2date, month: cal2date.month + 1})
            }
        } else {
            console.log("ERROR!");
        }
    }
    function onLeftClick(e) {
        if (e.target.id === "year") {
            if (cal1date.year < 1900) {
                alert("최소값입니다!");
                return;
            }
            setCal1date({...cal1date, year: cal1date.year - 1})
            setCal2date({...cal2date, year: cal2date.year - 1})
        } else if (e.target.id === "month") {
            if (cal1date.month === 1) {
                setCal1date({...cal1date, year: cal1date.year - 1, month: 12})
            } else {
                setCal1date({...cal1date, month: cal1date.month - 1})
            }
            if (cal2date.month === 1) {
                setCal2date({...cal2date, year: cal2date.year - 1, month: 12})
            } else {
                setCal2date({...cal2date, month: cal2date.month - 1})
            }
        } else {
            console.log("ERROR!");
        }
    }
    function dateEdit(date, day) {
        if (startDay.day === -1 && endDay.day === -1) {
            setStartDay({...startDay, 
                year: date.year,
                month: date.month,
                day: day
            })
        }  else if (startDay.day !== -1 && endDay.day === -1) {
            if (startDay.year=== date.year && startDay.month === date.month && startDay.day === +day) {
                setStartDay({...startDay, 
                    day: -1 
                })
                setEndDay({...endDay,
                    day: -1
                })
            } else if (
                (startDay.year > date.year) || 
                (startDay.year === date.year && date.month  < startDay.month) ||
                (startDay.year === date.year && date.month === startDay.month && startDay.day > +day)    
            ) {
                setStartDay({...startDay, 
                    year: date.year,
                    month: date.month,
                    day: day
                })
            } else {
                setEndDay({...endDay, 
                    year: date.year,
                    month: date.month,
                    day: day
                })
            }
        } else if (startDay.day !== -1 && endDay.day !== -1) {
            if (startDay.year=== date.year && startDay.month === date.month && startDay.day === +day) {
                setStartDay({...startDay, 
                    day: -1 
                })
                setEndDay({...endDay,
                    day: -1
                })
            } else if (endDay.year=== date.year && endDay.month === date.month && endDay.day === +day) {
                setEndDay({...endDay, 
                    day: -1 
                })
            } else if (
                (startDay.year > date.year) || 
                (startDay.year === date.year && date.month  < startDay.month) ||
                (startDay.year === date.year && date.month === startDay.month && startDay.day > +day)    
            ) {
                setStartDay({...startDay, 
                    year: date.year,
                    month: date.month,
                    day: day
                })
            } else if (
                (endDay.year < date.year) || 
                (endDay.year === date.year && date.month > endDay.month) ||
                (endDay.year === date.year && date.month === endDay.month && endDay.day < +day)    
            ) {
                setEndDay({...endDay, 
                    year: date.year,
                    month: date.month,
                    day: day
                })
            } else {
                setEndDay({...endDay, 
                    year: date.year,
                    month: date.month,
                    day: day
                })
            }
        }
    }
    /////////////
    function outDateClick(e) {
        let bfdate = cal1date;
        let afdate = cal2date;
        if (e.target.id === "bf1") {
            setCal1date({...cal1date, month: cal1date.month - 1})
            bfdate = {...bfdate, month: bfdate.month - 1}
            setCal2date({...cal2date, month: cal2date.month - 1})
            afdate = {...afdate, month: afdate.month - 1}
            if (cal1date.month === 1) {
                bfdate = {...bfdate, year: bfdate.year -1, month: 12}
                setCal1date({...cal1date, year: cal1date.year - 1, month: 12})
                setCal2date({...cal2date, month: cal2date.month - 1})
            } 
            if (cal2date.month === 1) {
                setCal1date({...cal1date, month: cal1date.month - 1})
                setCal2date({...cal2date, year: cal2date.year - 1, month: 12})
                afdate = {...afdate, year: afdate.year - 1, month: 12}
            } 
                
            if (type === "period") {
                setStartDay({...startDay, 
                    year: bfdate.year,
                    month: bfdate.month,
                    day: e.target.dataset.date
                })
            } else if (type === "term") {
                dateEdit(bfdate, +e.target.dataset.date)
             }
        } else if (e.target.id === "af1") {
            if (type === "period") {
                if (cal1date.month === 12) {
                    setCal1date({...cal1date, year: cal1date.year + 1, month: 1})
                    bfdate = {...bfdate, year: bfdate.year + 1, month: 1}
                } else {
                    setCal1date({...cal1date, month: cal1date.month + 1})
                    bfdate = {...bfdate, month: bfdate.month + 1}
                }
                setStartDay({...startDay,
                    year: bfdate.year,
                    month: bfdate.month,
                    day: e.target.dataset.date
                })
            } else if (type === "term") {
                dateEdit(afdate, +e.target.dataset.date)
            }
        } else if (e.target.id === "bf2") {
            dateEdit(bfdate, +e.target.dataset.date)
        } else if (e.target.id === "af2") {
            setCal1date({...cal1date, month: cal1date.month + 1})
            bfdate = {...bfdate, month: bfdate.month + 1}
            setCal2date({...cal2date, month: cal2date.month + 1})
            afdate = {...afdate, month: afdate.month + 1}
            if (cal1date.month === 12) {
                bfdate = {...bfdate, year: bfdate.year + 1, month: 1}
                setCal1date({...cal1date, year: cal1date.year + 1, month: 1})
                setCal2date({...cal2date, month: cal2date.month + 1})
            } 
            if (cal2date.month === 12) {
                setCal1date({...cal1date, month: cal1date.month + 1})
                setCal2date({...cal2date, year: cal2date.year + 1, month: 1})
                afdate = {...afdate, year: afdate.year + 1, month: 1}
            } 
            if (type === "period") {
                setStartDay({...startDay,
                    year: bfdate.year,
                    month: bfdate.month,
                    day: e.target.dataset.date
                })
            } else if (type === "term") { 
                dateEdit(afdate, +e.target.dataset.date)
            }
        }
        console.log(bfdate, afdate);
    }
    function DateClick(e) {
        if (type === "period") {   
            if (startDay.day === -1) {
                setStartDay({...startDay, 
                    year: cal1date.year,
                    month: cal1date.month,
                    day: e.target.dataset.date
                })
            } else if (startDay.day !== -1) {
                if (startDay.year=== cal1date.year && startDay.month === cal1date.month && startDay.day === e.target.dataset.date) {
                    setStartDay({...startDay, day: -1 })
                } else {
                    setStartDay({...startDay, 
                        year: cal1date.year,
                        month: cal1date.month,
                        day: e.target.dataset.date
                    })
                }
            }
        } else if (type === "term") {
            const id = e.target.id === "now1" ? cal1date : cal2date;
            dateEdit(id, +e.target.dataset.date);
        } else {
            console.log("ERROR!");
        }
    }
    function okClick() {
        if (type === "period") {
            if (startDay.day === -1) {
                alert("날짜가 선택되지않음.");
                return;
            } 
            fdateSel(startDay.year + "-" + startDay.month + "-" + startDay.day)
        } else if (type === "term") {
            if (startDay.day === -1 || endDay.day === -1) {
                alert("날짜가 선택되지않음.");
                return;
            } 
            fdateSel(startDay.year + "-" + startDay.month + "-" + startDay.day, endDay.year + "-" + endDay.month + "-" + endDay.day)
        } 
    }
    function calcelClick() {
        setStartDay({...startDay, 
            day: -1 
        })
        setEndDay({...endDay,
            day: -1
        })
    }
    console.log("DATE: ", dateVal, sDate, eDate, sDate < eDate);
    return (
        <div className={clsx("DPbody", type === "term" ? "DPterm" : type === "period" ? "DPperiod" : "DPerror")}>
            <div className="DPheader">
                <div className="DPheadcell">
                    <button id="year" className="DPheadbt" onClick={onLeftClick}>〈</button>
                    <span>
                        {cal1date.year}
                    </span>
                    <button id="year" className="DPheadbt" onClick={onRightClick}>〉</button>
                </div>
                <div className="DPheadcell">
                    <button id="month" className="DPheadbt" onClick={onLeftClick}>〈</button>
                    <span>
                        {cal1date.month}
                    </span>
                    <button id="month" className="DPheadbt" onClick={onRightClick}>〉</button>
                </div>
                {type === "term"
                        ? (<>
                                <div className="DPheadcell">
                                <button id="year" className="DPheadbt" onClick={onLeftClick}>〈</button>
                                <span>
                                    {cal2date.year}
                                </span>
                                <button id="year" className="DPheadbt" onClick={onRightClick}>〉</button>
                                </div>
                                <div className="DPheadcell">
                                <button id="month" className="DPheadbt" onClick={onLeftClick}>〈</button>
                                <span>
                                    {cal2date.month}
                                </span>
                                <button id="month" className="DPheadbt" onClick={onRightClick}>〉</button>
                                </div>
                            </>
                        )
                        : ""
                    }
            </div>
            <div className="DPcalender">
                <div className="DPcalarea">
                    {bfday1list.map((day) => (
                        <button 
                            key={day} 
                            id="bf1" 
                            data-date={day} 
                            className={clsx("DPoutCell",
                            (type === "period"
                                ? ( startDay.year === (cal1date.month === 1 ? cal1date.year - 1 : cal1date.year) && 
                                    startDay.month === (cal1date.month === 1 ? 12 : cal1date.month - 1) && 
                                    startDay.day === +day )
                                        ? "outSelected" 
                                        : ""
                                : ( startDay.year === (cal1date.month - 1 === 1 ? cal1date.year - 1 : cal1date.year) &&
                                    startDay.month === (cal1date.month - 1 === 1 ? 12 : cal1date.month - 1) && 
                                    startDay.day === +day ) || 
                                  ( endDay.year === (cal1date.month - 1 === 1 ? cal1date.year - 1 : cal1date.year) &&
                                    endDay.month === (cal1date.month - 1 === 1 ? 12 : cal1date.month - 1) && 
                                    endDay.day === +day)
                                        ? "outSelected" 
                                        : ""
                            ))} 
                            onClick={outDateClick}
                        >
                            {day}
                        </button>
                    ))}
                    {Object.keys(nowday1list).map((day) => (
                        <button 
                            key={day} 
                            id="now1" 
                            data-date={day} 
                            className={clsx("DPCalCell", 
                                (type === "period"
                                ? ( startDay.year === cal1date.year && 
                                    startDay.month === cal1date.month && 
                                    startDay.day === +day )
                                    ? "selected" 
                                    : ""
                                : (startDay.year === cal1date.year  && startDay.month === cal1date.month  && startDay.day === +day ) || (endDay.year === cal1date.year && endDay.month === cal1date.month && endDay.day === +day)
                                    ? "selected" 
                                    : (sDate < new Date(cal1date.year+"-"+cal1date.month+"-"+day) && new Date(cal1date.year+"-"+cal1date.month+"-"+day) < eDate)
                                        ? "int"
                                        : " "
                                ))} 
                            onClick={DateClick}
                        >
                            {day}
                        </button>
                    ))}
                    {afday1list.map((day) => (
                        <button 
                            key={day} 
                            id="af1" 
                            data-date={day} 
                            className={clsx("DPoutCell",
                                (type === "period"
                                ? ( startDay.year === (cal1date.month === 12 ? cal1date.year + 1 : cal1date.year) && 
                                    startDay.month === (cal1date.month === 12 ? 1 : cal1date.month + 1) && 
                                    startDay.day === +day )
                                        ? "outSelected" 
                                        : ""
                                : ( startDay.year === cal2date.year &&
                                    startDay.month === cal2date.month && 
                                    startDay.day === +day ) || 
                                  ( endDay.year === cal2date.year &&
                                    endDay.month === cal2date.month && 
                                    endDay.day === +day)
                                        ? "outSelected" 
                                        : ""
                            ))} 
                            onClick={outDateClick}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                {type === "term" 
                ? (<div className="DPcalarea DPborder">
                    {bfday2list.map((day) => (
                        <button 
                            key={day} 
                            id="bf2" 
                            data-date={day} 
                            className={clsx("DPoutCell",
                                (( startDay.year === cal1date.year &&
                                    startDay.month === cal1date.month && 
                                    startDay.day === +day ) || 
                                  ( endDay.year === cal1date.year &&
                                    endDay.month === cal1date.month && 
                                    endDay.day === +day)
                                        ? "outSelected" 
                                        : ""
                            ))} 
                            onClick={outDateClick}
                        >
                            {day}
                        </button>
                    ))}
                    {Object.keys(nowday2list).map((day) => (
                        <button 
                            key={day} 
                            id="now2" 
                            data-date={day} 
                            className={clsx("DPCalCell", 
                                (( startDay.year === cal2date.year && startDay.month === cal2date.month  && startDay.day === +day ) || ( endDay.year === cal2date.year && endDay.month === cal2date.month && endDay.day === +day)
                                    ? "selected" 
                                    : (sDate < new Date(cal2date.year+"-"+cal2date.month+"-"+day) && new Date(cal2date.year+"-"+cal2date.month+"-"+day)< eDate)
                                        ? "int"
                                        : ""
                                ))} 
                            onClick={DateClick}
                        >
                            {day}
                        </button>
                    ))}
                    {afday2list.map((day) => (
                        <button 
                            key={day} 
                            id="af2" 
                            data-date={day} 
                            className={clsx("DPoutCell",
                                (type === "period"
                                ? ( startDay.year === (cal2date.month + 1 === 12 ? cal2date.year + 1 : cal2date.year) && 
                                    startDay.month === (cal2date.month + 1 === 12 ? 1 : cal2date.month + 1) && 
                                    startDay.day === +day )
                                        ? "outSelected" 
                                        : ""
                                : ( startDay.year === (cal2date.month + 1 === 1 ? cal2date.year + 1 : cal2date.year) &&
                                    startDay.month === (cal2date.month + 1 === 1 ? 12 : cal2date.month + 1) && 
                                    startDay.day === +day ) || 
                                  ( endDay.year === (cal2date.month + 1 === 1 ? cal2date.year + 1 : cal2date.year) &&
                                    endDay.month === (cal2date.month + 1 === 1 ? 12 : cal2date.month + 1) && 
                                    endDay.day === +day)
                                        ? "outSelected" 
                                        : ""
                            ))} 
                            onClick={outDateClick}
                        >
                            {day}
                        </button>
                    ))}
            </div>)
                : ""
                }
            </div>
            <div className="DPselDate">
                Date:
                {type === "period"
                    ?   startDay.day !== -1 
                            ? startDay.year + "-" + startDay.month + "-" +  startDay.day 
                            : " - - - -"
                    :   (startDay.day !== -1 ? startDay.year + "-" + startDay.month + "-" +  startDay.day : " - - - -") + "~" + (type === "term" && endDay.day !== -1 ? endDay.year + "-" + endDay.month + "-" +  endDay.day : "- - - -")
                }
            </div>
            <div className="DPbtbar">
                <button className="DPbtcell" onClick={okClick}>OK</button>
                <button className="DPbtcell" onClick={calcelClick}>CANCEL</button>
            </div>
        </div>
    )
}