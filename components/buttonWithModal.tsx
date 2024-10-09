import React, { useMemo, useState } from 'react';
import { Dialog, DialogClose, DialogContent } from '@radix-ui/react-dialog';
import { Button } from '@nextui-org/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getColor } from '@/utils/colorUtils';
import { useTheme } from './ThemeContext';



interface ButtonWithModalProps {
  buttonText: string;
  onSubmit: (tableName: string) => void;
}

const ButtonWithModal: React.FC<ButtonWithModalProps> = ({ buttonText, onSubmit }) => {
  const { currentTheme } = useTheme(); // Get the current theme

  const styles = useMemo(() => ({
    button: {
      width: '100%',
      backgroundColor: getColor('primary'),
      color: getColor('on-primary'),
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      backgroundColor: getColor('background-primary'),
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '300px',
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: getColor('text-primary'),
    },
    input: {
      width: '100%',
      padding: '8px',
      border: `1px solid ${getColor('border')}`,
      borderRadius: '5px',
      marginBottom: '15px',
      backgroundColor: getColor('background-secondary'),
      color: getColor('text-primary'),
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
    },
    modalButton: {
      padding: '8px 15px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  }), [currentTheme]); // Recalculate styles when theme changes


  const [isOpen, setIsOpen] = useState(false);
  const [tableName, setTableName] = useState('');

  const handleSubmit = () => {
    if (tableName.trim()) {
      onSubmit(tableName);
      setIsOpen(false);
      setTableName('');
    }
  };

  return (
    <div>
      <motion.button
        style={styles.button}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
        <ChevronDown size={16} style={{ marginLeft: '5px' }} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent asChild>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                style={styles.modal}
              >
                <h2 style={styles.modalTitle}>Enter Table Name</h2>
                <input
                  style={styles.input}
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="Table name"
                />
                <div style={styles.buttonContainer}>
                  <DialogClose asChild>
                    <motion.button
                      style={{ ...styles.modalButton, backgroundColor: getColor('secondary'), color: getColor('on-primary') }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </motion.button>
                  </DialogClose>
                  <motion.button
                    style={{ ...styles.modalButton, backgroundColor: getColor('primary'), color: getColor('on-primary') }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!tableName.trim()}
                  >
                    Save changes
                  </motion.button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ButtonWithModal;