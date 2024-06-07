const shiftFixtures = {
    oneShift:
    [
        {
            "id": 1,
            "day": "Friday",
            "shiftStart": "09:00AM",
            "shiftEnd": "10:00AM",
            "driverID": 1,
            "driverBackupID": 2
        }
    ],

    threeShifts: [
        {
            "id": 1,
            "day": "Monday",
            "shiftStart": "08:00AM",
            "shiftEnd": "11:00AM",
            "driverID": 1,
            "driverBackupID": 2
        },
        {
            "id": 2,
            "day": "Tuesday",
            "shiftStart": "11:00AM",
            "shiftEnd": "02:00PM",
            "driverID": 2,
            "driverBackupID": 3
        },
        {
            "id": 3,
            "day": "Thursday",
            "shiftStart": "03:00PM",
            "shiftEnd": "06:00PM",
            "driverID": 6,
            "driverBackupID": 5
        },
    ]
}

export default shiftFixtures;
export { shiftFixtures };