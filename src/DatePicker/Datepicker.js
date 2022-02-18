import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment-lunar";

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

////////
// 날짜 표시 Comp
////////
function DateComp({day = 0, type = "disable", fclick}) {
    //////////////////////
    // disable (전/후달 날짜)
    // normal (현재 달 날짜)    
    // selected (시작/종료 날짜)
    //////////////////////
        
        
    const [cltype, setCltype] = useState("DPoutCell");
    useEffect(() => { setCltype(
        type === "normal"
            ? "DPCalCell"
            : type === "selected"
                ? "DPCalCell selected" 
                : type === "int" 
                    ? "DPCalCell int"
                    : type === "holiday"
                        ? "DPCalCell holiday"
                        : type === "Hselected"
                            ? "DPCalCell Hselected" 
                            : type === "Hint"
                                ? "DPCalCell Hint" 
                                : "DPoutCell" 
    )}, [type])
    return (
        <button data-date={day} className={cltype} onClick={fclick}>
            {day}   
        </button>
    )
} 
    
////////
// 달력 표시 Comp(date type분류, onClick func )
////////
//function CalenderComp({date, fpick, fonClk}) {
function CalenderComp({date, pick, holiday = [], fonClk}) {
    const [bfdaylist, setbfday] = useState([]);
    const [caldaylist, setCalday] = useState({});
    const [afdaylist, setafday] = useState([]);
    //////////
    // 년도/월값 갱신 시 해당년월 날짜목록 갱신
    //////////
    useEffect(() => { 
            setCalday(getDaysObj(date.year, date.month))
        }, [date])
    useEffect(()=> {
        let index = caldaylist[1] === 0 ? -7 : -caldaylist[1]
        date.month === 1    
            ? setbfday(getDaysArray(date.year - 1, 12).slice(index))
            : setbfday(getDaysArray(date.year, date.month - 1).slice(index))
        const cal1Num = 42 - (Object.keys(caldaylist).length + (-index));
        date.month === 12
            ? setafday(getDaysArray(date.year + 1, 1).slice(0, cal1Num))    
            : setafday(getDaysArray(date.year, date.month + 1).slice(0, cal1Num))
    }, [caldaylist, date])
    function dateClick(e) {
        fonClk(date.year, date.month, e.target.dataset.date)
    }
    function getStyle(day) {
        let pickday = ""
        let holidaychk = holiday.includes(day);
        (caldaylist[day] === 0 || holidaychk)
                ? pick.start === day || pick.end === day
                    ? pickday = "Hselected"
                    : pick.from <= day && pick.to >= day
                        ? pickday = "Hint"
                        : pickday = "holiday"
                : pick.start === day || pick.end === day
                    ? pickday = "selected"
                    : pick.from <= day && pick.to >= day
                        ? pickday = "int"
                        : pickday = "normal"
        return pickday;
    }
    return (
        <div className="DPcalender">
            <div className="DPcalarea">
                {bfdaylist.map((day, index) => (
                    <DateComp key={index} day={day} type={"disable"} />
                ))}
                {Object.keys(caldaylist).map((day, index) => (
                    <DateComp key={index} day={day} type={getStyle(+day)} fclick={dateClick}/>
                ))}
                {afdaylist.map((day, index) => (
                    <DateComp key={index} day={day} type={"disable"} />
                ))}
            </div> 
        </div>
    )
}
////////
// 달력 header comp
////////
function CalenderheaderComp({date, calnum, fLClick, fRclick}) {
    return (
        <div className="DPheader">
            {date.map((item, index) => (
                index === parseInt(calnum / 2)
                    ? 
                <div key={index} className="DPheadbar">
                    <div className="DPheadcell">
                        <button id="year" className="DPheadbt" onClick={fLClick}>〈</button>
                        <span>
                            {item.year}
                        </span>
                        <button id="year" className="DPheadbt" onClick={fRclick}>〉</button>
                    </div>
                    <div className="DPheadcell">    
                        <button id="month" className="DPheadbt" onClick={fLClick}>〈</button>
                        <span>
                            {item.month}
                        </span>
                        <button id="month" className="DPheadbt" onClick={fRclick}>〉</button>
                    </div>
                </div>
                    :
                <div key={index} className="DPheadbar">
                    <div className="DPtextcell">
                        <span>
                            {item.year}
                        </span>
                        /
                        <span>
                            {item.month}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}

// MODE 정의
// pick = 하루 지정
// term = 기간 지정
// set = 일정 추가모드
export default function DatePicker({
    date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000), 
    cViewCal = 1, 
    mode = "pick",
    fdateSel
}) {
    let $width = 211 * cViewCal + "px"
    const [dateVal, setDateval] = useState(date);
    const [Caldate, setCaldate] = useState([{year:2000, month: 1}]);
    const [Pickdate, setPickdate] = useState({})    
    ////////
    // period : 날짜 fpick // term : 시작/종료날짜 fpick
    ////////
    const [spick, setsPick] = useState(-1);
    const [epick, setePick] = useState(-1); 
    const [holiday, setHoliday] = useState({});
    //////////
    // page loading시 년도/월값 최신화-
    useEffect(() => {
        let getDate = new Date(dateVal);
        getDate.setMonth(getDate.getMonth() - parseInt(cViewCal / 2));
        let result = [];
        for (let i = 0; i < cViewCal; i++) {
            let setDate = getDate.toISOString().split("T")[0];
            result[i] = {year: +setDate.split("-")[0], month: +setDate.split("-")[1]}
            getDate.setMonth(getDate.getMonth() + 1);
        }
        setCaldate(result)
    }, [dateVal, cViewCal])
    useEffect(()=> {    
        pickCal();
    },[spick, epick, Caldate])
    function onRightClick({target:{id}}) {
        const date = dateVal;
        id === "year"
            ? date.setFullYear(date.getFullYear() + 1)
            : date.setMonth(date.getMonth() + 1)
        setDateval(new Date(date))
        setPickdate({})
    }
    function onLeftClick({target:{id}}) {
        const date = dateVal;
        id === "year"
            ? date.setFullYear(date.getFullYear() - 1)
            : date.setMonth(date.getMonth() - 1)
        setDateval(new Date(date))
        setPickdate({})
    }
    function DateClick(year, month, date) {
            if (spick === -1 && epick === -1) {
                setsPick(new Date(year, month - 1, date))
            } else if (spick !== -1 && epick === -1) {
                if (spick > new Date(year, month - 1, date)) {
                    setePick(spick)
                    setsPick(new Date(year, month - 1, date))
                } else {
                    setePick(new Date(year, month - 1, date))
                }
            } else if (spick !== -1 && epick !== -1) {
                setPickdate({})
                setsPick(new Date(year, month - 1, date))
                setePick(-1) 
            }
    }   
    function addHoliday(year, month, date) {
        let temp = []
        holiday[year]
            ? holiday[year][month]
                ? temp = holiday[year][month]
                : temp = []
            : temp = []

        temp.includes(+date) ? alert("이미 존재합니다.") : temp.push(+date);
        setHoliday({...holiday, [year]: {...holiday[year], [month]: temp}})
    }
     //////////
    // page loading시 년도/월값 최신화
    //////////
    function okClick() {
        spick === -1
        ? alert("날짜가 선택되지않음.")
        : fdateSel(spick)
    }
    function cancelClick() {
        setsPick(-1)
        setePick(-1)
        setPickdate({})
    }
    function pickCal() {
        let temp = {...Pickdate}
        for (let i = 0; i < +cViewCal; i++) {
            if (spick !== -1 ) {
                if ((spick.getFullYear() === Caldate[i].year)&&((spick.getMonth()+1)===Caldate[i].month)){
                    temp = {...temp, [i]: {...temp[i], from: +spick.getDate(), start: +spick.getDate()}}
                } else if (spick < new Date(Caldate[i].year, Caldate[i].month - 1) && epick > new Date(Caldate[i].year, Caldate[i].month - 1)) {
                    temp = {...temp, [i]: {...temp[i], from: 1, to: new Date(Caldate[i].year, Caldate[i].month,0).getDate() }}
                } 
            }
            if (epick !== -1) {
                if ((epick.getFullYear() === Caldate[i].year)&&((epick.getMonth()+1)===Caldate[i].month)) {
                    temp = {...temp, [i]: {...temp[i], to: +epick.getDate(), end: +epick.getDate()}}
                } else if (epick > new Date(Caldate[i].year, Caldate[i].month - 1)) {
                    if (spick < new Date(Caldate[i].year, Caldate[i].month - 1)) {
                        temp = {...temp, [i]: {...temp[i], from: 1, to: new Date(Caldate[i].year, Caldate[i].month,0).getDate() }}
                    } else if (spick.getFullYear() === Caldate[i].year) {
                        temp = {...temp, [i]: {...temp[i], to: new Date(Caldate[i].year, Caldate[i].month,0).getDate()}}
                    }
                }
            }
        }
        setPickdate(temp)
    }
    function checkHoliday(year, month) {
        let result = {
            1:[1],
            2:[],
            3:[1],
            4:[],
            5:[5],
            6:[6],
            7:[],
            8:[15],
            9:[],
            10:[3,9],
            11:[],
            12:[25],
        };
        // lunar new year's day
        let newyear = new Date(moment().year(year).month(0).date(1).solar().format("YYYY-MM-DD"))
        let newyear1 = new Date(newyear)
        newyear1.setDate(newyear1.getDate()  - 1)
        let newyear2 = new Date(newyear)
        newyear2.setDate(newyear2.getDate()  + 1)
        result[newyear.getMonth() + 1].push(newyear.getDate())
        result[newyear1.getMonth() + 1].push(newyear1.getDate())
        result[newyear2.getMonth() + 1].push(newyear2.getDate())

        // budda's day
        let buddaday = new Date(moment().year(year).month(3).date(8).solar().format("YYYY-MM-DD"))
        result[buddaday.getMonth() + 1].push(buddaday.getDate())

        // thanksgiving day
        let tgday = new Date(moment().year(year).month(8).date(15).solar().format("YYYY-MM-DD"))
        let tgday1 = new Date(tgday)
        tgday1.setDate(tgday1.getDate()  - 1)
        let tgday2 = new Date(tgday)
        tgday2.setDate(tgday2.getDate()  + 1)
        result[tgday.getMonth() + 1].push(tgday.getDate())
        result[tgday1.getMonth() + 1].push(tgday1.getDate())
        result[tgday2.getMonth() + 1].push(tgday2.getDate())

        //check holiday state
        let checkstate = []
        holiday[year]
            ? holiday[year][month]
                ? checkstate = holiday[year][month]
                : checkstate = -1
            : checkstate = -1
        if (checkstate !== -1) {
            for (let index of holiday[year][month]) {
                result[month].push(index);
            }
        }

        return result[month];
    }
    
    /* 공휴일 목록
        1-1 신정
        음력 1-1 구정
        3-1 삼일절
        음력 4-8 부처님오신날
        5-5 어린이날
        6-6 현충일
        8-15 광복절
        음력 8-15 추석
        10-3 개천절
        10-9 한글날
        12-25 크리스마스
    */
    return (
        <div className="DPbody" style={{width: $width}}>
            <CalenderheaderComp date={Caldate} calnum={cViewCal} fLClick={onLeftClick} fRclick={onRightClick} />
            <div className="DPcell">
                {Caldate.map((date, index) => (
                    <CalenderComp key={date.month} date={date} pick={Pickdate[index] ? Pickdate[index] : -1} holiday={checkHoliday(date.year, date.month)} fonClk={mode === "set" ? addHoliday : DateClick}/>
                ))}
            </div>
            
            <div className="DPselDate">
                Date:
                {spick !== -1 ? spick.getFullYear()+"-"+(spick.getMonth() + 1)+"-"+spick.getDate() : "----"} {mode === "term" && epick !== -1 ? " to " + epick.getFullYear()+"-"+(epick.getMonth() + 1)+"-"+epick.getDate() : ""}
            </div>
            <div className="DPbtbar">
                <button className="DPbtcell" onClick={okClick}>OK</button>
                <button className="DPbtcell" onClick={cancelClick}>CANCEL</button>
                <button className="DPbtcell"> + </button>
            </div>
        </div>
    )
}
