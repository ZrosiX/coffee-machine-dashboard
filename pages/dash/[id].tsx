export default function Dash () {
  if (!process.browser) {
    return <></>
  }

  return <meta httpEquiv="refresh" content={`0; url=/dash?g=${window.location.pathname.split('/').pop()}`} />
}
