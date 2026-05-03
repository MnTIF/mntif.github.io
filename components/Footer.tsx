export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-10 col-lg-offset-1 text-center">
            <h4>
              <strong>M&amp;T Innovation Fund</strong>
            </h4>
            <p>
              3537 Locust Walk
              <br />
              Philadelphia, PA 19104
            </p>
            <ul className="list-unstyled">
              <li>
                <i className="fa fa-envelope-o fa-fw" />{' '}
                <a href="mailto:info@mandtinnovationfund.com">mandtinnovationfund@gmail.com</a>
              </li>
            </ul>
            <ul className="list-inline banner-social-buttons">
              <li>
                <a
                  href="https://www.facebook.com/MandTInnovationFund"
                  className="btn btn-default btn-lg"
                >
                  <i className="fa fa-facebook fa-fw" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/MandTInnovation" className="btn btn-default btn-lg">
                  <i className="fa fa-twitter fa-fw" />
                </a>
              </li>
            </ul>
            <hr className="small" />
            <p className="text-muted">Copyright &copy; M&amp;T Innovation Fund 2018</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
