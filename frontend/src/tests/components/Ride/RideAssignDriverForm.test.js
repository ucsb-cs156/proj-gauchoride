import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RideAssignDriverForm from "main/components/Ride/RideAssignDriverForm";
import { rideFixtures } from "fixtures/rideFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

import driverFixtures from "fixtures/driverFixtures";
import shiftFixtures from "fixtures/shiftFixtures";
import axios from "axios";
import axiosMockAdapter from "axios-mock-adapter";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RideAssignDriverForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Shift Id", "Day of Week", "Start Time", "End Time", "Pick Up Building", "Drop Off Building", "Room Number for Dropoff", "Course Number"];
    const testId = "RideAssignDriverForm";

    const axiosMock = new axiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/drivers").reply(200, driverFixtures.threeDrivers);
        axiosMock.onGet("/api/shifts").reply(200, shiftFixtures.threeShifts);
    });

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideAssignDriverForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Assign Driver/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RideAssignDriverForm initialContents={rideFixtures.oneRide} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Assign Driver/)).toBeInTheDocument();

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
                    <RideAssignDriverForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

});