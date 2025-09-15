import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface ContactCompanyNotificationProps {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

export const ContactCompanyNotification = ({
  name,
  email,
  company,
  phone,
  message,
}: ContactCompanyNotificationProps) => (
  <Html>
    <Head />
    <Preview>New Contact Form Submission from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New Contact Form Submission</Heading>
        <Text style={paragraph}>You have received a new message from your website contact form.</Text>
        <Hr style={hr} />
        <Section>
          <Row style={row}>
            <Column style={label}>Name:</Column>
            <Column style={value}>{name}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Email:</Column>
            <Column style={value}><a href={`mailto:${email}`} style={link}>{email}</a></Column>
          </Row>
          {company && (
            <Row style={row}>
              <Column style={label}>Company:</Column>
              <Column style={value}>{company}</Column>
            </Row>
          )}
          {phone && (
             <Row style={row}>
              <Column style={label}>Phone:</Column>
              <Column style={value}>{phone}</Column>
            </Row>
          )}
        </Section>
        <Hr style={hr} />
        <Heading as="h2" style={messageHeading}>Message:</Heading>
        <Text style={messageText}>
          {message}
        </Text>
        <Hr style={hr} />
        <Text style={footer}>This email was sent from the contact form on Boxmoc.</Text>
      </Container>
    </Body>
  </Html>
);

export default ContactCompanyNotification;

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

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "600",
  color: "#484848",
  padding: "0 40px",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#5E6A7D",
  padding: "0 40px",
};

const messageHeading = {
  fontSize: "18px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "600",
  color: "#484848",
  padding: "0 40px",
  marginTop: '20px',
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const row = {
    padding: "0 40px",
};

const label = {
    fontSize: "15px",
    color: "#5E6A7D",
    width: '100px',
    paddingBottom: '8px'
};

const value = {
    fontSize: "15px",
    color: "#484848",
};

const messageText = {
  ...paragraph,
  padding: "0 40px",
  whiteSpace: "pre-wrap" as const,
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
