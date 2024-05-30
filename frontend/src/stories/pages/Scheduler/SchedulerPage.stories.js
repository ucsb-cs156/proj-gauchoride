import React from 'react';

import SchedulerPage from 'main/pages/Scheduler/SchedulerPage';

import { rideFixtures } from 'fixtures/rideFixtures';
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';
import { shiftFixtures } from 'fixtures/shiftFixtures';

export default {
    title: 'pages/Scheduler/SchedulerPage',
    component: SchedulerPage
};

const Template = () => <SchedulerPage />;

export const Default = Template.bind({});