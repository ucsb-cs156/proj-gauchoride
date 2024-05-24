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

    const expectedHeaders = ["driverId", "Day of Week", "Availability Start", "Availability End", "Notes"];
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
        expect(screen.getByText(`driverId`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-day`)).toBeInTheDocument();
        expect(screen.getByText(`Day of Week`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-startTime`)).toBeInTheDocument();
        expect(screen.getByText(`Availability Start`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-endTime`)).toBeInTheDocument();
        expect(screen.getByText(`Availability End`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-notes`)).toBeInTheDocument();
        expect(screen.getByText(`Notes`)).toBeInTheDocument();
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

        await screen.findByText(/driverId is required./);
        expect(screen.getByText(/Day is required./)).toBeInTheDocument();
        expect(screen.getByText(/Availability Start is required./)).toBeInTheDocument();
        expect(screen.getByText(/Availability End is required./)).toBeInTheDocument();

    });

    test("enter wrong time format", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        fireEvent.change(startTimeField, { target: { value: 'BAD' } });
        fireEvent.change(endTimeField, { target: { value: 'BAD' } });
        fireEvent.click(submitButton);

        await screen.findByText(/driverId is required./);
        expect(screen.getByText("Please enter start time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();
        expect(screen.getByText("Please enter end time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();
        expect(screen.getByText(/Day is required./)).toBeInTheDocument();

        fireEvent.change(startTimeField, { target: { value: 'BAD 3:30PM' } });
        fireEvent.change(endTimeField, { target: { value: 'BAD 3:30PM' } });
        await screen.findByText(/driverId is required./);
        expect(screen.getByText("Please enter start time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();
        expect(screen.getByText("Please enter end time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();
        
        fireEvent.change(startTimeField, { target: { value: 'BAD 3:30PM BAD' } });
        fireEvent.change(endTimeField, { target: { value: 'BAD 3:30PM BAD' } });
        await screen.findByText(/driverId is required./);
        expect(screen.getByText("Please enter start time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();
        expect(screen.getByText("Please enter end time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();

        fireEvent.change(startTimeField, { target: { value: '3:30PM BAD' } });
        fireEvent.change(endTimeField, { target: { value: '3:30PM BAD' } });
        await screen.findByText(/driverId is required./);
        expect(screen.getByText("Please enter start time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();
        expect(screen.getByText("Please enter end time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument();
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
        fireEvent.change(dayField, { target: { value: 'Monday' } });
        fireEvent.change(startTimeField, { target: { value: '3:30PM' } });
        fireEvent.change(endTimeField, { target: { value: '3:30PM' } });
        fireEvent.change(notesField, { target: { value: 'test' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/driverId is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Day is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Availability Start is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Availability End is required./)).not.toBeInTheDocument();
        expect(screen.queryByText("Please enter start time in the format HH:MM AM/PM (e.g., 3:30PM).")).not.toBeInTheDocument();
        expect(screen.queryByText("Please enter end time in the format HH:MM AM/PM (e.g., 3:30PM).")).not.toBeInTheDocument();


    });

});