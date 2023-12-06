import React from 'react';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PagedTwilioErrorTable from 'main/components/Twilio/TwilioErrorTable';

const TwilioErrorPage = () => {
    return (
        <BasicLayout>
        <div className="twilio-errors">
            <h1>Twilio Errors</h1>
            <PagedTwilioErrorTable />
        </div>
        </BasicLayout>
    );
}

export default TwilioErrorPage;
