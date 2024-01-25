import { defineConfig } from 'cypress';

export default defineConfig({
    video: false,
    retries: {
        runMode: 3,
        openMode: 0,
    },
    viewportHeight: 1080,
    viewportWidth: 1920,
    defaultCommandTimeout: 30000,
    component: {
        devServer: {
            framework: 'create-react-app',
            bundler: 'webpack',
        },
    },
});
