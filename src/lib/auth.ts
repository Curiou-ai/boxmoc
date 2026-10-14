import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma";
import { dash } from "@better-auth/infra";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email-service";
import WelcomeEmail from "@/emails/WelcomeEmail";
import SignInNotificationEmail from '@/emails/SignInNotificationEmail';
// import { Pool } from "pg";

// const database = new Pool({
//   connectionString: `${process.env.POSTGRES_PRISMA_URL}`,
// });

// export const auth = betterAuth({
//   database: database,
//   baseURL: "http://localhost:3000/",
//   emailAndPassword: { enabled: true },
// });


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true, // Natively handles password hashing via internal secure algorithms
        requireEmailVerification: false // Flip to true when email server configuration is ready
    },
    // Add OAuth providers seamlessly without managing dashboard redirects manually
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    // ... your existing config
    plugins: [
        // ... other plugins
        dash()
    ],
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // Executed inside an application lifecycle loop securely
                    try {
                        const stripeCustomer = await stripe.customers.create({
                            email: user.email,
                            name: user.name,
                            metadata: { userId: user.id },
                        });

                        await prisma.b_User.update({
                            where: { id: user.id },
                            data: { stripeCustomerId: stripeCustomer.id },
                        });

                        await sendEmail({
                            to: user.email,
                            subject: "Welcome to Boxmoc!",
                            react: WelcomeEmail({ name: user.name, appName: "Boxmoc" }),
                        });
                    } catch (error) {
                        console.error("Post-registration background execution failure:", error);
                    }
                },
            },
        },
        // Hook added to catch every successful login session generation
        session: {
            create: {
                after: async (session) => {
                    try {
                        // Better Auth sessions only contain the userId, fetch the email from your DB
                        const user = await prisma.b_User.findUnique({
                            where: { id: session.userId }
                        });

                        if (!user) return;

                        await sendEmail({
                            to: user.email,
                            subject: `New Sign-In to Your Boxmoc Account`,
                            react: SignInNotificationEmail({
                                email: user.email,
                                signInTime: new Date(session.createdAt),
                                ipAddress: session.ipAddress || undefined,
                                userAgent: session.userAgent || undefined,
                                appName: "Boxmoc"
                            })
                        });
                    } catch (error) {
                        console.error("Post-signin lifecycle notification hook failure:", error);
                    }
                }
            }
        }
    },
});