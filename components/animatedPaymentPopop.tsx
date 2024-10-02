import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, RefreshCcw } from 'lucide-react';

import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import { PaymentLoadingStatus } from '@/redux_slices/posSlice';

interface AnimatedPaymentPopupProps {
    status: PaymentLoadingStatus;
}

const AnimatedPaymentPopup: React.FC<AnimatedPaymentPopupProps> = ({ status }) => {
    return (
        <AnimatePresence>
            {(status == PaymentLoadingStatus.Loading || status == PaymentLoadingStatus.Success) && (
                <motion.div
                    key="popup"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

                    <Card className="w-full max-w-md relative z-10">
                        <CardHeader>
                            {status == PaymentLoadingStatus.Loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <RefreshCcw className="animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2 text-green-500">
                                    <CheckCircleIcon />
                                    <span>Payment Successful</span>
                                </div>
                            )}
                        </CardHeader>
                        <CardBody className='text-white '>
                            {status == PaymentLoadingStatus.Loading ? (
                                "Please wait while we process your payment..."
                            ) : (
                                "Your payment has been successfully processed."
                            )}
                        </CardBody>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnimatedPaymentPopup;