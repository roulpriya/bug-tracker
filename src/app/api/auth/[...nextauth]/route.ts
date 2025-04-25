import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { UserService } from "@/services/user.service";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({user}) {
            if (!user.email) return false;

            try {
                // Create or update user in database using service
                await UserService.upsertUser({
                    email: user.email,
                    name: user.name,
                    image: user.image,
                });
                return true;
            } catch (error) {
                console.error("Error during sign in:", error);
                return false;
            }
        },
        async session({session}) {
            // If we have email in the session, enrich with user data
            if (session?.user?.email) {
                try {
                    const userData = await UserService.getUserByEmail(session.user.email);
                    if (userData) {
                        session.user.name = userData.name;
                    }
                } catch (error) {
                    console.error("Error enriching session:", error);
                }
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
});

export {handler as GET, handler as POST};
