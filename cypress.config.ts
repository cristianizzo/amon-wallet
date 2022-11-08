import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '57hur3',

  env: {
    password: 'DMQ!ypz.jyu4fah@enb',
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: false,
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
