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