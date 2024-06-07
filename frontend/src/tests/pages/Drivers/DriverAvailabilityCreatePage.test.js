import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DriverAvailabilityCreatePage from "main/pages/Drivers/DriverAvailabilityCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("DriverAvailabilityCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
            <DriverAvailabilityCreatePage />
            </MemoryRouter>
        </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /availability", async () => {
        const queryClient = new QueryClient();
        const availability = {
        id: 5,
        day: "Saturday",
        startTime: "11:40AM",
        endTime: "11:59AM",
        notes: "none",
        };
        const noidavailability = {
        day: "Saturday",
        startTime: "11:40AM",
        endTime: "11:59AM",
        notes: "none",
        };

        axiosMock.onPost("/api/driverAvailability/new").reply(202, availability);

        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
            <DriverAvailabilityCreatePage />
            </MemoryRouter>
        </QueryClientProvider>
        );

        const dayInput = screen.getByLabelText("Day");
        await waitFor(() => {
        expect(dayInput).toBeInTheDocument();
        });

        const startTimeInput = screen.getByLabelText("Start Time");
        expect(startTimeInput).toBeInTheDocument();

        const endTimeInput = screen.getByLabelText("End Time");
        expect(endTimeInput).toBeInTheDocument();

        const notesInput = screen.getByLabelText("Notes");
        expect(notesInput).toBeInTheDocument();

        // Simulating filling out the form
        fireEvent.change(dayInput, { target: { value: availability.day } });
        fireEvent.change(startTimeInput, {
        target: { value: availability.startTime },
        });
        fireEvent.change(endTimeInput, { target: { value: availability.endTime } });
        // fireEvent.change(driverIdInput, { target: { value: String(availability.driverId) } });
        fireEvent.change(notesInput, {
        target: { value: String(availability.notes) },
        });

        const createButton = screen.getByRole("button", { name: /Create/ });

        fireEvent.click(createButton);

        // Wait for the axios call to be made
        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
        expect(axiosMock.history.post[0].params).toEqual(noidavailability);

        expect(mockToast).toBeCalledWith(
        `New Driver Availability Created - id: ${availability.id}`
        );
        expect(mockNavigate).toBeCalledWith({ to: "/availability/" });
    });

    test("missing input should fail", async () => {
        const queryClient = new QueryClient();
        const availability = {};

        axiosMock.onPost("/api/driverAvailability/new").reply(202, availability);

        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
            <DriverAvailabilityCreatePage />
            </MemoryRouter>
        </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Day is required./);
        expect(screen.getByText(/Start Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/End Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/Notes is required./)).toBeInTheDocument();
    });
});
