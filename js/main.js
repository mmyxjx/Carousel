;(function(){
	var Carousel = function(poster){
		// console.log(poster.find('li'))
		//保存单个Carousel对象
		this.poster = poster;
		this.posterItemMain = poster.find("ul.poster-list");
		this.nextBtn = poster.find(".poster-next-btn");
		this.prevBtn = poster.find(".poster-prev-btn");
		this.allPosterItems = poster.find(".poster-item");
		this.posterFirstItem = poster.find(".poster-item").first();
		this.posterLastItem = poster.find(".poster-item").last();
		//默认配置参数
		this.setting = {
			"width": 1000,//整体宽度
			"hieght": 270,//整体高度
			"posterWidth": 800,//第一帧的宽
			"posterHeight": 286,//第一帧高
			"scale": 0.9,
			"speed": 500,
			"verticleAlign":"middle",//接受top、bottom、middle这三个参数
			"autoPlay": 3000
		};
		$.extend(this.setting,this.getSetting());
		// console.log(this.setting)
		this.setSettingValue();
		this.setPosterPos();
		//事件绑定
		var self = this;
		this.prevBtn.click(function(){
			self.carouselRotate("left");
		});
		this.nextBtn.click(function(){
			self.carouselRotate("right");
		});
		//自动播放
		var timer = null;
		timer = setInterval(function(){
			self.nextBtn.click();
		},self.setting.autoPlay);

		this.poster.hover(function(){
			clearInterval(timer);
		},function(){
			timer = setInterval(function(){
				self.nextBtn.click();
			},self.setting.autoPlay);

		})




	};

	Carousel.prototype = {
		//旋转
		carouselRotate: function(direction){
			var _this_ = this;
			var zIndexArr = [];
			_this_.allPosterItems.each(function(){
				var self = $(this);
				var prev;
				
				if(self.is(":animated")) { //点击时如果处于动画阶段,此次点击不生效
					return;
					// self.stop(true, true); //*使用停止动画存在问题*
				} else {
					
					if(direction === "left") {
						prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem;
						//左转拿到上一帧的数据，第一帧没有上一帧，取最后一帧的数据
					} else {
						prev = self.next().get(0) ? self.next() : _this_.posterFirstItem;
						//右转拿到下一帧的数据，最后一帧没有下一帧，取第一帧的数据
					}
					var width = prev.width(),
						height = prev.height(),
						zIndex = prev.css("zIndex"),
						opacity = prev.css("opacity"),
						left = prev.css("left"),
						top = prev.css("top");
					zIndexArr.push(zIndex);
					self.animate({
						width: width,
						height: height,
						opacity: opacity,
						left: left,
						top: top
					},_this_.setting.speed);//将配置里的speed参数设置为动画事件
					//单独设置z-index
					
				}

			});
			_this_.allPosterItems.each(function(i){ 
				$(this).css("zIndex",zIndexArr[i]);

			});

		},

		//设置配置参数值去控制基本的宽度高度
		setSettingValue: function(){

			this.poster.css({
				width: this.setting.width,
				height: this.setting.height
			});
			this.posterItemMain.css({
				width: this.setting.posterWidth,
				height: this.setting.posterHeight
			});
			//计算左右切换按钮的宽度
			var btnW = (this.setting.width - this.setting.posterWidth)/2;
			this.nextBtn.css({
				width: btnW,
				height: this.setting.height,
				zIndex: Math.ceil(this.allPosterItems.size()/2)

			});
			this.prevBtn.css({
				width: btnW,
				height: this.setting.height,
				zIndex: Math.ceil(this.allPosterItems.size()/2)
			});
			this.posterFirstItem.css({
				width: this.setting.posterWidth,
				height: this.setting.posterHeight,
				left: btnW,
				zIndex: Math.floor(this.allPosterItems.size()/2)

			});



		},
		//设置剩余帧的位置关系
		setPosterPos: function(){
			var self = this;
			var sliceItems = this.allPosterItems.slice(1);//第一帧作为中间,截取保存第一帧之后的所有帧
			var rightSlice = sliceItems.slice(0,(sliceItems.size()/2));//截取右一半帧数作为右侧
			var leftSlice = sliceItems.slice(sliceItems.size()/2);
			var level = Math.floor(this.allPosterItems.size()/2);


			//设置右边帧的位置关系和宽、高
			var rw = this.setting.posterWidth;
			var rh = this.setting.posterHeight;
			var gap = (this.setting.width - this.setting.posterWidth)/2/level;
			var firstLeft = (this.setting.width - this.setting.posterWidth)/2;
			var fixOffsetLeft = firstLeft + rw;
			
			rightSlice.each(function(i){

				level --;
				rw = rw * self.setting.scale;
				rh = rh * self.setting.scale;		
				var j = i;
				
				$(this).css({
					zIndex: level,
					width: rw,
					height: rh,
					opacity: 1/( ++i ),
					left: fixOffsetLeft + ( ++j )*gap -rw,
					top: self.setVerticalAlign(rh)

				})
			});


			//设置左边帧的位置关系和宽、高
			var lw = rightSlice.last().width();
			var lh = rightSlice.last().height();
			var oloop  = Math.floor(this.allPosterItems.size()/2);
			leftSlice.each(function(i){


				$(this).css({
					zIndex: i,
					width: lw,
					height: lh,
					opacity: 1/(oloop),
					left: i * gap,
					top: self.setVerticalAlign(lh)

				});

				lw = lw/self.setting.scale;
				lh = lh/self.setting.scale;

				oloop --;


			});
		},
		//设置垂直对其方式
		setVerticalAlign: function(height){
			var top;
			switch (this.setting.verticleAlign) {
				case "top":
					top = 0;
					break;
				case "middle":
					top = (this.setting.height - height)/2;
					break;

				case "bottom":
					top = this.setting.height - height;
					break;
				default:
					top = 0;
					break;
			}

			return top;

		},


		//获取人工配置参数
		getSetting: function(){

			var setting = this.poster.attr("data-setting");
			if(setting && setting != ''){
				return $.parseJSON(setting);
			} else {
				return {};
			}
		}

	};
	//根据实例的个数来创建实例
	
	Carousel.init = function(posters){
		var _this= this;

		//将传递进来的节点，根据节点的个数实例化
		posters.each(function(i,ele){
			new _this($(this));
		})

	}

	window.Carousel = Carousel;

})(jQuery);
