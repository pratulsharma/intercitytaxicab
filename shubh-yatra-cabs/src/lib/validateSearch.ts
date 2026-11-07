

// comment : we need to validate the input that user is entering into the form
//  User is entering From, to, date and number of passengers 
//  For from and to we can simplyn check if these are not empty 
//  for to we can also check if its not the same is from 
//  for date we can check if the date is not in past 
//  for passengers we can define max and min and make sure user enters something in between 
//  How to provide the output --> The output --> an object where the key is the seachkey and the 
//  value is the error 
// COMMENT: How to create an object that is generated as we go --> 


import type { SearchInput } from "./search";

// COMMENT (1): How to create an object that is generated as we go --> 
export type SearchErrors = Partial<Record<keyof SearchInput, string>>

const MIN_PASSENGERS = 1
const MAX_PASSENGERS = 30
// Comment: for each function we need to define the input,its type and output type
//  also we need to make sure that these types are defined
export const ValidateSearch = (input:SearchInput, today:string): SearchErrors =>{
 
    // comment: when we define any variable-> in this case an object --> we need to define its type
    //  we need to ensure that the type is defined
    const Errors:SearchErrors = {}
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