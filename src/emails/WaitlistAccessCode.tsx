
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
  Section,
  Button
} from "@react-email/components";
import * as React from "react";

interface WaitlistAccessCodeEmailProps {
  accessCode: string;
  companyName: string;
}

export const WaitlistAccessCodeEmail = ({
  accessCode,
  companyName = "Boxmoc",
}: WaitlistAccessCodeEmailProps) => (
  <Html>
    <Head />
    <Preview>Your early access code for {companyName} is here!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'/static/boxmoc-logo.png'}
          width="42"
          height="42"
          alt={companyName}
          style={logo}
        />
        <Heading style={heading}>You're In!</Heading>
        <Text style={paragraph}>
          Thank you for being one of the first to join {companyName}. As promised, here is your unique access code to get early access to the platform.
        </Text>
        <Section style={codeContainer}>
          <Text style={code}>{accessCode}</Text>
        </Section>
        <Text style={paragraph}>
          Click the link below and enter your code to create your account and start designing.
        </Text>
        <Section style={{ textAlign: "center" }}>
           <Button href={`https://boxmoc.com/waitlist`} style={button}>
              Use My Access Code
            </Button>
        </Section>
        <Text style={paragraph}>
          Welcome aboard,
          <br />
          — The {companyName} Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WaitlistAccessCodeEmail;

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

const codeContainer = {
  background: "#f2f3f3",
  borderRadius: "4px",
  margin: "16px auto",
  padding: "20px",
  width: "200px",
  textAlign: "center" as const,
  border: '1px solid #e6ebf1'
};

const code = {
  color: "#000",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "4px",
  margin: 0,
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

