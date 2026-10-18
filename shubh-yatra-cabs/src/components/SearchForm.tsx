// from, to, date, pasengers
"use client"
import { useState } from 'react'
import { locations } from "@/lib/locations";
export const SearchForm = () => {
    const handleSubmit = () => { };
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [passengers, setPassengers] = useState(1);
    const inputClass = "p-3 mt-3 bg-amber-100 rounded-2xl"
    const labelClass = "p-3 mt-3 font-bold"
    return (
        <form
            className="mx-auto  "
        > 
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-10 shadow-sm">
            <label className={labelClass} htmlFor="from" >From</label>
            <select id="from" name="from" defaultValue="">
                <option value="" disabled>Select City</option >
                {locations.map((place) =>
                    <option key={place.slug}> {place.name} </option>
                )}
            </select>

            <label className={labelClass} htmlFor="to">To</label>
                <select id="to" name="to" defaultValue="">
                <option value="" disabled>Select City</option >
                {locations.map((place) =>
                    <option key={place.slug}> {place.name} </option>
                )}
            </select>
        
            <label className={labelClass} htmlFor="date">Date</label>
            <input
                id="date"
                name="date"
                className={inputClass}
                type="date"
                placeholder="date"
            />
            <label className={labelClass} htmlFor="passengers">Passengers</label>
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
            </div>
            <button type="button" className="rounded-2xl mt-8 bg-blue-600 text-amber-50 p-4 font-bold">Search Cabs</button>
        </form>
    );
};
