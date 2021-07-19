// import * as React from 'react'
// import ReactDom from 'react-dom'
import App from './src/App.jsx'
import MyReact from './react/index.js'

// console.log(App)

// // const element = <h1 title="foo">foo</h1>
// const container = document.querySelector('#root')

// ReactDom.render(App(), container)

const container = document.getElementById("root");

MyReact.render(App, container);
