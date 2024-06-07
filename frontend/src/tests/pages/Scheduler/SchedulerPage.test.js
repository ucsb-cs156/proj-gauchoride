import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import SchedulerPage from 'main/pages/Scheduler/SchedulerPage';

import driverAvailabilityFixtures from 'fixtures/driverAvailabilityFixtures';
import { rideFixtures } from 'fixtures/rideFixtures';
import shiftFixtures from 'fixtures/shiftFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';

import AxiosMockAdapter from "axios-mock-adapter";
import axios from 'axios';

const mockDeleteMutation = jest.fn();
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: () => ({
    mutate: mockDeleteMutation,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('SchedulerPage if backend is not working', () => {
    const queryClient = new QueryClient();

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet('/api/systemInfo').reply(200, systemInfoFixtures.showingNeither);

        axiosMock.onGet('/api/shift/all').timeout();
        axiosMock.onGet('/api/ride_request/all').timeout();
        axiosMock.onGet('/api/driverAvailability/admin/all').timeout();
    });

    test('renders default without crashing', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule']}>
                    <Routes>
                        <Route path="/admin/schedule" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test('navigates to shifts and loads shift events', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/shifts']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(screen.queryByTestId(`ScedulerEvent-${shiftFixtures.threeShifts[0].id}`)).not.toBeInTheDocument());
    });

    test('navigates to ride requests and loads ride events', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/rides']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(screen.queryByTestId(`ScedulerEvent-${rideFixtures.threeRidesTable[0].id}`)).not.toBeInTheDocument());
    });

    test('navigates to driver availability and loads availability events', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/driver']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(screen.queryByTestId(`ScedulerEvent-${driverAvailabilityFixtures.threeAvailability[0].id}`)).not.toBeInTheDocument());
    });
});

