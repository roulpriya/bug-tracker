'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideNav() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 bg-gray-900">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2 p-4">
                    <li>
                        <Link
                            href="/dashboard"
                            className={`block p-2 rounded ${pathname === '/dashboard' || pathname.startsWith('/dashboard') && pathname === '/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/projects"
                            className={`block p-2 rounded ${pathname === '/dashboard/projects' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                        >
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/issues"
                            className={`block p-2 rounded ${pathname === '/dashboard/issues' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                        >
                            Issues
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
