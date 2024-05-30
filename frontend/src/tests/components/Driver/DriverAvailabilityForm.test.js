import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import DriverAvailabilityForm from "main/components/Driver/DriverAvailabilityForm"
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("DriverAvailabilityForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Driver Id", "Day", "Start Time", "End Time", "Notes"];
    const testId = "DriverAvailabilityForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm initialContents={driverAvailabilityFixtures.oneAvailability} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`id`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-driverId`)).toBeInTheDocument();
        expect(screen.getByText("Driver Id")).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-day`)).toBeInTheDocument();
        expect(screen.getByText("Day")).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-startTime`)).toBeInTheDocument();
        expect(screen.getByText("Start Time")).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-endTime`)).toBeInTheDocument();
        expect(screen.getByText("End Time")).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-notes`)).toBeInTheDocument();
        expect(screen.getByText("Notes")).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Driver Id is required./);
        expect(screen.getByText(/Day is required./)).toBeInTheDocument();
        expect(screen.getByText(/Start Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/End Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/Notes is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(driverIdField, { target: { value: 'test' } });
        fireEvent.change(dayField, { target: { value: 'Tuesday' } });
        fireEvent.change(startTimeField, { target: { value: '3:15PM' } });
        fireEvent.change(endTimeField, { target: { value: '4:15PM' } });
        fireEvent.change(notesField, { target: { value: 'test' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Driver Id is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Day is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Start Time is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/End Time is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Notes is required./)).not.toBeInTheDocument();
        expect(screen.queryByText("Please enter time in the format HH:MM AM/PM (e.g., 3:30PM).")).not.toBeInTheDocument();
    });


    test("Error messages on missing inputs", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(driverIdField, { target: { value: '' } });
        fireEvent.change(dayField, { target: { value: '' } });
        fireEvent.change(startTimeField, { target: { value: '' } });
        fireEvent.change(endTimeField, { target: { value: '' } });
        fireEvent.change(notesField, { target: { value: '' } });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Driver Id is required./)).toBeInTheDocument();
        expect(screen.queryByText(/Day is required./)).toBeInTheDocument();
        expect(screen.queryByText(/Start Time is required./)).toBeInTheDocument();
        expect(screen.queryByText(/End Time is required./)).toBeInTheDocument();
        expect(screen.queryByText(/Notes is required./)).toBeInTheDocument();

    });

    test("Error message when end time is not later than start time", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        // Select the same driver for both driverID and driverBackupID
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-startTime"), { target: { value: "11:00AM" } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-endTime"), { target: { value: "10:00AM" } });

        // Try to submit the form
        fireEvent.click(screen.getByTestId("DriverAvailabilityForm-submit"));

        // Check for the validation message
        await waitFor(() => expect(screen.getByText("End time must be later than start time.")).toBeInTheDocument());

        // Select different drivers for driverID and driverBackupID
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-startTime"), { target: { value: "11:00AM" } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-endTime"), { target: { value: "2:00PM" } });

        // Try to submit the form again
        fireEvent.click(screen.getByTestId("DriverAvailabilityForm-submit"));

        // Check that the validation message is not present
        await waitFor(() => expect(screen.queryByText("End time must be later than start time.")).not.toBeInTheDocument());
    });
   
    test("Error messages on bad time format", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );

        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        // Invalid start time format
        fireEvent.change(driverIdField, { target: { value: 'test' } });
        fireEvent.change(dayField, { target: { value: 'Tuesday' } });
        fireEvent.change(startTimeField, { target: { value: '315PM' } });
        fireEvent.change(endTimeField, { target: { value: '4:15PM' } });
        fireEvent.change(notesField, { target: { value: 'test' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const startTimeError = screen.getByTestId("DriverAvailabilityForm-startTime").parentElement.querySelector('.invalid-feedback');
            expect(startTimeError).toHaveTextContent("Please enter time in the format HH:MM AM/PM (e.g., 3:30PM).");
        });
    });

    test("Error messages on bad time format - extra characters at beginning", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );

        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        // Invalid start time format
        fireEvent.change(driverIdField, { target: { value: 'test' } });
        fireEvent.change(dayField, { target: { value: 'Tuesday' } });
        fireEvent.change(startTimeField, { target: { value: 'a3:15PM' } });
        fireEvent.change(endTimeField, { target: { value: 'a4:15PM' } });
        fireEvent.change(notesField, { target: { value: 'test' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const startTimeError = screen.getByTestId("DriverAvailabilityForm-startTime").parentElement.querySelector('.invalid-feedback');
            const endTimeError = screen.getByTestId("DriverAvailabilityForm-endTime").parentElement.querySelector('.invalid-feedback');
            expect(startTimeError).toHaveTextContent("Please enter time in the format HH:MM AM/PM (e.g., 3:30PM).");
            expect(endTimeError).toHaveTextContent("Please enter time in the format HH:MM AM/PM (e.g., 3:30PM).");
        });
    });

    test("Error messages on bad time format - extra characters at end", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );

        await screen.findByTestId("DriverAvailabilityForm-driverId");

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(driverIdField, { target: { value: 'test' } });
        fireEvent.change(dayField, { target: { value: 'Tuesday' } });
        fireEvent.change(startTimeField, { target: { value: '3:15PMa' } });
        fireEvent.change(endTimeField, { target: { value: '4:15PMa' } });
        fireEvent.change(notesField, { target: { value: 'test' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const startTimeError = screen.getByTestId("DriverAvailabilityForm-startTime").parentElement.querySelector('.invalid-feedback');
            const endTimeError = screen.getByTestId("DriverAvailabilityForm-endTime").parentElement.querySelector('.invalid-feedback');
            expect(startTimeError).toHaveTextContent("Please enter time in the format HH:MM AM/PM (e.g., 3:30PM).");
            expect(endTimeError).toHaveTextContent("Please enter time in the format HH:MM AM/PM (e.g., 3:30PM).");
        });
    });
});
