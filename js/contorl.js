var cw = document.documentElement.clientWidth || document.body.clientWidth;// 屏幕宽度
var ch = document.documentElement.clientHeight|| document.body.clientHeight;// 屏幕高度
var eccent = IsPC() ? 9 : 3
var radius = IsPC() ? 150 : 120
var redress = cw > ch ? ch/eccent : cw/eccent //矫正值，为了居中

var pArr = document.querySelectorAll('.pai');
var len = pArr.length;
var isSelfAg = 0;
var canStart = false;

//随机函数
function rd(min,max){
	return Math.round(Math.random()*(max-min)+min)
}

// 返回一个圆圈坐标
function coordinate(angle){
	var ag = angle*Math.PI/180;
	var left = Math.sin(ag)*radius
	var top = Math.cos(ag)*radius//距离圆心的半径长
	return {
		x: left,
		y: top
	}
}

//初始以一个圆圈摆放牌
function circle(arg){
	pArr = (arg && arg.length) ? arg : pArr
	for(var i=0;i<pArr.length;i++){
		!function(i){
			var ag = 360/len*i;
			var left = coordinate(ag).x;
			var top = coordinate(ag).y;
			pArr[i].style.left = left + 'px';
			pArr[i].style.top = top + 'px';
			pArr[i].style.transform = 'rotateZ('+ -ag +'deg)';
			pArr[i].style.zIndex = i;
		}(i)
	}
}

//洗牌函数
function shuffle(){
	for(var i = 0; i<len;i++){
		var _redress = angleZ(pArr[i])
		pArr[i].style.top = rd(-200,200) + 'px';
		pArr[i].style.left = rd(-200,200) + 'px';
		pArr[i].style.transform = 'rotateZ(' + (rd(0,360) + _redress) + 'deg)'
	}
	messUp()
}

//横向合牌,加任意参数是竖向合拍（其实由ZNWei函数决定）
function fold(s){
	for(var i = 0; i<len;i++){
		pArr[i].style.top = '0px';
		pArr[i].style.left = '0px';
		var ag = angleZ(pArr[i])
		var zn = ZNWei(ag,s) //规整函数，要么竖着要么横
		pArr[i].style.transform = 'rotateZ(' + zn + 'deg)'
	}
	return 'next'
}

//打乱排序，嵌在洗牌函数里
function messUp(){
	var zArr = []
	for(var i=0;i<len;i++){
		zArr.push(i);
	}
	//打乱z-index
	for(var n=0;n<len;n++){
		pArr[n].style.zIndex = zArr.splice(rd(0,zArr.length-1),1)[0]
	}
}

//铺开函数
function unfold(arg){
	pArr = (arg && arg.length) ? arg : pArr
	len = pArr.length
	//横向铺开以z-index为序列
	var _w = document.body.clientWidth;
	document.getElementById('origin').style.marginTop = '10px'
	var cha = 0;
	for(var i=0;i<len;i++){
		var T = ch/8 //将屏幕高度分成四份，决定每行上下间距
		var f = (len*50/cw) + .4 //以左右间距50铺开，得出能份成几行
		var c = parseInt(len/f) //每一行有多少张？
		pArr[i].style.top = parseInt(pArr[i].style.zIndex/c) * T + 'px';
		pArr[i].style.left = (pArr[i].style.zIndex%c)*50 - cw/2 + 50 + 'px'; // 新补了一个30校正值。。。
		
		var ag = angleZ(pArr[i])
		var zn = ZNWei(ag,'s')
		// pArr[i].style.transform = 'rotateZ(' + zn + 'deg)'
		pArr[i].setAttribute('wei',(zn % 360 == 180 ? '逆' : '正'))
		pArr[i].wei = (zn == 180 ? '逆' : '正')
	}
}

