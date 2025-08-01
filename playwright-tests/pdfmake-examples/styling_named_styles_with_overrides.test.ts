import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

// https://github.com/bpampuch/pdfmake/blob/master/examples/styling_named_styles_with_overrides.js
const document: TDocumentDefinitions = {
  content: [
    {
      text: 'This paragraph uses header style and extends the alignment property',
      style: 'header',
      alignment: 'center',
    },
    {
      text: [
        'This paragraph uses header style and overrides bold value setting it back to false.\n',
        'Header style in this example sets alignment to justify, so this paragraph should be rendered \n',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.',
      ],
      style: 'header',
      bold: false,
    },
  ],
  styles: { header: { fontSize: 18, bold: true, alignment: 'justify' } },
}

test('pdfmake/named-styles-overrides', async ({ page }) => {
  await takeSnapshots(document, page)
})
