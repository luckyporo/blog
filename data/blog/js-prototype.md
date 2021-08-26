---
title: JS中的原型和原型链
date: '2020-12-24'
tags: ['JavaScript']
draft: false
summary: JS夯实基础系列1
---

## 原型

### prototype

每个函数都有一个`prototype`属性，如:

```javascript
function Person() {

}
// 注: prototype是函数才有的属性
Person.prototype.name = 'Andy'
const p1 = new Person()
const p2 = new Person()
console.log(p1.name) // Andy
console.log(p1.name) // Andy
```
函数的`prototype`属性指向的到底是哪里?

实际上函数的`prototype`属性指向的是一个对象，这个对象是调用该构造函数而创建的**实例**的原型，即上述代码里面的`p1`和`p2`对象的原型

那么问题来了，什么是原型?

> 无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个`prototype`属性（指向原型对象）。默认情况下，所有原型对象自动获得一个名为`constructor`的属性，指回与之关联的构造函数。
> 
> 在自定义构造函数时， 原型对象默认只会获得`constructor`属性，其他的所有方法都继承自 `Object`。每次调用构造函数创建一个新实例，这个实例的内部`[[Prototype]]`指针就会被赋值为构 造函数的原型对象。脚本中没有访问这个`[[Prototype]]`特性的标准方式，但大部分浏览器会在每个对象上暴露`__proto__`属性，通过这个属性可以访问对象的原型。而在`nodejs`中这个实现完全被隐藏了
>
> 关键在于理解这一点：实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有

每一个JavaScript对象(`null`除外)在创建的时候就会关联另一个对象，这个关联的对象就是原型，对象会从原型中**继承**属性

![](https://image-1259477787.cos.ap-shanghai.myqcloud.com/blog/img/20210826153908.png)

通过构造函数我们可以使用`[构造函数名称].prototype`来表示实例原型，那么我们如何表示实例与实例原型也就是`p1`和`Person.prototype`之间的关系呢?

### `__proto__`

每一个JavaScript对象(除了`null`)都具有一个`__proto__`属性，这个属性指向该对象的原型

```javascript
function Person() {

}
const person = new Person()
console.log(person.__proto__ === Person.prototype) // true
```

![](https://image-1259477787.cos.ap-shanghai.myqcloud.com/blog/img/20210826161522.png)

通过对象我们可以使用`[对象].__proto__`来表示实例原型，
那么如何通过原型来表示构造函数或者实例?

### constructor

通过原型指回实例是无法做到的，因为同一个构造函数可以生成多个实例，但是原型指向构造函数是可以的，每一个原型都有`constructor`属性指向关联的构造函数

```javascript
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```

![](https://image-1259477787.cos.ap-shanghai.myqcloud.com/blog/img/20210826162156.png)

综合上述

```javascript
function Person() {

}
const person = new Person();

console.log(person.__proto__ === Person.prototype) // true 实例的__proto__指向实例原型
console.log(Person.prototype.constructor === Person) // true 实例原型的构造器指向构造函数 
console.log(Object.getPrototypeOf(person) === Person.prototype) // true 
```

### 实例与原型

当读取实例的属性时，如果找不到，就会去关联原型中找，如果还找不到会继续去找原型的原型中是否存在属性，直到最顶层为止

```javascript
function Person() {

}

Person.prototype.name = 'Andy';

const person = new Person();

person.name = 'Bob';
console.log(person.name) // Bob

delete person.name;
console.log(person.name) // Andy
```



## 原型链

### 理解原型链

> `ECMA-262`把原型链定义为`ECMAScript`的主要继承方式。其基本思想就是通过原型继承多个引用类型的属性和方法。重温一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型有一个属性指回构造函数，而实例有一个内部指针指向原型。如果原型是另一个类型的实例呢？那就意味 着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链。这就是原型链的基本构想。

### 原型的原型

原型也是一个对象，所以可以通过最原始的方式创建

```javascript
const obj = new Object();
obj.name = 'Andy'
console.log(obj.name) // Andy
```

实际上原型对象就是通过`Object`构造函数生成的，实例的`__proto__`指向构造函数的`prototype`

![](https://image-1259477787.cos.ap-shanghai.myqcloud.com/blog/img/20210826172321.png)

### 原型链的终止

正常的原型链都会终止于`Object`的原型对象而`Object`原型的原型是`null`

```javascript
console.log(Object.prototype.__proto__ === null) // true
```

阮一峰老师在[undefined与null的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)一文中写到:

> null 表示“没有对象”，即该处不应该有值。

所以`Object.prototype.__proto__`的值为`null`跟`Object.prototype`没有原型，其实表达了一个意思

所以查找属性的时候查到`Object.prototype`就可以停止查找了

![](https://image-1259477787.cos.ap-shanghai.myqcloud.com/blog/img/20210826173056.png)

蓝色线条关联起来的原型的链状结构就是原型链

## 补充

1. ```javascript
   function Person() {

   }
   const person = new Person();
   console.log(person.constructor === Person); 
   // person.constructor === Person.prototype.constructor
   ```
   实际上`person`中并没有`constructor`属性，当找不到此属性时候会去原型链上找也就是`Person.prototype.constructor`原型中有该属性，于是`person.constructor === Person`
2. `__proto__`是一个非标准访问原型的方法，只是绝大多数浏览器都实现了这个方法，可以在浏览器中直接访问，它并不存在于`Person.prototype`中，而是来自于`Object.prototype`，当使用`obj.__proto__`时，可以理解成返回了`Object.getPrototypeOf(obj)`
3. JS中原型链真的是继承吗?
   > 继承意味着复制操作，然而`JavaScript`默认并不会复制对象的属性，相反，`JavaScript`只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些
   >
   > --你不知道的JavaScript

## 参考资料

1. [冴羽的博客](https://github.com/mqyqingfeng/Blog/issues/2)
2. [JavaScript高级程序设计](https://book.douban.com/subject/35175321/)
3. [JavaScript权威指南](https://book.douban.com/subject/35396470/)