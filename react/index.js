// fiber alternate wipRoot
const TEXT_ELEMENT = 'TEXT_ELEMENT'
function createElement(type, props, ...children) {
  console.log('--type', type)
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child),
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
const isEvent = key => key.startsWith('on')
const isProperty = (key) => key !== 'children' && !isEvent(key)
// const isProperty = (key) => key !== 'children'
const isNew = (prev, next) => key => prev[key] != next[key]
const isGone = (prev, next) => key => !(key in next)


function createDom(fiber) {
  if (!fiber) return
  // console.log(fiber)
  const type = fiber.type
  let props = fiber.props
  // 组件类型
  let dom =
    type === TEXT_ELEMENT
      ? document.createTextNode('')
      : document.createElement(type)

  
  Object.keys(props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = props[name]))
    Object.keys(props)
      .filter(isEvent)
      .forEach((event) => {
        const eventName = event.toLowerCase().substring(2)
        dom.addEventListener(eventName, props[event])
      })
  return dom
}


let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null
let deletions = null
let wipFiber = null
let hookIndex = null



function render(element, container) {
  //  todo
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot, // link to old fiber
  }
  deletions = []
  nextUnitOfWork = wipRoot
}


function updateDom(dom, prevProps, nextProps){
  console.log('---prevProps', prevProps)
  console.log('---prevProps', prevProps)
  // remove old or change listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key => !(key in nextProps) || isNew(prevProps, nextProps)[key]
    )
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
  // remove has gone property
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => dom[name] = '')
  // change or add new property
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => dom[name] = nextProps[name])
  // add event listenrer
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      debugger
      const eventTYpe = name.toLowerCase().substring(2)
      dom.addEventListener(
        eventTYpe,
        nextProps[name]
      )
    })
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitDeletion(fiber, parentDom){
  if(fiber.dom){
    parentDom.removeChild(fiber.dom)
  }else {
    commitDeletion(fiber.child, parentDom)
  }
}

function commitWork(fiber) {
  // todo update just add dom
  if (!fiber) {
    return
  }
  // find parent fiber has dom node
  let domParentFiber = fiber.parent;
  while(!domParentFiber.dom){
    domParentFiber = domParentFiber.parent
  }
  const parentDom = domParentFiber.dom

  if(fiber.effectTag === 'PLACEMENT' && fiber.dom !== null){//  add new dom
    parentDom.appendChild(fiber.dom)
  }else if(fiber.effectTag === 'UPDATE' && fiber.dom !== null){// update dom
    // update
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if(fiber.effectTag === 'DELETION' ){ // delete dom
    // parentDom.removeChild(fiber.dom)
    commitDeletion(fiber, parentDom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
/**
 * ？dom 数量过大会导致 阻塞主线程
 * 需要切分任务
 */

function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    // console.log('---nextUnitOfWork', nextUnitOfWork)
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)

function updateFunctionComponent(fiber){
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber){
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  const elements = fiber.props.children
  reconcileChildren(fiber, elements)
}

function performUnitOfWork(fiber) {
  // console.log('----fiber', fiber)
  // todo
  // 1. add dom node
  // is a function components 
  const isFunctionComponent = fiber.type instanceof Function
  if(isFunctionComponent){
    updateFunctionComponent(fiber)
  }else {
    updateHostComponent(fiber)
  }
  
  // add alternate to new fiber
  // alternate link to old fiber

  // if(fiber.parent){
  //   console.log('appendChild',fiber.dom)
  //   fiber.parent.dom.appendChild(fiber.dom)
  // }
  // 2. create new fiber foreach children create new fiber
  

  // 3. return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber //fiber.sibling
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

function reconcileChildren(wipFiber, elements) {
  // reconcile new fiber and old fiber
  let index = 0
  let prevSibling = null
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child

  while (index < elements.length || oldFiber !== null) {
    const element =  elements[index]
    let newFiber = null
    // const newFiber = {
    //   type: elements[index].type,
    //   parent: wipFiber,
    //   props: elements[index].props,
    //   dom: null,
    //   // child: null,
    //   // sibling: null
    // }
    // compare newFiber and oldFiber use type
    const sameType = oldFiber && element && element.type ===oldFiber.type

    if(sameType){
      // update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: oldFiber.parent,
        alternate: oldFiber,
        effectTag: "UPDATE"

      }
    }

    if(element && !sameType){
      // add the node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"

      }
    }

    if(oldFiber && !sameType){
      // delete the oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index == 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    // if(newFiber === null) prevSibling = newFiber
    prevSibling = newFiber
    ++index
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
function useState(value){

  const oldHook = 
    wipFiber.alternate && 
    wipFiber.alternate.hooks && 
    wipFiber.alternate.hooks[hookIndex]

  const hook = {
    state: oldHook ? oldHook.state : value,
    queue: []
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    
    hook.state = action(hook.state)
  })

  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
  // return [value,setValue]
}

const MyReact = {
  createElement,
  render,
  useState,
}

export default MyReact
