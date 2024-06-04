import { Container } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";

export const space = " ";

export default function Footer() {
  
  const { data: systemInfo, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/systemInfo"],
            // Stryker disable next-line StringLiteral,ObjectLiteral : since "GET" is default, "" is an equivalent mutation
            { method: "GET", url: "/api/systemInfo" },
            []
        );
  
  return (
    <footer className="bg-light pt-3 pt-md-4 pb-4 pb-md-5">
      <Container>
        <p>
          This app is a class project of{space}
          <a
            data-testid="footer-class-website-link"
            href="https://ucsb-cs156.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            CMPSC 156
          </a>
          {space}
          at
          {space}
          <a data-testid="footer-ucsb-link" href="https://ucsb.edu" target="_blank" rel="noopener noreferrer">
            UCSB
          </a>
          . Check out the source code on
          {space}
          <a
            data-testid="footer-source-code-link"
            href={systemInfo["sourceRepo"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>

        <p>
          See our{space}
          <a
          href="/privacy.html"
          >
            privacy policy
          </a>

        </p>

        <p>
          The cartoon Storke Tower images in the brand logo and favicon for this site were
          developed by Chelsea Lyon-Hayden, Art Director for UCSB Associate Students, and are
          used here by permission of the Executive Director of UCSB Associated Students.
          These images are Copyright © 2021 UCSB Associated Students, and may not be reused
          without express written permission of the Executive Director of UCSB Associated Students.  For more info, visit:
          {space}
          <a data-testid="footer-sticker-link" href="https://www.as.ucsb.edu/sticker-packs">www.as.ucsb.edu/sticker-packs/</a>
          .
        </p>
      </Container>
    </footer>
  );
}