// to display the popular routes 
// use featured for the first route --> pass it as an optional property
import type { Route } from "@/lib/routes"
import {formatPrice} from "@/lib/format"

type RouteCardProps = {
    route: Route;
    featured?:Boolean;
}
const RouteCard = ({ route, featured }: RouteCardProps) => {
    return (
      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {featured && (
        <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Popular
        </span>
      )}
      <h3 className="text-lg font-semibold">
        {route.from} → {route.to}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{route.blurb}</p>
      <p className="mt-3 text-sm font-semibold text-amber-700">
        From {formatPrice(route.fromPriceInr)}
      </p>
    </article> 
    )
}

export default RouteCard