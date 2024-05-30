import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RideForm from "main/components/Ride/RideForm";
import { rideFixtures } from "fixtures/rideFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RideForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Day of Week", "Pick Up Time", "Drop Off Time", "Pick Up Building", "Drop Off Building", "Room Number for Dropoff", "Course Number"];
    const testId = "RideForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideForm />
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
                    <RideForm initialContents={rideFixtures.oneRide} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("validates that end time cannot be earlier than start time", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideForm />
                </Router>
            </QueryClientProvider>
        );

        // Select a day
        fireEvent.change(screen.getByTestId("RideForm-day"), { target: { value: "Monday" } });

        // Set invalid times
        fireEvent.change(screen.getByTestId("RideForm-start"), { target: { value: "11:00AM" } });
        fireEvent.change(screen.getByTestId("RideForm-end"), { target: { value: "10:00AM" } });

        // Try to submit the form
        fireEvent.click(screen.getByTestId("RideForm-submit"));

        // Check for the validation message
        await waitFor(() => expect(screen.getByText("End time must be later than start time.")).toBeInTheDocument());

        // Set valid times
        fireEvent.change(screen.getByTestId("RideForm-start"), { target: { value: "11:00AM" } });
        fireEvent.change(screen.getByTestId("RideForm-end"), { target: { value: "11:30AM" } });

        // Try to submit the form again
        fireEvent.click(screen.getByTestId("RideForm-submit"));

        // Check that the validation message is not present
        await waitFor(() => expect(screen.queryByText("End time must be later than start time.")).not.toBeInTheDocument());
    });

});