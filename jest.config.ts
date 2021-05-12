import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'jest-puppeteer',
  testTimeout: 20000,
}

export default config
