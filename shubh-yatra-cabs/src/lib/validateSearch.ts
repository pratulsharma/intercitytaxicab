
import type { SearchInput } from "./search";

export type SearhErrors = Partial<Record<keyof SearchInput, string>>

const MIN_PASSENGERS = 1
const MAX_PASSENGERS = 30
export const ValidateSearch = (input:SearchInput, today:string): SearhErrors =>{
 
    const Errors:SearhErrors = {}
    if (input.from === "")  Errors.from = "Please provide from"
    if (input.to === "")  Errors.to = "Please provide to"
    if (input.from !== "" && input.from === input.to) Errors.to = "Dropoff locations cannot be same as pick up location"
    if (input.date === "")  Errors.date = "Please choose a travel date"
    if (input.date <today) Errors.date = "Travel date should be in future"
     
    const validCount = Number.isInteger(input.passengers) &&
                    input.passengers >= MIN_PASSENGERS &&
                    input.passengers <= MAX_PASSENGERS 

    if(!validCount) Errors.passengers = `Passenger count should be in between ${MIN_PASSENGERS} and ${MAX_PASSENGERS}`
    return Errors;

}