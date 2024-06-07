import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DriverAvailabilityTable from 'main/components/Driver/DriverAvailabilityTable';
import { useCurrentUser } from 'main/utils/currentUser'
// import { Button } from 'react-bootstrap';

export default function DriverAvailabilityIndexPage() {

    const currentUser = useCurrentUser();

    const { data: availabilities, error: _error, status: _status } =
        useBackend(
            // Stryker disable all : hard to test for query caching
            ["/api/driverAvailability/admin/all"],
            { method: "GET", url: "/api/driverAvailability/admin/all" },
            []
            // Stryker restore all 
        );

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Driver Availabilities</h1>
                <DriverAvailabilityTable Availability={availabilities} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}