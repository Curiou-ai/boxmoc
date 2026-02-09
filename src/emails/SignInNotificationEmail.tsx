import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import { format } from "date-fns";
import * as React from "react";

interface SignInNotificationEmailProps {
  appName: string;
  email: string;
  signInTime: Date;
  ipAddress?: string;
  userAgent?: string | null;
}

export const SignInNotificationEmail = ({
  appName,
  email,
  signInTime,
  ipAddress,
  userAgent,
}: SignInNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Security Alert: New Sign-In to Your {appName} Account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New Sign-In to Your {appName} Account</Heading>
        <Text style={paragraph}>
          We're writing to let you know that there was a recent sign-in to your {appName} account associated with the email <strong style={strong}>{email}</strong>.
        </Text>
        <Section style={detailsSection}>
          <Text style={detailsText}>
            <strong>Time:</strong> {format(signInTime, "PPPppp")}
          </Text>
          {ipAddress && (
            <Text style={detailsText}>
              <strong>IP Address:</strong> {ipAddress}
            </Text>
          )}
          {userAgent && (
            <Text style={detailsText}>
              <strong>Device:</strong> {userAgent}
            </Text>
          )}
        </Section>
        <Text style={paragraph}>
          If this was you, you can safely ignore this email.
        </Text>
        <Text style={paragraph}>
          If you don't recognize this activity, please change your password immediately and contact our support team.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This is an automated security notification.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SignInNotificationEmail;

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
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#5E6A7D",
  padding: "0 40px",
};

const strong = {
  color: "#484848",
  fontWeight: "600",
};

const detailsSection = {
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
  margin: "16px 40px",
  padding: "16px",
  border: "1px solid #e6ebf1",
};

const detailsText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#3c4149",
  margin: "0 0 8px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
