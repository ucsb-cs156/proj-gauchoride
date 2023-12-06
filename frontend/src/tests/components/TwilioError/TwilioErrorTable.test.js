import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TwilioErrorTable from "main/components/Twilio/TwilioErrorTable";
import { firstPagedFixture, secondPagedFixture, thirdPagedFixture } from "fixtures/twilioErrorFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

function convertDateToInt(dateString) {
  const digitsOnly = dateString.replace(/\D/g, '');
  const intValue = parseInt(digitsOnly);
  return intValue;
}

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("TwilioErrorTable tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const queryClient = new QueryClient();

    

    test("Renders correctly for empty", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/chat/getErrors").reply(200, {
          content: [], totalPages: 0
          });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TwilioErrorTable />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Page: 1/)).toBeInTheDocument();
        });

        const nextButton = screen.getByTestId("PagedTwilioErrorTable-next-button");
        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toBeDisabled();

        const previousButton = screen.getByTestId("PagedTwilioErrorTable-previous-button");
        expect(previousButton).toBeInTheDocument();
        expect(previousButton).toBeDisabled();
    });

    test("renders correctly for 1 page", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/chat/getErrors",  { params: { page: 0, size: 10 } }).reply(200, firstPagedFixture);
        axiosMock.onGet("/api/chat/getErrors",  { params: { page: 1, size: 10 } }).reply(200, secondPagedFixture);
        axiosMock.onGet("/api/chat/getErrors",  { params: { page: 2, size: 10 } }).reply(200, thirdPagedFixture);
  
        const {getByText, getByTestId} = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                  <TwilioErrorTable />
                </MemoryRouter>
            </QueryClientProvider>
        );

      await waitFor(() => {
        expect(axiosMock.history.get.length).toBe(1);
      });
      expect(axiosMock.history.get[0].url).toBe("/api/chat/getErrors");
      expect(axiosMock.history.get[0].params).toEqual({ page: 0, size: 10 });

      const expectedHeaders = ['Id', 'Timestamp', 'Error Message', 'Content', 'Sender', 'Receiver'];
        const expectedFields = ['id', 'timestamp', 'errorMessage', 'content', 'sender', 'receiver'];
        const testId = "PagedTwilioErrorTable";

        expectedHeaders.forEach((headerText) => {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

      const nextButton = screen.getByTestId("PagedTwilioErrorTable-next-button");
      expect(nextButton).toBeInTheDocument();
      expect(nextButton).not.toBeDisabled();

      const previousButton = screen.getByTestId("PagedTwilioErrorTable-previous-button");
      expect(previousButton).toBeInTheDocument();
      expect(previousButton).toBeDisabled();

      for (let i = 29; i >= 0; i--){
        if(i > 20){
          expect(screen.getByText(`EM${i}`)).toBeInTheDocument();
        }else{
          expect(screen.queryByText(`EM${i}`)).not.toBeInTheDocument();
        }
      }
      expect(screen.getByText(`2024-08-04 01:09:08`)).toBeInTheDocument();
      expect(screen.getByText(`2024-11-24 21:51:17`)).toBeInTheDocument();
      
      const timestampCells = document.querySelectorAll('[data-testid^="PagedTwilioErrorTable-cell-row"][data-testid$="-col-timestamp"]');
      const timestamps = Array.from(timestampCells).map(cell => cell.textContent);

// Check if the timestamps are in reverse order
for (let i = 1; i < timestamps.length; i++) {
  expect(convertDateToInt(timestamps[i])).toBeLessThanOrEqual(convertDateToInt(timestamps[i - 1])); // Compare as integers for reverse order
}
      
      
      
      expect(screen.getByText(`Page: 1`)).toBeInTheDocument();
      fireEvent.click(nextButton);

      await waitFor(() => {expect(screen.getByText(`Page: 2`)).toBeInTheDocument();});
      expect(previousButton).toBeEnabled();
      expect(nextButton).toBeEnabled();

      fireEvent.click(previousButton);
      await waitFor(() => { expect(screen.getByText(`Page: 1`)).toBeInTheDocument();});
      expect(previousButton).toBeDisabled();
      expect(nextButton).toBeEnabled();

      fireEvent.click(nextButton);
      await waitFor(() => { expect(screen.getByText(`Page: 2`)).toBeInTheDocument();});

      fireEvent.click(nextButton);
      await waitFor(() => { expect(screen.getByText(`Page: 3`)).toBeInTheDocument();});

      expect(previousButton).toBeEnabled();
      expect(nextButton).toBeDisabled();
      
    });

    



});


