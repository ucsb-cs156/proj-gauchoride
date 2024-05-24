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


    });


    test("Error messsages on bad input", async () => {

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
        fireEvent.change(startTimeField, { target: { value: '315PM' } });
        fireEvent.change(endTimeField, { target: { value: '4:15PM' } });
        fireEvent.change(notesField, { target: { value: 'test' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText("Please enter time in the format HH:MM AM/PM (e.g., 3:30PM).")).toBeInTheDocument());
    });
});