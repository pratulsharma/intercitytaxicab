// for getting the date in similar format as we get in the form input 
// then checking if the user did not select date in the past 

// comments:  In JS we use new Date(); to get the time and date from the browser
// comment: Important: call this only inside an event handler (a click or submit), never while a component is drawing. "Now" changes every moment, and the server and browser would disagree. Next.js enforces this: calling it during a draw fails the build with Next.js encountered the unstable value new Date() in a Client Component.
/* comment: dates.ts get the date value from the browser, calculates YYYY-MM-DD and then this is used in validation */

export const todayAsIsoDate =(): string =>{
    const now = new Date();
    // comments: to convert to string in JS we use String(xxxx)
    const month =  String(now.getMonth()+1).padStart(2,"0")
    const day =  String(now.getDate()+1).padStart(2,"0")
    console.log("Date", now, month)
    return `${now.getFullYear()}-${month}-${day}`
}

console.log("__>", todayAsIsoDate())