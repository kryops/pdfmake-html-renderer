import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'jest-puppeteer',
  testTimeout: 20000,
  transformIgnorePatterns: ['/node_modules/(?!(get-port)/)'],
  extensionsToTreatAsEsm: ['.ts'],
}

module.exports = config
