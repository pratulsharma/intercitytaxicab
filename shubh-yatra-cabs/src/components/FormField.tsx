// In this formfield we will create a components that we can use for building a form 
// it will provide a common label for the forms we built 
// The input props for this will be id, label and the children 
// add the error also as as an input passed
import type { ReactNode } from 'react';
type FormFieldProps = {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
};
export const formfieldClassname = `mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200 `
export const FormField = ({ id, label, error, children }: FormFieldProps) => {
    const errorFor = (id:string) => `${id}-error`
    return (<div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
            {label}
        </label>
        {children}
        {error && <p id={errorFor(id)} className="mt-1 text-sm text-red-600">
            {error}
        </p>}
    </div>)
}