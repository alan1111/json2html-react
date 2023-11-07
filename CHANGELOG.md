# 版本更新日志

## v2.3.0

-fixed
  - 支持链式组件，例如：{widget: "list.item"}，则会查找List组件下面的Item组件。

- feat
  - 支持全局css的引入，可以在option中添加css字符串，将直接引入到页面head中。

## v2.2.0

-fixed
  - 修复Input组件，当编辑或修改中间内容时，光标自动移动到内容末尾问题。

- feat
  - 新增editCb入参，用于支持html2json的开发实现。

## v2.1.6

-update
  - update numToPx to numToRem。即：renderJson可以配置任何动态数值，该数值以750px屏幕宽度为参照，将单位转换为rem。所以只需要根据不同尺寸的终端，设置html的fontSize即可。例如：width: r(10); fontSize: r(24);等等。

## v2.1.5

-feat
  - support form.validateFieldsAndScroll()。

## v2.1.2

- feat
  - 对于form组件需要额外添加属性，{"isFormField": true}。dataBind将不仅仅作为form的key值，也会作为path的一部分，方便form设置值，update action更新，联动等。
  - 联动中注入的变量名称发生改变：$globalState -> $formState。
  - action的入参，第一个是传入的data，第二个包含两个内容{form, parentResult}。其中form，为表单管理对象；parentResult为上一个action返回的内容。
  - events的入参，第一个是value，第二个包含两个内容{form, pathName}。其中form，为表单管理对象；pathName由当前组件及其父组件的dataBind组成的一个数组，主要用于表单的增删改查以及update action的更新。
  - 更新examples

## v2.1.0

- feat
  - 支持“消失的form”，即页面或者组件将不会出现form。form将会自动注入到action的第二个参数。

## v2.0.7

- feat
  - 支持异步"action", 并支持透传父"action"的放回结果"parentRes"

## v2.0.4

- fix
  - 兼容未配置"onChange"的页面

## v2.0.0

- feat
  - 支持用户使用，提供例子🌰

## v1.3.2

- feat
  - 更新入口文件"main.js", 添加"RenderJSON"组件

## v1.2.0

- feat
  - 添加"rollup"打包功能

## v1.1.0

- feat
  - 添加"peerDependencies"

## v1.0.1

- feat
  - 添加源码核心逻辑解析文档

## v1.0.0

- 初始化项目
