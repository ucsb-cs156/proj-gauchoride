import React from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import SchedulerEvents from "./SchedulerEvent";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const hours = [
    '', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', 
    '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', 
    '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
];

// min required data for event object
//     {
//         title: "Meeting with Team",
//         day: "Tuesday",
//         startTime: "2:00PM",
//         endTime: "4:00PM"
//     }

export default function SchedulerPanel({ Events = [], eventColor="#d1ecf188", borderColor="#bee5eb"}) {

    return (
        <Container fluid style={styles.schedulerPanel}>
            <Row style={styles.headerRow}>
                <Col style={styles.timeColumn}></Col>
                {daysOfWeek.map(day => (
                    <Col key={day} style={styles.dayColumn}>
                        <Card style={styles.dayCard}>
                            <Card.Body>
                                <Card.Title style={styles.dayTitle}>{day}</Card.Title>
                            </Card.Body>
                            {Events
                                .filter(event => event.day === day)
                                .map(event => (
                                <SchedulerEvents key={event.id} event={event} eventColor={eventColor} borderColor={borderColor} />
                            ))}
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row>
                <Col style={styles.timeColumn}>
                    <div style={{...styles.timeSlot, height: "30px", border: "0"}}></div>
                    {hours.map((hour, index) => (
                        <div key={index} style={{...styles.timeSlot, border: "0"}}>
                            <span style={styles.hourLabel}>{hour}</span>
                        </div>
                    ))}
                </Col>
                {daysOfWeek.map(day => (
                    <Col key={day} style={styles.dayColumn}>
                        <div style={{...styles.timeSlot, height: "30px"}}></div>
                        {hours.slice(0, hours.length-1).map(hour => (
                            <div key={hour} style={styles.timeSlot}>
                                <Card style={styles.eventCard}/>
                            </div>
                        ))}
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

const styles = {
    schedulerPanel: {
        backgroundColor: "#fff",
        padding: "20px",
    },
    headerRow: {
        textAlign: "center",
    },
    timeColumn: {
        textAlign: "right",
        borderRight: "1px solid #ddd",
        position: "relative",
    },
    dayColumn: {
        padding: 0,
        borderRight: "1px solid #ddd"
    },
    dayCard: {
        backgroundColor: "#ddd",
        borderRadius: "0"
    },
    dayTitle: {
        fontSize: "1.2rem",
        fontWeight: "bold"
    },
    timeSlot: {
        height: "60px", /* Full time slot height */
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderBottom: "1px solid #ddd",
    },
    eventCard: {
        width: "100%",
        height: "100%",
        border: "0",
        // borderBottom: "1px solid #eeeeee",
        borderRadius: "0",
    },
    hourLabel: {
        height: "30px", /* Half of the full time slot height */
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
        position: "absolute",
        top: 0,
        right: "5px",
        transform: "translateY(-50%)",
    }
};