import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SchedulerPanel from "main/components/Scheduler/SchedulerPanel";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Button, ButtonGroup, Stack } from "react-bootstrap";

import { useBackend, useBackendMutation } from "main/utils/useBackend";

import { cellToAxiosParamsDelete as shiftCellToAxiosParamsDelete, onDeleteSuccess as shiftOnDeleteSuccess } from "main/utils/shiftUtils"
import { cellToAxiosParamsDelete as RideCellToAxiosParamsDelete, onDeleteSuccess as RideOnDeleteSuccess } from "main/utils/rideUtils"
import { cellToAxiosParamsDelete as driverAvailabilityCellToAxiosParamsDelete, onDeleteSuccess as driverAvailabilityOnDeleteSuccess } from "main/utils/driverAvailabilityUtils"

export default function SchedulerPage() {
    const { page } = useParams();

    const testId = "SchedulerPage";

    const navigate = useNavigate();

    const [events, setEvents] = useState();
    const [createLink, setCreateLink] = useState();

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

    const editShiftCallback = useCallback((shift) => {
        navigate(`/shift/edit/${shift.id}`);
    }, [navigate]);

    const infoShiftCallback = useCallback((shift) => {
        navigate(`/shiftInfo/${shift.id}`);
    }, [navigate]);

    // Stryker disable all : hard to test for query caching
    const shiftDeleteMutation = useBackendMutation(
        shiftCellToAxiosParamsDelete,
        { onSuccess: shiftOnDeleteSuccess },
        ["/api/shift/all"]
    );
    // Stryker restore all 

    // Stryker disable all : delete call back
    const deleteShiftCallback = useCallback(async (shift) => {
        shiftDeleteMutation.mutate({ row: { values: { id: shift.id } } });
    }, [shiftDeleteMutation]);
    // Stryker restore all




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

    const editRideCallback = useCallback((ride) => {
        navigate(`/ride/edit/${ride.id}`);
    }, [navigate]);

    const assignRideCallback = useCallback((ride) => {
        navigate(`/ride/assigndriver/${ride.id}`);
    }, [navigate]);

    // Stryker disable all : hard to test for query caching
    const RideDeleteMutation = useBackendMutation(
        RideCellToAxiosParamsDelete,
        { onSuccess: RideOnDeleteSuccess },
        ["/api/ride_request/all"]
    );
    // Stryker restore all 

    // Stryker disable all : delete call back
    const deleteRideCallback = useCallback(async (ride) => {
        RideDeleteMutation.mutate({ row: { values: { id: ride.id } } });
    }, [RideDeleteMutation]);
    // Stryker restore all




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

    const reviewDriverCallback = useCallback((driver) => {
        navigate(`/admin/availability/review/${driver.id}`);
    }, [navigate]);

    // Stryker disable all : hard to test for query caching
    const DriverDeleteMutation = useBackendMutation(
        driverAvailabilityCellToAxiosParamsDelete,
        { onSuccess: driverAvailabilityOnDeleteSuccess },
        ["/availability"]
    );
    // Stryker restore all 

    // Stryker disable all : delete call back
    const deleteDriverCallback = useCallback(async (driver) => {
        DriverDeleteMutation.mutate({ row: { values: { id: driver.id } } });
    }, [DriverDeleteMutation]);
    // Stryker restore all

    const onUpdateEvents = useCallback(() => {
        if(page === "shifts") {
            if(shifts === undefined) return;
            setEvents(shifts.map(shift => ({
                id: shift.id,
                title: `Shift for Driver ${shift.driverID}`,
                // Stryker disable next-line all : hard to test for specific description
                description: `Backup Driver: ${shift.driverBackupID}`,
                day: shift.day,
                startTime: shift.shiftStart,
                endTime: shift.shiftEnd,
                actions: [
                    { text: "Edit", variant: "primary", callback: () => editShiftCallback(shift) },
                    { text: "Delete", variant: "danger", callback: () => {deleteShiftCallback(shift); navigate(0)} },
                    { text: "Info", variant: "success", callback: () => infoShiftCallback(shift) }
                ]
            })));
            setCreateLink("/shift/create");
        }
        else if(page === "rides") {
            if(ride_request === undefined) return;
            setEvents(ride_request.map(request => ({
                id: request.id,
                title: `Ride Request for ${request.student}`,
                // Stryker disable next-line all : hard to test for specific description
                description: `From ${request.pickupBuilding} to ${request.dropoffBuilding}`,
                day: request.day,
                startTime: request.startTime,
                endTime: request.endTime,
                actions: [
                    { text: "Edit", variant: "primary", callback: () => editRideCallback(request) },
                    { text: "Delete", variant: "danger", callback: () => {deleteRideCallback(request); navigate(0)} },
                    { text: "Assign Driver", variant: "success", callback: () => assignRideCallback(request) }
                ]
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
                    { text: "Delete", variant: "danger", callback: () => {deleteDriverCallback(availability); navigate(0)} },
                    { text: "Review", variant: "success", callback: () => reviewDriverCallback(availability) }
                ]
            })));
            setCreateLink("/availability/create");
        }
    }, [page, shifts, ride_request, driverAvailability, navigate, editShiftCallback, editRideCallback, assignRideCallback, reviewDriverCallback, deleteShiftCallback, deleteRideCallback, deleteDriverCallback, infoShiftCallback]);

    // Stryker disable all : hard to test for use effect
    useEffect(() => {
        onUpdateEvents();
    }, [ shifts, ride_request, driverAvailability, page, onUpdateEvents ]);
    // Stryker restore all

    return (
        <BasicLayout>
            <Stack className="flex-row justify-content-between">
                <ButtonGroup>
                    <Button onClick={() => {navigate('/admin/schedule/shifts')}}>Shifts</Button>
                    <Button onClick={() => {navigate('/admin/schedule/rides')}}>Ride Requests</Button>
                    <Button onClick={() => {navigate('/admin/schedule/driver')}}>Driver Availability</Button>
                </ButtonGroup>
                {page && createLink && 
                    <Button
                        variant="success"
                        data-testid={`${testId}-create-${page}`}
                        onClick={() => navigate(createLink)}
                    >
                        Create {page}
                    </Button>
                }
            </Stack>
            <SchedulerPanel Events={events} />
        </BasicLayout>
    );
}