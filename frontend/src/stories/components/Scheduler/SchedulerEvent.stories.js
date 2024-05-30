import React from 'react';
import SchedulerEvent from "main/components/Scheduler/SchedulerEvent";
import { scheduleEventsFixtures } from 'fixtures/scheduleEventsFixtures';

export default {
    title: 'components/Scheduler/SchedulerEvent',
    component: SchedulerEvent
};

const Template = (args) => {
    return (
        <SchedulerEvent {...args} />
    )
}

export const Default = Template.bind({});

Default.args = {
    event: scheduleEventsFixtures.oneEvent
};