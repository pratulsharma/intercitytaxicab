// sample formfield.tsx
import { ReactNode } from "react";
type FormfieldProps = {
  id: string;
  label: string;
  children: ReactNode;
};

export const sampleFormField = (props: FormfieldProps) => {
  return (
    <div>
      <label
        id={props.id}
        htmlFor={props.label}
        className="block font-bold text-slate-700"
      >
        {props.label}
      </label>
      {props.children}
    </div>
  );
};

//Todo: test
//TODO: test