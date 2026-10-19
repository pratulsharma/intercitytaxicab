// to display the popular routes 
import type { Route } from "@/lib/routes"
import {formatPrice} from "@/lib/format"

const RouteCard = ({ route }: { route: Route }) => {
    return (
        <article className="rounded-xl border border-slate-200 bg-blue-100 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">
                {route.from} to {route.to}
            </h3>
            <p className="mt-2 text-sm text-slate-600 text-center">{route.blurb}</p>
            <p className="mt-2 text-sm text-slate-600 text-center">From {formatPrice(route.fromPriceInr)}</p>
        </article>
    )
}

export default RouteCard