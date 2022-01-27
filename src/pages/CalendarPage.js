import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Spinner from '../components/spinner/Spinner'
const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});


const CalendarPage = () => {
    const navigate= useNavigate();
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let end_point;
        end_point =`/api/tasks/assigned`;
        axios.get(end_point).then(res=> {
            console.log(res);
            if (res.data.code === 200) {
                let events = [];
                res.data.data.data.forEach(element => {  
                    events = [...events,{ title: element.taskName, start: new Date(element.taskStart), end: new Date(element.taskEnd) }]
                });
                setAllEvents(events);
                setLoading(false);
            }
        }).catch(error => navigate('/login'))
    },[navigate]);

    if (loading) {
        return <Spinner></Spinner>
    }

    return (
        <React.Fragment>
            <div className="row" style={{marginBottom:'20px'}}>
                <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{ height: 750, margin: "0px" }} />
            </div>
        </React.Fragment>
    );
}

export default CalendarPage;