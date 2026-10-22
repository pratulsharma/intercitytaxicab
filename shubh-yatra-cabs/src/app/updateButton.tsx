"use client"
import { useState } from 'react'

export const updateButton = () => {
    const [count, setCount] = useState(0)
    return (
        <div>
            <button className="px-2 bg-amber-300 m-2 hover:font-bold  border-fuchsia-500 border rounded hover:bg-green-400 text-2xl" disabled={count>=12} onClick={() => setCount(count + 1)}>+</button>
            <span className='text-2xl'>{count} Passengers</span>
            <button className="px-2 bg-amber-300 m-2 hover:font-bold  border-fuchsia-500 border rounded hover:bg-red-400 text-2xl" disabled={count<=1} onClick={() => setCount(count - 1)}>-</button>

        </div>
    )
}