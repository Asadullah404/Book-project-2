'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData } from '@/data/quizData';
import { useAuth } from '@/contexts/AuthContext';
import { saveQuizResult } from '@/lib/firestoreService';

export default function TestArea({ chapterId }) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!chapterId) return;

        // Helper to extract the first number from a string (e.g., "11" from "11-1-intro" or "chapter-11")
        const getChapterNumber = (id) => {
            const match = id.match(/(\d+)/);
            return match ? parseInt(match[1], 10) : null;
        };

        const targetNum = getChapterNumber(chapterId);

        // Find key in quizData that matches the chapter number
        // This handles "09" vs "9" mismatches and ensures subheadings (e.g. "11.1") map to the main chapter quiz
        let key = Object.keys(quizData).find(k => {
            const keyNum = getChapterNumber(k);
            return keyNum !== null && keyNum === targetNum;
        });

        // Fallback to original inclusion logic if number matching fails
        if (!key) {
            key = Object.keys(quizData).find(k => chapterId.includes(k) || k.includes(chapterId));
        }

        if (key) {
            setQuestions(quizData[key]);
        } else {
            setQuestions([]);
        }

        // Reset state on chapter change
        setUserAnswers({});
        setShowAnswers(false);
        setIsSubmitted(false);
        setScore(0);
    }, [chapterId]);

    const handleOptionSelect = (questionId, optionIndex) => {
        if (isSubmitted) return; // Prevent changing answers after submission
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = async () => {
        let newScore = 0;
        const incorrectQuestions = [];

        questions.forEach(q => {
            if (userAnswers[q.id] === q.correct) {
                newScore++;
            } else if (userAnswers[q.id] !== undefined) {
                incorrectQuestions.push({
                    questionId: q.id,
                    question: q.question,
                    userAnswer: userAnswers[q.id],
                    correctAnswer: q.correct
                });
            }
        });

        setScore(newScore);
        setIsSubmitted(true);
        setShowAnswers(true);

        // Save to Firestore if user is logged in
        if (user && chapterId) {
            try {
                await saveQuizResult(user.uid, chapterId, {
                    score: newScore,
                    totalQuestions: questions.length,
                    incorrectQuestions,
                    userAnswers
                });
                console.log('✅ Quiz result saved successfully!');
            } catch (error) {
                console.error('❌ Failed to save quiz result:', error);
            }
        }
    };

    if (!questions || questions.length === 0) return null;

    return (
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
                    Test Your Knowledge
                </h2>

                <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
            </div>

            {isSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8 text-center"
                >
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                        You scored {score} out of {questions.length}
                    </p>
                    <p className="text-green-700 dark:text-green-400 mt-2">
                        {score === questions.length ? 'Perfect Score! 🎉' :
                            score > questions.length * 0.7 ? 'Great Job! 👏' :
                                'Keep Practicing! 💪'}
                    </p>
                </motion.div>
            )}

            <div className="space-y-8">
                {questions.map((q, index) => {
                    const isCorrect = userAnswers[q.id] === q.correct;
                    const isSelected = userAnswers[q.id] !== undefined;

                    return (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${showAnswers
                                ? isCorrect
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                    : 'border-red-300 bg-red-50 dark:bg-red-900/10'
                                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-sm">
                                    {index + 1}
                                </span>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        {q.question}
                                    </h3>

                                    <div className="grid gap-3">
                                        {q.options.map((option, optIndex) => {
                                            let optionClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ";

                                            if (showAnswers) {
                                                if (optIndex === q.correct) {
                                                    optionClass += "bg-green-500 border-green-500 text-white";
                                                } else if (userAnswers[q.id] === optIndex) {
                                                    optionClass += "bg-red-500 border-red-500 text-white";
                                                } else {
                                                    optionClass += "border-gray-200 dark:border-gray-700 opacity-50 text-gray-500 dark:text-gray-400";
                                                }
                                            } else {
                                                if (userAnswers[q.id] === optIndex) {
                                                    optionClass += "bg-blue-600 border-blue-600 text-white shadow-md";
                                                } else {
                                                    optionClass += "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
                                                }
                                            }

                                            return (
                                                <button
                                                    key={optIndex}
                                                    onClick={() => handleOptionSelect(q.id, optIndex)}
                                                    disabled={isSubmitted}
                                                    className={optionClass}
                                                >
                                                    <span className="font-medium">{option}</span>
                                                    {showAnswers && optIndex === q.correct && (
                                                        <span className="text-white">✓</span>
                                                    )}
                                                    {showAnswers && userAnswers[q.id] === optIndex && optIndex !== q.correct && (
                                                        <span className="text-white">✗</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {showAnswers && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg"
                                        >
                                            <span className="font-bold text-gray-900 dark:text-gray-200">Explanation: </span>
                                            {q.explanation}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {!isSubmitted && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Submit Quiz
                    </button>
                </div>
            )}
        </div>
    );
}