describe('SchedulerPage tests', () => {
    const queryClient = new QueryClient();

    const axiosMock = new AxiosMockAdapter(axios);
    
    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        axiosMock.onGet("/api/shift/all").reply(200, shiftFixtures.threeShifts);
        axiosMock.onGet("/api/ride_request/all").reply(200, rideFixtures.threeRidesTable);
        axiosMock.onGet("/api/driverAvailability/admin/all").reply(200, driverAvailabilityFixtures.threeAvailability);
    });

    test('renders default without crashing', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule']}>
                    <Routes>
                        <Route path="/admin/schedule" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        const shifts = screen.getByText('Shifts')
        const rides = screen.getByText('Ride Requests')
        const driver = screen.getByText('Driver Availability')

        expect(shifts).toBeInTheDocument();
        expect(rides).toBeInTheDocument();
        expect(driver).toBeInTheDocument();

        fireEvent.click(shifts);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin/schedule/shifts'));

        fireEvent.click(rides);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin/schedule/rides'));

        fireEvent.click(driver);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin/schedule/driver'));
    });

    test('navigates to wrong page', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/wrong']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId(`SchedulerEvent-1`)).not.toBeInTheDocument();
        });

        expect(screen.queryByTestId('SchedulerPage-create-wrong')).not.toBeInTheDocument();
    });

    test('navigates to shifts and loads shift events', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/shifts']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(`Shift for Driver ${shiftFixtures.threeShifts[0].driverID}`)).toBeInTheDocument();
        });

        expect(screen.getByText(`Shift for Driver ${shiftFixtures.threeShifts[1].driverID}`)).toBeInTheDocument();
        expect(screen.getByText(`Shift for Driver ${shiftFixtures.threeShifts[2].driverID}`)).toBeInTheDocument();

        const createButton = screen.getByText('Create shifts');
        expect(createButton).toBeInTheDocument();

        const createButton2 = screen.getByTestId('SchedulerPage-create-shifts');
        expect(createButton2).toBeInTheDocument();

        fireEvent.click(createButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/shift/create'));
    });

    test('navigates to ride requests and loads ride events', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/rides']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getAllByText(`Ride Request for ${rideFixtures.threeRidesTable[0].student}`).length).toBe(2);
        });

        expect(screen.getByTestId(`SchedulerEvent-${rideFixtures.threeRidesTable[0].id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`SchedulerEvent-${rideFixtures.threeRidesTable[1].id}`)).toBeInTheDocument();
        expect(screen.getByTestId(`SchedulerEvent-${rideFixtures.threeRidesTable[2].id}`)).toBeInTheDocument();

        const createButton = screen.getByText('Create rides');
        expect(createButton).toBeInTheDocument();

        fireEvent.click(createButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/ride/create'));
    });

    test('navigates to driver availability and loads availability events', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/driver']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(`Availability for Driver ${driverAvailabilityFixtures.threeAvailability[0].driverId}`)).toBeInTheDocument();
        });

        expect(screen.getByText(`Availability for Driver ${driverAvailabilityFixtures.threeAvailability[1].driverId}`)).toBeInTheDocument();
        expect(screen.getByText(`Availability for Driver ${driverAvailabilityFixtures.threeAvailability[2].driverId}`)).toBeInTheDocument();

        const createButton = screen.getByText('Create driver');
        expect(createButton).toBeInTheDocument();

        fireEvent.click(createButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/availability/create'));
    });

    test('shift action buttons trigger correct callbacks', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/shifts']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Shift for Driver 1')).toBeInTheDocument();
        });

        const event = screen.getByText('Shift for Driver 1');
        fireEvent.click(event);

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        const editButton = screen.getByText('Edit');
        expect(editButton).toBeInTheDocument();

        const infoButton = screen.getByText('Info');
        expect(infoButton).toBeInTheDocument();

        const deleteButton = screen.getByText('Delete');
        expect(deleteButton).toBeInTheDocument();

        expect(editButton).toHaveClass('btn-primary');
        expect(infoButton).toHaveClass('btn-success');
        expect(deleteButton).toHaveClass('btn-danger');

        fireEvent.click(screen.getByText('Edit'));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/shift/edit/1'));

        fireEvent.click(screen.getByText('Info'));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/shiftInfo/1'));

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(mockDeleteMutation).toHaveBeenCalled();
        });
    });

    test('driver action buttons trigger correct callbacks', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/driver']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(`Availability for Driver ${driverAvailabilityFixtures.threeAvailability[0].driverId}`)).toBeInTheDocument();
        });

        const event = screen.getByText(`Availability for Driver ${driverAvailabilityFixtures.threeAvailability[0].driverId}`);
        fireEvent.click(event);

        await waitFor(() => {
            expect(screen.getByText('Review')).toBeInTheDocument();
        });

        const reviewButton = screen.getByText('Review');
        expect(reviewButton).toBeInTheDocument();

        const deleteButton = screen.getByText('Delete');
        expect(deleteButton).toBeInTheDocument();

        expect(reviewButton).toHaveClass('btn-success');
        expect(deleteButton).toHaveClass('btn-danger');

        fireEvent.click(screen.getByText('Review'));
        await waitFor(()=> expect(mockNavigate).toHaveBeenCalledWith(`/admin/availability/review/${driverAvailabilityFixtures.threeAvailability[0].id}`));

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(mockDeleteMutation).toHaveBeenCalled();
        });
    });

    test('ride action buttons trigger correct callbacks', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/rides']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId(`SchedulerEvent-${rideFixtures.threeRidesTable[0].id}`)).toBeInTheDocument();
        });

        const event = screen.getByTestId(`SchedulerEvent-${rideFixtures.threeRidesTable[0].id}`);
        fireEvent.click(event);

        await waitFor(() => {
            expect(screen.getByText('Edit')).toBeInTheDocument();
        });

        const editButton = screen.getByText('Edit');
        expect(editButton).toBeInTheDocument();

        const deleteButton = screen.getByText('Delete');
        expect(deleteButton).toBeInTheDocument();

        const assignButton = screen.getByText('Assign Driver');
        expect(assignButton).toBeInTheDocument();

        expect(editButton).toHaveClass('btn-primary');
        expect(deleteButton).toHaveClass('btn-danger');
        expect(assignButton).toHaveClass('btn-success');

        fireEvent.click(screen.getByText('Edit'));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/ride/edit/${rideFixtures.threeRidesTable[0].id}`));

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(mockDeleteMutation).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByText('Assign Driver'));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/ride/assigndriver/${rideFixtures.threeRidesTable[0].id}`));
    });
});
