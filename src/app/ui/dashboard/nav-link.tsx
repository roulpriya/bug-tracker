'use client';
import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';

type Link = {
    name: string;
    href: string;
    icon: React.ElementType;
};

const links: Link[] = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon
    },
    {
        name: 'Customers',
        href: '/dashboard/customers',
        icon: UserGroupIcon
    },
    {
        name: 'Documents',
        href: '/dashboard/documents',
        icon: DocumentDuplicateIcon
    },
];

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex items-center space-x-2 rounded-md p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
                            pathname === link.href ? 'bg-gray-100 dark:bg-gray-700' : ''
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
