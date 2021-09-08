---
title: 作用域、执行上下文、变量对象和作用域链
date: '2020-12-28'
tags: ['JavaScript']
draft: false
summary: JS夯实基础系列2
---

## 作用域

> 作用域是指程序源代码中定义变量的区域
> 
> 作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限

### 动态作用域

函数的作用域是在函数调用的时候决定了

### 静态作用域（词法作用域）

函数的作用域是在函数定义的时候就决定的

`JavaScript`采用的是词法作用域

```javascript
let value = 1

function foo () {
  console.log(value)
}

function bar () {
  let value = 2
  foo()
}
bar() // 1
```

如果`JavaScript`是动态作用域，那么调用`bar`函数后执行`foo`打印`value`时在`foo`内部没找到局局部变量，继续向外部调用函数`bar`中找到了`value=2`于是打印了`2`

显然`JavaScript`不是动态作用域，依然是从`foo`函数内部查找是否有局部变量`value`，如果没有，就根据书写的位置，查找上面一层的代码，也就是`value=1`，所以结果会打印`1`

## 执行上下文

执行上下文在`JavaScript`中指的是代码运行时的环境的抽象。每当`JavaScript`代码运行，都是在执行上下文中运行的。

有三种执行上下文类型：

- **全局执行上下文（GEC）**：任何不在函数内部的代码都在会全局上下文中，EC会创建一个全局对象并且设置`this`指向全局对象。一个程序中只有一个EC
- **函数执行上下文（FEC）**：每当有函数被调用时，JS引擎都会为该函数创建一个新的上下文，函数上下文可以有多个，它们会按照定义的顺序执行
- **`eval`函数执行上下文（EFEC）**：对于现代JS开发者用的非常少，在手写`call`和`apply`才会用到

> Tips：浏览器中的全局对象是`window`，`node`中的全局对象是`global`，ES2020中定义了标准的`globalThis`来整合各个环境的全局对象访问方式，目前浏览器和`node`均实现了这个标准

### 执行栈

执行栈也即调用栈（ES），用于管理代码运行时创建的所有执行上下文。当第一次开始执行脚本时，JS引擎会创建一个全局的EC并且压入ES栈中，每次遇到一个函数调用，就会创建一个新的FEC并且压入ES栈顶，当引擎执行完ES栈顶的函数后，该FEC从ES栈中弹出。

```javascript
let a = 'hello'

function foo() {
  console.log('foo1')
  bar()
  console.log('foo2')
}

function bar() {
  console.log('bar')
}

foo()
console.log('全局')
// foo1
// bar
// foo2
// 全局
```

执行过程：

1. 创建全局执行上下文GEC并压入当前执行栈ES中
2. 代码运行到`foo()`这一行，开始创建一个函数执行上下文FEC并且压入ES栈顶
3. 开始执行`foo`函数，打印”foo1“，运行到`bar()`开始创建一个新的FEC并压入ES栈顶
4. 开始执行`bar`函数，打印”bar“，`bar`函数执行完毕，从ES栈顶弹出
5. 继续执行当前ES栈顶未执行完的FEC，打印”foo2“，`foo`函数执行完毕，从ES栈顶弹出
6. 继续执行当前ES栈顶未执行完的GEC，打印”全局“，全部代码执行完毕，GEC也会被JS引擎从ES中移除


执行上下文的创建分为两个阶段：**创建阶段**和**执行阶段**

### 执行上下文的创建阶段

1. this的绑定
2. 创建变量对象VO
3. 创建作用域链Scope chain

> 在ES6中执行上下文实际被定义为
> 1. this的绑定
> 2. 词法环境的创建
> 3. 变量环境的创建
>
> 词法环境由**环境记录器**（存储变量和函数声明的实际位置）和**外部环境的引用**（可以访问父级的词法环境，即作用域）组成，可以理解为环境记录器对应ES5前的变量对象这个概念，外部环境引用对应作用域链这个概念。
>
> 变量环境也是个一个词法环境，在ES6中，词法环境是用来存储函数声明以及使用`let`和`const`声明的变量，而变量环境**只**存储`var`声明的变量
>
> ```javascript
> let a = 20
> const b = 30
> var c
> 
> function multiply(e, f) {
>  var g = 20;
>  return e * f * g
> }
> 
> c = multiply(20, 30)
>
> // 上述代码用伪代码表示
> GlobalExectionContext = {
> 
>   ThisBinding: <Global Object>,
> 
>   LexicalEnvironment: {
>     EnvironmentRecord: {
>       Type: "Object",
>       // 在这里绑定标识符
>       a: < uninitialized >,
>       b: < uninitialized >,
>       multiply: < func >
>     }
>     outer: <null>
>   },
> 
>   VariableEnvironment: {
>     EnvironmentRecord: {
>       Type: "Object",
>       // 在这里绑定标识符
>       c: undefined,
>     }
>     outer: <null>
>   }
> }
> 
> FunctionExectionContext = {
>   ThisBinding: <Global Object>,
> 
>   LexicalEnvironment: {
>     EnvironmentRecord: {
>       Type: "Declarative",
>       // 在这里绑定标识符
>       Arguments: {0: 20, 1: 30, length: 2},
>     },
>     outer: <GlobalLexicalEnvironment>
>   },
> 
> VariableEnvironment: {
>     EnvironmentRecord: {
>       Type: "Declarative",
>       // 在这里绑定标识符
>       g: undefined
>     },
>     outer: <GlobalLexicalEnvironment>
>   }
> }
> ```

