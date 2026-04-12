import { useEffect, useRef } from 'react'
import { PdfmakeHtmlRenderer, mount, unmount } from 'pdfmake-html-renderer/standalone'
import 'pdfmake-html-renderer/index.css'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

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
        }
      }
    })

    return () => { unmount(app); }
  }, []);

  return (
    <div ref={containerRef}></div>
  )
}

export default App
