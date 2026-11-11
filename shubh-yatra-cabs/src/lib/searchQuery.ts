// here we will take the input from the searchform and create a query
// we will also validate the query
// what all we need to do? // since we are passing the form output object to
// a function that will validate and produce the output
// we need type of the searchInput
// we also need the type of the output
// so what all are we doing in this file -
// 1) we will export 2 function, first function will take the searchquery
// validate it and then output the search object -> so we need the type for search object
// the second function will take the the searchInput and will output the search query
// so we need the types for the output -> searchquery
import { type SearchInput } from "./search";

// the search query key is text, the value is string, string array or undefined
type SearchQuery = Record<string, string | string[] | undefined>;

// this is the output after parsing and validating the searchQuery
type readResult =
  | { success: true; data: SearchInput }
  | { success: false; message: string };

export const readSearchQuery = (query: SearchQuery): readResult => {
  // what are we checking here --> we are checking type for all the values is string
  // that the date format is correct ; passengers are digits
  // that the passenger count is a safe number

  if (
    typeof query.from !== "string" ||
    typeof query.to !== "string" ||
    typeof query.date !== "string" ||
    typeof query.passengers !== "string"
  ) {
    return {
      success: false,
      message: "All the search params should be string!",
    };
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(query.date) ||
    !/^\d+$/.test(query.passengers)
  ) {
    return { success: false, message: "Date should be in YYYY-MM-DD format and passengers should be integers" };
  }
  const count = Number(query.passengers)
  if(!Number.isSafeInteger(count)){
    return { success: false, message: "Passengers should be integers" };
  }
  return {
    success: true,
    data: {from:query.from, to: query.to, date: query.date, passengers: count},
  };
};

export const searchToQuery = (input:SearchInput): URLSearchParams =>{
  return new URLSearchParams({
    from: input.from,
    to: input.to,
    date: input.date,
    passengers: String(input.passengers),
  });
}

// so what did we do in these functions --> we created 2 functions first one is for taking the searchInput and ouputing the success object if all the 
// fields in the query are correct 
// second function is for creating the URL from the input 

