import React from 'react';
import { fireEvent, render, act} from "@testing-library/react";
import usersFixtures from "fixtures/usersFixtures";
import UsersTable from "main/components/Users/UsersTable"

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();


describe("UserTable tests", () => {
    const queryClient = new QueryClient();

    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockedNavigate
    }));

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UsersTable users={[]} />
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three users", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UsersTable users={usersFixtures.threeUsers} />
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content", () => {
        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <UsersTable users={usersFixtures.threeUsers}/>
            </QueryClientProvider>
        );
    
        const expectedHeaders = ["id", "First Name", "Last Name", "Email", "Admin", "Driver", "Rider"];
        const expectedFields = ["id", "givenName", "familyName", "email", "admin", "driver","rider"];
        const testId = "UsersTable";

        expectedHeaders.forEach( (headerText)=> {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-0-col-admin`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-0-col-driver`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-0-col-rider`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-1-col-admin`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-1-col-driver`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-1-col-rider`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-2-col-rider`)).toHaveTextContent("true");
      });

    test("Delete button calls delete callback", async () => {        
        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <UsersTable users={usersFixtures.threeUsers}/>
            </QueryClientProvider>
        );

        const expectedHeaders = ["id", "First Name", "Last Name", "Email", "Admin", "Driver", "Rider"];
        const expectedFields = ["id", "givenName", "familyName", "email", "admin", "driver","rider"];
        const testId = "UsersTable";

        expectedHeaders.forEach( (headerText)=> {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-0-col-admin`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-0-col-driver`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-0-col-rider`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-1-col-admin`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-1-col-driver`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-1-col-rider`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-2-col-rider`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const driverToggleButton = getByTestId('UsersTable-cell-row-0-col-Toggle Driver-button');
        expect(driverToggleButton).toBeInTheDocument();


        await act(async () => {
            fireEvent.click(driverToggleButton);
        });

        expectedHeaders.forEach( (headerText)=> {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-0-col-admin`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-0-col-driver`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-0-col-rider`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-1-col-admin`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-1-col-driver`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-1-col-rider`)).toHaveTextContent("false");
        expect(getByTestId(`${testId}-cell-row-2-col-rider`)).toHaveTextContent("true");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
      });

        const sampleUsers = [
            { id: 2, givenName: 'dkd', familyName: 'sdf', email: 'asdf@example.com', admin: true, driver: false, rider: false },
            { id: 4, givenName: 'asdfa', familyName: 'asdfadsf', email: 'jane@example.com', admin: false, driver: true, rider: true },
            { id: 3, givenName: 'asd12321fa', familyName: 'asdfadsf', email: 'jane@example.com', admin: false, driver: true, rider: true },
            { id: 1, givenName: 'asd34324fa', familyName: 'asdfadsf', email: 'jane@example.com', admin: false, driver: true, rider: true },

        ];
    
        test('initial state of sort should be { keyToSort: "id", direction: "asc" }', () => {
            const { getByText, getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <UsersTable users={sampleUsers}/>
                </QueryClientProvider>
            );

            const expectedHeaders = ["id", "First Name", "Last Name", "Email", "Admin", "Driver", "Rider"];
            const expectedFields = ["id", "givenName", "familyName", "email", "admin", "driver","rider"];
            const testId = "UsersTable";

            expectedHeaders.forEach( (headerText)=> {
                const header = getByText(headerText);
                expect(header).toBeInTheDocument();
            });
    
            expectedFields.forEach( (field)=> {
              const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
              expect(header).toBeInTheDocument();
            });

            expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(getByTestId(`${testId}-cell-row-0-col-givenName`)).toHaveTextContent("asd34324fa");
            expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
            expect(getByTestId(`${testId}-cell-row-1-col-givenName`)).toHaveTextContent("dkd");

            expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
            expect(getByTestId(`${testId}-cell-row-2-col-givenName`)).toHaveTextContent("asd12321fa");
            expect(getByTestId(`${testId}-cell-row-3-col-id`)).toHaveTextContent("4");
            expect(getByTestId(`${testId}-cell-row-3-col-givenName`)).toHaveTextContent("asdfa");

        });
    });

