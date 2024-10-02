import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@nextui-org/button';


interface ButtonWithModalProps {
  buttonText: string;
  onSubmit: (tableName: string) => void;
}

const ButtonWithModal: React.FC<ButtonWithModalProps> = ({ buttonText, onSubmit }) => {
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
      <Button className='w-full bg-red-500 text-white mb-[10px]' onClick={() => setIsOpen(true)}>{buttonText}</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='bg-white px-[20px] border-gray-300 shadow-xl rounded-[10px]'>
          {/* <DialogHeader>
            <DialogTitle>Enter Table Name</DialogTitle>
          </DialogHeader> */}
          <input
            style={{
              'padding': 4,
              'marginRight': '10px'
            }}
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Table name"
            className="mt-2"
          />
          <DialogClose>
            <Button className='h-[30px] px-[10px] bg-gray-300 text-white mb-[10px] rounded-[10px] mr-[10px]' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button className='h-[30px] px-[10px] bg-gray-300 text-white mb-[10px] rounded-[10px]' onClick={handleSubmit} disabled={!tableName.trim()}>
              Submit
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ButtonWithModal;