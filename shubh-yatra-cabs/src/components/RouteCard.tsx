// to display the popular routes 
import type { Route } from "@/lib/routes"

const RouteCard = ({ route }: { route: Route }) => {
    return (
        <article className="rounded-xl border border-slate-200 bg-amber-950  p-5 shadow-sm">
            <h3 className="text-lg font-semibold">
                {route.from} to {route.to}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{route.blurb}</p>
        </article>
    )
}

export default RouteCard