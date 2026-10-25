// "use client"

// import {useState} from 'react'
import type { SubmitEvent } from "react";

type TestFormProps = {
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  fname: string;
  onChange: (value: string) => void;
};

export const TestForm = ({handleSubmit, fname,onChange}: TestFormProps) => {
    return (
        <form onSubmit={handleSubmit} >
            <label>Fname</label>
             <input
              type = "text"
              name ="fname"
              value={fname}
              onChange = {(e)=>onChange(e.target.value)} 
              />
              <br/>
   {/* <label>lname</label>
             <input
              type = "text"
              name ="lname"
              value={lname}
              onChange = {(e)=>setName(e.target.value)}  */}
              <button type="submit">submit</button>
        </form>
    )
 }