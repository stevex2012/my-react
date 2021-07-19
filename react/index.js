function createElement(type, props, ...children){
  return {
    type,
    props: {
      ...props,
      children: children.map(child => (
        typeof child === 'object'
         ? child
         : createTextElement(child)
      )),
    }
  }
}

function createTextElement(text){
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValues: text,
      children: []
    }
  }
}

function render(ele, container){
  console.log(ele, container)
  var p = document.createElement("p");
  p.innerHTML = 'lllll'
  container.appendChild(p)
}
const MyReact = {
  createElement,
  render
}

export default MyReact;
