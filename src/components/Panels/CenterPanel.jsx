// 'use client';

// import React, { useEffect, useState } from 'react';
// import useStore from '@/store/useStore';
// import { motion } from 'framer-motion';
// import { getChapter } from '@/lib/firestoreService';
// import TestArea from '../TestArea';

// const SkeletonLoader = () => (
//     <div className="space-y-4 animate-pulse max-w-3xl mx-auto mt-8">
//         <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
//         <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
//         <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
//         <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
//         <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl mt-8" />
//     </div>
// );

// export default function CenterPanel() {
//     const { currentChapter, isLeftPanelOpen, isRightPanelOpen } = useStore();
//     const [content, setContent] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchChapterContent = async () => {
//             if (currentChapter) {
//                 setLoading(true);
//                 try {
//                     // If chapter has content property, use it directly
//                     if (currentChapter.content) {
//                         setContent(currentChapter.content);
//                     } else if (currentChapter.source === 'local') {
//                         // If it's a local chapter or heading
//                         // If it's a heading, it might not have contentPath directly if we didn't put it there.
//                         // But wait, if we click a heading, we want to jump to that heading in the content.
//                         // For now, let's assume we want to load the file.
//                         // We need to find the contentPath. 
//                         // If currentChapter doesn't have it, maybe it's a child. 
//                         // But we don't have easy access to parent here without searching.

//                         // BETTER FIX: Let's assume for now we only support clicking the main chapter for content loading,
//                         // OR we ensure headings have contentPath too.

//                         const path = currentChapter.contentPath;
//                         if (path) {
//                             console.log("Fetching local content from:", path);
//                             const res = await fetch(path);
//                             if (res.ok) {
//                                 const html = await res.text();
//                                 setContent(html);

//                                 // If it's a heading, scroll to it after render (simple timeout for now)
//                                 if (currentChapter.type === 'heading') {
//                                     setTimeout(() => {
//                                         const elementId = currentChapter.id;
//                                         const element = document.getElementById(elementId);
//                                         if (element) {
//                                             element.scrollIntoView({ behavior: 'smooth' });
//                                         }
//                                     }, 500);
//                                 } else if (currentChapter.type === 'quiz') {
//                                     // For quiz, wait longer for TestArea component to render
//                                     setTimeout(() => {
//                                         const elementId = currentChapter.id;
//                                         const element = document.getElementById(elementId);
//                                         if (element) {
//                                             element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                                         } else {
//                                             // Fallback: scroll to bottom if element not found
//                                             window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
//                                         }
//                                     }, 1000);
//                                 }
//                             } else {
//                                 console.error("Failed to fetch:", path, res.status);
//                                 throw new Error(`Failed to load local content: ${res.status}`);
//                             }
//                         } else {
//                             // If no content path, maybe it's a heading without path.
//                             // We should probably show a message or try to find parent.
//                             console.warn("No contentPath for local item:", currentChapter);
//                             setContent(`<div class="p-4">Select the main chapter to view content.</div>`);
//                         }
//                     } else {
//                         // Otherwise fetch from Firestore
//                         const chapterData = await getChapter(currentChapter.id);
//                         if (chapterData && chapterData.content) {
//                             setContent(chapterData.content);
//                         } else {
//                             // Fallback to demo content
//                             setContent(`
//                                 <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">${currentChapter.title}</h1>
//                                 <p class="text-lg leading-relaxed mb-4 text-gray-900 dark:text-gray-300">
//                                     This chapter doesn't have content yet. Admin can add content using the "Add Content" button.
//                                 </p>
//                             `);
//                         }
//                     }
//                 } catch (error) {
//                     console.error('Error fetching chapter:', error);
//                     setContent(`
//                         <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Error Loading Chapter</h1>
//                         <p class="text-lg leading-relaxed mb-4 text-red-600 dark:text-red-400">
//                             Failed to load chapter content. Please try again.
//                         </p>
//                     `);
//                 }
//                 setLoading(false);
//             } else {
//                 setContent(null);
//             }
//         };

//         fetchChapterContent();
//     }, [currentChapter]);

//     // Trigger MathJax to process the content after it's loaded
//     useEffect(() => {
//         if (content && typeof window !== 'undefined' && window.MathJax) {
//             window.MathJax.typesetPromise().catch((err) => console.error('MathJax typeset error:', err));
//         }
//     }, [content]);

//     if (!currentChapter) {
//         return (
//             <div className="flex flex-col items-center justify-center h-full text-center p-8">
//                 <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
//                     <span className="text-4xl">📚</span>
//                 </div>
//                 <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to Reader</h1>
//                 <p className="text-gray-700 dark:text-gray-400 max-w-md">
//                     Select a chapter from the library on the left to start reading.
//                 </p>
//             </div>
//         );
//     }

//     // Dynamically adjust max-width based on sidebar state and screen size
//     // Mobile: full width, Desktop varies by sidebar state
//     const getMaxWidth = () => {
//         // On mobile, always use full width
//         if (typeof window !== 'undefined' && window.innerWidth < 768) {
//             return 'max-w-full';
//         }
//         // Desktop: adjust based on sidebars
//         if (!isLeftPanelOpen && !isRightPanelOpen) return 'max-w-5xl';
//         if (isLeftPanelOpen && isRightPanelOpen) return 'max-w-3xl';
//         return 'max-w-4xl';
//     };

//     return (
//         <div className={`${getMaxWidth()} mx-auto pb-20`}>
//             {loading ? (
//                 <SkeletonLoader />
//             ) : (
//                 <>
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         className="prose dark:prose-invert max-w-none"
//                         dangerouslySetInnerHTML={{ __html: content }}
//                     />
//                     {currentChapter && <TestArea chapterId={currentChapter.id} />}
//                 </>
//             )}
//         </div>
//     );
// }


'use client';

import React, { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import { motion } from 'framer-motion';
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

    if (!currentChapter) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">📚</span>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to Reader</h1>
                <p className="text-gray-700 dark:text-gray-400 max-w-md">
                    Select a chapter from the library on the left to start reading.
                </p>
            </div>
        );
    }

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
        <div className={`${getMaxWidth()} mx-auto pb-20`}>
            {loading ? (
                <SkeletonLoader />
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                    {currentChapter && <TestArea chapterId={currentChapter.id} />}
                </>
            )}
        </div>
    );
}



