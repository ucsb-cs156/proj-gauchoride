import React from "react";
import OurTable from "main/components/OurTable";
import { Button } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";

const PagedTwilioErrorTable = () => {

    const testId = "PagedTwilioErrorTable";
    const refreshJobsIntervalMilliseconds = 5000;

    const [selectedPage, setSelectedPage] = React.useState(0);

    const pageSize = 10;

    // Stryker disable all
    const {
        data: page
    } = useBackend(
        ["/api/chat/getErrors"],
        {
            method: "GET",
            url: "/api/chat/getErrors",
            params: {
                page: selectedPage,
                size: pageSize,
            }
        },
        {content: [], totalPages: 0},
        { refetchInterval: refreshJobsIntervalMilliseconds }
    );
    // Stryker restore  all

    const testid = "PagedTwilioErrorTable";

    const previousPageCallback = () => {
        return () => {
            setSelectedPage(selectedPage - 1);
        }
    }

    const nextPageCallback = () => {
        return () => {
            setSelectedPage(selectedPage + 1);
        }
    }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'timestamp',
            accessor: 'timestamp'
        },
        {
            Header: 'errorMessage',
            accessor: 'errorMessage'
        },
        {
            Header: 'content',
            accessor: 'content'
        },
        {
            Header: 'receiver',
            accessor: 'receiver'
        },
        {
            Header: 'sender',
            accessor: 'sender'
        },
    ];

    return (
        <>
            <p>Page: {selectedPage + 1}</p>
            <Button data-testid={`${testId}-previous-button`}onClick={previousPageCallback()} disabled={ selectedPage === 0}>Previous</Button>
            <Button data-testid={`${testId}-next-button`} onClick={nextPageCallback()} disabled={page.totalPages===0 || selectedPage === page.totalPages-1}>Next</Button>
            < OurTable
                data={page.content}
                columns={columns}
                testid={testid}
            />
        </>
    );
}; 

export default PagedTwilioErrorTable;