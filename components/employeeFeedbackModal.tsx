import React, { useState } from 'react';
import { getColor } from './ThemeContext';
import toast from 'react-hot-toast';
import { FeedbackData } from "../common/type/employeeFeedbackData";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feedback: FeedbackData) => void;
    username: string;
}

const EmployeeFeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, username }) => {
    // const [experience, setExperience] = useState<'positive' | 'neutral' | 'negative' | null>(null);
    const [feedbacks, setFeedbacks] = useState('');

    const handleSubmit = () => {
        if (!feedbacks || feedbacks == '') {
            toast('Talk about your mood today');
            return;
        }
        onSubmit({ feedbacks, username });
        onClose();
    };

    if (!isOpen) return null;

    const styles = {
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
        },
        modal: {
            backgroundColor: getColor('background-primary'),
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '28rem',
        },
        header: {
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '1rem',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
            position: 'relative' as const,
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '0.25rem',
            color: getColor('on-primary'),
        },
        subtitle: {
            fontSize: '0.875rem',
        },
        closeButton: {
            position: 'absolute' as const,
            top: '0.5rem',
            right: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.5rem',
        },
        content: {
            padding: '1.5rem',
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: getColor('text-primary'),
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.25rem',
            backgroundColor: getColor('background-primary'),
            color: getColor('text-primary'),
        },
        textarea: {
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.25rem',
            resize: 'vertical' as const,
            minHeight: '6rem',
            backgroundColor: getColor('background-primary'),
            color: getColor('text-primary'),
        },
        emojiContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem',

        },
        emojiButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '2rem',
            padding: '0.5rem',
            borderRadius: '50%',
        },
        submitButton: {
            width: '100%',
            backgroundColor: getColor('primary'),
            color: getColor('on-primary'),
            padding: '0.75rem',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontWeight: '500',
            marginTop: '1rem',
        },
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Send us your feedback!</h2>
                    <p style={styles.subtitle}>Do you have a suggestion or found some bug? Let us know in the field below.</p>
                    {/* <button style={styles.closeButton} onClick={onClose}>&times;</button> */}
                </div>
                <div style={styles.content}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={styles.label}>Username</label>
                        <input style={styles.input} type="text" value={username} readOnly />
                    </div>
                    {/* <div style={{ marginBottom: '1rem' }}>
                        <label style={styles.label}>How was your experience?</label>
                        <div style={styles.emojiContainer}>
                            <button
                                style={{
                                    ...styles.emojiButton,
                                    backgroundColor: experience === 'positive' ? '#e6fffa' : 'transparent',
                                }}
                                onClick={() => setExperience('positive')}
                            >
                                😃
                            </button>
                            <button
                                style={{
                                    ...styles.emojiButton,
                                    backgroundColor: experience === 'neutral' ? '#fffaf0' : 'transparent',
                                }}
                                onClick={() => setExperience('neutral')}
                            >
                                😐
                            </button>
                            <button
                                style={{
                                    ...styles.emojiButton,
                                    backgroundColor: experience === 'negative' ? '#fff5f5' : 'transparent',
                                }}
                                onClick={() => setExperience('negative')}
                            >
                                😞
                            </button>
                        </div>
                    </div> */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={styles.label} htmlFor="description">
                            Describe your experience here...
                        </label>
                        <textarea
                            id="description"
                            style={styles.textarea}
                            value={feedbacks}
                            onChange={(e) => setFeedbacks(e.target.value)}
                        ></textarea>
                    </div>
                    <button style={styles.submitButton} onClick={handleSubmit}>
                        Send Feedback
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeFeedbackModal;