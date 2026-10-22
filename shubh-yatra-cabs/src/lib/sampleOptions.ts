export type VehicleType = "suv" | "sedan" | "minivan" | "bus" 
export type CarOption = {
    id: string;
    name: string;
    seats: number;
    vehicle: VehicleType;
    priceInr: number;
}

export const sampleOptions: CarOption[] = [
    {id:"car", name: "Maruti", vehicle:"sedan", seats: 5, priceInr: 2000},
    {id:"suv", name: "Bolero", vehicle:"suv", seats: 7, priceInr: 3000},
    {id:"minivan", name: "Innove", vehicle:"minivan", seats: 9, priceInr: 5000},
    {id:"bus", name: "Innove", vehicle:"bus", seats: 30, priceInr: 15000}
]

export const pickOptions = (options:CarOption[], passengers: number): CarOption[] =>{
    return options.filter(r => r.seats > passengers).sort((a,b)=>a.priceInr - b.priceInr)
}