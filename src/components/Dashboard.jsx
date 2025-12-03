'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProgress } from '@/lib/firestoreService';
import { BookOpen, Trophy, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalChapters: 4,
        completedQuizzes: 0,
        averageScore: 0,
        totalQuestions: 0,
        correctAnswers: 0
    });

    useEffect(() => {
        const fetchProgress = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const progressData = await getUserProgress(user.uid);
                setProgress(progressData);

                // Calculate stats
                if (progressData.length > 0) {
                    const totalScore = progressData.reduce((sum, p) => sum + p.score, 0);
                    const totalQuestions = progressData.reduce((sum, p) => sum + p.totalQuestions, 0);
                    const correctAnswers = progressData.reduce((sum, p) => sum + p.score, 0);

                    setStats({
                        totalChapters: 4,
                        completedQuizzes: progressData.length,
                        averageScore: Math.round((totalScore / (progressData.length * 30)) * 100),
                        totalQuestions,
                        correctAnswers
                    });
                }
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [user]);

    if (!user) {
        return (
            <div className="max-w-6xl mx-auto p-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Please Sign In
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be signed in to view your progress dashboard.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Get recommendations based on incorrect answers
    const recommendations = [];
    const chapterNames = {
        '09_convolution_and_binaural_sound_synthesis': 'Convolution and Binaural Sound Synthesis',
        '10_simulation_methods': 'Simulation Methods',
        '11_simulation_of_sound_in_rooms': 'Simulation of Sound in Rooms',
        '18_acoustic_virtual_reality_systems': 'Acoustic Virtual Reality Systems'
    };

    progress.forEach(p => {
        if (p.incorrectQuestions && p.incorrectQuestions.length > 0) {
            const chapterName = Object.keys(chapterNames).find(k => p.chapterId.includes(k));
            const percentage = Math.round((p.score / p.totalQuestions) * 100);

            if (percentage < 70) {
                recommendations.push({
                    chapterId: p.chapterId,
                    chapterName: chapterNames[chapterName] || p.chapterId,
                    incorrectCount: p.incorrectQuestions.length,
                    percentage,
                    priority: percentage < 50 ? 'high' : 'medium'
                });
            }
        }
    });

    return (
        <div className="pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Learning Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Track your progress and improve your knowledge
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <BookOpen className="w-8 h-8" />
                        <span className="text-3xl font-bold">{stats.completedQuizzes}/{stats.totalChapters}</span>
                    </div>
                    <p className="text-blue-100 font-medium">Quizzes Completed</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Trophy className="w-8 h-8" />
                        <span className="text-3xl font-bold">{stats.averageScore}%</span>
                    </div>
                    <p className="text-green-100 font-medium">Average Score</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8" />
                        <span className="text-3xl font-bold">{stats.correctAnswers}/{stats.totalQuestions}</span>
                    </div>
                    <p className="text-purple-100 font-medium">Correct Answers</p>
                </motion.div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                        Recommended Review
                    </h2>
                    <div className="space-y-4">
                        {recommendations.map((rec, index) => (
                            <motion.div
                                key={rec.chapterId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={`border-l-4 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-md ${rec.priority === 'high'
                                    ? 'border-red-500'
                                    : 'border-orange-500'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {rec.chapterName}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {rec.incorrectCount} incorrect answer{rec.incorrectCount > 1 ? 's' : ''} • Score: {rec.percentage}%
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${rec.priority === 'high'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                        }`}>
                                        {rec.priority === 'high' ? 'High Priority' : 'Review Soon'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Chapter Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: recommendations.length > 0 ? 0.6 : 0.4 }}
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Chapter Progress
                </h2>
                {progress.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            No quiz attempts yet. Start learning to see your progress!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {progress.map((p, index) => {
                            const percentage = Math.round((p.score / p.totalQuestions) * 100);
                            const chapterKey = Object.keys(chapterNames).find(k => p.chapterId.includes(k));
                            const chapterName = chapterNames[chapterKey] || p.chapterId;

                            return (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-4">
                                            {chapterName}
                                        </h3>
                                        {percentage >= 70 ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Score</span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {p.score}/{p.totalQuestions}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${percentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {percentage}%
                                        </p>
                                    </div>

                                    {p.completedAt && (
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            Completed: {new Date(p.completedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
