'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MouseShadow from '@/components/MouseShadow';
import Dashboard from '@/components/Dashboard';
import useStore from '@/store/useStore';

export default function DashboardPage() {
    const { theme } = useStore();
    const router = useRouter();

    // Handle Theme
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <MouseShadow color={theme === 'dark' ? "100, 200, 255" : "10, 100, 200"} intensity={0.5} lag={0.1} />
            <Navbar />
            <div className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    <button
                        onClick={() => router.push('/')}
                        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Reader</span>
                    </button>
                    <Dashboard />
                </div>
            </div>
        </div>
    );
}
