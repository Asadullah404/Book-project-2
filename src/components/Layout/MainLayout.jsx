import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store/useStore';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function MainLayout({ leftContent, rightContent, children }) {
    const { isLeftPanelOpen, isRightPanelOpen, toggleLeftPanel, toggleRightPanel } = useStore();

    // Animation variants for 3D effect + Width
    // Animation variants for 3D effect + Width
    const panelVariants = {
        open: (width) => ({
            width: width,
            rotateY: 0,
            opacity: 1,
            x: 0,
            display: "flex",
            transition: {
                width: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                rotateY: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3, delay: 0.1 },
                default: { type: "spring", stiffness: 100, damping: 20 }
            }
        }),
        closed: (direction) => ({
            width: 0,
            rotateY: direction === 'left' ? 90 : -90,
            opacity: 0,
            x: direction === 'left' ? -50 : 50,
            transition: {
                width: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                rotateY: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.2 },
                default: { type: "spring", stiffness: 100, damping: 20 }
            },
            transitionEnd: {
                display: "none"
            }
        }),
    };

    // Mobile overlay variants
    const mobileOverlayVariants = {
        open: {
            x: 0,
            opacity: 1,
            display: "flex",
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        closed: (direction) => ({
            x: direction === 'left' ? '-100%' : '100%',
            opacity: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 },
            transitionEnd: {
                display: "none"
            }
        }),
    };

    return (
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden relative">
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {(isLeftPanelOpen || isRightPanelOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            if (isLeftPanelOpen) toggleLeftPanel();
                            if (isRightPanelOpen) toggleRightPanel();
                        }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Left Panel - Desktop: inline, Mobile: overlay */}
            {/* Left Panel - Desktop: inline, Mobile: overlay */}
            {/* Left Panel - Desktop: inline, Mobile: overlay */}
            {/* Desktop version */}
            <div className="hidden md:flex h-full z-20" style={{ perspective: '1000px' }}>
                <motion.aside
                    key="left-panel-desktop"
                    custom="20rem"
                    variants={panelVariants}
                    initial="closed"
                    animate={isLeftPanelOpen ? "open" : "closed"}
                    className="h-full bg-white/80 dark:bg-zinc-900/95 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 origin-left preserve-3d shadow-xl flex-col overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="w-80 h-full flex flex-col">
                        <div className="p-4 flex-1 overflow-y-auto">
                            {leftContent}
                        </div>
                    </div>
                </motion.aside>
            </div>

            {/* Mobile version - overlay */}
            <div className="md:hidden z-40">
                <motion.aside
                    key="left-panel-mobile"
                    custom="left"
                    variants={mobileOverlayVariants}
                    initial="closed"
                    animate={isLeftPanelOpen ? "open" : "closed"}
                    className="fixed left-0 top-16 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Library</h2>
                        <button
                            onClick={toggleLeftPanel}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {leftContent}
                    </div>
                </motion.aside>
            </div>

            {/* Toggle Left Button */}
            {!isLeftPanelOpen && (
                <button
                    onClick={toggleLeftPanel}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 md:p-2 bg-white/80 dark:bg-black/80 text-gray-900 dark:text-white backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    <ChevronRight size={20} />
                </button>
            )}

            {isLeftPanelOpen && (
                <button
                    onClick={toggleLeftPanel}
                    className="hidden md:block absolute left-[300px] top-1/2 -translate-y-1/2 z-30 p-2 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform -ml-4"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            {/* Center Content */}
            <main className="flex-1 h-full relative z-10 overflow-hidden bg-white/80 dark:bg-black backdrop-blur-sm shadow-2xl mx-2 md:mx-4 rounded-xl my-2 border border-white/20">
                <div className="h-full w-full p-4 md:p-8 overflow-hidden">
                    {children}
                </div>
            </main>

            {/* Right Panel - Desktop: inline, Mobile: overlay */}
            {/* Desktop version */}
            <div className="hidden md:flex h-full z-20" style={{ perspective: '1000px' }}>
                <motion.aside
                    key="right-panel-desktop"
                    custom="24rem"
                    variants={panelVariants}
                    initial="closed"
                    animate={isRightPanelOpen ? "open" : "closed"}
                    className="h-full bg-white/80 dark:bg-zinc-900/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-800 origin-right preserve-3d shadow-xl flex-col overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="w-96 h-full flex flex-col">
                        <div className="p-4 flex-1 overflow-y-auto">
                            {rightContent}
                        </div>
                    </div>
                </motion.aside>
            </div>

            {/* Mobile version - overlay */}
            <div className="md:hidden z-40">
                <motion.aside
                    key="right-panel-mobile"
                    custom="right"
                    variants={mobileOverlayVariants}
                    initial="closed"
                    animate={isRightPanelOpen ? "open" : "closed"}
                    className="fixed right-0 top-16 bottom-0 w-96 max-w-[85vw] bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Python Runner</h2>
                        <button
                            onClick={toggleRightPanel}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {rightContent}
                    </div>
                </motion.aside>
            </div>

            {/* Toggle Right Button */}
            {!isRightPanelOpen && (
                <button
                    onClick={toggleRightPanel}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 md:p-2 bg-white/80 dark:bg-black/80 text-gray-900 dark:text-white backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            {isRightPanelOpen && (
                <button
                    onClick={toggleRightPanel}
                    className="hidden md:block absolute right-[360px] top-1/2 -translate-y-1/2 z-30 p-2 bg-white/50 dark:bg-black/50 text-gray-900 dark:text-white backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform -mr-4"
                >
                    <ChevronRight size={20} />
                </button>
            )}
        </div>
    );
}
