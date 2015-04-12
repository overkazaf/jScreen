(function (window, $, undefined){
	var $doc = $(document),
		$docBody = $doc.find('body');

	window.jScreen = jScreen;
	function jScreen () {
		return new _jScreen().init(arguments[0]);
	}
	function _jScreen() {
		return {
			init : function (opts){
				var defaults = {
					ctx : "#jscreen_" + Math.round(Math.random() * 1000),
					container : '.jscreen',
					width : "960px",
					height : "200px",
					bgcolor : "#09F",
					hAlign: true,
					imgData : {
						pathPrefix : "../images/",
						data : [{src : 'default.jpg'}]
					}
				};
				this.op = $.extend({}, defaults, opts);
				var op = this.op;
				this.ctx = $('<div></div>').attr(
					{id : op.ctx.substring(1)}
				);
				this.container = $('<div></div>').attr(
					{'class' : op.container.substring(1)}
				).css({
					height : op.height
				});
				
				this.beforeRender();
			},
			beforeRender : function (){
				var _this = this,
					op = _this.op;
				
				_this.ctx.css({
					position : 'relative',
					width : op.width,
					height : op.height,
					background : op.bgcolor,
					margin : "10px auto"
				});
				_this.ctx.append(_this.container);
				$docBody.append(_this.ctx);
				_this.renderScreen();
			},
			getContainerSize : function (){
				var container = this.container;
				return {
					W : container.width(),
					H : container.height()
				}
			},
			renderScreen : function (){
				var _this = this,
					ctx = this.ctx,
					container = this.container,
					op = this.op,
					imgData = this.op.imgData,
					prefix = imgData['pathPrefix'],
					data = imgData['data'];
				if (data.length > 0) {
					var oUl = $('<ul class="jScreen_ui_list"></ul>');
					if (op.hAlign) {
						oUl.css({
							position:'absolute',
							left : 0,top:0,
							height:'100%',
							width : container.width() * data.length + 'px',
							'list-style': 'none',
							'background-color' : '#CCC'
						});
					}
					var btnContainer = $('<div class="jScreen_ui_btn_container"></div>').css({
						position : 'absolute',
						width:'100%',
						height:'24px',
						bottom : '0',
						background :"#2B2B2B",
						opacity : 0.6
					});
					var btnUl = $('<ul class="jScreen_ui_btns"></ul>').css({
						margin : '2px',padding :0,
						position : 'relative',
						height : '100%',
						'line-height' : '40px',
						width : 'auto',
						'list-style': 'none'
					});
					for (var i=0,len=data.length, oW = oUl.width(); i<len;i++) {
						var oLi = $('<li></li>').css({
							position : 'relative',
							float : 'left',
							width :oW / len + 'px'
						});
						var imgName = prefix + data[i]['src'];
						var oImg = $('<img src="'+imgName+'">').css({
							position : "relative",
							margin : "0 auto"
						});
						oLi.html(oImg);
						oLi.appendTo(oUl);

						var btnLi = $('<li></li>').css({
							width : '20px',
							height : '20px',
							float : 'left',
							color : "#FFF",
							'background-color':'#777',
							'font-size' : '12px',
							'line-height' : '20px',
							'margin-left' : '2px',
							'cursor' : 'pointer',
							'text-align' : 'center',
							'border-radius' : '50%'
						}).html(i+1);
						btnLi.appendTo(btnUl);
					}
					oUl.appendTo(container);
					btnUl.appendTo(btnContainer);
					btnContainer.appendTo(container);

					this.targetUl = container.find('ul:eq(0)').get(0);
					this.setScreenFrame(1);

					//bind prev and next event
					var lBtn = $('<a class="jScreen_ctrl_btns"></a>').css({
						position : 'absolute',
						left : '4px',
						top : '50%',
						cursor : 'pointer',
						margin :'-20px auto',
						'text-align' : 'center',
						'line-height' : '40px',
						color : "#FFF",
						"font-size" : '34px',
						width : "40px",
						height : "40px",
						opacity : 0.5,
						'background-color' : "#000"
					}).hide().html("<").appendTo(_this.container);

					var rBtn = $('<a class="jScreen_ctrl_btns"></a>').css({
						position : 'absolute',
						right : '4px',
						top : '50%',
						cursor : 'pointer',
						margin :'-20px auto',
						'text-align' : 'center',
						'line-height' : '40px',
						color : "#FFF",
						"font-size" : '34px',
						width : "40px",
						height : "40px",
						opacity : 0.5,
						'background-color' : "#000"
					}).hide().html(">").appendTo(_this.container);


					//bind button events
					this.bindBtnEvents();

				}
			},
			bindBtnEvents : function (){
				var container = this.container;
				var btnContainer = container.find('.jScreen_ui_btns');
				var btns = btnContainer.find('li');
				var ctrlBtns = container.find('.jScreen_ctrl_btns');
				var _this = this;

				//fadein and fadeout
				container.on('mouseenter',function(){
					ctrlBtns.fadeIn('slow');
					container.on('mouseleave', function (){
						ctrlBtns.fadeOut('slow');
					})
				});

				btns.each(function (index){
					$(this).on('click', function (){
						_this.setScreenFrame(index + 1);
					});
				});

				
				ctrlBtns.each(function (index){
					$(this).on('click', function (){index === 0 ? _this.prev() : _this.next();});
				});
			},
			pause : function (){
				var timer = this.playerTimer;
				clearInterval(timer);
			},
			setScreenFrame : function (index){
				index = index > 0 ? index : 1;
				this.currentIndex = index;
				var _this = this;
				var op = _this.op;
				var oW = parseInt(op.width);
				var targetUl = this.targetUl;
				animate(targetUl,{'left': (index == 1 ? 0 : -(index-1)*oW)}, false, 12);
				
				var btnContainer = this.container.find('.jScreen_ui_btns');
				var btns = btnContainer.find('li');
				btns.eq(index - 1).css({
					'background-color': '#999'
				}).siblings().css({
					'background-color': '#777'
				});
				this.pause();
				this.play();
			},
			getTotalImageCount : function (){
				return this.getTotalImages().length;
			},
			getTotalImages : function (){
				var op = this.op,
					imgData = op.imgData,
					data = imgData['data'];
				return data;
			},
			increaseIndex : function (){
				var tot = this.getTotalImageCount();
				++this.currentIndex;
				if (this.currentIndex == tot + 1) {
					this.currentIndex = 1;
				}
				return this.currentIndex;
			},
			decreaseIndex : function (){
				var tot = this.getTotalImageCount();
				--this.currentIndex;
				if (this.currentIndex == 0)
					this.currentIndex = tot;
				return this.currentIndex;
			},
			prev : function (){
				var _this = this;
				this.setScreenFrame(_this.decreaseIndex());
			},
			next : function (){
				var _this = this;
				this.setScreenFrame(_this.increaseIndex());
			},
			play : function (){
				var _this = this;
				var container = this.container;
				var targetUl = this.targetUl;
				var oW = parseInt(this.op.width);
				var tot = _this.op.imgData['data'].length;
				
				this.interval = 3;
				
				this.playerTimer = setInterval(function (){
					(function (curIndex){
						if (curIndex == (tot + 1)) {
							setStyle(targetUl, 'left', 0);
						} else {
							_this.setScreenFrame(curIndex);
						}
					})(++_this.currentIndex % (tot + 1));
				},this.interval * 1000);
			}
		}
	}

	function getStyle (obj, name){
		if (obj) {
			if (obj.style) {
				return obj.style[name];
			} else if (obj.currentStyle) {
				return obj.currentStyle[name];
			} else if (window.getComputedStyle) {
				return getComputedStyle(obj, false)[name];
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	function setStyle (obj, name, tar ,unit) {
		unit = unit || 'px';
		obj.style[name] = tar + unit;
	}

	function animate(obj, json, fnEnd, interval){
		clearInterval(obj.timer);
		obj.timer = setInterval(function (){
			var bStop = true;
			for (var attr in json) {
				var cur = getStyle(obj,attr);
				if (attr != 'opacity') {
					cur = parseInt(cur);
				} else {
					cur = parseFloat(cur) * 100;
				}

				var target = json[attr];
				var speed = (target - cur) / 7;
				speed = speed > 0 ?Math.ceil(speed) : Math.floor(speed);

				if (target != cur) {
					bStop = false;
				}

				if (bStop) {
					clearInterval(obj.timer);
					fnEnd && fnEnd();
				} else {
					setStyle(obj, attr, cur+speed, 'px');
				}
			}

			
		}, interval || 17);
	}
})(window, jQuery);