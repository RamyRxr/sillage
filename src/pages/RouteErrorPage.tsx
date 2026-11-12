import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { buttonClasses } from '../components/ui/buttonStyles'
import { NotFoundPage } from './NotFoundPage'

/**
 * Shown when a page crashes. A missing page still gets the friendly 404; anything else gets an honest
 * "something went wrong" instead of pretending the page does not exist. No error details are shown.
 */
export function RouteErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }
  return (
    <main className="grid min-h-svh place-items-center bg-cream px-5 text-center">
      <title>Something went wrong — Sillage</title>
      <div>
        <p className="micro text-cocoa-soft">Error</p>
        <h1 className="t-h2 mt-4">
          Something went <span className="accent">wrong</span>
        </h1>
        <p className="t-lead mx-auto mt-6 max-w-[36ch] text-cocoa-soft">Please reload the page. Your cart is saved.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className={buttonClasses('gradient')}>
            Reload
          </button>
          <Link to="/" className={buttonClasses('outline')}>
            Back home
          </Link>
        </div>
      </div>
    </main>
  )
}
