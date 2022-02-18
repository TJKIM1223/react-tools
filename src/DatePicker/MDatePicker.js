import React, { useEffect, useState } from "react";
import clsx from 'clsx';



////////////////////////////////////
/// period = 단일날짜, term = 기간
////////////////////////////////////
export function MDatePicker({
        type = "period", 
        date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0], 
        fdateSel
    }) {
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
    const [dateVal, setDateval] = useState(date);
    const [sDate, setSdate] = useState(-1);
    const [eDate, setEdate] = useState(-1);
    //////////
    // page loading시 년도/월값 최신화
    //////////
    useEffect(() => {
        console.log("Reset Date value...", dateVal);
        setCal1date({...cal1date, year: +dateVal.split("-")[0], month: +dateVal.split("-")[1]});
        +dateVal.split("-")[1] === 12 
            ? setCal2date({...cal2date, year: +dateVal.split("-")[0] + 1, month: 1}) 
            : setCal2date({...cal2date, year: +dateVal.split("-")[0], month: +dateVal.split("-")[1] + 1})
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
    //일 0 월 1 화 2 수 3 목 4 금 5 토 6
    function getDaysObj(year, month) {
        const date = new Date(year, month - 1, 1);
        let result = {};
        while (date.getMonth() === month - 1) {
        result[date.getDate()] = date.getDay();
        date.setDate(date.getDate() + 1);
        }
        return result;
    };
    function getDaysArray(year, month) {
        const date = new Date(year, month - 1, 1);
        let result = [];
        while (date.getMonth() === month - 1) {
        result.push(`${date.getDate()}`)
        date.setDate(date.getDate() + 1);
        }
        return result;
    };
    //////////
    // 년도/월값 갱신 시 해당년월 날짜목록 갱신
    //////////
    useEffect(() => {
        setnowDay1list(getDaysObj(cal1date.year, cal1date.month))
        setnowDay2list(getDaysObj(cal2date.year, cal2date.month))
    }, [cal1date, cal2date])

    //////////
    // 빈 칸 없이 달력에 표시하기 위해 전달 날짜 삽입
    //////////
    useEffect(() => {
        cal1date.month === 1
            ? nowday1list[1] === 0
                ? setbfDay1list(getDaysArray(cal1date.year - 1, 12).slice(-7))
                : setbfDay1list(getDaysArray(cal1date.year - 1, 12).slice(-nowday1list[1]))
            : nowday1list[1] === 0
                ? setbfDay1list(getDaysArray(cal1date.year, cal1date.month - 1).slice(-7))
                : setbfDay1list(getDaysArray(cal1date.year, cal1date.month - 1).slice(-nowday1list[1]))
        cal2date.month === 1
            ? nowday2list[1] === 0
                ? setbfDay2list(getDaysArray(cal2date.year - 1, 12).slice(-7))
                : setbfDay2list(getDaysArray(cal2date.year - 1, 12).slice(-nowday2list[1]))
            : nowday2list[1] === 0
                ? setbfDay2list(getDaysArray(cal2date.year, cal2date.month - 1).slice(-7))
                : setbfDay2list(getDaysArray(cal2date.year, cal2date.month - 1).slice(-nowday2list[1]))
    }, [nowday1list, nowday2list])
    //////////
    // 7X6 배열의 남은공간을 다음달의 날짜로 채움
    //////////
    useEffect(() => {
        const cal1Num = 42 - (Object.keys(nowday1list).length + bfday1list.length);
        const cal2Num = 42 - (Object.keys(nowday2list).length + bfday2list.length);
        Object.keys(nowday1list).length + bfday1list.length < 42 
            ? cal1date.month === 12
                ? setafDay1list(getDaysArray(cal1date.year + 1, 1).slice(0, cal1Num))
                : setafDay1list(getDaysArray(cal1date.year, cal1date.month + 1).slice(0, cal1Num))
            : console.log();
        Object.keys(nowday2list).length + bfday2list.length < 42
            ? cal2date.month === 12
                ? setafDay2list(getDaysArray(cal2date.year + 1, 1).slice(0, cal2Num))
                : setafDay2list(getDaysArray(cal2date.year, cal2date.month + 1).slice(0, cal2Num))
            : console.log();
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
    function onRightClick({target:{id}}) {
        if (id === "year") {
            setCal1date({...cal1date, year: cal1date.year + 1})
            setCal2date({...cal2date, year: cal2date.year + 1})
        } else if (id === "month") {
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
    function onLeftClick({target:{id}}) {
        if (id === "year") {
            if (cal1date.year < 1900) {
                alert("최소값입니다!");
                return;
            }
            setCal1date({...cal1date, year: cal1date.year - 1})
            setCal2date({...cal2date, year: cal2date.year - 1})
        } else if (id === "month") {
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
        (startDay.day === -1 && endDay.day === -1)
        ? setStartDay({...startDay, 
                year: date.year,
                month: date.month,
                day: day
            })
        : (startDay.day !== -1 && endDay.day === -1)
            ? (startDay.year=== date.year && startDay.month === date.month && startDay.day === +day)
                ? (
                    setStartDay({...startDay, 
                        day: -1 
                    }) &&
                    setEndDay({...endDay,
                        day: -1
                    })
                )
                : ((startDay.year > date.year) || 
                  (startDay.year === date.year && date.month  < startDay.month) ||
                  (startDay.year === date.year && date.month === startDay.month && startDay.day > +day))
                    ? setStartDay({...startDay, 
                        year: date.year,
                        month: date.month,
                        day: day
                    })
                    : setEndDay({...endDay, 
                        year: date.year,
                        month: date.month,
                        day: day
                    })
            : (startDay.day === -1 && endDay.day !== -1)
                ? ((endDay.year > date.year) || 
                    (endDay.year === date.year && date.month < endDay.month) ||
                    (endDay.year === date.year && date.month === endDay.month && endDay.day > +day))
                    ?  setStartDay({...startDay, 
                        year: date.year,
                        month: date.month,
                        day: day
                        }) 
                    : setEndDay({...endDay,
                            day: -1
                        })
                : (startDay.day !== -1 && endDay.day !== -1)
                    ? (startDay.year=== date.year && startDay.month === date.month && startDay.day === +day)
                        ? (setStartDay({...startDay, 
                            day: -1 
                        }) &&
                        setEndDay({...endDay,
                            day: -1
                        }))
                        : (endDay.year=== date.year && endDay.month === date.month && endDay.day === +day)
                            ? setEndDay({...endDay, 
                                day: -1 
                            })
                            : ((startDay.year > date.year) || 
                                (startDay.year === date.year && date.month  < startDay.month) ||
                                (startDay.year === date.year && date.month === startDay.month && startDay.day > +day))
                                    ? setStartDay({...startDay, 
                                        year: date.year,
                                        month: date.month,
                                        day: day
                                    })
                                    : ((endDay.year < date.year) || 
                                        (endDay.year === date.year && date.month > endDay.month) ||
                                        (endDay.year === date.year && date.month === endDay.month && endDay.day < +day))
                                            ?  setEndDay({...endDay, 
                                                year: date.year,
                                                month: date.month,
                                                day: day
                                            }) 
                                            : setEndDay({...endDay, 
                                                year: date.year,
                                                month: date.month,
                                                day: day
                                            })
                    : console.log()
        // if (startDay.day === -1 && endDay.day === -1) {
        //     setStartDay({...startDay, 
        //         year: date.year,
        //         month: date.month,
        //         day: day
        //     })
        // }  else if (startDay.day !== -1 && endDay.day === -1) {
        //     if (startDay.year=== date.year && startDay.month === date.month && startDay.day === +day) {
        //         setStartDay({...startDay, 
        //             day: -1 
        //         })
        //         setEndDay({...endDay,
        //             day: -1
        //         })
        //     } else if (
        //         (startDay.year > date.year) || 
        //         (startDay.year === date.year && date.month  < startDay.month) ||
        //         (startDay.year === date.year && date.month === startDay.month && startDay.day > +day)    
        //     ) {
        //         setStartDay({...startDay, 
        //             year: date.year,
        //             month: date.month,
        //             day: day
        //         })
        //     } else {
        //         setEndDay({...endDay, 
        //             year: date.year,
        //             month: date.month,
        //             day: day
        //         })
        //     } //
        // } else if (startDay.day !== -1 && endDay.day !== -1) {
        //     if (startDay.year=== date.year && startDay.month === date.month && startDay.day === +day) {
        //         setStartDay({...startDay, 
        //             day: -1 
        //         })
        //         setEndDay({...endDay,
        //             day: -1
        //         })
        //     } else if (endDay.year=== date.year && endDay.month === date.month && endDay.day === +day) {
        //         setEndDay({...endDay, 
        //             day: -1 
        //         })
        //     } else if (
        //         (startDay.year > date.year) || 
        //         (startDay.year === date.year && date.month  < startDay.month) ||
        //         (startDay.year === date.year && date.month === startDay.month && startDay.day > +day)    
        //     ) {
        //         setStartDay({...startDay, 
        //             year: date.year,
        //             month: date.month,
        //             day: day
        //         })
        //     } else if (
        //         (endDay.year < date.year) || 
        //         (endDay.year === date.year && date.month > endDay.month) ||
        //         (endDay.year === date.year && date.month === endDay.month && endDay.day < +day)    
        //     ) {
        //         setEndDay({...endDay, 
        //             year: date.year,
        //             month: date.month,
        //             day: day
        //         })  
        //     } else {
        //         setEndDay({...endDay, 
        //             year: date.year,
        //             month: date.month,
        //             day: day
        //         })
        //     }
        // }
    }
    /////////////
    function outDateClick({target:{id, dataset:{date}}}) {
        console.log(id, "click!");
        ////Period : cal1dt 사용
        ////
        let caldate = {cal1:{year: cal1date.year, month: cal1date.month}, cal2: {year: cal2date.year, month: cal2date.month}};
        id === "bf1"
            ? cal1date.month === 1
                ? caldate = {...caldate, cal1: {...caldate.cal1, year: cal1date.year - 1, month: 12}, cal2: {...caldate.cal2, month: cal2date.month -1}}
                : cal2date.month === 1
                    ? caldate = {...caldate, cal1: {...caldate.cal1, month: cal1date.month - 1}, cal2: {...caldate.cal2, year: cal2date.year - 1, month: 12}}
                    : caldate = {...caldate, cal1: {...caldate.cal1, month: cal1date.month - 1}, cal2: {...caldate.cal2, month: cal2date.month -1}}
            : id === "af1" 
                ? type === "period" 
                    ? cal1date.month === 12
                        ? caldate = {...caldate, cal1: {...caldate.cal1, year: cal1date.year + 1, month: 1}}
                        : caldate = {...caldate, cal1: {...caldate.cal1, month: cal1date.month + 1}}
                    : console.log()
                : id === "af2"
                        ? cal2date.month === 12
                            ? caldate = {...caldate, cal1: {...caldate.cal1, month: cal1date.month + 1}, cal2: {...caldate.cal2, year: cal2date.year + 1, month: 1}}
                            : cal1date.month === 12
                                ? caldate = {...caldate, cal1: {...caldate.cal1, year: cal1date.year + 1, month: 1}, cal2: {...caldate.cal2, month: cal2date.month + 1}}
                                : caldate = {...caldate, cal1: {...caldate.cal1, month: cal1date.month + 1}, cal2: {...caldate.cal2, month: cal2date.month + 1}}
                        : console.log()
        console.log("caldate:", caldate);
        type === "period"
            ? setStartDay({...startDay, year: +caldate.cal1.year, month: +caldate.cal1.month, day: date})
            : console.log();
        setCal1date(caldate.cal1);
        setCal2date(caldate.cal2)
        // if (id === "bf1") {
        //     setCal1date({...cal1date, month: cal1date.month - 1})
        //     bfdate = {...bfdate, month: bfdate.month - 1}
        //     setCal2date({...cal2date, month: cal2date.month - 1})
        //     afdate = {...afdate, month: afdate.month - 1}
        //     if (cal1date.month === 1) {
        //         bfdate = {...bfdate, year: bfdate.year -1, month: 12}
        //         setCal1date({...cal1date, year: cal1date.year - 1, month: 12})
        //         setCal2date({...cal2date, month: cal2date.month - 1})
        //     } 
        //     if (cal2date.month === 1) {
        //         setCal1date({...cal1date, month: cal1date.month - 1})
        //         setCal2date({...cal2date, year: cal2date.year - 1, month: 12})
        //         afdate = {...afdate, year: afdate.year - 1, month: 12}
        //     } 
                
        //     if (type === "period") {
        //         setStartDay({...startDay, 
        //             year: bfdate.year,
        //             month: bfdate.month,
        //             day: date
        //         })
        //     } 
        //     // else if (type === "term") {
        //     //     dateEdit(bfdate, +date)
        //     // }
        // } else if (id === "af1") {
        //     if (type === "period") {
        //         if (cal1date.month === 12) {
        //             setCal1date({...cal1date, year: cal1date.year + 1, month: 1})
        //             bfdate = {...bfdate, year: bfdate.year + 1, month: 1}
        //         } else {
        //             setCal1date({...cal1date, month: cal1date.month + 1})
        //             bfdate = {...bfdate, month: bfdate.month + 1}
        //         }
        //         setStartDay({...startDay,
        //             year: bfdate.year,
        //             month: bfdate.month,
        //             day: date
        //         })
        //     } 
        //     // else if (type === "term") {
        //     //     dateEdit(afdate, +date)
        //     // }
        // } else if (id === "bf2") {
        //     // dateEdit(bfdate, +date)
        // } else if (id === "af2") {
        //     setCal1date({...cal1date, month: cal1date.month + 1})
        //     bfdate = {...bfdate, month: bfdate.month + 1}
        //     setCal2date({...cal2date, month: cal2date.month + 1})
        //     afdate = {...afdate, month: afdate.month + 1}
        //     if (cal1date.month === 12) {
        //         bfdate = {...bfdate, year: bfdate.year + 1, month: 1}
        //         setCal1date({...cal1date, year: cal1date.year + 1, month: 1})
        //         setCal2date({...cal2date, month: cal2date.month + 1})
        //     } 
        //     if (cal2date.month === 12) {
        //         setCal1date({...cal1date, month: cal1date.month + 1})
        //         setCal2date({...cal2date, year: cal2date.year + 1, month: 1})
        //         afdate = {...afdate, year: afdate.year + 1, month: 1}
        //     } 
        //     if (type === "period") {
        //         setStartDay({...startDay,
        //             year: bfdate.year,
        //             month: bfdate.month,
        //             day: date
        //         })
        //     } 
        //     // else if (type === "term") { 
        //     //     dateEdit(afdate, +date)
        //     // }
        // }
    }
    function DateClick({target:{id, dataset:{date}}}) {
        const caldate = (id === "now1" ? cal1date : cal2date);
        type === "period"
            ? startDay.day === -1
                ? setStartDay({...startDay, 
                    year: cal1date.year,
                    month: cal1date.month,
                    day: date
                })
                : (startDay.year=== cal1date.year && startDay.month === cal1date.month && startDay.day === date)
                    ? setStartDay({...startDay, day: -1 })
                    : setStartDay({...startDay, 
                        year: cal1date.year,
                        month: cal1date.month,
                        day: date
                    })
            : dateEdit(caldate, +date)
        // if (type === "period") {   
        //     if (startDay.day === -1) {
        //         setStartDay({...startDay, 
        //             year: cal1date.year,
        //             month: cal1date.month,
        //             day: date
        //         })
        //     } else if (startDay.day !== -1) {
        //         if (startDay.year=== cal1date.year && startDay.month === cal1date.month && startDay.day === date) {
        //             setStartDay({...startDay, day: -1 })
        //         } else {
        //             setStartDay({...startDay, 
        //                 year: cal1date.year,
        //                 month: cal1date.month,
        //                 day: date
        //             })
        //         }
        //     }
        // } else if (type === "term") {
        //     const caldate = id === "now1" ? cal1date : cal2date;
        //     dateEdit(caldate, +date);
        // } else {
        //     console.log("ERROR!");
        // }
    }
    function okClick() {
        type === "period"
            ? startDay.day === -1
                ? alert("날짜가 선택되지않음.")
                : fdateSel(startDay.year + "-" + startDay.month + "-" + startDay.day)
            : (startDay.day === -1 || endDay.day === -1)
                ? alert("날짜가 선택되지않음.")
                : fdateSel(startDay.year + "-" + startDay.month + "-" + startDay.day, endDay.year + "-" + endDay.month + "-" + endDay.day)
        // if (type === "period") {
        //     if (startDay.day === -1) {
        //         alert("날짜가 선택되지않음.");
        //         return;
        //     } 
        //     fdateSel(startDay.year + "-" + startDay.month + "-" + startDay.day)
        // } else if (type === "term") {
        //     if (startDay.day === -1 || endDay.day === -1) {
        //         alert("날짜가 선택되지않음.");
        //         return;
        //     } 
        //     fdateSel(startDay.year + "-" + startDay.month + "-" + startDay.day, endDay.year + "-" + endDay.month + "-" + endDay.day)
        // } 
    }
    function calcelClick() {
        setStartDay({...startDay, 
            day: -1 
        })
        setEndDay({...endDay,
            day: -1
        })
    }
    console.log("DATE: ", dateVal, sDate, eDate, cal1date);
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
                            data-date={+day} 
                            className={clsx("DPoutCell",
                            (type === "period"
                                ? ( startDay.year === (cal1date.month === 1 ? cal1date.year - 1 : cal1date.year) && 
                                    startDay.month === (cal1date.month === 1 ? 12 : cal1date.month - 1) && 
                                    startDay.day === day )
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
                            data-date={+day} 
                            className={clsx("DPCalCell", 
                                (type === "period"
                                ? ( startDay.year === cal1date.year && 
                                    startDay.month === cal1date.month && 
                                    startDay.day === day )
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
                            data-date={+day} 
                            className={clsx("DPoutCell",
                                (type === "period"
                                ? ( startDay.year === (cal1date.month === 12 ? cal1date.year + 1 : cal1date.year) && 
                                    startDay.month === (cal1date.month === 12 ? 1 : cal1date.month + 1) && 
                                    startDay.day === day )
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
                            data-date={+day} 
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
                            data-date={+day} 
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
                            data-date={+day} 
                            className={clsx("DPoutCell",
                                ( startDay.year === (cal2date.month + 1 === 1 ? cal2date.year + 1 : cal2date.year) &&
                                    startDay.month === (cal2date.month + 1 === 1 ? 12 : cal2date.month + 1) && 
                                    startDay.day === +day ) || 
                                  ( endDay.year === (cal2date.month + 1 === 1 ? cal2date.year + 1 : cal2date.year) &&
                                    endDay.month === (cal2date.month + 1 === 1 ? 12 : cal2date.month + 1) && 
                                    endDay.day === +day)
                                        ? "outSelected" 
                                        : ""
                            )} 
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