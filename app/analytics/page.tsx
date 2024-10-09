'use client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import { useCoreClient } from '@/utils/useClient';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from '@/components/ThemeContext';
import { TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardBody } from 'reactstrap';

interface FeedbackData {
    userId: number;
    username: string;
    averageScore: number;
    feedbacks: {
        date: string;
        score: number;
        text: string;
    }[];
}

export default function EmployeeFeedbackDashboard(): JSX.Element {
    const { currentTheme } = useTheme();
    const [feedbackData, setFeedbackData] = useState<FeedbackData[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const { isInitialized, isLoading, coreClient, error, setAppLoading } = useCoreClient();
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    const styles = useMemo(() => ({
        container: {
            minHeight: '100vh',
            backgroundColor: getColor('background-primary'),
            padding: '3rem',
        },
        main: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        header: {
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getColor('primary'),
        },
        subtitle: {
            fontSize: '1.0rem',
            color: getColor('text-secondary'),
        },
        metricsContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '3rem',
            gap: '1.5rem',
        },
        metricCard: {
            flex: '1',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
        },
        metricCardHeader: {
            padding: '1.5rem 1.5rem 0.5rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
        },
        metricCardBody: {
            padding: '1.5rem',
        },
        tableCard: {
            // marginBottom: '3rem',
            // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            // borderRadius: '12px',
            // overflow: 'hidden',
        },
        tableCardHeader: {
            padding: '1.5rem',
            fontSize: '1.4rem',
            fontWeight: 'bold',
        },
        tableCardBody: {
            padding: '1.5rem',
        },
        table: {
            width: '100%',
            borderCollapse: 'separate' as const,
            borderSpacing: '0 0.75rem',
        },
        tableRow: {
            backgroundColor: getColor('surface-secondary'),
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
        },
        tableCell: {
            padding: '1.5rem',
            color: getColor('text-primary'),
        },
        tableHeaderCell: {
            padding: '1rem 1.5rem',
            color: getColor('text-secondary'),
            fontWeight: 'bold',
        },
        chartCell: {
            width: '200px',
            height: '80px',
            padding: '0.5rem 1.5rem',
        },
        expandButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            marginRight: '0.5rem',
        },
        expandedContent: {
            backgroundColor: getColor('background-secondary'),
            padding: '1rem 1.5rem',
            marginTop: '0.5rem',
            borderRadius: '8px',
        },
        feedbackItem: {
            marginBottom: '0.5rem',
            padding: '0.5rem',
            backgroundColor: getColor('surface'),
            borderRadius: '4px',
        },
    }), [currentTheme]);



    const fetchFeedbacks = useCallback(async (): Promise<void> => {
        if (isInitialized && coreClient && !isFetching && !feedbackData) {
            setIsFetching(true);
            setAppLoading(true);
            try {
                const data = await coreClient.getFeedbacks();
                setFeedbackData(data);
            } catch (error) {
                console.error('Failed to fetch feedback data:', error);
            } finally {
                setAppLoading(false);
                setIsFetching(false);
            }
        }
    }, [isInitialized, coreClient, setAppLoading, isFetching, feedbackData]);

    useEffect(() => {
        if (isInitialized && coreClient && !isFetching) {
            fetchFeedbacks();
        }
    }, [isInitialized, coreClient, isFetching, fetchFeedbacks]);

    if (!isInitialized || isLoading || !feedbackData) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '3rem' }}>Error: {error}</div>;
    }

    const overallAverage = feedbackData.reduce((sum, user) => sum + user.averageScore, 0) / feedbackData.length;
    const highestScore = Math.max(...feedbackData.map(user => user.averageScore));
    const lowestScore = Math.min(...feedbackData.map(user => user.averageScore));

    const getTrendIcon = (score: number) => {
        if (score > 0) return <TrendingUp color={getColor('success')} size={28} />;
        if (score < 0) return <TrendingDown color={getColor('error')} size={28} />;
        return <Minus color={getColor('warning')} size={28} />;
    };
    const toggleRowExpansion = (userId: number) => {
        setExpandedRows(prev => ({ ...prev, [userId]: !prev[userId] }));
    };


    return (
        <div style={styles.container}>
            <main style={styles.main}>
                <motion.header
                    style={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h1
                        style={styles.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Employee Feedback Dashboard
                    </motion.h1>
                    <motion.p
                        style={styles.subtitle}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Overview of employee mood and satisfaction
                    </motion.p>
                </motion.header>

                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            style={styles.metricsContainer}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            {[
                                { title: 'Overall Average', value: overallAverage, icon: getTrendIcon(overallAverage) },
                                { title: 'Highest Score', value: highestScore, icon: <TrendingUp color={getColor('success')} size={28} /> },
                                { title: 'Lowest Score', value: lowestScore, icon: <TrendingDown color={getColor('error')} size={28} /> }
                            ].map((metric, index) => (
                                <motion.div
                                    key={metric.title}
                                    style={styles.metricCard}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                >
                                    <Card>
                                        <CardHeader style={styles.metricCardHeader}>{metric.title}</CardHeader>
                                        <CardBody style={styles.metricCardBody}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '2.5rem', marginRight: '0.75rem' }}>{metric.value.toFixed(2)}</span>
                                                {metric.icon}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            style={styles.tableCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                        >
                            <Card>
                                <CardHeader style={styles.tableCardHeader}>Employee Feedback Details</CardHeader>
                                <CardBody style={styles.tableCardBody}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.tableHeaderCell}></th>
                                                <th style={styles.tableHeaderCell}>Username</th>
                                                <th style={styles.tableHeaderCell}>Average Score</th>
                                                <th style={styles.tableHeaderCell}>Feedback Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feedbackData.map((user, index) => (
                                                <React.Fragment key={user.userId}>
                                                    <motion.tr
                                                        style={styles.tableRow}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.5, delay: 0.1 * index }}
                                                        whileHover={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' }}
                                                    >
                                                        <td style={styles.tableCell}>
                                                            <button
                                                                style={styles.expandButton}
                                                                onClick={() => toggleRowExpansion(user.userId)}
                                                            >
                                                                {expandedRows[user.userId] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                            </button>
                                                        </td>
                                                        <td style={styles.tableCell}>{user.username}</td>
                                                        <td style={styles.tableCell}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>
                                                                    {user.averageScore.toFixed(2)}
                                                                </span>
                                                                {getTrendIcon(user.averageScore)}
                                                            </div>
                                                        </td>
                                                        <td style={{ ...styles.tableCell, ...styles.chartCell }}>
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <LineChart data={user.feedbacks}>
                                                                    <XAxis dataKey="date" hide />
                                                                    <YAxis domain={[-5, 5]} hide />
                                                                    <Tooltip />
                                                                    <Line type="monotone" dataKey="score" stroke={getColor('primary')} dot={false} />
                                                                </LineChart>
                                                            </ResponsiveContainer>
                                                        </td>
                                                    </motion.tr>
                                                    <AnimatePresence>
                                                        {expandedRows[user.userId] && (
                                                            <motion.tr
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <td colSpan={4}>
                                                                    <div style={styles.expandedContent}>
                                                                        {user.feedbacks.map((feedback, idx) => (
                                                                            <div key={idx} style={styles.feedbackItem}>
                                                                                <p><strong>Date:</strong> {feedback.date}</p>
                                                                                <p><strong>Score:</strong> {feedback.score}</p>
                                                                                <p><strong>Feedback:</strong> {feedback.text}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        )}
                                                    </AnimatePresence>
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}