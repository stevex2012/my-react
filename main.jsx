// import * as React from 'react'
// import ReactDom from 'react-dom'
import App from './src/App.jsx'
import MyReact from './react/index.js'
/** @jsx MyReact.createElement */
// // const element = <h1 title="foo">foo</h1>
// const container = document.querySelector('#root')

// ReactDom.render(App(), container)

const container = document.getElementById("root");

// function rerender(value){
//   MyReact.render(App(value), container);
// }


/** @jsx MyReact.createElement */
function Counter() {
  const [state, setState] = MyReact.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}
const element = <Counter />

// MyReact.render(element, container)
MyReact.render(<App name="123" />, container);
// MyReact.render(App({name: 123}), container);

// rerender('hello')
// setTimeout(() => {
//   console.log('---')
//   MyReact.render(App('value'), container);
// }, 2000)
