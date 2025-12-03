'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, FileText, Hash } from 'lucide-react';
import useStore from '@/store/useStore';
import { searchChapters } from '@/lib/searchService';

export default function SearchModal() {
    const { isSearchModalOpen, setSearchModalOpen, setCurrentChapter } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (!searchQuery || searchQuery.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const searchResults = await searchChapters(searchQuery);
                setResults(searchResults);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(performSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleResultClick = (result) => {
        setCurrentChapter({
            id: result.chapterId,
            title: result.chapterTitle,
            source: 'local',
            contentPath: `/content/${result.chapterId}.html`
        });
        setSearchModalOpen(false);
        setSearchQuery('');
    };

    const handleClose = () => {
        setSearchModalOpen(false);
        setSearchQuery('');
        setResults([]);
    };

    if (!isSearchModalOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Search Input */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                        <Search className="text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search through all chapters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-lg"
                        />
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[500px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">Searching...</p>
                            </div>
                        ) : results.length === 0 && searchQuery.length >= 2 ? (
                            <div className="p-8 text-center">
                                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-8 text-center">
                                <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">Type to search through all chapters</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                {results.map((result, index) => (
                                    <motion.button
                                        key={`${result.chapterId}-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        onClick={() => handleResultClick(result)}
                                        className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {result.type === 'heading' ? (
                                                    <Hash className="w-5 h-5 text-blue-500" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                        {result.chapterTitle}
                                                    </span>
                                                    {result.heading && result.type !== 'heading' && (
                                                        <>
                                                            <span className="text-gray-400">›</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                                                {result.heading}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                                                    {result.content}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {results.length > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                                {results.length} result{results.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
