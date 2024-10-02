'use client';

import { OrderType } from "@/common/type/order";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useState } from "react";
interface OrderTypeButtonProps {
    value: string;
    onChange: Function;
}

const OrderTypeButton: React.FC<OrderTypeButtonProps> = ({ value, onChange }) => {
    const options = Object.values(OrderType);
    return (
        <ButtonGroup radius="full">
            {
                options.map((v: string) =>
                    <Button className={(value == v) ? "bg-red-500 text-white" : "text-red-500"} value={v} onClick={() => onChange(v)}>
                        <p>
                            {v}
                        </p>

                    </Button>)
            }

        </ButtonGroup>
    );
};

export default OrderTypeButton;

