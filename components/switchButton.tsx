'use client';

import { Button, ButtonGroup } from "@nextui-org/button";
import { useState } from "react";


const ToggleButton = () => {
    var options = ['dine-in', 'take-away']
    const [option, setOption] = useState(options[0]);

    return (
        <ButtonGroup radius="full">
            {
                options.map((v) =>
                    <Button className={(option == v) ? "bg-red-500 text-white" : "text-red-500"} value={v} onClick={() => setOption(v)}>
                        <p>
                            {v}
                        </p>

                    </Button>)
            }

        </ButtonGroup>
    );
};

export default ToggleButton;

