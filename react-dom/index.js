import MyReact from '../react'

function render(element, container){
  // const ele = MyReact.createElement(element)
  const dom = document.createElement(element.type)
  container.appendChild(dom) 
}



const MyReactDom = {
  render
}

export default MyReactDom