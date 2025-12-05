'use client';

import React, { useEffect, useState, useRef } from 'react';
import useStore from '@/store/useStore';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { getChapter } from '@/lib/firestoreService';
import TestArea from '../TestArea';

const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse max-w-3xl mx-auto mt-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl mt-8" />
    </div>
);

export default function CenterPanel() {
    const { currentChapter, isLeftPanelOpen, isRightPanelOpen } = useStore();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchChapterContent = async () => {
            if (currentChapter) {
                setLoading(true);
                try {
                    // If chapter has content property, use it directly
                    if (currentChapter.content) {
                        setContent(currentChapter.content);
                    } else if (currentChapter.source === 'local') {
                        // If it's a local chapter or heading
                        // If it's a heading, it might not have contentPath directly if we didn't put it there.
                        // But wait, if we click a heading, we want to jump to that heading in the content.
                        // For now, let's assume we want to load the file.
                        // We need to find the contentPath. 
                        // If currentChapter doesn't have it, maybe it's a child. 
                        // But we don't have easy access to parent here without searching.

                        // BETTER FIX: Let's assume for now we only support clicking the main chapter for content loading,
                        // OR we ensure headings have contentPath too.

                        const path = currentChapter.contentPath;
                        if (path) {
                            console.log("Fetching local content from:", path);
                            const res = await fetch(path);
                            if (res.ok) {
                                const html = await res.text();
                                setContent(html);

                                // If it's a heading, scroll to it after render (simple timeout for now)
                                if (currentChapter.type === 'heading') {
                                    setTimeout(() => {
                                        const elementId = currentChapter.id;
                                        const element = document.getElementById(elementId);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }, 500);
                                } else if (currentChapter.type === 'quiz') {
                                    // For quiz, wait longer for TestArea component to render
                                    setTimeout(() => {
                                        const elementId = currentChapter.id;
                                        const element = document.getElementById(elementId);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        } else {
                                            // Fallback: scroll to bottom if element not found
                                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                        }
                                    }, 1000);
                                }
                            } else {
                                console.error("Failed to fetch:", path, res.status);
                                throw new Error(`Failed to load local content: ${res.status}`);
                            }
                        } else {
                            // If no content path, maybe it's a heading without path.
                            // We should probably show a message or try to find parent.
                            console.warn("No contentPath for local item:", currentChapter);
                            setContent(`<div class="p-4">Select the main chapter to view content.</div>`);
                        }
                    } else {
                        // Otherwise fetch from Firestore
                        const chapterData = await getChapter(currentChapter.id);
                        if (chapterData && chapterData.content) {
                            setContent(chapterData.content);
                        } else {
                            // Fallback to demo content
                            setContent(`
                                <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">${currentChapter.title}</h1>
                                <p class="text-lg leading-relaxed mb-4 text-gray-900 dark:text-gray-300">
                                    This chapter doesn't have content yet. Admin can add content using the "Add Content" button.
                                </p>
                            `);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching chapter:', error);
                    setContent(`
                        <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Error Loading Chapter</h1>
                        <p class="text-lg leading-relaxed mb-4 text-red-600 dark:text-red-400">
                            Failed to load chapter content. Please try again.
                        </p>
                    `);
                }
                setLoading(false);
            } else {
                setContent(null);
            }
        };

        fetchChapterContent();
    }, [currentChapter]);

    // Trigger MathJax to process the content after it's loaded
    useEffect(() => {
        if (content && typeof window !== 'undefined' && window.MathJax) {
            window.MathJax.typesetPromise().catch((err) => console.error('MathJax typeset error:', err));
        }
    }, [content]);

    // 3D Scroll Effect
    const containerRef = useRef(null);
    const { scrollY } = useScroll({ container: containerRef });
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const rotateX = useTransform(smoothVelocity, [-3000, 0, 3000], [15, 0, -15]);

    // Dynamically adjust max-width based on sidebar state and screen size
    // Mobile: full width, Desktop varies by sidebar state
    const getMaxWidth = () => {
        // On mobile, always use full width
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            return 'max-w-full';
        }
        // Desktop: adjust based on sidebars
        if (!isLeftPanelOpen && !isRightPanelOpen) return 'max-w-5xl';
        if (isLeftPanelOpen && isRightPanelOpen) return 'max-w-3xl';
        return 'max-w-4xl';
    };

    return (
        <div
            ref={containerRef}
            className="h-full w-full overflow-y-auto custom-scrollbar perspective-1000 pb-20"
        >
            {!currentChapter ? (
                <div className="flex items-center justify-center h-full p-8 perspective-1000">
                    <motion.div
                        initial={{ rotateY: -15, rotateX: 5, scale: 0.9, opacity: 0 }}
                        animate={{ rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full max-w-md aspect-[3/4] bg-gradient-to-br from-white/80 via-gray-100/50 to-white/80 dark:from-zinc-900/80 dark:via-black/50 dark:to-zinc-900/80 backdrop-blur-xl rounded-r-2xl rounded-l-md border-r border-t border-b border-white/20 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center text-center p-12 group hover:shadow-cyan-500/20 transition-shadow duration-500"
                    >
                        {/* Book Spine Effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-900 rounded-l-md shadow-inner" />
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10" />

                        {/* Content */}
                        <div className="relative z-10 space-y-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="w-32 h-32 mx-auto bg-gradient-to-tr from-cyan-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                                <span className="text-6xl relative z-10">🎧</span>
                                <div className="absolute bottom-2 right-6 text-2xl">⚡</div>
                            </motion.div>

                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 font-serif tracking-tight drop-shadow-sm">
                                    Audio Code Book
                                </h1>
                                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent" />
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-mono">
                                    Interactive Learning
                                </p>
                            </div>

                            <div className="pt-8">
                                <p className="text-gray-600 dark:text-gray-300 font-medium italic">
                                    "Select a chapter from the library<br />to begin your journey."
                                </p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 rounded-r-2xl pointer-events-none" />
                        <div className="absolute top-4 right-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl" />
                        <div className="absolute bottom-4 left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
                    </motion.div>
                </div>
            ) : (
                <div className={`${getMaxWidth()} mx-auto`}>
                    {loading ? (
                        <SkeletonLoader />
                    ) : (
                        <motion.div
                            style={{ rotateX, transformStyle: "preserve-3d" }}
                            className="origin-top"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                            {currentChapter && <TestArea chapterId={currentChapter.id} />}
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
