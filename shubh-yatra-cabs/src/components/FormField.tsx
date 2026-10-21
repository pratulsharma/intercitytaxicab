// In this formfield we will create a components that we can use for building a form 
// it will provide a common label for the forms we built 
// The input props for this will be id, label and the children 
import type { ReactNode } from 'react';
type FormFieldProps = {
    id: string;
    label: string;
    children: ReactNode;
};
export const formfieldClassname = `mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200 `
export const FormField = ({ id, label, children }: FormFieldProps) => {
    return (<div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
            {label}
        </label>
        {children}
    </div>)
}


