const scheduleEventsFixtures = {
    oneEvent: {
        id: 1,
        title: "Team Meeting",
        day: "Monday",
        startTime: "10:00AM",
        endTime: "11:00AM",
        description: "Discuss project progress"
    },
    threeEvents: [
        {
            id: 1,
            title: "Team Meeting",
            day: "Monday",
            startTime: "10:00AM",
            endTime: "11:00AM",
            description: "Discuss project progress"
        },
        {
            id: 2,
            title: "Client Call",
            day: "Wednesday",
            startTime: "01:30PM",
            endTime: "02:30PM",
            description: "Monthly update call with the client"
        },
        {
            id: 3,
            title: "Workshop",
            day: "Friday",
            startTime: "09:00AM",
            endTime: "12:00PM",
            description: "React.js workshop"
        }
    ],
    sixEvents: [
        {
            id: 1,
            title: "Team Meeting",
            day: "Monday",
            startTime: "10:00AM",
            endTime: "11:00AM",
            description: "Discuss project progress"
        },
        {
            id: 2,
            title: "Client Call",
            day: "Wednesday",
            startTime: "01:30PM",
            endTime: "02:30PM",
            description: "Monthly update call with the client update call with the client update call with the client"
        },
        {
            id: 3,
            title: "Workshop Workshop Workshop",
            day: "Friday",
            startTime: "09:00AM",
            endTime: "12:00PM",
            description: "React.js workshop"
        },
        {
            id: 4,
            title: "Design Review Review Review",
            day: "Tuesday",
            startTime: "03:19PM",
            endTime: "04:00PM",
            description: "Review new designs"
        },
        {
            id: 5,
            title: "Sprint Planning",
            day: "Thursday",
            startTime: "11:00AM",
            endTime: "12:30PM",
            description: "Plan tasks for the next sprint"
        },
        {
            id: 6,
            title: "Code Review",
            day: "Monday",
            startTime: "02:00PM",
            endTime: "03:00PM",
            description: "Review code submissions"
        }
    ]
}

export { scheduleEventsFixtures };