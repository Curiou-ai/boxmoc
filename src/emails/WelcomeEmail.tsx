import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Button,
  Section
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  appName: string;
}

export const WelcomeEmail = ({
  name,
  appName = "Boxmoc",
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to {appName}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'/static/boxmoc-logo.png'}
          width="42"
          height="42"
          alt={appName}
          style={logo}
        />
        <Heading style={heading}>Welcome aboard, {name}!</Heading>
        <Text style={paragraph}>
          We're thrilled to have you join the {appName} community. You're now ready to start creating stunning designs for packaging, promotions, and events with the power of AI.
        </Text>
        <Text style={paragraph}>
          To get started, simply log in to your account and explore the creator dashboard.
        </Text>
        <Section style={{ textAlign: "center" }}>
           <Button href={`https://boxmoc.com/creator`} style={button}>
              Start Designing
            </Button>
        </Section>
        <Text style={paragraph}>
          If you have any questions, feel free to visit our{" "}
          <Link href="https://example.com/help" style={link}>
            Help Center
          </Link>
          .
        </Text>
        <Text style={paragraph}>
          — The {appName} Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
};

const logo = {
  margin: "0 auto",
  backgroundColor: '#778BCA',
  borderRadius: '8px',
  padding: '5px'
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "600",
  color: "#484848",
  padding: "15px 30px 0",
  textAlign: "center" as const,
};

const paragraph = {
  margin: "15px 0",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
  padding: "0 30px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#778BCA",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
  border: 'none',
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};
