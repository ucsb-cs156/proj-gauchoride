import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
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

    const expectedHeaders = ["Day of the Week", "Start Time", "End Time", "Notes"];
    const testId = "DriverAvailabilityForm";

    test("renders correctly with no initialContents", async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <DriverAvailabilityForm />
                    </Router>
                </QueryClientProvider>
            );
        });

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <DriverAvailabilityForm initialContents={driverAvailabilityFixtures.oneAvailability} />
                    </Router>
                </QueryClientProvider>
            );
        });

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`ID`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-day`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Day of the Week`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-startTime`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Start Time`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-endTime`)).toBeInTheDocument();
        expect(screen.getByLabelText(`End Time`)).toBeInTheDocument();

        expect(await screen.findByTestId(`${testId}-notes`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Notes`)).toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <DriverAvailabilityForm />
                    </Router>
                </QueryClientProvider>
            );
        });

        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        await act(async () => {
            fireEvent.click(cancelButton);
        });

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <DriverAvailabilityForm />
                    </Router>
                </QueryClientProvider>
            );
        });

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(screen.getByText(/Day of the Week is required./)).toBeInTheDocument();
        expect(screen.getByText(/Start Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/End Time is required./)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {

        const mockSubmitAction = jest.fn();

        await act(async () => {
            render(
                <Router>
                    <DriverAvailabilityForm submitAction={mockSubmitAction} />
                </Router>
            );
        });

        await screen.findByTestId("DriverAvailabilityForm-day");

        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        await act(async () => {
            fireEvent.change(dayField, { target: { value: 'Monday' } });
            fireEvent.change(startTimeField, { target: { value: '11:00 AM' } });
            fireEvent.change(endTimeField, { target: { value: '12:00 PM' } });
            fireEvent.change(notesField, { target: { value: 'Some notes' } });
        });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Day of the Week is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Start time is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/End time is required./)).not.toBeInTheDocument();
    });

    test("displays error messages for invalid time format", async () => {
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <DriverAvailabilityForm />
                    </Router>
                </QueryClientProvider>
            );
        });

        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        await act(async () => {
            fireEvent.change(dayField, { target: { value: 'Monday' } });
            fireEvent.change(startTimeField, { target: { value: 'invalid' } });
            fireEvent.change(endTimeField, { target: { value: 'invalid' } });
            fireEvent.change(notesField, { target: { value: 'Some notes' } });
        });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        // There should be 2 error messages for the invalid time format on startTime and endTime
        const errorMessages = screen.getAllByText(/Invalid time format. Use HH:MM AM\/PM./);
        expect(errorMessages).toHaveLength(2); 

        expect(screen.getByTestId("DriverAvailabilityForm-startTime")).toHaveClass("is-invalid");
        expect(screen.getByTestId("DriverAvailabilityForm-endTime")).toHaveClass("is-invalid");
    });
});
