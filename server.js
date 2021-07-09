
const { createServer } = require('vite')
const path = require('path')

// (async () => {
//   const server = await createServer({
//     // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
//     configFile: false,
//     root: path.resolve(__dirname),
//     server: {
//       port: 1337
//     }
//   })
//   await server.listen()
// })()

const server = createServer({
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
  configFile: './vite.config.js',
  root: path.resolve(__dirname),
  server: {
    port: 1337
  }
}).then((ViteDevServer) => ViteDevServer.listen())
// await server.listen()