
const inr = new Intl.NumberFormat("en-IN",{
    style :"currency",
    currency:"INR",
    maximumFractionDigits: 4
})

export const formatPrice = (price: number): string =>{
    return inr.format(price)
}

export const formatPassengers = (passengers: number):string =>{
    return `${passengers} Passengers`
}