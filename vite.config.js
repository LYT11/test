import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('env', env)
  const port = env.VITE_PORT || 8081

  return {
    // 对应原 publicPath
    base: '/',
    // 对应原 outputDir
    build: {
      outDir: 'dist',
      // 对应原 assetsDir
      assetsDir: 'static',
      // 对应原 productionSourceMap
      sourcemap: false,
      rollupOptions: {
        output: {
          /**
           * @name 分块策略
           * @description 1. 注意这些包名必须存在，否则打包会报错
           * @description 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            element: ["element-plus", "@element-plus/icons-vue"]
          }
        }
      }
    },
    // 开发服务器配置（对应原 devServer）
    server: {
      port: port,
      open: true,
      // 对应原 client.overlay
      overlay: {
        warnings: false,
        errors: true
      },
      https: false,
      // 代理配置（对应原 proxy）
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_API, // 注意：Vite 默认环境变量前缀是 VITE_
          secure: false,
          changeOrigin: true
        }
      }
    },

    plugins: [
      vue(),
      vueDevTools(),
      VueSetupExtend(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
