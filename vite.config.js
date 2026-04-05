import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        about: resolve(__dirname, 'about.html'),
        blog: resolve(__dirname, 'blog.html'),
        serviceSmm: resolve(__dirname, 'service-smm.html'),
        serviceSeo: resolve(__dirname, 'service-seo.html'),
        serviceWebdev: resolve(__dirname, 'service-webdev.html'),
        serviceAds: resolve(__dirname, 'service-ads.html'),
        serviceContent: resolve(__dirname, 'service-content.html'),
        serviceVideo: resolve(__dirname, 'service-video.html'),
        serviceGraphic: resolve(__dirname, 'service-graphic.html'),
        servicePhotoshoot: resolve(__dirname, 'service-photoshoot.html')
      }
    }
  }
});
