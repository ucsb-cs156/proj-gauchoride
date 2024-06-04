import { render, waitFor, screen } from "@testing-library/react";
import Footer, { space } from "main/components/Nav/Footer";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("Footer tests", () => {

    const queryClient = new QueryClient();

    const axiosMock = new AxiosMockAdapter(axios);
    
    const setupSystemInfo = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingBoth);
    };

    test("renders correctly ", async () => {
        setupSystemInfo();
        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Footer />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(getByText(/This app is a class project/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/The cartoon Storke Tower images/)).toBeInTheDocument());
    });

    test("space stands for a space", () => {
        expect(space).toBe(" ");
    });

    test("Links are correct", async () => {
        setupSystemInfo();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Footer />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("footer-class-website-link")).toHaveAttribute(
            "href",
            "https://ucsb-cs156.github.io"
        );
        expect(screen.getByTestId("footer-ucsb-link")).toHaveAttribute(
            "href",
            "https://ucsb.edu"
        );
        expect(screen.getByTestId("footer-source-code-link")).toHaveAttribute(
            "href",
            "https://github.com/ucsb-cs156/proj-gauchoride"
        );
        expect(screen.getByTestId("footer-sticker-link")).toHaveAttribute(
            "href",
            "https://www.as.ucsb.edu/sticker-packs"
        );
    });

    // tests taken from https://github.com/ucsb-cs156/proj-courses repo
    test("space stands for a space", () => {
        expect(space).toBe(" ");
    });

    test("Link is correct", async () => {
        setupSystemInfo();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <Footer />
                </MemoryRouter>
            </QueryClientProvider>
        );
        
        expect(screen.getByTestId("footer-sticker-link")).toHaveAttribute(
          "href",
          "https://www.as.ucsb.edu/sticker-packs"
        );
      });
});


