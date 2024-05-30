import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter, Route, Routes } from 'react-router-dom';
import SchedulerPage from 'main/pages/Scheduler/SchedulerPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useBackend } from 'main/utils/useBackend';

const mockedNavigate = jest.fn();

jest.mock('main/utils/useBackend', () => ({
    useBackend: jest.fn(),
    useBackendMutation: jest.fn(() => ({ mutate: jest.fn() })),
}));

const mockDeleteMutation = jest.fn();
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: () => ({
    mutate: mockDeleteMutation,
  }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe('SchedulerPage tests', () => {
    const queryClient = new QueryClient();
    
    beforeEach(() => {
        useBackend.mockImplementation((key, request) => {
            if (request.url.includes('shift')) {
                return { data: shiftsMockData };
            }
            if (request.url.includes('ride_request')) {
                return { data: rideRequestsMockData };
            }
            if (request.url.includes('driverAvailability')) {
                return { data: driverAvailabilityMockData };
            }
        });
    });

    const shiftsMockData = [
        {
            id: 1,
            driverID: 1,
            driverBackupID: 2,
            day: 'Monday',
            shiftStart: '02:00PM',
            shiftEnd: '03:00PM',
        },
    ];

    const rideRequestsMockData = [
        {
            id: 1,
            student: 'Alice',
            day: 'Wednesday',
            startTime: '12:00PM',
            endTime: '01:00PM',
            pickupBuilding: 'Building A',
            dropoffBuilding: 'Building B',
        },
    ];

    const driverAvailabilityMockData = [
        {
            id: 1,
            driverId: 1,
            day: 'Friday',
            startTime: '06:00AM',
            endTime: '07:00AM',
            notes: 'Available',
        },
    ];

    test('renders without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/admin/schedule/shifts']}>
                    <Routes>
                        <Route path="/admin/schedule/:page" element={<SchedulerPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText('Shifts')).toBeInTheDocument();
        expect(screen.getByText('Ride Requests')).toBeInTheDocument();
        expect(screen.getByText('Driver Availability')).toBeInTheDocument();
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
            expect(screen.getByText('Shift for Driver 1')).toBeInTheDocument();
        });
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
            expect(screen.getByText('Ride Request for Alice')).toBeInTheDocument();
        });
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
            expect(screen.getByText('Availability for Driver 1')).toBeInTheDocument();
        });
    });

    test('action buttons trigger correct callbacks', async () => {
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
            expect(screen.getByText('Info')).toBeInTheDocument();
            expect(screen.getByText('Delete')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Edit'));
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/shift/edit/1'));

        fireEvent.click(screen.getByText('Info'));
        // expect(window.location.pathname).toBe('/shiftInfo/1');
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/shiftInfo/1'));

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(mockDeleteMutation).toHaveBeenCalled();
        });
    });
});
