// This header is similar to the navbar 
// here we will display the brand name and call to action

export const Header = () => {
    return (
        <header className="flex items-center justify-between border-b bg-amber-400 border-slate-200 px-6 py-4 ">
            <span className="text-xl font-bold text-amber-700">Shubh-yatra-travel</span>
            <a href="#routes" className="text-sm font-medium hover:underline">Popular-routes</a>
        </header>
    )
}
