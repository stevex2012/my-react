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

function createDom(fiber){
  if(!fiber) return 
    // console.log(fiber)
    const type = fiber.type;
    let props = fiber.props
    // 组件类型
    let dom = type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(type)
  
    const isPropKey = key => key !== 'children'
    Object.keys(props).filter(isPropKey).forEach(name => dom[name] = props[name])
    
    return dom
}
let nextUnitOfWork = null

function render(element, container){
  //  todo
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

/**
 * ？dom 数量过大会导致 阻塞主线程 
 * 需要切分任务
 */


function workLoop(deadline){
  let shouldYield = false
  while(!shouldYield && nextUnitOfWork){
    // console.log('---nextUnitOfWork', nextUnitOfWork)
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1;
  }
  window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)

function performUnitOfWork(fiber){
  // console.log('----fiber', fiber)
  // todo
  // 1. add dom node 
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  }
  if(fiber.parent){
    console.log('appendChild',fiber.dom)
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // 2. create new fiber foreach children create new fiber
  const elements =fiber.props.children
  let index = 0
  let prevSibling = null;
  while(index< elements.length){
    const newFiber = {
      type: elements[index].type,
      parent: fiber,
      props: elements[index].props,
      dom: null,
      // child: null,
      // sibling: null
    }

    if(index === 0){
      fiber.child = newFiber
    }else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber;
    index++
  }

  // 3. return next unit of work
  if(fiber.child){
    return fiber.child
  }
  let nextFiber = fiber //fiber.sibling
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
// fiber data
// function createFiber(){
//   return {
//     type: '',
//     child:'',
//     parent: '',
//     sibling: '',
//     dom: ''
//   }
// }


const MyReact = {
  createElement,
  render
}

export default MyReact;
