import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RiderApplicationEditForm from "main/components/RiderApplication/RiderApplicationEditForm";
import { riderApplicationFixtures } from "fixtures/riderApplicationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RiderApplicationEditForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Email", "Description"];
    const testId = "RiderApplicationEditForm";

    test('handleAction submits data and navigates', async () => {
        const mockSubmitAction = jest.fn();
    
        render(
            <QueryClientProvider client={queryClient}>
                <RiderApplicationEditForm
                    initialContents={{ id: 1,
                        userId: 'user123',
                        status: 'pending',
                        email: 'test@example.com',
                        created_date: '2024-03-06',
                        updated_date: '2024-03-06',
                        cancelled_date: null,
                        notes: 'This is a note.',
                        perm_number: '1234567',
                        description: 'This is a test description.', }}
                    submitAction={mockSubmitAction}
                    email="test@example.com"
                />
            </QueryClientProvider>
        );
    
        // Trigger the button click
        fireEvent.click(screen.getByTestId(`${testId}-approve`));
    
        // Check if submitAction is called with the correct arguments
        expect(mockSubmitAction).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'accepted' })
        );
    
        // Check if navigate is called with the correct argument
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    // Add other test cases...

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationEditForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Return/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });

    });

    test("renders correctly when passing in initialContents with status declined", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationEditForm initialContents={{ id: 1,
                    userId: 'user123',
                    status: 'declined',
                    email: 'test@example.com',
                    created_date: '2024-03-06',
                    updated_date: '2024-03-06',
                    cancelled_date: null,
                    notes: 'This is a note.',
                    perm_number: '1234567',
                    description: 'This is a test description.', }} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Return/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });

    test("renders correctly when passing in initialContents with status cancelled", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationEditForm initialContents={{ id: 1,
                    userId: 'user123',
                    status: 'cancelled',
                    email: 'test@example.com',
                    created_date: '2024-03-06',
                    updated_date: '2024-03-06',
                    cancelled_date: null,
                    notes: 'This is a note.',
                    perm_number: '1234567',
                    description: 'This is a test description.', }} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Return/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });

    test("renders correctly when passing in initialContents with status expired", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationEditForm initialContents={{ id: 1,
                    userId: 'user123',
                    status: 'expired',
                    email: 'test@example.com',
                    created_date: '2024-03-06',
                    updated_date: '2024-03-06',
                    cancelled_date: null,
                    notes: 'This is a note.',
                    perm_number: '1234567',
                    description: 'This is a test description.', }} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Return/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationEditForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

});