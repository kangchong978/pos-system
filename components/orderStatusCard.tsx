import React, { useMemo } from 'react';


import { Utensils, ShoppingBag, Table, Table2 } from 'lucide-react';
import { Badge, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { OrderType } from '@/common/type/order';
import { motion } from 'framer-motion';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';

interface OrderStatusCardProps {
    orderId: number;
    orderType: OrderType;
    tableName?: string;
    orderStatus: string;
    onClick: () => void;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ orderId, orderType, tableName, orderStatus, onClick }) => {

    const { currentTheme } = useTheme(); // Get the current theme
    const styles = useMemo(() => ({
        card: {
            backgroundColor: getColor('background-primary'),
            borderRadius: '10px',
            border: `1px solid ${getColor('border')}`,
            padding: '16px',
            marginBottom: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        header: {
            marginBottom: '12px',
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold' as const,
            color: getColor('text-primary'),
        },
        body: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px',
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        icon: {
            marginRight: '6px',
        },
        text: {
            fontSize: '14px',
            color: getColor('text-secondary'),
            display: 'flex',
            alignItems: 'center',
        },
        badge: {
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 'bold' as const,
            color: getColor('background-primary'),
        }
    }), [currentTheme]); // Recalculate styles when theme changes

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'preparing':
                return getColor('status-preparing');
            case 'ready':
                return getColor('status-ready');
            case 'delivered':
                return getColor('status-delivered');
            default:
                return getColor('status-default');
        }
    };

    const getOrderTypeIcon = (type: string) => {
        return type.toLowerCase() === 'dinein' ? (
            <Utensils size={16} style={styles.icon} />
        ) : (
            <ShoppingBag size={16} style={styles.icon} />
        );
    };

    const getOrderTypeName = (type: string) => {
        return type.toLowerCase() === 'dinein' ? 'Dine-In' : 'Take-Away';
    };

    return (
        <motion.div
            style={styles.card}
            whileHover={{
                backgroundColor: getColor('surface'),
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            <div style={styles.header}>
                <h3 style={styles.title}>Order #{orderId}</h3>
            </div>
            <div style={styles.body}>
                <div style={styles.row}>
                    <span style={styles.text}>
                        {getOrderTypeIcon(orderType)}
                        {getOrderTypeName(orderType)}
                    </span>
                    {tableName && (
                        <span style={styles.text}>
                            <Table size={16} style={styles.icon} />
                            {tableName}
                        </span>
                    )}
                </div>
                <div style={styles.row}>
                    <motion.span
                        style={{
                            ...styles.badge,
                            backgroundColor: getStatusColor(orderStatus),
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {orderStatus}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderStatusCard;