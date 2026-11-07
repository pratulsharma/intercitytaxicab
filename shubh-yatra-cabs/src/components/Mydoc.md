## My running doc

- this is my running doc for this app 
- here I will de writing everything about the app
- each and every low level detail has to be here so when I need to refer back why certain things were implemented in a way they were implemented - why it was done so?
- Also learning new things --> passing props ; typescript etc 
- next js , lint, unit tests etc. Also my capacity to streach my brain 
- even when I am feeling week or sleepy I should be able to read this doc and 

- 10/25/2026
    - my goal for today is to finish the understaning of how to pass the props from parent to child 
    - types - when and where to define them -- I think its bettwr to define the type where its used to its easy to refer
    - finis the searchform so that this milestone is sone -- 
    - I have 3 hours --- let me finih as much as I can -- take a nap in between as needed 
    - Ok here is the hirerchy we are using 
        Top - SearchForm 
            - calls -> CitySelect -> calls FormField 
            - calls -> PassengerStepprt 
    - Now lets look at FormField 
        - it defines the label tag --> lable tag used id and label (thing that need to be displayed)
        - also uses children as a prop that it can display; it uses children because the form can have different types of inputs --> just text input, date input, dropdown inputs etc.
        - for children we use ReactNode as a type
        - So how does the FormField.tsx look like ?
        