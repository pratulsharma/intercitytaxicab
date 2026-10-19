// In this file we will describe search -> from ->to on date, number of passengers 
// the search input will be an object --> define the type
// import the format passengers and findCity functions 

import {findCity} from '@/lib/locations'
import {formatPassengers} from '@/lib/format'

export type SearchInput = {
    from: string;
    to:string;
    date:string;
    passengers:number;
}
export const describeSearch = (input:SearchInput) : string =>{
    const fromName = findCity(input.from)?.name ?? "Unknown City"
    const toName = findCity(input.from)?.name ?? "Unknown City"
    return `${fromName} -> ${toName} on ${input.date} with ${formatPassengers(input.passengers)} `
}
