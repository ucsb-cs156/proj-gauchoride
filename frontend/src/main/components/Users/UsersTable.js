import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable"

const columns = [
    {
        Header: 'id',
        accessor: 'id', // accessor is the "key" in the data
    },
    {
        Header: 'First Name',
        accessor: 'givenName',
    },
    {
        Header: 'Last Name',
        accessor: 'familyName',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Admin',
        id: 'admin',
        accessor: (row, _rowIndex) => String(row.admin) // hack needed for boolean values to show up
    },
    {
        Header: 'Driver',
        id: 'driver',
        accessor: (row, _rowIndex) => String(row.driver) // hack needed for boolean values to show up
    },
];
/*
const buttonColumns = [
    ...columns,
        ButtonColumn("Toggle Admin", "danger", postCallback, "UsersTable")
]*/

export default function UsersTable({ users }) {
    return <OurTable
        data={users}
        columns={columns}
        testid={"UsersTable"} />;
};