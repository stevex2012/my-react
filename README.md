# my-react
learn react ^17

## vite api 启动

### 
- jsx -> createElement -> js object
- reactDom.render(createElement()) ===> html
- 上一步是递归，dom数据过大可能导致 主线程阻塞 
- render 任务需要细分化
```js
const app = <div style="color: red">12313<span>inner span</span></div>

const jsxTransformApp = {
  type: 'div',
  props: {
    children: [
      {
        type: 'text_element',
        props: {
          children: [],
          nodeVale: '12313',
        }
      },
      {
        type: 'span',
        props: {
          children: [
            {
             type: 'text_element',
             props: {
                children: [],
                nodeVale: 'inner span',
              }
            }
          ]
        }
      },
    ],
    style: "color: red"
  } 
}
```
## 简单fiber 机制
- 首先需要一个任务数据
```js
// fiber 数据结构 双向链表
interface fiberP = {
  type: string,
  props: {
    ...restP,
    children: fiberP[]
  },
  child: fiberP,
  sibling: fiberP,
  parent: fiberP,
}
```
- 主线程空闲的时候并且任务数据不为空的时候， 执行 vDom -> 真实dom
- 深度优先遍历更新,
- 每次只更新一个节点
```js
let fiberTask = null
function render(element, container){
  fiberTask = {
    dom: element,
    parent: container
  }
}
function createDom(fiber){
  const { type, props } = fiber;
  // create vDom 数据
  return dom;
}
function workLoop(deadTime){
  let yieldUpdate = false
  while(!yieldUpdate && fiberTask){
    fiberTask = performUnitOfWork(fiberTask)
    shouldYield = deadline.timeRemaining() < 1;
  } 
  window.requestIdleCallback(workLoop)
}
function performUnitOfWork(fiber){
  // create dom
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  }
  // append dom
  if(fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // create fiber for the children
  // fiber 
  const children = fiber.props.children;
  let i = 0;
  let prevSibling = null
  while(i < children.length){
    const newFiber = {
      type: children[i].type,
      dom: null,
      child: null,
      parent: null,
      props: children[i].props,
      sibling: null,
    }
    // 新fiber需要挂载在传入的fiber上
    if(i === 0){
      fiber.child = newFiber
    }else{
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber;
    i++
  }
  // return next unit of work
  if(fiber.child){
    return fiber.child
  }
  let nextFiber = fiber
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
window.requestIdleCallback(workLoop)
```