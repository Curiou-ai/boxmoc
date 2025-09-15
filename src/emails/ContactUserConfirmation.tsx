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
  Hr,
} from "@react-email/components";
import * as React from "react";

interface ContactUserConfirmationProps {
  name: string;
  message: string;
  companyName: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ContactUserConfirmation = ({
  name,
  message,
  companyName = "Boxmoc",
}: ContactUserConfirmationProps) => (
  <Html>
    <Head />
    <Preview>We've received your message!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'/static/boxmoc-logo.png'}
          width="42"
          height="42"
          alt={companyName}
          style={logo}
        />
        <Heading style={heading}>Thanks for reaching out, {name}!</Heading>
        <Text style={paragraph}>
          We've successfully received your message and our team will get back to you as soon as possible. We appreciate your patience.
        </Text>
        <Text style={paragraph}>
          For your records, here is a copy of your message:
        </Text>
        <Hr style={hr} />
        <Text style={messagePreview}>{message}</Text>
        <Hr style={hr} />
        <Text style={paragraph}>
          In the meantime, feel free to visit our{" "}
          <Link href="https://example.com/help" style={link}>
            Help Center
          </Link>
          .
        </Text>
        <Text style={paragraph}>
          — The {companyName} Team
        </Text>
      </Container>
      <Text style={footer}>
        {companyName}, Inc. | Your Address Here
      </Text>
    </Body>
  </Html>
);

export default ContactUserConfirmation;

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
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
  padding: "0 30px",
};

const messagePreview = {
  ...paragraph,
  padding: "20px 30px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
  fontStyle: "italic",
  color: "#5E6A7D"
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};
