import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SchedulerPanel from "main/components/Scheduler/SchedulerPanel";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Button, ButtonGroup, Stack } from "react-bootstrap";
import { toast } from "react-toastify";

import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser , hasRole} from 'main/utils/currentUser'

import { cellToAxiosParamsDelete as shiftCellToAxiosParamsDelete, onDeleteSuccess as shiftOnDeleteSuccess } from "main/utils/shiftUtils"
import { cellToAxiosParamsDelete as RideCellToAxiosParamsDelete, onDeleteSuccess as RideOnDeleteSuccess } from "main/utils/rideUtils"
import { cellToAxiosParamsDelete as driverAvailabilityCellToAxiosParamsDelete, onDeleteSuccess as driverAvailabilityOnDeleteSuccess } from "main/utils/driverAvailabilityUtils"

export default function SchedulerPage() {

    // Function to convert a shift object to Axios parameters
    const shiftToAxiosParams = (shift) => ({
        url: "/api/shift/post",
        method: "POST",
        params: {
            day: shift.day,
            driverBackupID: shift.driverBackupID,
            driverID: shift.driverID,
            id: shift.id,
            shiftEnd: shift.shiftEnd,
            shiftStart: shift.shiftStart,
        }
    });

    // Function to convert an availability object to Axios parameters
    const driverToAxiosParams = (availability) => ({
        url: "/api/driverAvailability/new",
        method: "POST",
        params: {
            driverId: availability.driverId,
            day: availability.day,
            startTime: availability.startTime,
            endTime: availability.endTime,
            notes: availability.notes
        }
    });

    // Function to convert a ride object to Axios parameters
    const rideToAxiosParams = (ride) => ({
        url: "/api/ride_request/post",
        method: "POST",
        params: {
            day: ride.day,
            startTime: ride.startTime,
            endTime: ride.endTime,
            pickupBuilding: ride.pickupBuilding,
            dropoffBuilding: ride.dropoffBuilding,
            dropoffRoom: ride.dropoffRoom,
            pickupRoom: ride.pickupRoom,
            course: ride.course,
            notes: ride.notes
        }
    });

    // Function to generate random notes of variable length
    const generateRandomNotes = () => {
        const possibleNotes = [
            "Note 1", "Short note", "A bit longer note", "This is a much longer note to provide more detail",
            "Please be on time", "Student has special requirements", "Requires assistance with luggage",
            "Pickup location might change", "Contact student if any issues", "Prefers quiet rides"
        ];
        const randomIndex = Math.floor(Math.random() * possibleNotes.length);
        return possibleNotes[randomIndex];
    };

    const onSuccessShift = (shift) => {
        toast(`New shift Created - id: ${shift.id}, day: ${shift.day}, shiftStart: ${shift.shiftStart}, shiftEnd: ${shift.shiftEnd}, driverID: ${shift.driverID}, driverBackupID: ${shift.driverBackupID}`);
    }

    const mutationShift = useBackendMutation(
        shiftToAxiosParams,
        { onSuccessShift }, 
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/shift/all"] // mutation makes this key stale so that pages relying on it reload
        );

    // Function to fill the shift database with placeholder information
    const fillShiftDatabase = async () => {
        const placeholderShifts = [
            { id: 1, day: "Monday", shiftStart: "08:00AM", shiftEnd: "04:00PM", driverID: 1, driverBackupID: 1 },
            { id: 2, day: "Tuesday", shiftStart: "09:00AM", shiftEnd: "05:00PM", driverID: 3, driverBackupID: 4 },
            { id: 3, day: "Wednesday", shiftStart: "10:00AM", shiftEnd: "06:00PM", driverID: 5, driverBackupID: 6 },
            { id: 4, day: "Thursday", shiftStart: "11:00AM", shiftEnd: "07:00PM", driverID: 7, driverBackupID: 8 },
            { id: 5, day: "Friday", shiftStart: "12:00PM", shiftEnd: "08:00PM", driverID: 9, driverBackupID: 10 },
            { id: 6, day: "Saturday", shiftStart: "01:00PM", shiftEnd: "09:00PM", driverID: 11, driverBackupID: 12 },
            { id: 7, day: "Sunday", shiftStart: "02:00PM", shiftEnd: "10:00PM", driverID: 13, driverBackupID: 14 },
        ];

        for (const shift of placeholderShifts) {
            try {
                await mutationShift.mutate(shift);
                console.log(`Shift for ${shift.day} successfully added`);
            } catch (error) {
                console.error(`Error adding shift for ${shift.day}: `, error);
            }
        }
    };

    const onSuccessDriver = (availability) => {
        toast(`New Driver Availability Created - id: ${availability.id}`);
    }

    const mutationDriver = useBackendMutation(
        driverToAxiosParams,
        { onSuccessDriver },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/driverAvailability"]
    );

    // Function to fill the driver availability database with placeholder information
    const fillDriverAvailabilityDatabase = async () => {
        const placeholderAvailabilities = [
            { id: 1, driverId: 1, day: "Monday", startTime: "03:30PM", endTime: "04:30PM", notes: generateRandomNotes() },
            { id: 2, driverId: 1, day: "Monday", startTime: "01:30PM", endTime: "03:30PM", notes: generateRandomNotes() },
            { id: 3, driverId: 1, day: "Tuesday", startTime: "03:40PM", endTime: "03:40PM", notes: generateRandomNotes() },
            { id: 4, driverId: 1, day: "Wednesday", startTime: "3:30AM", endTime: "3:30AM", notes: generateRandomNotes() },
            { id: 5, driverId: 1, day: "Thursday", startTime: "4:00PM", endTime: "8:00PM", notes: generateRandomNotes() },
            { id: 6, driverId: 1, day: "Friday", startTime: "1:00PM", endTime: "5:00PM", notes: generateRandomNotes() },
            { id: 7, driverId: 1, day: "Saturday", startTime: "2:00PM", endTime: "6:00PM", notes: generateRandomNotes() },
        ];

        for (const availability of placeholderAvailabilities) {
            try {
                await mutationDriver.mutate(availability);
                console.log(`Availability for Driver ${availability.driverId} on ${availability.day} successfully added`);
            } catch (error) {
                console.error(`Error adding availability for Driver ${availability.driverId} on ${availability.day}: `, error);
            }
        }
    };

    const onSuccessRide = (ride) => {
        toast(`New Ride Created - id: ${ride.id}`);
    }

    const mutationRide = useBackendMutation(
        rideToAxiosParams,
        { onSuccessRide },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/ride_request/all"]
    );

    // Function to fill the ride request database with placeholder information
    const fillRideRequestDatabase = async () => {
        const placeholderRides = [
            { id: 1, riderId: 1, student: "Gen Tamada", day: "Tuesday", startTime: "3:30AM", endTime: "4:00AM", pickupBuilding: "Building A", dropoffBuilding: "Building B", dropoffRoom: "Room 101", pickupRoom: "Room 201", notes: generateRandomNotes(), course: "Course A", shiftId: 3 },
            { id: 2, riderId: 1, student: "Alex Johnson", day: "Wednesday", startTime: "4:00AM", endTime: "4:30AM", pickupBuilding: "Building C", dropoffBuilding: "Building D", dropoffRoom: "Room 102", pickupRoom: "Room 202", notes: generateRandomNotes(), course: "Course B", shiftId: 4 },
            { id: 3, riderId: 1, student: "Maria Garcia", day: "Thursday", startTime: "5:00AM", endTime: "5:30AM", pickupBuilding: "Building E", dropoffBuilding: "Building F", dropoffRoom: "Room 103", pickupRoom: "Room 203", notes: generateRandomNotes(), course: "Course C", shiftId: 5 },
            { id: 4, riderId: 1, student: "James Smith", day: "Friday", startTime: "6:00AM", endTime: "6:30AM", pickupBuilding: "Building G", dropoffBuilding: "Building H", dropoffRoom: "Room 104", pickupRoom: "Room 204", notes: generateRandomNotes(), course: "Course D", shiftId: 6 },
            { id: 5, riderId: 1, student: "Emily Davis", day: "Saturday", startTime: "7:00AM", endTime: "7:30AM", pickupBuilding: "Building I", dropoffBuilding: "Building J", dropoffRoom: "Room 105", pickupRoom: "Room 205", notes: generateRandomNotes(), course: "Course E", shiftId: 7 },
            { id: 6, riderId: 1, student: "Daniel Brown", day: "Sunday", startTime: "8:00AM", endTime: "8:30AM", pickupBuilding: "Building K", dropoffBuilding: "Building L", dropoffRoom: "Room 106", pickupRoom: "Room 206", notes: generateRandomNotes(), course: "Course F", shiftId: 8 },
            { id: 7, riderId: 1, student: "Sarah Wilson", day: "Monday", startTime: "9:00AM", endTime: "9:30AM", pickupBuilding: "Building M", dropoffBuilding: "Building N", dropoffRoom: "Room 107", pickupRoom: "Room 207", notes: generateRandomNotes(), course: "Course G", shiftId: 9 },
        ];

        for (const ride of placeholderRides) {
            try {
                await mutationRide.mutate(ride);
                console.log(`Ride request for ${ride.student} on ${ride.day} successfully added`);
            } catch (error) {
                console.error(`Error adding ride request for ${ride.student} on ${ride.day}: `, error);
            }
        }
    };




    const { page } = useParams();

    const navigate = useNavigate();
    const currentUser = useCurrentUser();

    const [events, setEvents] = useState([]);
    const [createLink, setCreateLink] = useState("");

    const { data: shifts } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/shift/all`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/shift/all`
                // Stryker restore all
            },
        );

    const editShiftCallback = (shift) => {
        navigate(`/shift/edit/${shift.id}`)
    }

    const infoShiftCallback = (shift) => {
        navigate(`/shiftInfo/${shift.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const shiftDeleteMutation = useBackendMutation(
        shiftCellToAxiosParamsDelete,
        { onSuccess: shiftOnDeleteSuccess },
        ["/api/shift/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteShiftCallback = async (shift) => { shiftDeleteMutation.mutate({row: {values: {id: shift.id}}}); }




    const { data: ride_request } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/ride_request/all`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/ride_request/all`
                // Stryker restore all
            },
        );

    const editRideCallback = (ride) => {
        navigate(`/ride/edit/${ride.id}`)
    }

    const assignRideCallback = (ride) => {
        navigate(`/ride/assigndriver/${ride.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const RideDeleteMutation = useBackendMutation(
        RideCellToAxiosParamsDelete,
        { onSuccess: RideOnDeleteSuccess },
        ["/api/ride_request/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteRideCallback = async (ride) => { RideDeleteMutation.mutate({row: {values: {id: ride.id}}}); }




    const { data: driverAvailability } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/driverAvailability/admin/all`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/driverAvailability/admin/all`
                // Stryker restore all
            },
        );

    const reviewDriverCallback = (driver) => {
        navigate(`/admin/availability/review/${driver.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const DriverDeleteMutation = useBackendMutation(
        driverAvailabilityCellToAxiosParamsDelete,
        { onSuccess: driverAvailabilityOnDeleteSuccess },
        ["/availability"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteDriverCallback = async (driver) => { DriverDeleteMutation.mutate({row: {values: {id: driver.id}}}); }




    useEffect(() => {
        if(page === "shifts") {
            if(shifts === undefined) return;
            setEvents(shifts.map(shift => ({
                id: shift.id,
                title: `Shift for Driver ${shift.driverID}`,
                description: `Backup Driver: ${shift.driverBackupID}`,
                day: shift.day,
                startTime: shift.shiftStart,
                endTime: shift.shiftEnd,
                actions: [
                    hasRole(currentUser, "ROLE_ADMIN") && { text: "Edit", variant: "primary", callback: () => editShiftCallback(shift) },
                    hasRole(currentUser, "ROLE_ADMIN") && { text: "Delete", variant: "danger", callback: () => {deleteShiftCallback(shift); navigate(0)} },
                    (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_DRIVER")) && { text: "Info", variant: "success", callback: () => infoShiftCallback(shift) }
                ].filter(Boolean) // remove undefined values
            })));
            setCreateLink("/shift/create");
        }
        else if(page === "rides") {
            if(ride_request === undefined) return;
            setEvents(ride_request.map(request => ({
                id: request.id,
                title: `Ride Request for ${request.student}`,
                description: `From ${request.pickupBuilding} to ${request.dropoffBuilding}`,
                day: request.day,
                startTime: request.startTime,
                endTime: request.endTime,
                actions: [
                    hasRole(currentUser, "ROLE_ADMIN") && { text: "Edit", variant: "primary", callback: () => editRideCallback(request) },
                    hasRole(currentUser, "ROLE_ADMIN") && { text: "Delete", variant: "danger", callback: () => {deleteRideCallback(request); navigate(0)} },
                    hasRole(currentUser, "ROLE_ADMIN") && { text: "Assign Driver", variant: "success", callback: () => assignRideCallback(request) }
                ].filter(Boolean) // remove undefined values
            })));
            setCreateLink("/ride/create");
        }
        else if(page === "driver") {
            if(driverAvailability === undefined) return;
            setEvents(driverAvailability.map(availability => ({
                id: availability.id,
                title: `Availability for Driver ${availability.driverId}`,
                description: availability.notes,
                day: availability.day,
                startTime: availability.startTime,
                endTime: availability.endTime,
                actions: [  
                    hasRole(currentUser, "ROLE_ADMIN") && { text: "Delete", variant: "danger", callback: () => {deleteDriverCallback(availability); navigate(0)} },
                    hasRole(currentUser, "ROLE_ADMIN") && { text: "Review", variant: "success", callback: () => reviewDriverCallback(availability) }
                ].filter(Boolean) // remove undefined values
            })));
            setCreateLink("/availability/create");
        }
        else {
            setEvents([]);
        }
    }, [shifts, ride_request, driverAvailability, page]);

    return (
        <BasicLayout>
            <Stack className="flex-row justify-content-between">
                <ButtonGroup>
                    <Button onClick={() => {navigate('/admin/schedule/shifts')}}>Shifts</Button>
                    <Button onClick={() => {navigate('/admin/schedule/rides')}}>Ride Requests</Button>
                    <Button onClick={() => {navigate('/admin/schedule/driver')}}>Driver Availability</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button variant="danger" onClick={() => {fillShiftDatabase();}}>Fill Shifts</Button>
                    <Button variant="danger" onClick={() => {fillRideRequestDatabase();}}>Fill Rides</Button>
                    <Button variant="danger" onClick={() => {fillDriverAvailabilityDatabase();}}>Fill Driver Availability</Button>
                </ButtonGroup>
                {page && 
                    <Button
                        variant="success"
                        href={createLink}
                    >
                        Create {page}
                    </Button>
                }
            </Stack>
            <SchedulerPanel Events={events} />
        </BasicLayout>
    );
}