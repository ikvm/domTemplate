# domTemplate.js
一个非侵入式、不会破坏原来静态页面结构、可被浏览器正确显示的、格式良好的前端HTML模板解析引擎。彻底实现前后端分离，让后端专注业务的处理。
####Demo http://parky18.github.io/demo/

##目录
* [概述](#概述)
* [用法](#用法)
* [model标签](#model标签)
* [刷新model标签](#刷新model标签)
* [属性标签](#属性标签)
* [其他属性标签](#其他属性标签)
* [html标签](#html标签)
* [删除标签](#删除标签)
* [if条件标签](#if条件标签)
* [unless条件标签](#unless条件标签)
* [switch条件标签](#switch条件标签)
* [each遍历标签](#each遍历标签)
* [自定义标签](#自定义标签)
* [字符串拼接运算](#字符串拼接运算)
* [其他算术运算](#其他算术运算)
* [自定义函数](#自定义函数)

概述
-----------
 这是一个非侵入式、不会破坏原来静态页面结构、可被浏览器正确显示的、格式良好的前端引擎。

传统MVC开发模式，V层使用服务器端渲染。美工设计好静态HTML文件，交给后端工程师，需要转换成 `Jsp`、`Freemarker`、`Velocity`等动态模板文件。这种模式有几个缺点

1、动态模板文件不能被浏览器解释、必须要运行在服务器中才能显示出效果  
2、动态效果和静态效果分别存在不同文件，美工和后端工程师需要分别维护各自页面文件，其中一方需要修改页面，都需要通知另一方进行修改  
3、页面数据不能分块加载、获取跨域数据比较麻烦  

domTemplate.js 模板引擎是通过在标签中添加自定义属性，实现动态模板功能，当没有引入domTemplate脚本， 则自定义标签属性不会被浏览器解析，不会破坏原有静态效果，当引入domTemplate脚本，模板引擎回去解析这些标签属性， 并加载数据进行动态渲染。 下图：对比服务器页面渲染和使用domTemplate前端引擎开发流程 

| 服务器端模板解析 | domTemplate.js前端解析 |
| ---- | ---- |
|![before](http://git.oschina.net/parki/domTemplate/raw/master/docs/images/before.jpg)|![after](http://git.oschina.net/parki/domTemplate/raw/master/docs/images/after.jpg)|
用法
-----------
导入`jquery.js`或者`zepto.js`和`domTemplate.min.js`
```javascript
$(function () {
 $.domTemplate.init(options,callback);//可以通过selector指定根节点，默认根节点是body,表示从body开始，渲染整个页面 
 }); 
 ```
 或者解析某一个html片段。
 ```javascript
  $('selector').domTemplate(options,callback);//渲染数据是通过h-model 自动去获取数据，也可以通过data指定全局数据 
  ```
  Options
--------

| Name 	| Type 	| Default | 	Description| 
--------- | -------- | -------- | --------| 
| selector |	selector |	body 	| 根节点选择器| 
| data |	json |	{} |	渲染数据| 
| prefix | 	string |	h- |	标签前缀| 
| escape |	boolean |	true 	| 是否转义| 
| $parentElement |	jquery或者zepto对象 |	$(selector) |	当前上下文渲染父元素| 
| $currentElement |	jquery或者zepto对象 |	$parentElement 	| 当前上下文渲染元素| 

  callback
--------
模板渲染成功回调函数,`callback(model)`,所有需要等页面渲染成为做的逻辑需要注册这个回调函数，例如用`jquery.lazyload.js`实现图片懒加载
model标签
-----------
模板引擎通过`<h-model>`标签获取渲染数据,并把数据放到上下文`Context`中
方式1(把h-model取数据放在任意标签):
  ```html
 <body h-model="{user:{url:'http://localhost:8080/v/game/getUser'}}">< 
 <a h-class="{user.type}" h-href="{user.pic}" h-text="{user.username}">xxx1</a> 
 /body>
  ```
 方式2(把h-model取数据放在任意标签,可以连续取多个Model数据):
  ```html
 <div h-model="{user:{url:'http://localhost:8080/v/game/getUser'},users:{type:'get',url:'http://localhost:8080/v/game/getUsers'}}"> 
 <a h-class="{user.type}" h-href="{user.pic}" h-text="{user.username}">xxx1</a> 
 </div> 
   ```
 方式3(把h-model取数据放在任意标签,不同块数据相互不影响):
  ```html
 <div h-model="{user1:{url:'http://localhost:8080/v/game/getUser?id=5'}}"> 
 <a h-class="{user1.type}" h-href="{user1.pic}" h-text="{user1.username}">xxx1</a> 
 </div> 
 <div h-model="{user2:{url:'http://localhost:8080/v/game/getUser?id=6'}}"> 
 <a h-class="{user2.type}" h-href="{user2.pic}" h-text="{user2.username}">xxx1</a> 
 </div> 
   ```
方式4(h-model标签可以嵌套使用):
 ```html
 <body> 
 <div class="container"> 
 <div class="table-responsive" h-model="{data:{url:'http://api.huceo.com/txapi/chengyu/?key=0e70bfd01018c4404e24e68c73255d81&word=%E9%A9%AC%E5%88%B0%E6%88%90%E5%8A%9F'}}"> 
 <h3 h-text="{data.newslist[0].chengyu}">成语 <p>出处:<span h-text="{data.newslist[0].diangu}"></span></p> 
 <p>拼音:<span h-text="{data.newslist[0].pinyin}"></span></p> 
 <p>出处:<span h-text="{data.newslist[0].chuchu}"></span></p> 
 <p>范例:<span h-text="{data.newslist[0].fanli}"></span></p> 
 <div h-model="{data2:{url:'http://api.huceo.com/txapi/chengyu/?key=0e70bfd01018c4404e24e68c73255d81&word=%E6%97%97%E5%BC%80%E5%BE%97%E8%83%9C'}}"> 
 <h4 h-text="[{data.newslist[0].chengyu}]相关同义词:{data2.newslist[0].chengyu}">成语</h4> 
 <p>出处:<span h-text="{data2.newslist[0].diangu}"></span></p> 
 <p>拼音:<span h-text="{data2.newslist[0].pinyin}"></span></p> 
 <p>出处:<span h-text="{data2.newslist[0].chuchu}"></span></p> 
 <p>范例:<span h-text="{data2.newslist[0].fanli}"></span></p> 
 </div> 
 </div> 
 </div> 
 </body> 
 ```
方式5(可以定义一个全局函数对model数据进行干预):
 ```html
  <body> 
 <div class="container"> 
 <div class="table-responsive" h-model="{data:{render:'modelRender',url:'http://api.huceo.com/txapi/chengyu/?key=0e70bfd01018c4404e24e68c73255d81&word=%E9%A9%AC%E5%88%B0%E6%88%90%E5%8A%9F'}}"> 
 <h3 h-text="{data.newslist[0].chengyu}">成语 
 </div> 
 </div> 
 </body> 
 ```
 ```javascript
 function modelRender(modelName, res) { 
   console.info("model名称" + modelName); 
   console.info(res); 
   if(!res){//失败 
   return {error: '错误'}; 
   } 
   if (modelName == 'data') { //可以对model数据进行修改 
   res.newslist[0].chengyu = res.newslist[0].chengyu + '(修改)'; 
   return res; 
   } 
 } 
 ```
 
model标签作用域
只有model标签的子节点才能获得model数据，不同块model数据相互独立不影响，但是单个页面model名称还是建议不要相同

[model标签测试例子](http://parky18.github.io/demo/examples/test_model.html)  
[嵌套model测试例子](http://parky18.github.io/demo/examples/test_nest_model.html)  
[自定义修改model数据例子](http://parky18.github.io/demo/examples/test_render_model.html)  
model请求参数
--------

| Name 	| Type 	| Default | 	Description| 
|--------- | -------- | -------- | --------| 
|url 	|String |	|	发送请求的地址。|
|dataType |	String |	json |	json|
|data |	String 	|	 | 发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后|
|type |	String |	POST 	|请求方式 ("POST" 或 "GET")|

刷新model标签
-----------
可以通过`$.domTemplate.getModel([modelName])`方式获得对应对应`model`，然后调用`reload`方法，其所属页面块模板会自动刷新下
model方法
--------
|Name |	Type 	|Description|
|--------- | -------- | -------- | 
|setParamsData 	|object 	|设置URL请求参数，例如分页参数：{page: page}。|
|reload(options,callback) |	object 	刷新， |appendType=after：返回数据往原来的列表后面拼接；  appendType=before：返回数据往原来的列表前面拼接；   appendType=page：清除原来列表数据，添加返回数据； |

例子
```javascript
$.domTemplate.getModel('list1').setParamsData({page: page}).reload({appendType: 'page'}, function () { 
console.info("加载完成") ;
}); 
```

[刷新model例子1](http://parky18.github.io/demo/examples/reload_model.html)
[刷新model例子2](http://parky18.github.io/demo/examples/reload_model2.html)
[刷新model例子3](http://parky18.github.io/demo/examples/reload_model3.html)

属性标签
-----------
可以把多个DOM标签用逗号分隔，解析后会把对应的标签属性替换
```html
model数据:  
 {src:'http://www.wed114.cn/jiehun/uploads/allimg/160426/39_160426110624_1.jpg',title:'测试标题'}  
模板:  
 <img src="../../images/xx.png" h-attr="src={img.src},title={img.title},alt={img.title}" /> 
```
渲染结果
```html
 <img src="http://www.wed114.cn/jiehun/uploads/allimg/160426/39_160426110624_1.jpg" 
 title='测试标题' alt='测试标题' h-attr="src={img.src},title={img.title},alt={img.title}" /> 
```
[attr标签例子](http://parky18.github.io/demo/examples/attr.html)

其他属性标签
-----------
引擎除了支持`h-attr`这种方式：还支持以下替换标签写法

|属性 |	引擎标签|
|-----| -------- |
|text |	h-text|
|value |	h-val|
|href |	h-href|
|src |	h-src|
|src |	h-src|
|class |	h-class|
|style |	h-css|
|width |	h-width|
|height |	h-height|
|id |	h-id|
|title |	h-title|
|alt |	h-alt|

如果还需要支持其他标签属性，可以通过`$.domTemplate.registerSupportAttr(attrName)`进行添加。 

html标签
-----------

该标签解析结果会显示在对应标签的html位置
```html
<div h-html="{user.memo}">xxxxx</div>
```
渲染结果
```html
<div h-html="{user.memo}"><p>个人介绍</p></div>
```

删除标签
-----------
`h-remove` 渲染时候会删除有这个标签标识的html

```html
 <ul> 
 <li>李小璐</li> 
 <li h-remove="">动态页面需要删除这个节点</li> 
 </ul> 
```
渲染结果
```html
 <ul> 
 <li>李小璐</li> 
 </ul> 
```

if条件标签
-----------

```html
<div> 
 <p h-if="{user.id==50}" h-text="用户ID等于50">xxx</p> 
 <p>其他内容</p> 
 </div> 
```
渲染结果
```html
 <div> 
 <p>其他内容</p> 
 </div> 
```
 
unless条件标签
-----------

```html
 <div> 
 <p h-if="{user.id==50}" h-text="用户ID等于50">xxx</p> 
 <p h-unless="{user.id==50}" h-text="用户ID不等于50">xxx</p> 
 </div> 
```
渲染结果
```html
<div> 
 <p h-unless="{user.id==50}" h-text="用户ID不等于50">用户ID不等于50</p> 
 </div> 
```

switch条件标签
-----------

```html
<p h-switch="{user.id}"> 
 <input type="text" h-case="20" h-val="{user.email}"/> 
 <input type="text" h-case="60" h-val="拉拉"/> 
 <input type="text" h-case="*" h-val="丽丽"/> 
 </p> 
```
渲染结果
```html
<p h-switch="{user.id}"> 
 <input type="text" h-case="20" h-val="{user.email}" value="parky_18@163.com"/> 
 </p> 
```
each遍历标签
-----------
`t:each`属性用于迭代循环，语法：`th:each="obj,iterStat:{objList}" `迭代对象可以是`Java.util.List,java.util.Map`,数组等;
`iterStat`称作状态变量，如果没有显示设置状态变量，会默 认给个“变量名+Stat"的状态变量。属性有：
`index`:当前迭代对象的`index`（从0开始计算）
`count`: 当前迭代对象的`index`(从1开始计算)
`size`:被迭代对象的大小
`current`:当前迭代变量
`even/odd`:布尔值，当前循环是否是偶数/奇数（从0开始计算）
`first`:布尔值，当前循环是否是第一个
`last`:布尔值，当前循环是否是最后一个 

```html
 <p>遍历List例子</p> 
 <ul> 
 <li h-each="user,userStat : {users}" h-text="{userStat.index+1}---{user.email}">李小璐</li> 
 </ul> 

 <p>遍历map例子</p> 
 <ul> 
 <li  h-each="item : {user}" h-text="{item.key}:{item.value}">李小璐</li> 
 </ul> 

 <p>遍历map例子2</p> 
 <ul> 
 <li h-each="item : {{name:'lala',age:25}}" h-text="{item.key}:{item.value}">李小璐</li> 
 </ul> 

 <p>遍历数组例子</p> 
 <ul> 
 <li h-each="item : {users}" h-text="{itemStat.index}:{item}">李小璐</li>> 
 </ul> 

 <p>遍历数组例子2</p> 
 <ul> 
 <li h-each="item : {['lala','lulu']}" h-text="{itemStat.index}:{item}">李小璐</li> 
 </ul> 
```
渲染结果详细看例子
[遍历list例子](http://parky18.github.io/demo/examples/each_list.html)
[遍历map例子](http://parky18.github.io/demo/examples/each_map.html)
[遍历数组例子](http://parky18.github.io/demo/examples/each_array.html)
[遍历嵌套list例子](http://parky18.github.io/demo/examples/each_nest_list.html)

自定义标签
-----------
```javascript
 $.domTemplate.registerTag('tagName',function(ctx,name,exp){ }); //tagName 是自定义标签名称，用时要加上前缀，如定义'test'标签，用时h-test="" 
```
用法
```html
 <input type="text" h-tagName="{user.username}" /> 
```
[自定义标签例子](http://parky18.github.io/demo/examples/custom_tag.html)
参数
-----------

|Name |	Type |	 	Description|
|-----------|-----------|-----------|
|ctx 	|Context 	|	上下文，一般会用到 ctx.options、渲染表达式函数：ctx.compile(exp)和模板渲染函数：ctx.tpl(exp)|
|name |string 	|	标签名称|
|exp 	|string 	|	标签值|

字符串拼接运算
-----------
```html
 <p h-text="用户类型:{user.type}-{user.email}">xxx1</p> 
```
渲染结果
```html
 <p h-text="用户类型：{user.type}-{user.email}">用户身份:uType-parky_18@163.com</p> 
```

其他算术运算
-----------
```html
 <p h-text="{user.id-user.id}">xxx1</p> 
```
渲染结果
```html
 <p h-text="{user.id-user.id}">0</p> 
```
自定义函数
-----------
可以通过`$.domTemplate.registerHelper('functionName',function)`添加自定义函数，实例:
```html
 <p h-text="{dateFormat(user.createTime,'yyyy-MM-dd hh:mm:ss')}">xxx1</p> 
```
渲染结果
```html
 <p h-text="{dateFormat(user.createTime,'yyyy-MM-dd hh:mm:ss')}">2016-05-30 11:20:42</p> 
```
自定义函数示例
```javascript
 $.domTemplate.registerHelper('toPrefix', function (value) { return 'test:'+value; }); 
```
用法
```html
 <p h-text="{toPrefix(user.email)}">xxx1</p> 
```
渲染结果
```html
 <p h-text="{toPrefix(user.email}">test:parky_18@163.com</p> 
```
[自定义函数例子](http://parky18.github.io/demo/examples/custom_function.html)

其他例子
-----------
[新闻APP](http://parky18.github.io/demo/examples/news.html)  
[图片懒加载和渲染成功回调例子](http://parky18.github.io/demo/examples/images_lazyload.html)