//铺开函数2 -- 这个才是最初使用的方法，年代久远，忘记这为什么被弃用，貌似对齐间距问题
function unfold2(arg){
	pArr = (arg && arg.length) ? arg : pArr
	len = pArr.length
	//横向铺开以z-index为序列
	var _w = document.body.clientWidth;
	document.getElementById('origin').style.marginTop = '10px'
	var cha = 0;
	for(var i=0;i<len;i++){
		var T = ch/4 // 决定每行上下间距
		var f = (len*90/cw) + (IsPC() ? .7 : 3) //以左右间距90铺开，得出能份成几行
		var c = Math.ceil(len/f) //每一行有多少张？
		// var c = parseInt(len/f)
		pArr[i].style.top = parseInt(pArr[i].style.zIndex/c) * T + 'px';
		pArr[i].style.left = 16 + (pArr[i].style.zIndex%c)*90 + 'px';
		
		var ag = angleZ(pArr[i])
		var zn = ZNWei(ag,'s')
		// pArr[i].style.transform = 'rotateZ(' + zn + 'deg)'
		pArr[i].setAttribute('wei',(zn % 360 == 180 ? '逆' : '正'))
		pArr[i].wei = (zn == 180 ? '逆' : '正')
	}
}

//切三叠牌
function cutCard(){
	var i = arguments[0] || 0;  //记步数，这是第几次递归
	var rand = arguments[1] || 0;  // 切三叠拍，每叠随机数
	var cun = arguments[2] || null; // 存之前切好的：每叠的随机数
	var _this = arguments.callee;
	var lens = len;
	var x = 0;
	var val = IsPC() ? 100 : 150

	if(i >= 5){
		return next()
	}

	//操作地图
	var map = {
		top: [val,-val,val,-val,0],
		run: ['fen','fen','he','he','zo'],
		cun:[0]
	}
	if(cun){
		map.cun = cun
	}

	//分开切牌时
	if(map.run[i] == 'fen'){ 
		var mix = (len-rand)/3 + rand || parseInt(len/3);
		var max = (len-rand)/3*2 + rand || parseInt(len/3*2);
		rand = rd(mix,max)
		map.cun.push(rand)
	}

	//合起切牌时
	if(map.run[i] == 'he'){
		x = i==3 ? len - map.cun[1] : len + map.cun[2] - map.cun[1]
		var start = map.cun[i-2]
		rand = map.cun[i-1];
	}

	if(map.run[i] == 'zo'){
		rand = map.cun[2];
		lens = len;
	}
	
	setTimeout(function(){
		if(i <= 4){
			for(var n=0;n<lens;n++){
				var style = pArr[n].style
				switch(map.run[i]){
					case 'fen':
						if(style.zIndex >= rand){
							style.top = map.top[i] + 'px'
						}
						break;
					case 'he':
						if(style.zIndex >= start && style.zIndex < rand || (i == 3 && style.zIndex >= map.cun[i])){
							if(style.zIndex >= start && style.zIndex < rand){
								style.zIndex = parseInt(style.zIndex) + x;
							}
							style.top = map.top[i] + 'px'
						}
						break;
					case 'zo':
						style.zIndex -= map.cun[2]; // zIndex对铺开效果有影响，所以复位
						style.top = '0px'
				}
				
			}
			if(map.run[i] == 'he'){
				map.cun.push(x)
			}
			_this(++i,rand,map.cun)
		}
	},1000)
}

// 自动洗牌一套动作集合，传参洗几遍，默认3次
var process = function(n, _ag = 90){
	var lens = n || 3
	isSelfAg = parseInt(_ag) || 0;
	// document.getElementById('origin').style.animation = "circle "+i+"s linear"
	for(var i=0;i<lens;i++){
		setTimeout(function(){
			// 洗牌动作
			shuffle()
		}, i*1000)
	}
	setTimeout(function(){
		// 合牌动作
		fold()
	}, ++i*1000)
	setTimeout(function(){
		// 切三叠后收牌，附带铺开动作
		cutCard()
	}, ++i*1000)
}

// 初始化上来摊开所有牌
var initProcess = function(_ag = 90){
	isSelfAg = parseInt(_ag) || 0;
	for(var i=0;i<3;i++){
		setTimeout(function(){
			shuffle()
		},i*1000)
	}
}

// 直接完成洗牌，复合动作：合牌，收牌，平铺开
function finishShuffle(_ag = 90){
	isSelfAg = parseInt(_ag) || 0;
	fold()
	setTimeout(function(){
		cutCard()
	}, 1000)
}

function next(){
	for(var i=0;i<len;i++){
		var _redress = getRoutate(pArr[i].style.transform,'Z');
		var _ag = isSelfAg + _redress // 为自己占卜加90度 ，为他人占卜减90度,90从首页信息选择来还是按钮选择？
		pArr[i].style.transform = 'rotateZ(' + _ag + 'deg)'
	}
	setTimeout(function(){
		unfold()
		canStart = true;
	},1000)
}
