---
title: JS中的对象
date: '2020-12-20'
tags: ['JavaScript']
draft: false
summary: 创建对象的5种方式：创建Object构造函数、对象字面量、工厂模式、构造函数模式、原型模式
---

## 创建对象

### 1.创建Object构造函数

```javascript
const person = new Object()
person.greet = 'hello'
console.log(person) // { greet: 'hello' }
```

### 2.对象字面量

```javascript
const person = { greet: 'hello' }
console.log(person) // { greet: 'hello' }
```

使用前两种方式的不足之处： 创建具有同样接口的多个对象需要重复编写代码

### 3.工厂模式

```javascript
function createPerson(greet) {
  const obj = new Object()
  obj.greet = greet
  return obj
}

const person1 = { greet: 'hello' }
const person2 = { greet: 'hi' }
console.log(person1) // { greet: 'hello' }
console.log(person2) // { greet: 'hi' }
```

工厂模式解决创建多个类似对象问题，但是还是无法识别新创建的对象是什么类型

### 4.构造函数模式

```javascript
function Person(greet) {
  this.greet = greet;
  this.sayHello = function() {
    console.log(this.greet);
  }
}

const person1 = new Person('hello');
const person2 = new Person('hi');
```

构造函数也是函数，只不过需要`new`关键字调用，使用`new`操作符调用构造函数时会执行如下操作：

1. 在内存中创建一个新对象
2. 在这个新对象内部的`[[Prototype]]`特性被赋值为构造函数的`prototype`属性
3. `this`指向新对象
4. 执行构造函数内部代码给新对象添加属性
5. 返回刚才创建的新对象(除非构造函数本身返回另一个非空对象)

相比工厂模式，构造函数可以确保实例被标识为特定类型，但也有自己的问题：其定义的方法会在每个实例上都创建一遍。因为ECMAScript规定函数是对象，所以每次定义函数的时候都会初始化一个对象。

### 5.原型模式

```javascript
/**
 * 每个函数都会创建一个prototype属性，是一个对象，包含由特定引用类型的实例共享的属性和方法。
 * 实际上prototype对象就是通过调用构造函数创建的对象的原型。
 * 在原型对象上面定义的属性和方法可以被实例化的对象共享。
 */
function Person() {}

Person.prototype.greet = 'hello';
Person.prototype.sayHello = function() {
    console.log(this.greet);
};

const person1 = new Person();
const person2 = new Person();

person1.sayHello(); // "hello"
person2.sayHello(); // "hello"
```

无论何时，只要创建一个函数，`js`引擎就会按照特定的规则为这个函数创建一个`prototype`属性，其他的所有方法都继承自`Object`。每次调用构造函数创建一个新的实例时，这个实例的内部`[[Prototype]]`指针就会被赋值为构造函数的原型对象。实例与构造函数原型之间有直接联系，但实例与构造函数之间没有直接联系。

通过对象访问属性时，会按照属性名称开始在对象上搜索，找到了就会返回该属性对应的值，没有找到就会沿着指针进入原型对象搜索该属性。如果实例对象上有与原型对象同名的属性，则实例对象上的属性会遮蔽原型对象上的同名属性，而不会修改原型对象。

原型模式也不是没有问题，首先他弱化了向构造函数传递初始化参数的能力，导致所有的实例默认都取得相同的属性值，原型最主要的问题是源自它的共享特性，原型上的所有属性在实例间共享，对函数来说比较合适，对于包含基本类型的属性也可以通过在实例上添加同名属性来遮蔽原型对象，但是对于包含引用值的属性，例如数组，向一个实例的数组属性中添加元素，另一个实例的属性中的数组也会共享数组。这也是开发中不会单独使用原型模式的原因。
