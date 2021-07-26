// import React from 'react'

// const Hello = () => <h3>hello1</h3>

// const App = () => (
//   <div>
//     <h1 title="foo">hello</h1>
//     <Hello />
//   </div>
// )

// export default App;

// import { Didact } from '../main.js'
import MyReact from '../react/index.js'
/** @jsx MyReact.createElement */

// const App = (
//   <div style="background: salmon;min-height: 30px">
//     {/* <h1>Hello World<span>13123</span></h1>
//     <h2 style="text-align:right">lllll</h2> */}
//     <input placeholder="placeholder" onInput={(e) => console.log(e.target.value)}/>
//     <h1>
//       <p></p>
//       <a>a</a>
//     </h1>
//     <h2 onClick={() => console.log(11111)}>h2</h2>
//     <h3>h3</h3>
//   </div>
// );

const updateVa = (e) => {
  foo(e.target.value)
}

function foo(value) {
  console.log('value',value)
  return (
    <div style="background: salmon;min-height: 30px">
    {/* <h1>Hello World<span>13123</span></h1>
    <h2 style="text-align:right">lllll</h2> */}
    <input placeholder="placeholder" onInput={updateVa} value={value}/>
    {/* <h1>
      <p></p>
      <a>a</a>
    </h1>
    <h2 onClick={() => console.log(11111)}>h2</h2>
    <h3>h3</h3> */}
  </div>
  )
}
/** @jsx MyReact.createElement */
function App(props){
  const [num, setNum] = MyReact.useState(0)
  console.log('setNum',setNum)
  return (
    <div>
      <h1>{props.name}</h1>
      <button onClick={() => setNum(pre => pre+1)}>click{num}</button>
    </div>
  )
}


export default App
// export default foo

