import Script from 'next/script'

export function SiteScripts() {
  return (
    <>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCRngKslUGJTlibkQ3FkfTxj3Xss1UlZDA&sensor=false"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/startbootstrap-grayscale/1.0.4/js/grayscale.min.js"
        strategy="afterInteractive"
      />
    </>
  )
}
