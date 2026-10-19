// a separate file that shows the popular routes 
// whay a separate file --> so taht we can easily exchange it with the db connection 
// instead of taking it from the file. 
// 
export type Route = {
    slug: string;  // a meaningful web link instead of random 
    from: string;
    to:string;
    blurb: string; 
    fromPriceInr: number;
};

export const popularRoutes: Route[] = [
    { slug: "haridwar-to-rishikesh", from: "Haridwar", to: "Rishikesh", blurb: "Ganga Aarti", fromPriceInr: 1200 },
    { slug: "haridwar-to-kedarnath", from: "Haridwar", to: "Kedarnath", blurb: "Spiritual Retreat", fromPriceInr: 6200 },
    { slug: "haridwar-to-badrinath", from: "Haridwar", to: "Badrinath", blurb: "Badri Vishal", fromPriceInr: 5900 },
    { slug: "haridwar-to-delhi", from: "Haridwar", to: "Delhi", blurb: "For Airport Drop ", fromPriceInr: 7000 }
];