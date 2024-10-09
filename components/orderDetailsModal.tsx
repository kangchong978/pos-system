import React, { useMemo } from 'react';
import { Order, PosProduct, OrderType, OrderStatus } from '@/common/type/order';
import { Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onPrint: (e: React.MouseEvent) => void;
}



const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onPrint }) => {
  const { currentTheme } = useTheme(); // Get the current theme

  /* to overcome the theme incorrect by rerender while theme changed */
  const styles = useMemo(() => ({
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    modalContent: {
      backgroundColor: getColor('surface'),
      padding: '2rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: getColor('text-primary'),
    },
    printButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      backgroundColor: getColor('primary'),
      color: getColor('on-primary'),
      borderRadius: '0.25rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: getColor('text-secondary'),
      marginBottom: '0.25rem',
    },
    value: {
      fontSize: '1rem',
      color: getColor('text-primary'),
    },
    table: {
      width: '100%',
      borderSpacing: '0 0.5rem',
    },
    th: {
      padding: '0.75rem',
      backgroundColor: getColor('background-primary'),
      color: '#6B7280',
      fontWeight: 'semibold',
      fontSize: '0.75rem',
    },
    td: {
      padding: '0.75rem',
      borderBottom: `1px solid ${getColor('border')}`,
      color: getColor('text-secondary'),
    },
    closeButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: getColor('primary'),
      color: getColor('on-primary'),
      border: 'none',
      borderRadius: '0.25rem',
      fontSize: '1rem',
      fontWeight: 'medium',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },

  }), [currentTheme]); // Recalculate styles when theme changes


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.modalOverlay}
        onClick={onClose} // Close the modal when clicking outside
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={styles.modalContent}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <div style={styles.header}>
            <h3 style={styles.title}>Order Details</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.printButton}
              onClick={onPrint}
            >
              <Printer style={{ marginRight: '0.5rem' }} size={18} />
              Print
            </motion.button>
          </div>

          <div style={styles.grid}>
            <div>
              <p style={styles.label}>Order ID</p>
              <p style={styles.value}>{order.id}</p>
            </div>
            <div>
              <p style={styles.label}>Order Type</p>
              <p style={styles.value}>{order.orderType === OrderType.DineIn ? 'Dine In' : 'Take Away'}</p>
            </div>
            <div>
              <p style={styles.label}>Status</p>
              <p style={styles.value}>{order.status}</p>
            </div>
            <div>
              <p style={styles.label}>Table ID</p>
              <p style={styles.value}>{order.tableId || 'N/A'}</p>
            </div>
            <div>
              <p style={styles.label}>Created Date</p>
              <p style={styles.value}>{new Date(order.createDate).toLocaleString()}</p>
            </div>
            <div>
              <p style={styles.label}>Last Updated</p>
              <p style={styles.value}>{new Date(order.updateDate).toLocaleString()}</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ ...styles.title, fontSize: '1.25rem', marginBottom: '1rem' }}>Products</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Variations</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product: PosProduct, index: number) => (
                    <tr key={index}>
                      <td style={styles.td}>{product.name}</td>
                      <td style={styles.td}>{product.quantity}</td>
                      <td style={styles.td}>${product.price.toFixed(2)}</td>
                      <td style={styles.td}>
                        {product.variation.map(v => `${v.pName}: ${v.name}`).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ ...styles.grid, marginTop: '2rem' }}>
            <div>
              <p style={styles.label}>Subtotal</p>
              <p style={styles.value}>${order.subTotal.toFixed(2)}</p>
            </div>
            <div>
              <p style={styles.label}>Tax</p>
              <p style={styles.value}>${order.tax.toFixed(2)}</p>
            </div>
            <div>
              <p style={styles.label}>Total</p>
              <p style={styles.value}>${order.total.toFixed(2)}</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={styles.closeButton}
              onClick={onClose}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;