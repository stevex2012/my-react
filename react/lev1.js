const TEXT_ELEMENT = 'TEXT_ELEMENT'
function createElement(type, props, ...children){
  console.log('--type', type)
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
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: []
    }
  }
}


function render(ele, container){
  if(!ele) return 
  console.log(ele, container)
  const type = ele.type;
  let props = ele.props
  // 组件类型
  let element = type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(ele.type)

  const isPropKey = key => key !== 'children'
  Object.keys(props).filter(isPropKey).forEach(name => element[name] = props[name])
  
  props.children.forEach((child) => {
    render(child, element)
  })
  container.appendChild(element)
}
/**
 * ？dom 数量过大会导致 阻塞主线程 
 * 需要切分任务
 */
let nextUnitOfWork = null

function workLoop(deadline){
  let shouldYield = false
  while(!shouldYield && nextUnitOfWork){
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1;
  }
  window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)

function performUnitOfWork(nextUnitOfWork){
  // todo
  // 1. create root fiber
  // 2. run performUnitOfWork(rootfiber)
  // 3. add element to dom 
  // 4. create fiber for children
  // 5. select the next unit of work 
  
}

function createFiber(){
  return {
    child:'',
    parent: '',
    sibling: '',
  }
}


const MyReact = {
  createElement,
  render
}

export default MyReact;
