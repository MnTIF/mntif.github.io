import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { blogPostHtml } from '@/lib/blog-post-html'

export default function BlogPage() {
  return (
    <>
      <Nav variant="subpage" />
      <header className="intro">
        <div className="intro-body">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="brand-logo" />
                <p className="intro-text">
                  Written by members of our team, this blog highlights events and opportunities in
                  MTIF.
                </p>
                <a href="#about" className="btn btn-circle page-scroll">
                  <i className="fa fa-angle-double-down animated" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section id="about" className="container content-section text-center red">
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2">
            <div
              className="blog-article"
              dangerouslySetInnerHTML={{ __html: blogPostHtml }}
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
