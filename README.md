### 介绍

来自慕课网课程 JS实现“旋转木马”幻灯片效果学习

一个幻灯片js插件。



HTML最外层从.C_poster.poster-main开始

* 调用方法：

     引入css和main.js、jQuery
     
		

		Carousel.init($(".C_poster"));
		
	


* 配置方法：

   为了做到对称，目前只能支持奇数个展示项

 在类名为.C_poster.poster-main的节点设置data-setting属性，加上需要的配置属性和对应的值：例如


	<div class="C_poster poster-main" data-setting='{"width": 1100,"hieght": 270,"posterWidth": 800,"height": 286,"scale": 0.8,"speed":300,"verticleAlign":"middle"}'></div>
	各配置项的意思：
	width/height: 整体的宽/高
	posterWidth/posterHeight: 第一帧（居中的一帧）的宽/高
	scale: 相邻帧之间的缩放倍率
	speed: 帧切换的速度
	verticleAlign: 帧的对其方式
	autoPlay: 自动播放时帧切换的时间间隔
	
	
	