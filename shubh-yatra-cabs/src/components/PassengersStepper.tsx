"use client";
// add or remove passengers
// display the car options based on the passenger count
import { useState } from "react";
import { formatPassengers, formatPrice } from "@/lib/format";

const MAX_PASSENGERS = 30;
const MIN_PASSENGERS = 1;

type PassengerStepperProps = {
    id: string;
    passengers: number;
    checkFit: number;
    addPassengers: () => void;
    removePassengers: () => void;
};

export const PassengerStepper = ({ id, passengers, checkFit, addPassengers, removePassengers }: PassengerStepperProps) => {
    
    const stepButtonClass = "h-10 w-10 item-center justify-center border rounded-sl border border-slate-300 bg-white text-xl font-semibold"
    return (
        <div>
            {/* span to tell what is it*/}
            <span id={id}>Passengers</span>
            {/* + */}
            <div className="flex"> 
                <button
                    type="button"
                    disabled={passengers >= MAX_PASSENGERS}
                    onClick={()=>addPassengers()}
                    className={stepButtonClass}
                >
                    +
                </button>
                <span className="min-w-28 text-center font-medium">{formatPassengers(passengers)}</span>
            {/* button */}
            <button
                type="button"
                disabled={passengers <= MIN_PASSENGERS}
                onClick={()=>removePassengers()}
                className={stepButtonClass}
            >-</button>
            </div>
            {/* - */}
        <p className="mt-1 text-sm text-slate-500">
             {checkFit === 1? "Only 1 type of car fits": `${checkFit} types of cars fit`} 
        </p>
        </div> 
    );
};
