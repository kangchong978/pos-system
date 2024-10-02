import { PosTable } from '@/common/type/posTable';
import React, { useState, useRef } from 'react';

interface TableProps extends PosTable {
    onClick: (id: number, orderId: number) => void;
    onDragEnd: (id: number, x: number, y: number) => void;
    onRemove: (id: number) => void;
    onDragStateChange: (isDragging: boolean) => void;
}

const Table: React.FC<TableProps> = ({
    id,
    name,
    x,
    y,
    status,
    onClick,
    onDragEnd,
    onRemove,
    onDragStateChange,
    orderId
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [currentX, setCurrentX] = useState(x);
    const [currentY, setCurrentY] = useState(y);
    const dragTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isDraggingInitiated = useRef(false);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setDragStartX(event.clientX - currentX);
        setDragStartY(event.clientY - currentY);

        dragTimeout.current = setTimeout(() => {
            setIsDragging(true);
            isDraggingInitiated.current = true;
            onDragStateChange(true);
        }, 100);
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        if (dragTimeout.current) {
            clearTimeout(dragTimeout.current);
        }

        if (isDragging) {
            const finalX = event.clientX - dragStartX;
            const finalY = event.clientY - dragStartY;

            if (finalY > window.innerHeight - 100) {
                onRemove(id);
            } else {
                onDragEnd(id, finalX, finalY);
            }
        } else if (!isDraggingInitiated.current) {
            onClick(id, orderId!);
        }

        setIsDragging(false);
        isDraggingInitiated.current = false;
        onDragStateChange(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            setCurrentX(event.clientX - dragStartX);
            setCurrentY(event.clientY - dragStartY);
        }
    };

    const getTableColor = () => {
        switch (status) {
            case 'active':
                return "#F25C54";
            default:
                return '#EAEAEA';
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: `${currentX}px`,
                top: `${currentY}px`,
                width: '150px',
                height: '150px',
                backgroundColor: getTableColor(),
                borderRadius: '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'move',
                ...(isDragging ? { transform: 'scale(1.3)' } : {}),
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="unselectable-text"
        >
            <p style={{
                paddingBottom: '10px'
            }}>{name}</p>
            {orderId && <div style={{
                background: 'white',
                borderRadius: '10px',
                padding: '5px 10px'
            }}>
                <p>Order#{orderId}</p>
            </div>}
        </div>
    );
};

interface RestaurantTableProps {
    tables: PosTable[];
    onTableClick: (id: number, orderId: number) => void;
    onTableDragEnd: (id: number, x: number, y: number) => void;
    onTableRemove: (id: number) => void;
}

const RestaurantTables: React.FC<RestaurantTableProps> = ({
    tables,
    onTableClick,
    onTableDragEnd,
    onTableRemove,
}) => {
    const [isAnyTableDragging, setIsAnyTableDragging] = useState(false);

    const handleDragStateChange = (isDragging: boolean) => {
        setIsAnyTableDragging(isDragging);
    };

    return (
        <div className='fixed h-full w-full z-0'>
            <div className='m-[20px]'>
                <div>
                    <div className='mb-[5px] flex items-center'>
                        <div className='w-[20px] h-[20px] bg-[#EAEAEA] rounded-[6px] mr-[10px]'></div>
                        <p> Available </p>
                    </div>
                    <div className='mb-[5px] flex items-center'>
                        <div className='w-[20px] h-[20px] bg-red-500 rounded-[6px] mr-[10px]'></div>
                        <p> Occupied </p>
                    </div>
                </div>
            </div>

            {tables.map((table) => (
                <Table
                    key={table.id}
                    id={table.id}
                    name={table.name}
                    x={table.x}
                    y={table.y}
                    orderId={table.orderId}
                    status={table.status}
                    onClick={onTableClick}
                    onDragEnd={onTableDragEnd}
                    onRemove={onTableRemove}
                    onDragStateChange={handleDragStateChange}
                />
            ))}

            {/* Removal area */}
            {isAnyTableDragging && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100px',
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        zIndex: -1,
                    }}
                >
                    Drag here to remove table
                </div>
            )}
        </div>
    );
};

export default RestaurantTables;