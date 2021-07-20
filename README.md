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