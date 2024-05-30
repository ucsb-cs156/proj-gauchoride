import React from 'react';
import SchedulerPanel from "main/components/Scheduler/SchedulerPanel";
import { scheduleEventsFixtures } from 'fixtures/scheduleEventsFixtures';


export default {
    title: 'components/Scheduler/SchedulerPanel',
    component: SchedulerPanel
};

const Template = (args) => {
    return (
        <SchedulerPanel {...args} />
    )
};


export const Default = Template.bind({});

export const threeEvents = Template.bind({});

threeEvents.args = {
    Events: scheduleEventsFixtures.threeEvents
};

export const sixEvents = Template.bind({});

sixEvents.args = {
    Events: scheduleEventsFixtures.sixEvents
};