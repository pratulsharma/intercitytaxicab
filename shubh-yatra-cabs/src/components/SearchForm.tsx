// from, to, date, pasengers
"use client"
import { useState } from 'react'
import { locations } from "@/lib/locations";
import { FormField } from './FormField';
import { CitySelect } from './CitySelect';
import  Button  from './Button';
export const SearchForm = () => {
    const handleSubmit = () => { };
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [passengers, setPassengers] = useState(1);
    const inputClass = "p-3 mt-3 bg-amber-100 rounded-2xl"
    const labelClass = "p-3 mt-3 font-bold"
    return (
        <form className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white text-left shadow-lg ">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <CitySelect id="from" label="From" />
                <CitySelect id="to" label="To" />
                {/* Date */}
                <FormField id="date" label="date">
                    <input
                        id="date"
                        name="date"
                        className={inputClass}
                        type="date"
                        placeholder="date"
                    />
                </FormField>
                {/* Passengers */}
                <FormField id="passengers" label="passengers">
                    <input
                        className={inputClass}
                        id="passengers"
                        name="passengers"
                        type="number"
                        min={1}
                        max={12}
                        defaultValue={1}
                        placeholder="passengers"
                    />
                </FormField>
</div>
                {/* Button */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button>Search cabs</Button>
                    <Button variant="secondary" type="reset">
                        Clear
                    </Button>
                </div>

        </form>
    );
};
