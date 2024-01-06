import toReact from 'svelte-adapter/react'
import { PdfmakeHtmlRenderer } from 'pdfmake-html-renderer'

import 'pdfmake-html-renderer/dist/index.css'

const Renderer = toReact(PdfmakeHtmlRenderer)

function App() {
  return (
    <div>
      <Renderer
        document={{
          content: [
            {
              text: 'pdfmake-html-renderer React Example',
              fontSize: 18,
              bold: true,
            },
            '\n',
            'Hello, world!',
          ],
        }}
      />
    </div>
  )
}

export default App
