"use client";
// add or remove passengers
// display the car options based on the passenger count
import { useState } from "react";
import { formatPassengers, formatPrice } from "@/lib/format";
import { sampleOptions, pickOptions } from "@/lib/sampleOptions";

const MAX_PASSENGERS = 30;
const MIN_PASSENGERS = 1;

export const PassengerStepper = () => {
    const [count, setCount] = useState(1);
    const carThatFit = pickOptions(sampleOptions,count).length;

    const stepButtonClass = "h-10 w-10 item-center justify-center border rounded-sl border border-slate-300 bg-white text-xl font-semibold"
    return (
        <div>
            {/* span to tell what is it*/}
            <span>Passengers</span>
            {/* + */}
            <div className="flex"> 
                <button
                    type="button"
                    disabled={count >= MAX_PASSENGERS}
                    onClick={() => setCount(count + 1)}
                    className={stepButtonClass}
                >
                    +
                </button>
                <span className="min-w-28 text-center font-medium">{formatPassengers(count)}</span>
            {/* button */}
            <button
                type="button"
                disabled={count <= MIN_PASSENGERS}
                onClick={() => setCount(count - 1)}
                className={stepButtonClass}
            >-</button>
            </div>
            {/* - */}
        <p className="mt-1 text-sm text-slate-500">
            {carThatFit === 1? "Only 1 type of car fits": `${carThatFit} types of cars fit`}
        </p>
        </div> 
    );
};
