import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useBackend } from 'main/utils/useBackend';






function RideAssignDriverForm({ initialContents, submitAction, buttonLabel = "Assign Driver" }) {
    const navigate = useNavigate();
   
    const { data: drivers, error: _error, status: _status } = useBackend(
        // Stryker disable all : hard to test for query caching
        ["/api/drivers/all"],
        { method: "GET", url: "/api/drivers/all" },
        []
        // Stryker restore all
    );


    const { data: shifts, error: _shiftError, status: _shiftStatus } = useBackend(
        // Stryker disable all : hard to test for query caching
        ["/api/shift/all"],
        { method: "GET", url: "/api/shift/all" },
        []
        // Stryker restore all
    );
    // Stryker disable all


    const { register, formState: { errors }, handleSubmit } = useForm(
        { defaultValues: initialContents }
    );
    // Stryker enable all


    const testIdPrefix = "RideAssignDriverForm";

    // Helper func
    const getDriverFullName = (driverId) => {
        
        const driver = drivers.find(driver => driver.id === driverId);
        // console.log(driverId + " " + drivers.find(driver => driver.id === driverId));

        return driver ? `${driver.givenName} ${driver.familyName}` : '';
    };




    return (


        <Form onSubmit={handleSubmit(submitAction)}>


            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        defaultValue={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}


           


            <Form.Group className="mb-3">
                <Form.Label htmlFor="shiftId">Shift Id</Form.Label>
                <Form.Select
                    data-testid={testIdPrefix + "-shiftId"}
                    id="shiftId"
                    as="select"
                    type="select"
                    isInvalid={Boolean(errors.shiftId)}
                    {...register("shiftId", {
                        required: "Shift Id is required."
                    })}
                    defaultValue={initialContents?.shiftId}
                >
                    <option value="">Select a shift</option> {/* Default empty option */}
                    {shifts && shifts
    .flatMap(shift => {
        const driverOptions = [];


        // Main driver option
        if (getDriverFullName(shift.driverID)) {
            console.log(`${shift.id}-main`); 
            driverOptions.push(
                <option key={`${shift.id}-main`} value={shift.id}>
                    {`${shift.driverID} - ${getDriverFullName(shift.driverID)} - ${shift.day} ${shift.shiftStart}-${shift.shiftEnd}`}
                </option>
            );
        }


        // Backup driver option
        if (getDriverFullName(shift.driverBackupID)) {
            driverOptions.push(
                <option key={`${shift.id}-backup`} value={shift.id}>
                    {`${shift.driverBackupID} - ${getDriverFullName(shift.driverBackupID)} - ${shift.day} ${shift.shiftStart}-${shift.shiftEnd}`}
                   
                </option>
            );
        }


        return driverOptions;
    })}
                </Form.Select>


                <Form.Control.Feedback type="invalid">
                    {errors.shiftId?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="day">Day of Week</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-day"}
                    id="day"
                    isInvalid={Boolean(errors.day)}
                    {...register("day")}
                    disabled
                    defaultValue={initialContents?.day}
                />
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="start">Start Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-start"}
                    id="start"
                    type="text"
                    {...register("start")}
                    disabled
                    defaultValue={initialContents?.startTime}
                />
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="end">End Time</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-end"}
                    id="end"
                    type="text"
                    {...register("end")}
                    disabled
                    defaultValue={initialContents?.endTime}    
                />
            </Form.Group>
           
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="pickupBuilding">Pick Up Building</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-pickupBuilding"}
                    id="pickupBuilding"
                    type="text"
                    isInvalid={Boolean(errors.pickupBuilding)}
                    {...register("pickupBuilding")}
                    disabled
                    defaultValue={initialContents?.pickupBuilding}
                />
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="pickupRoom">Room Number for Pickup</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-pickupRoom"}
                    id="pickupRoom"
                    type="text"
                    isInvalid={Boolean(errors.pickupRoom)}
                    {...register("pickupRoom")}
                    disabled
                    defaultValue={initialContents?.pickupRoom}
                />
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dropoffBuilding">Drop Off Building</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-dropoffBuilding"}
                    id="dropoffBuilding"
                    type="text"
                    isInvalid={Boolean(errors.dropoffBuilding)}
                    {...register("dropoffBuilding")}
                    disabled
                    defaultValue={initialContents?.dropoffBuilding}
                />
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dropoffRoom">Room Number for Dropoff</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-dropoffRoom"}
                    id="dropoffRoom"
                    type="text"
                    isInvalid={Boolean(errors.dropoffRoom)}
                    {...register("dropoffRoom")}
                    disabled
                    defaultValue={initialContents?.dropoffRoom}
                />
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="course">Course Number</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-course"}
                    id="course"
                    type="text"
                    isInvalid={Boolean(errors.course)}
                    {...register("course")}
                    disabled
                    defaultValue={initialContents?.course}
                />
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="notes">Notes</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-notes"}
                    id="notes"
                    type="text"
                    isInvalid={Boolean(errors.notes)}
                    {...register("notes")}
                    disabled
                    defaultValue={initialContents?.notes}
                />
            </Form.Group>




            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>


        </Form>


    )
}


export default RideAssignDriverForm;
