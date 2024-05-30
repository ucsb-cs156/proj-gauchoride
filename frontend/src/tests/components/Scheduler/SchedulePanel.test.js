import React from 'react';
import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom'
import { BrowserRouter as Router } from 'react-router-dom';

import SchedulerPanel from 'main/components/Scheduler/SchedulerPanel';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('SchedulerPanel tests', () => {
    const queryClient = new QueryClient();
    const events = [
        {
            id: 1,
            title: 'Meeting with Bob',
            day: 'Monday',
            startTime: '02:00PM',
            endTime: '03:00PM',
            description: 'Discuss the new project milestones.',
            actions: []
        },
        {
            id: 2,
            title: 'Lunch with Alice',
            day: 'Wednesday',
            startTime: '12:00PM',
            endTime: '01:00PM',
            description: 'Casual lunch.',
            actions: []
        },
        {
            id: 3,
            title: 'Gym',
            day: 'Friday',
            startTime: '06:00AM',
            endTime: '07:00AM',
            description: 'Morning workout.',
            actions: []
        },
    ];

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const hours = [
        '', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', 
        '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
        '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', 
        '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
    ];

    test('renders without crashing', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchedulerPanel />
                </Router>
            </QueryClientProvider>
        );

        daysOfWeek.forEach(day => {
            const dayTitle = screen.getByTestId(`SchedulerPanel-${day}-title`);
            expect( dayTitle ).toBeInTheDocument();
            const { getByText } = within(dayTitle);
            expect(getByText(day)).toBeInTheDocument();
        });

        hours.forEach(hour => {
            const hourSlot = screen.getByTestId(`SchedulerPanel-${hour.replace(' ', '-')}-title`);
            expect(hourSlot).toBeInTheDocument();
            const { getByTestId } = within(hourSlot);
            expect(getByTestId(`SchedulerPanel-${hour.replace(' ', '-')}-label`)).toBeInTheDocument();
        });

        expect(screen.getAllByTestId('SchedulerPanel-base-slot').length).toBe(161);
    });

    test('renders events on correct days', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchedulerPanel Events={events} />
                </Router>
            </QueryClientProvider>
        );

        events.forEach(event => {
            expect(screen.getAllByTestId(`SchedulerEvent-${event.id}`).length).toBe(1);
            const dayColumn = screen.getByTestId(`SchedulerPanel-${event.day}-column`);
            expect(dayColumn).toBeInTheDocument();
            const { getByTestId } = within(dayColumn);
            expect(getByTestId(`SchedulerEvent-${event.id}`)).toBeInTheDocument();
        });
    });

    test('renders without events', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchedulerPanel Events={[]} />
                </Router>
            </QueryClientProvider>
        );

        daysOfWeek.forEach(day => {
            expect(screen.getByText(day)).toBeInTheDocument();
        });

        hours.forEach(hour => {
            if (hour) {
                expect(screen.getByText(hour)).toBeInTheDocument();
            }
        });
    });
});
