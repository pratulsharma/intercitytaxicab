const cars = [
  { name: "Sedan", seats: 4, priceInr: 2400 },
  { name: "SUV", seats: 6, priceInr: 3100 },
  { name: "Tempo", seats: 12, priceInr: 5800 },
];

console.log(cars.find(f=> f.name == "Sedan").seats)