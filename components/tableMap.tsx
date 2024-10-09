import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PosTable } from '@/common/type/posTable';
import { Square, Users, Trash2 } from 'lucide-react';
import { getColor } from '../utils/colorUtils';
import { useTheme } from './ThemeContext';


interface TableProps extends PosTable {
    onClick: (id: number, orderId: number) => void;
    onDragEnd: (id: number, x: number, y: number) => void;
    onRemove: (id: number) => void;
    onDragStateChange: (isDragging: boolean) => void;
    scale: number;
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
    orderId,
    scale
}) => {
    const { currentTheme } = useTheme(); // Get the current theme

    const styles = useMemo(() => ({
        table: {
            position: 'absolute' as const,
            width: '150px',
            height: '150px',
            borderRadius: '20%',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'move',
            transition: 'transform 0.1s ease-out',
            border: `4px solid ${getColor('border')}`,
            padding: '1rem',
        },
        tableName: {
            paddingBottom: '10px',
            color: getColor((status == 'active') ? 'on-primary' : 'text-primary'),
            fontWeight: 'bold' as const,
        },
        orderBadge: {
            background: getColor('background-primary'),
            color: getColor('text-secondary'),
            borderRadius: '10px',
            padding: '5px 10px',
        },
    }), [currentTheme]); // Recalculate styles when theme changes

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
        return status === 'active' ? getColor('table-occupied') : getColor('table-available');
    };

    return (
        <div
            style={{
                ...styles.table,
                left: `${currentX / scale}px`,
                top: `${currentY / scale}px`,
                backgroundColor: getTableColor(),
                transform: `scale(${isDragging ? 1.3 / scale : 1 / scale})`,
                width: `${150 / scale}px`,
                height: `${150 / scale}px`,
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="unselectable-text"
        >
            <Square size={48 / scale} color={getColor((status == 'active') ? 'on-primary' : 'text-primary')} />
            <p style={{ ...styles.tableName, fontSize: `${16 / scale}px` }}>{name}</p>
            {orderId && (
                <div style={{ ...styles.orderBadge, fontSize: `${12 / scale}px` }}>
                    <Users size={16 / scale} style={{ marginRight: '5px', display: 'inline' }} />
                    <span>Order#{orderId}</span>
                </div>
            )}
        </div>

    );
};

interface RestaurantTableProps {
    tables: PosTable[];
    onTableClick: (id: number, orderId: number) => void;
    onTableDragEnd: (id: number, x: number, y: number) => void;
    onTableRemove: (id: number) => void;
    inModal?: boolean;
}

const RestaurantTables: React.FC<RestaurantTableProps> = ({
    tables,
    onTableClick,
    onTableDragEnd,
    onTableRemove,
    inModal = false,
}) => {
    const { currentTheme } = useTheme(); // Get the current theme
    const styles = useMemo(() => ({
        container: {
            position: 'fixed' as const,
            height: '100%',
            width: '100%',
            zIndex: 0,
            backgroundColor: getColor('background-primary'),
        },
        legend: {
            margin: '20px',
        },
        legendItem: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px',
        },
        legendColor: {
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            marginRight: '10px',
        },

        containerModal: {
            position: 'relative' as const,
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: getColor('background-primary'),
        },
        scaleContainer: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: '100px', // Leave space for the remove area
            transformOrigin: 'top left',
        },
        removeArea: {
            opacity: 1,
            position: 'absolute' as const,
            bottom: 0,
            left: 0,
            // width: '100%',
            padding: '20px',
            height: '100px',
            backgroundColor: getColor('remove-area'),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: getColor('on-primary'),
            fontSize: '18px',
            fontWeight: 'bold' as const,
            zIndex: -10,
        },
        removeAreaContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        removeAreaText: {
            marginLeft: '10px',
        },
    }), [currentTheme]); // Recalculate styles when theme changes


    const [isAnyTableDragging, setIsAnyTableDragging] = useState(false);
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragStateChange = (isDragging: boolean) => {
        setIsAnyTableDragging(isDragging);
    };

    useEffect(() => {
        if (inModal && containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            const contentWidth = Math.max(...tables.map(table => table.x + 150));
            const contentHeight = Math.max(...tables.map(table => table.y + 150));
            const scaleX = containerWidth / contentWidth;
            const scaleY = containerHeight / contentHeight;
            setScale(Math.min(scaleX, scaleY, 1));
        }
    }, [inModal, tables]);

    const containerStyle = inModal ? styles.containerModal : styles.container;

    return (
        <div style={containerStyle} ref={containerRef}>
            <div style={{ ...styles.scaleContainer, transform: `scale(${scale})` }}>
                <div style={styles.legend}>
                    <div style={styles.legendItem}>
                        <div style={{ ...styles.legendColor, backgroundColor: getColor('table-available') }}></div>
                        <p style={{ fontSize: `${14 / scale}px`, color: getColor('text-secondary') }}>Available</p>
                    </div>
                    <div style={styles.legendItem}>
                        <div style={{ ...styles.legendColor, backgroundColor: getColor('table-occupied') }}></div>
                        <p style={{ fontSize: `${14 / scale}px`, color: getColor('text-secondary') }}>Occupied</p>
                    </div>
                </div>

                {tables.map((table) => (
                    <Table
                        key={table.id}
                        {...table}
                        onClick={onTableClick}
                        onDragEnd={onTableDragEnd}
                        onRemove={onTableRemove}
                        onDragStateChange={handleDragStateChange}
                        scale={scale}
                    />
                ))}
            </div>
            {isAnyTableDragging && (
                <div style={styles.removeArea}>
                    <div style={styles.removeAreaContent}>
                        <Trash2 size={24} />
                        <span style={styles.removeAreaText}>Drag here to remove table</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantTables;