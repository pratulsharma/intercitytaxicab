// a separate file that shows the popular routes 
// whay a separate file --> so taht we can easily exchange it with the db connection 
// instead of taking it from the file. 

export type location = {
    slug: string;  // a meaningful web link instead of random 
    name: string; 
};

export const locations: location[] = [
    { slug: "haridwar", name: "Haridwar" },
    { slug: "rishikesh", name: "Rishikesh" },
    { slug: "nainital", name: "Nainital" },
    { slug: "haldwani", name: "Haldwani" },
    { slug: "kedarnath", name: "Kedarnath" },
    { slug: "badrinath", name: "Badrinath" }
];
export const findCity = (city: string): location | undefined =>{
  return locations.find(f=>f.slug === city) // the output is an object
}