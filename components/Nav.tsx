import Link from 'next/link'

type NavVariant = 'home' | 'subpage'

export function Nav({ variant }: { variant: NavVariant }) {
  const homePrefix = variant === 'home' ? '' : '/'
  const brandHref = variant === 'home' ? '#page-top' : '/'

  return (
    <nav
      className={`navbar navbar-custom navbar-fixed-top ${variant === 'home' ? 'top-nav-collapse' : ''}`}
      role="navigation"
    >
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="collapse"
            data-target=".navbar-main-collapse"
          >
            <i className="fa fa-bars" />
          </button>
          {variant === 'home' ? (
            <a className="navbar-brand page-scroll" href={brandHref}>
              <div className="navbar-image" />
              <div className="navbar-text">Menu</div>
            </a>
          ) : (
            <Link className="navbar-brand page-scroll" href="/">
              <div className="navbar-image" />
              <div className="navbar-text">Menu</div>
            </Link>
          )}
        </div>
        <div className="collapse navbar-collapse navbar-right navbar-main-collapse">
          <ul className="nav navbar-nav">
            <li className="hidden">
              <a href={`${homePrefix}#page-top`} />
            </li>
            <li>
              <a className="page-scroll" href={`${homePrefix}#about`}>
                About
              </a>
            </li>
            <li>
              <a className="page-scroll" href={`${homePrefix}#portfolio`}>
                Portfolio
              </a>
            </li>
            <li>
              <a className="page-scroll" href={`${homePrefix}#apply`}>
                Apply
              </a>
            </li>
            <li>
              <a className="page-scroll" href={`${homePrefix}#team`}>
                Team
              </a>
            </li>
            <li>
              <Link href="/blog/">Blog</Link>
            </li>
            <li>
              <a className="page-scroll" href={`${homePrefix}#contact`}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
