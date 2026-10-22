// for getting the date in similar format as we get in the form input 
// then checking if the user did not select date in the past 

export const todayAsIsoDate =(): string =>{
    const now = new Date();
    const month =  String(now.getMonth()+1).padStart(2,"0")
    const day =  String(now.getDate()+1).padStart(2,"0")
    console.log("Date", now, month)
    return `${now.getFullYear()}-${month}-${day}`
}

console.log("__>", todayAsIsoDate())