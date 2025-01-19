import { useRef, useEffect } from 'react'
import { PdfmakeHtmlRenderer } from 'pdfmake-html-renderer'
import { mount, unmount } from 'svelte'

import 'pdfmake-html-renderer/dist/index.css'

function App() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const app = mount(PdfmakeHtmlRenderer, {
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
      unmount(app)
    }
  }, [])

  return <div ref={containerRef} />
}

export default App
