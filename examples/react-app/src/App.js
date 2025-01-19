import { useRef, useEffect } from 'react'
import { PdfmakeHtmlRenderer } from 'pdfmake-html-renderer'

import 'pdfmake-html-renderer/dist/index.css'

function App() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const app = new PdfmakeHtmlRenderer({
      target: containerRef.current,
      props: {
        document: {
          content: [
            {
              text: 'pdfmake-html-renderer React Example',
              fontSize: 18,
              bold: true,
            },
            '\n',
            'Hello, world!',
          ],
        },
      },
    })

    return () => {
      app.$destroy()
    }
  }, [])

  return <div ref={containerRef} />
}

export default App
