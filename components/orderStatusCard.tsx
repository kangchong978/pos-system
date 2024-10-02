import React from 'react';

import { Utensils, ShoppingBag, Table, Table2 } from 'lucide-react';
import { Badge, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { OrderType } from '@/common/type/order';

interface OrderStatusCardProps {
    orderId: number;
    orderType: OrderType;
    tableName?: string;
    orderStatus: string;
    onClick: () => void;
}


const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ orderId, orderType, tableName, orderStatus, onClick }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'preparing':
                return 'bg-yellow-500';
            case 'ready':
                return 'bg-green-500';
            case 'delivered':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getOrderTypeIcon = (type: string) => {
        return type.toLowerCase() === 'dinein' ? (
            <Utensils className="w-5 h-5 mr-1" />
        ) : (
            <ShoppingBag className="w-5 h-5 mr-1" />
        );
    };

    const getOrderTypeName = (type: string) => {
        return type.toLowerCase() === 'dinein' ? (
            <p>Dine-In</p>
        ) : (
            <p>Take-Away</p>
        );
    };

    return (
        <Card className="shadow hover:shadow-xl transition-shadow duration-300 p-[10px] mb-[10px] rounded-[10px] border" onClick={onClick}>
            <CardHeader className="">
                <CardTitle className="text-lg font-bold text-gray-800 mb-[10px]">Order#{orderId}</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium text-gray-600 mb-[5px]">
                            {getOrderTypeIcon(orderType)}
                            {getOrderTypeName(orderType)}
                        </div>
                        {tableName && (
                            <div className="flex items-center text-sm font-medium text-gray-600 mb-[5px]">
                                <Table className="w-5 h-5 mr-1"></Table>
                                {tableName}
                            </div>
                        )}
                    </div>
                    <div className="">
                        <Badge className={`${getStatusColor(orderStatus)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            {orderStatus}
                        </Badge>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default OrderStatusCard;