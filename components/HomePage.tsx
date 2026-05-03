import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export function HomePage() {
  return (
    <>
      <Nav variant="home" />
      <header className="intro">
        <div className="intro-body">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="brand-logo" />
                <p className="intro-text">
                  Seed-stage cash grants and venture deployment for University of Pennsylvania
                  startups.
                  <br />
                  Managed by students in the Jerome Fisher Management and Technology Program.
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
            <h1>About the M&amp;T Innovation Fund</h1>
            <p>
              The <strong>M&amp;T Innovation Fund</strong> is a University- and M&amp;T-backed
              student run organization looking to provide value creation for seed-stage ventures.
              Along with value creation tasks, non-equity grants will be provided for specific
              expenses.
            </p>
            <p>
              The Fund is managed and operated by current M&amp;T students from all class years.
              Faculty advisers, M&amp;T Program administration, and M&amp;T alumni act as support
              for the Fund.
            </p>
            <p>
              The Fund is similar to an incubator or accelerator. Candidate ventures should be as
              interested in venture development as they are in the non-equity grants. Grants will
              likely fall between $4000~7000.
            </p>
            <p>
              The Fund will only give out grant money for expenses that are 1) specific, 2)
              near-term, and 3) related to the venture development in which the Fund is involved.
              That is, the Fund is not interested in handing out non-equity grants for &quot;black
              box&quot; expenses, or for expenses a venture anticipates having in a year&apos;s
              time.
            </p>
          </div>
        </div>
      </section>
      <section id="crest" className="content-section text-center black">
        <div className="crest-section">
          <div className="container text-box">
            <div className="col-lg-10 col-lg-offset-1">
              <h1>The M&amp;T Innovation Fund Difference</h1>
              <p>
                The M&amp;T Innovation Fund differentiates itself as a unique provider of both
                financial and strategic support for the ventures it selects. Grants from the Fund
                will provide initial capital that help seed stage ventures achieve particular goals.
                Perhaps more importantly, the fund will continue to be of support to the ventures we
                fund. Chosen startups can leverage the varied experiences and insights of current
                M&amp;T students, who will provide critical strategic insights into bringing a
                product to market. These companies can also gain valuable connections and mentorship
                from successful M&amp;T alumni to further their venture.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="portfolio" className="container content-section text-center white">
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2">
            <h1>Sponsors</h1>
            <hr />
            <p>
              The M&amp;T Innovation Fund is supported by the University of Pennsylvania, the Jerome
              Fisher Management and Technology Program, and M&amp;T alumni as well as various
              corporate sponsors.
            </p>
            <div className="row">
              <div className="col-lg-6">
                <img src="/img/penn_full.png" alt="University of Pennsylvania" />
              </div>
              <div className="col-lg-6">
                <img src="/img/mnt.png" alt="Jerome Fisher M&amp;T Program" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="apply" className="container content-section text-center black">
        <div className="spring-section">
          <div className="container text-box">
            <div className="col-lg-8 col-lg-offset-2">
              <h1>Apply Now</h1>
              <p>Applications are now open for the 2022-2023 Cohort!</p>
              <a href="https://forms.gle/5kzFYmvgDqN1Gjsf7" className="btn btn-default btn-lg">
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" className="content-section text-center white">
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2">
            <h1> FAQ </h1>
            <hr />
            <div className="row">
            <div className="col-lg-6">
              <div id="faqAccordionLeft">
                <div className="card">
                  <div className="card-header" id="headingOne">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed question-title"
                        type="button"
                        data-toggle="collapse"
                        data-target="#question4"
                        aria-expanded="false"
                        aria-controls="question4"
                      >
                        Is my startup too small for this?
                      </button>
                    </h5>
                  </div>
                  <div
                    id="question4"
                    className="collapse"
                    aria-labelledby="headingOne"
                    data-parent="#faqAccordionLeft"
                  >
                    <div className="card-body">
                      Very early stage, pre-seed startups should focus on having a clear road of their
                      objectives to develop their company&apos;s product/service and itemize
                      particular challenges the M&amp;T Innovation Fund could help fund or staff
                      (eg. front-end dev, server costs...).
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingTwo">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed question-title"
                        type="button"
                        data-toggle="collapse"
                        data-target="#question5"
                        aria-expanded="false"
                        aria-controls="question5"
                      >
                        Is my startup too large for this?
                      </button>
                    </h5>
                  </div>
                  <div
                    id="question5"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#faqAccordionLeft"
                  >
                    <div className="card-body">
                      Startups in the later stages of funding with a developed MVP should focus on
                      small projects M&amp;T students could work on that could then be integrated into
                      your main business activities (eg. conduct marketing research, develop small
                      custom API).
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingThree">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed question-title"
                        type="button"
                        data-toggle="collapse"
                        data-target="#question6"
                        aria-expanded="false"
                        aria-controls="question6"
                      >
                        Do you take equity in my startup?
                      </button>
                    </h5>
                  </div>
                  <div
                    id="question6"
                    className="collapse"
                    aria-labelledby="headingThree"
                    data-parent="#faqAccordionLeft"
                  >
                    <div className="card-body">
                      Funding you receive is considered a grant so there is no equity stake.
                      Although, our team does want to ensure that any funding goes towards your
                      original stated purpose and that we have the opportunity for continued
                      involvement over the semester in helping mature your project.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div id="faqAccordionRight">
                <div className="card">
                  <div className="card-header" id="headingOneR">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed question-title"
                        type="button"
                        data-toggle="collapse"
                        data-target="#question1"
                        aria-expanded="false"
                        aria-controls="question1"
                      >
                        How do I know if my startup is a good fit?
                      </button>
                    </h5>
                  </div>
                  <div
                    id="question1"
                    className="collapse"
                    aria-labelledby="headingOneR"
                    data-parent="#faqAccordionRight"
                  >
                    <div className="card-body">
                      Ideally, you should have more than just an idea – potentially a minimum viable
                      product or something to show that you have already invested some time into
                      your project.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingTwoR">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed question-title"
                        type="button"
                        data-toggle="collapse"
                        data-target="#question2"
                        aria-expanded="false"
                        aria-controls="question2"
                      >
                        How is this different from other grants ?
                      </button>
                    </h5>
                  </div>
                  <div
                    id="question2"
                    className="collapse"
                    aria-labelledby="headingTwoR"
                    data-parent="#faqAccordionRight"
                  >
                    <div className="card-body">
                      The fund&apos;s objective is to provide continued support over the academic year
                      to develop a component of your project while working with M&amp;T students. For
                      example, you may end up working closely with our team to help you develop a
                      marketing plan or to provide technical consulting with the advancement of a
                      software product. For the M&amp;T Innovation Fund to be right fit for you must
                      be interested in a project based funding approach rather than an unconditional
                      grant.
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingThreeR">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed question-title"
                        type="button"
                        data-toggle="collapse"
                        data-target="#question3"
                        aria-expanded="false"
                        aria-controls="question3"
                      >
                        How should funds be used?
                      </button>
                    </h5>
                  </div>
                  <div
                    id="question3"
                    className="collapse"
                    aria-labelledby="headingThreeR"
                    data-parent="#faqAccordionRight"
                  >
                    <div className="card-body">
                      Funding from the M&amp;T Innovation Fund goes towards covering costs of
                      particular projects that directly generate value for your startup. You will be
                      asked to provide detailed information on the application about what projects
                      you plan on working you will be using the grant for.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
      <section id="team" className="content-section text-center white">
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2">
            <h1>The Team</h1>
            <div className="row">
              <hr />
              <div className="col-lg-4">
                <img src="/img/megan.jpg" className="img-responsive" alt="Megan Kotrappa" />
                <h3>Megan Kotrappa</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/akshay.jpg" className="img-responsive" alt="Akshay Malhotra" />
                <h3>Akshay Malhotra</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/bharath.jpg" className="img-responsive" alt="Bharath Jaladi" />
                <h3>Bharath Jaladi</h3>
              </div>
            </div>
            <div className="row">
              <hr />
              <div className="col-lg-4">
                <img src="/img/Leo.jpg" className="img-responsive" alt="Leo Vigna" />
                <h3>Leo Vigna</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/Jonathan.png" className="img-responsive" alt="Jonathan Kogan" />
                <h3>Jonathan Kogan</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/maanasi.jpg" className="img-responsive" alt="Maanasi Garg" />
                <h3>Maanasi Garg</h3>
              </div>
            </div>
            <div className="row">
              <hr />
              <div className="col-lg-4">
                <img src="/img/rohit.jpg" className="img-responsive" alt="Rohit Majumdar" />
                <h3>Rohit Majumdar</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/Pranshu.JPG" className="img-responsive" alt="Pranshu Suri" />
                <h3>Pranshu Suri</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/cole.jpg" className="img-responsive" alt="Cole Hersowitz" />
                <h3>Cole Hersowitz</h3>
              </div>
            </div>
            <div className="row">
              <hr />
              <div className="col-lg-4">
                <img src="/img/srisa_2.jpg" className="img-responsive" alt="Srisa Changolkar" />
                <h3>Srisa Changolkar</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/Alex.JPG" className="img-responsive" alt="Alex Carbonell" />
                <h3>Alex Carbonell</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/Aryan_pic.jpeg" className="img-responsive" alt="Aryan Chauhan" />
                <h3>Aryan Chauhan</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <img src="/img/Cindy.JPG" className="img-responsive" alt="Cindy Jiang" />
                <h3>Cindy Jiang</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/Daniel_B.png" className="img-responsive" alt="Daniel Bessonov" />
                <h3>Daniel Bessonov</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/Daniel_T.JPG" className="img-responsive" alt="Daniel Tian" />
                <h3>Daniel Tian</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <img src="/img/Kush.jpg" className="img-responsive" alt="Kush Pandey" />
                <h3>Kush Pandey</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/savan_2.jpg" className="img-responsive" alt="Savan Patel" />
                <h3>Savan Patel</h3>
              </div>
              <div className="col-lg-4">
                <img src="/img/sriram_2.jpg" className="img-responsive" alt="Sriram Tolety" />
                <h3>Sriram Tolety</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <img src="/img/YanLing.png" className="img-responsive" alt="Yan Ling Chen" />
                <h3>Yan Ling Chen</h3>
              </div>
            </div>
            <br />
            <br />
            <br />
            <div className="row">
              <h2>Faculty Advisors</h2>
              <hr />
              <div className="col-lg-6 col-lg-offset-3">
                <img src="/img/boon.png" className="img-responsive" alt="Boon Thau Loo" />
                <h2>Boon Thau Loo</h2>
                <p>
                  Boon&apos;s research focuses on distributed data management systems, Internet-scale
                  query processing, and the application of database technologies to networked
                  systems. He is particularly interested in developing information-centric network
                  architectures that can be easily extended, composed, and formally verified. His
                  recent projects include applying declarative networking techniques in the areas of
                  dynamic network composition, adaptive mobile ad-hoc networks, and scalable
                  knowledge-based networks. He is also exploring novel database-inspired techniques
                  for diagnosing, securing, and verifying network protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="container content-section text-center blue">
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2">
            <h2>Contact Us</h2>
            <p>
              Want to learn more about the M&amp;T Innovation Fund? Interested in participating in
              the Fund as a sponsor or mentor? Please feel free to reach out to us with your
              questions and inquiries.
            </p>
            <p>
              <a href="mailto:info@mandtinnovationfund.com">mandtinnovationfund@gmail.com</a>
            </p>
            <ul className="list-inline banner-social-buttons">
              <li>
                <a
                  href="https://www.facebook.com/MandTInnovationFund"
                  className="btn btn-default btn-lg"
                >
                  <i className="fa fa-facebook fa-fw" /> <span className="network-name">Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/MandTInnovation" className="btn btn-default btn-lg">
                  <i className="fa fa-twitter fa-fw" /> <span className="network-name">Twitter</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <iframe
        title="Campus map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1113.024687103911!2d-75.19843275155752!3d39.95282567966475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c659d2b2d243%3A0x97cd4afbe82a44e2!2sUniversity%20of%20Pennsylvania%20-%20Wharton%20School!5e0!3m2!1sen!2sus!4v1581810394576!5m2!1sen!2sus"
        width="100%"
        height="250"
        style={{ border: 0 }}
        allowFullScreen
      />
      <Footer />
    </>
  )
}
