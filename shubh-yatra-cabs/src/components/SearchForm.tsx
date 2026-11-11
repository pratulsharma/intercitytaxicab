// from, to, date, pasengers
"use client"
import { useEffect, useState, type ChangeEvent, type SubmitEvent } from 'react'
import { locations } from "@/lib/locations";
import { FormField } from './FormField';
import { CitySelect } from './CitySelect';
import Button from './Button';
import { describeSearch, type SearchInput } from '@/lib/search';
import { PassengerStepper } from './PassengersStepper';
import { TestForm } from './TestForm';
import { sampleOptions, pickOptions } from "@/lib/sampleOptions";
import { todayAsIsoDate } from "@/lib/dates";
// comment : useRouter to go to anothre page 
import { useRouter } from "next/navigation";
// create a urn from the input 
import { searchToQuery } from '@/lib/searchQuery';
import { ignoreListAnonymousStackFramesIfSandwiched } from 'next/dist/next-devtools/server/shared';
export const SearchForm = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const inputClass = "p-3 mt-3 bg-amber-100 rounded-2xl";
    const labelClass = "p-3 mt-3 font-bold"
    const [fname,setName] = useState("")
    //Comments: 
    const emptySearch: SearchInput = {from: "", to: "", date: "", passengers: 0}
    const [search,setSearch] = useState<SearchInput>(emptySearch)
    // Set after the page loads: the server and browser would disagree about "today" if we asked while drawing.
    // comment (5) : make the previous dates unselectable
    const [minDate, setMinDate] = useState("")
    useEffect(() => {
        setMinDate(todayAsIsoDate())
    }, [])
    const updateName = (input: string) =>{
        setName(input)
    }
    const handleSearch = (searchValue:string, searchKey:string) => {
            console.log(searchKey, searchValue)
            setSearch({...search, [searchKey]: searchValue}) 
    }
      const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
            console.log(e.target.value)
            setSearch({...search, date: e.target.value}) 
    }
    // comment: using the router
    const router = useRouter();

    // handleSubmit should send the BE api; receive the response and display the 
    // list of options
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault()
        console.log("FirstName", fname)
        const myUrl = searchToQuery(search)
        console.log("MyUrl", myUrl)
        router.push(`/results?${searchToQuery(search).toString()}`);
    }
    const carThatFit = pickOptions(sampleOptions,search.passengers).length;
    const addPassenegers = () =>{
        console.log("adding")
        setSearch({...search,passengers:search.passengers+1})
    }
    const removePassengers = () =>{
        setSearch({...search,passengers:search.passengers-1})
    }
 
    return (
        <>
        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white text-left shadow-lg ">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <CitySelect id="from" label="From" handleSelect={handleSearch}/>
                <CitySelect id="to" label="To" handleSelect={handleSearch}/>
                {/* Date */}
               {/* // Comment (10) : how to make the previous dates unselectable */}
                <FormField id="date" label="date">
                    <input
                        id="date"
                        name="date"
                        className={inputClass}
                        type="date"
                        placeholder="date"
                        min={minDate} // <-- this is where we use minDate
                        onChange = {handleDate}
                    />
                </FormField>
                <PassengerStepper id="passengers" passengers={search.passengers} addPassengers={addPassenegers} removePassengers={removePassengers} checkFit={carThatFit}/>
            </div>
            {/* Button */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button type="submit">Search cabs</Button>
                <Button variant="secondary" type="reset">
                    Clear
                </Button>
            </div>
        </form>
<TestForm handleSubmit={handleSubmit} fname={fname} onChange={updateName}/>
</>
    );
};
