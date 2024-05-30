import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import SchedulerEvents from 'main/components/Scheduler/SchedulerEvent';
import { scheduleEventsFixtures } from 'fixtures/scheduleEventsFixtures';

import { QueryClient, QueryClientProvider } from 'react-query';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe('SchedulerEvents tests', () => {
    const queryClient = new QueryClient();

    const event = {
        ...scheduleEventsFixtures.oneEvent,
        actions: [
            {
                text: 'Edit',
                callback: jest.fn()
            },
            {
                text: 'Delete',
                callback: jest.fn()
            }
        ]
    };

    test('renders event with correct styles and popover', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchedulerEvents 
                        event={event}
                        eventColor="lightblue"
                        borderColor="blue"
                    />
                </Router>
            </QueryClientProvider>
        );

        // Check if the event is rendered with the correct title
        expect(screen.getByText(event.title)).toBeInTheDocument();

        // Check if the event card has correct styles
        const card = screen.getByText(event.title).closest('.card');
        expect(card).toHaveStyle('background-color: lightblue');
        expect(card).toHaveStyle('border: 2px solid blue');

        expect(screen.getByText(`${event.startTime} - ${event.endTime}`)).toBeInTheDocument();

        // Simulate a click to show the popover
        fireEvent.click(card);

        // Check if the popover content is correct
        await waitFor(() => expect(screen.getByTestId('SchedulerEvent-description')).toBeInTheDocument());

        // Check if the actions are rendered correctly
        event.actions.forEach(action => {
            expect(screen.getByText(action.text)).toBeInTheDocument();
        });

        // Check if clicking action buttons triggers callbacks
        event.actions.forEach(action => {
            const button = screen.getByText(action.text);
            fireEvent.click(button);
            expect(action.callback).toHaveBeenCalled();
        });

    });


    const heights = [
        { startTime: '12:00PM', endTime: '12:10PM', expectedFontSize: null, expectedHeight: 10 },
        { startTime: '12:00PM', endTime: '12:20PM', expectedFontSize: '10px', expectedHeight: 20 },
        { startTime: '12:00PM', endTime: '12:30PM', expectedFontSize: '12px', expectedHeight: 30 },
        { startTime: '12:00PM', endTime: '12:40PM', expectedFontSize: '14px', expectedHeight: 40 },
        { startTime: '12:00PM', endTime: '01:00PM', expectedFontSize: '16px', expectedHeight: 60 },
        { startTime: '12:00PM', endTime: '02:00PM', expectedFontSize: '16px', expectedHeight: 120 },
        { startTime: '12:00AM', endTime: '02:00PM', expectedFontSize: '16px', expectedHeight: 840 },
        { startTime: '2:00AM', endTime: '02:00PM', expectedFontSize: '16px', expectedHeight: 720 },
    ];
    
    heights.forEach(({ startTime, endTime, expectedFontSize, expectedHeight }) => {
        test(`renders event with height from ${startTime} to ${endTime} with font size ${expectedFontSize}`, async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <SchedulerEvents 
                            event={{ ...event, startTime, endTime }}
                            eventColor="lightblue"
                            borderColor="blue"
                        />
                    </Router>
                </QueryClientProvider>
            );

            // Check if the event card has correct font size
            if(expectedFontSize === null) {
                expect(screen.queryByTestId('SchedulerEvent-title')).not.toBeInTheDocument();
            }
            else {
                const cardText = await screen.findByText(event.title);
                expect(cardText).toHaveStyle(`font-size: ${expectedFontSize}`);
            }

            // Check if the event card has correct height
            const card = screen.getByTestId('SchedulerEvent');
            expect(card).toHaveStyle(`height: ${expectedHeight}px`);

            if(expectedHeight >= 40) {
                expect(screen.getByTestId('SchedulerEvent-title')).toBeInTheDocument();
                const time = screen.getByTestId('SchedulerEvent-time');
                expect(time).toBeInTheDocument();
                expect(time).toHaveStyle('font-size: 12px');
                expect(time).toHaveStyle('text-align: left');

            }
            else if(expectedHeight >= 20) {
                expect(screen.queryByTestId('SchedulerEvent-title')).toBeInTheDocument();
                expect(screen.queryByTestId('SchedulerEvent-time')).not.toBeInTheDocument();
            }
            else {
                expect(screen.queryByTestId('SchedulerEvent-title')).not.toBeInTheDocument();
                expect(screen.queryByTestId('SchedulerEvent-time')).not.toBeInTheDocument();
            }

        });
    });
});