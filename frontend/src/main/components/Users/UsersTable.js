
import OurTable, { ButtonColumn } from "main/components/OurTable"
import { useBackendMutation } from "main/utils/useBackend";

export default function UsersTable({ users }) {
    function cellToAxiosParamsToggleRider(cell) {
        return {
            url: "/api/admin/users/toggleRider",
            method: "POST",
            params: {
                id: cell.row.values.id
            }
        }
    }
    // Stryker disable all : hard to test for query caching
    const toggleRiderMutation = useBackendMutation(
        cellToAxiosParamsToggleRider,
        {},
        ["/api/admin/users"]
    );
    // Stryker enable all 

     // Stryker disable next-line all : TODO try to make a good test for this
    const toggleRiderCallback = async (cell) => { toggleRiderMutation.mutate(cell); }

    //toggleAdmin
    function cellToAxiosParamsToggleAdmin(cell) {
        return {
            url: "/api/admin/users/toggleAdmin",
            method: "POST",
            params: {
                id: cell.row.values.id
            }
        }
    }

    // Stryker disable all : hard to test for query caching
    const toggleAdminMutation = useBackendMutation(
        cellToAxiosParamsToggleAdmin,
        {},
        ["/api/admin/users"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const toggleAdminCallback = async (cell) => { toggleAdminMutation.mutate(cell); }


    //toggleDriver
    function cellToAxiosParamsToggleDriver(cell) {
        return {
            url: "/api/admin/users/toggleDriver",
            method: "POST",
            params: {
                id: cell.row.values.id
            }
        }
    }

    // Stryker disable all : hard to test for query caching
    const toggleDriverMutation = useBackendMutation(
        cellToAxiosParamsToggleDriver,
        {},
        ["/api/admin/users"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const toggleDriverCallback = async (cell) => { toggleDriverMutation.mutate(cell); }


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
        {
            Header: 'Rider',
            id: 'rider',
            accessor: (row, _rowIndex) => String(row.rider) // hack needed for boolean values to show up
        }
    ];

    const buttonColumn = [
        ...columns,
        ButtonColumn("Toggle Admin", "primary", toggleAdminCallback, "UsersTable"),
        ButtonColumn("Toggle Driver", "success", toggleDriverCallback, "UsersTable"),
        ButtonColumn("Toggle Rider", "danger", toggleRiderCallback, "UsersTable")
    ]

    users.sort((a, b) => {
        if (a.familyName === b.familyName) {
            if (a.givenName === b.givenName) {
                return a.id - b.id;
            }
            return a.givenName < b.givenName ? -1 : 1;
        }
        return a.familyName < b.familyName ? -1 : 1;
    });

    return <OurTable
        data={users}
        columns={buttonColumn}
        testid={"UsersTable"}
    />;
};