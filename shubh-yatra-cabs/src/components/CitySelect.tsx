// In tbis components we will pass on the children where we will pass the city list and 
// this component will display the dropdown cities 
// also for the label we will use FormField 
// so we need to import formfield component and pass it the props --> children, id and label 
import { FormField, formfieldClassname } from "./FormField";
import { locations } from "@/lib/locations";
type City = {
    id: string;
    label: string;
    error?:string;
}

export const CitySelect = ({ id, label }: City) => {
  const errorFor = (id:string) => `${id}-error`
    return (
        <FormField id={id} label={label}>
            <select id={id} name={id} defaultValue="" className={formfieldClassname}>
                <option value="" disabled>
                    Select city
                </option>
                {locations.map((place) => (
                    <option key={place.slug} value={place.slug}>
                        {place.name}
                    </option>
                ))}
            </select>
        </FormField >
    )
}