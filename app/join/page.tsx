import Script from 'next/script'

export default function JoinPage() {
  return (
    <>
      <Script
        src="https://s3-eu-west-1.amazonaws.com/share.typeform.com/embed.js"
        strategy="afterInteractive"
      />
      <style>{`
        html, body {
          margin: 0;
          height: 100%;
          overflow: hidden;
        }
        #typeform-full {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          border: 0;
        }
      `}</style>
      <iframe
        id="typeform-full"
        title="M&T Innovation Fund Application"
        width="100%"
        height="100%"
        frameBorder={0}
        src="https://karan15.typeform.com/to/koIj1G"
      />
    </>
  )
}
