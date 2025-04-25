'use client';

import {signIn, signOut, useSession} from "next-auth/react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function Home() {
    const {data: session} = useSession();

    return (
        <main
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-300 via-neutral-50 to-white">
            <div
                className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl p-10 space-y-8 text-center border border-white/20">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Welcome to Bug-Tracker
                </h1>
                {session ? (
                    <>
                        <Avatar className="mx-auto w-24 h-24 ring-4 ring-purple-200 ring-offset-2">
                            <AvatarImage src={session.user?.image ?? ""}/>
                            <AvatarFallback
                                className="bg-black text-white text-xl font-bold font-serif">{session.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-xl font-medium text-gray-800">
                            Signed in as <span className="font-semibold text-indigo-950">{session.user?.name}</span>
                        </p>
                        <button
                            onClick={() => signOut()}
                            className="mt-6 w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all shadow-lg hover:shadow-pink-300/50 font-medium"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => signIn("google")}
                            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-indigo-300/50 flex items-center justify-center gap-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="currentColor">
                                <path
                                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                            </svg>
                            Sign in with Google
                        </button>
                        <button
                            onClick={() => signIn("github")}
                            className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-gray-500/50 flex items-center justify-center gap-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="currentColor">
                                <path
                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.241 2.873.118 3.176.77.84 1.231 1.91 1.231 3.22 0 4.61-2.807 5.623-5.479 5.92.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576 4.765-1.587 8.2-6.084 8.2-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Sign in with GitHub
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}
