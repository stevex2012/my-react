import * as React from 'react'
import ReactDom from 'react-dom'
import App from './src/App.jsx'



// const element = <h1 title="foo">foo</h1>
const container = document.querySelector('#root')

ReactDom.render(App(), container)


// // const element = <h1 title="foo">foo</h1>
// // const container = document.querySelector('#root')
// // ReactDom.render(element, container)


// // ===>


// // a jsx ===> js object 
// const element = {
//   type: 'h1',
//   props: {
//     title: 'foo',
//     children:  'foo'
//   }
// }

// // root container 
// const container = document.querySelector('#root')
// // 2. call ReactDom.render ==> render react js object to dom


// // create parent node
// const node = document.createElement(element.type)

// node["title"] = element.props.title;

// // create children node

// const txt = document.createTextNode("")
// txt["nodeValue"] = element.props.children

// // do append 

// node.appendChild(txt)

// container.appendChild(node)

