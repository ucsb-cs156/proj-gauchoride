import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function DriverAvailabilityForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all
  const navigate = useNavigate();

  const testIdPrefix = "DriverAvailabilityForm";

  // Stryker disable next-line Regex
  const time_regex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

  return (
    <Form
      onSubmit={handleSubmit((data) => {
        const { driverId, ...filteredData } = data;
        submitAction(filteredData);
      })}
    >
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">ID</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="day">Day of the Week</Form.Label>
        <Form.Select
          data-testid={testIdPrefix + "-day"}
          id="day"
          isInvalid={Boolean(errors.day)}
          {...register("day", {
            required: "Day of the Week is required.",
          })}
        >
          <option value="">Select a Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.day?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="startTime">Start Time</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-startTime"}
          id="startTime"
          type="text"
          placeholder="Enter time in the format HH:MM AM/PM (eg. 11:30 AM)"
          isInvalid={Boolean(errors.startTime)}
          {...register("startTime", {
            required: "Start Time is required.",
            pattern: {
              value: time_regex,
              message: "Invalid time format. Use HH:MM AM/PM.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.startTime?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="endTime">End Time</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-endTime"}
          id="endTime"
          type="text"
          placeholder="Enter time in the format HH:MM AM/PM (eg. 5:30 PM)"
          isInvalid={Boolean(errors.endTime)}
          {...register("endTime", {
            required: "End Time is required.",
            pattern: {
              value: time_regex,
              message: "Invalid time format. Use HH:MM AM/PM.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.endTime?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="notes">Notes</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-notes"}
          id="notes"
          type="text"
          placeholder="Include any additional notes here."
          isInvalid={Boolean(errors.notes)}
          {...register("notes")}
        />
        <Form.Control.Feedback type="invalid">
          {errors.notes?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
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
  );
}

export default DriverAvailabilityForm;
