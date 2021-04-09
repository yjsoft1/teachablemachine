/////////////////////////////////////////
//터치 슬라이딩을 통한 메뉴 보이기, 숨기기
/////////////////////////////////////////
var mobile_menu_pannel_opend = false;
var mobile_menu_pannel_x = "-300px";
var startMainMenuMove = 0;

var mobile_menu_subpannel_opend = false;

// //메인 메뉴 단축키
// window.addEventListener("keydown", function(e){
// 	//alert(e.keyCode);
// 	switch (e.keyCode) {
// 		case e.altKey &&  49:
// 			window.location.href = " /content_users.html";
// 			break;
// 		case e.altKey &&  50:
// 			window.location.href = " /content_dept.html";
// 			break;
// 		case e.altKey &&  51:
// 		window.location.href = " /content_auth.html";
// 			break;
// 		case e.altKey &&  52:
// 		window.location.href = " /content_company.html";
// 			break;
// 		case e.altKey &&  53:
// 		window.location.href = " /content_asset.html";
// 			break;
// 		case e.altKey &&  54:
// 			window.location.href = " /content_location.html";
// 			break;
// 	}
// });

//window.addEventListener('load', function(){
//$("#header_mobile").ready(function() {	
	
$(function(){	
	//브라우저 탭 좌측 상단 아이콘
	if(!document.getElementById('f_icon')) {		//<link> 태그 추가
		var link = document.createElement('link');
		link.id = 'f_icon';
		link.rel = 'shortcut icon';
		link.href = '/images/logo-yjsoft-63x66.png';
		document.head.appendChild(link);
	}



	//헤더에 스크립트 추가								<script> 태그 추가
	// if(!document.getElementById('id1')) {
	// 	var script = document.createElement('script');
	// 	script.id = 'id1';
	// 	script.src = 'Scripts/Script1.js';
	// 	document.head.appendChild(script);
	// }



	
	//back button detect
	// $('body').backDetect(function(){
	// 	alert("꼬ㅒㄲ");
	// 	closeDialog_container();		
	// });
		
	// function closeDialog_container() {
	// 	//다이아로그 안보이게 하기 *!!! 모든 다이어로그는 dialog_container_main 컨테이너를 공통으로 사용해야 함 &*
	// 	var isOpenDialog = localStorage.getItem("isOpenDialog_dialog-container");
	// 	if (isOpenDialog == "visible") {
	// 		//히스토리 관리자에서 다이아로그 invisible 신호 설정
	// 		localStorage.setItem("isOpenDialog_dialog-container", "invisible");
	// 		isOpenDialog = localStorage.getItem("isOpenDialog_dialog-container");

	// 		//다이아로그 안보이게 하기
	// 		var dialog_container_main = document.getElementById("dialog_container_main");
	// 		if (dialog_container_main != null) {
	// 		  dialog_container_main.classList.remove('dialog-container--visible');                
	  
	// 		  //body scoll on
	// 		  scroll_body_on_off(true);
	// 		}

	// 		//window.history.forward();
	// 	}
	// }

	// 	return "햕 ㄹㄴ야ㅐㄹ내 ㄹ";
	// });	

	// //뒤로가기 버튼 처리
	// window.addEventListener('popstate', function(event) {
	// 	if (window.history && window.history.pushState) {
	// 		if (mobile_menu_pannel_opend == true) {
	// 			show_menu_mobile(mobile_menu_pannel_x, 0);	//hide
	// 		}

	// 		if (mobile_menu_subpannel_opend == true) {
	// 			hide_header_mobile_submenu();
	// 		}
	// 	}
	// }, false);	

	//수동 인터페이스 지원여부 체크
	var supportsPassive = false;
	try {
	  var opts = Object.defineProperty({}, 'passive', {
		get: function() {
		  supportsPassive = true;
		}
	  });
	  window.addEventListener("testPassive", null, opts);
	  window.removeEventListener("testPassive", null, opts);
	} catch (e) {}
	
		
	var content = document.getElementById('frame_content');
	// var Statusdiv = document.getElementById('Statusdiv');	
	var startx = 0;
	var startx_time;
	var dist = 0;
	var currnet_coordinate = 0;
	var x_coordinate = -mobile_menu_pannel_x.replace(/[^0-9]/g,'');						//문자열에서 모바일 메인 화면의 가로길이 -300px 가져오기		

	content.addEventListener('touchstart', function(e){
		var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
		startx = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser

		startx_time = new Date().getTime();
		if (startx < 20){
			if (mobile_menu_pannel_opend == false){				//좌에서 우로 슬라이딩 시작
				startMainMenuMove = 1;
				// $(".background_dark").css("display", "block");
				hide_header_mobile_submenu();
			}				
		} else if (startx < Math.abs(x_coordinate)) {			//우에서 좌로 슬라이딩 시작
			if (mobile_menu_pannel_opend == true) {
				startMainMenuMove = 2;
			}
		}
	}, supportsPassive ? { passive: true } : false)	//false일 경우 버블링, true일 경우 캡쳐링



	content.addEventListener('touchmove', function(e){
		var touchobj = e.changedTouches[0]; // reference first touch point for this event
		var dist = parseInt(touchobj.clientX) - startx;
		// Statusdiv.innerHTML = 'Status: touchmove<br> Horizontal distance traveled: ' + dist + 'px';

		var x_coordinate_abs = mobile_menu_pannel_x.replace(/[^0-9]/g,'');
		currnet_coordinate = parseInt(x_coordinate) + parseInt(startx) + dist;	//현재 터치 위치 x좌표

		if (startMainMenuMove == 1){
			if (currnet_coordinate <= 0){
				set_darkbackground(dist);
				$(".menu_mobile").css("left", currnet_coordinate);		//터치 시 실시간으로 메뉴레이아웃 이동
			}
		} else if (startMainMenuMove == 2){
			var left_c = $(".menu_mobile").css("left");
			var left_c_value = left_c.replace(/[^0-9]/g,'');				
			if (left_c_value > dist) {
				if (dist > 0) {		//좌에서 우로
					// set_darkbackground(dist);
					$(".menu_mobile").css("left", 0);			//메뉴 레이아웃이 오른쪽으로 이동될 경우 고정
				} else {			//우에서 좌로
					set_darkbackground(parseInt(x_coordinate_abs) + dist);
					$(".menu_mobile").css("left", dist);		//터치 시 실시간으로 메뉴레이아웃 이동
				}
			}
		}

		//모바일 메뉴보다 더 오른쪽에서부터 touch move 로 왼쪽으로 이동한 경우 모바일 메뉴 오른쪽(300px)부터 좌측으로 이동되는 경우		
		if (startx > x_coordinate_abs) {
			if (touchobj.clientX < Math.abs(x_coordinate)) {
				if (mobile_menu_pannel_opend == true) {
					startx = touchobj.clientX;
					startMainMenuMove = 2;
				}
			}
		}
	}, supportsPassive ? { passive: true } : false)	//false일 경우 버블링, true일 경우 캡쳐링
	
	content.addEventListener('touchend', function(e){
		var touchobj = e.changedTouches[0]; // reference first touch point for this event
		var endx = parseInt(touchobj.clientX);
		var x_coordinate_abs = mobile_menu_pannel_x.replace(/[^0-9]/g,'');
		// Statusdiv.innerHTML = 'Status: touchend<br> Resting x coordinate: ' + touchobj.clientX + 'px';
		
		if (startMainMenuMove == 1){
			//빠르게 좌에서 우로 슬라이딩 한경우 메뉴 보이기
			var current_time = new Date().getTime();			
			if ((current_time - startx_time) < 200){
				if (startx < endx) {		//좌에서 우로 슬라이딩 한 경우
					show_menu_mobile("0px", 1);
				}
			}
			else {	//천천히 좌에서 우로 슬라이딩 한경우 
				//사용자가 터치로 모바일메인메뉴를 이동하여 터치를 떼었을 경우 메뉴 가로 길이의 절반보다 더 늘이기를 한 경우 보이기 (반대=사라지기)
				if ((x_coordinate_abs - Math.abs(currnet_coordinate)) > (x_coordinate_abs / 2)){
					show_menu_mobile("0px", 1);
				} else {
					show_menu_mobile(mobile_menu_pannel_x, 0);
				}
			}
		} else if (startMainMenuMove == 2) {
			//빠르게 우에서 좌로 슬라이딩 한경우 메뉴 숨기기
			var current_time = new Date().getTime();			
			if ((current_time - startx_time) < 200){
				if (startx > endx) {		//우에서 좌로 슬라이딩 한 경우
					if ((startx - endx) > 50) {		//우에서 좌로 슬라이딩의 길이 임계치 설정
						show_menu_mobile(mobile_menu_pannel_x, 0);
					} else {
						show_menu_mobile("0px", 1);
					}
				}
			}
			else {	//천천히 우에서 좌로 슬라이딩 한경우 
				//사용자가 터치로 모바일메인메뉴를 이동하여 터치를 떼었을 경우 메뉴 가로 길이의 절반보다 더 늘이기를 한 경우 보이기 (반대=사라지기)
				var x_coordinate_abs = mobile_menu_pannel_x.replace(/[^0-9]/g,'');
				if ((startx - endx) < (x_coordinate_abs / 2)){
					show_menu_mobile("0px", 1);
				} else {
					show_menu_mobile(mobile_menu_pannel_x, 0);
				}
			}
		}

		//초기화
		startMainMenuMove = 0;
		currnet_coordinate = 0;
		startx_time = null;
	}, supportsPassive ? { passive: true } : false)	//false일 경우 버블링, true일 경우 캡쳐링



	//////////////
	//어두운 배경
	//////////////
	function set_darkbackground(input_dist){
		var x_coordinate_abs = mobile_menu_pannel_x.replace(/[^0-9]/g,'');
		var set_value =  (input_dist / x_coordinate_abs).toFixed(2);		
		
		if (set_value > 0.75) {
			set_value = 0.75;
		}

		//배경 변경
		var rgba = "rgba(0,0,0, " + set_value + ")";
		$(".background_dark").css("display", "block");
		$(".background_dark").css("background-color", rgba);
	}

	var a = 0;
	function darkbackground_hide(){
		$(".background_dark").css("display", "none");
		$(".background_dark").css("background-color", "rgba(0,0,0, 0)");		
	}

	function darkbackground_show(input_dark){
		$(".background_dark").css("display", "block");
		$(".background_dark").css("background-color", "rgba(0,0,0, " + input_dark + ")");
	}

	//모바일 메뉴가 오픈된 경우 어두운 배경을 누를 경우 모바일 메뉴 닫기
	$(".background_dark").click(function(){
		show_menu_mobile(mobile_menu_pannel_x, 0);
		hide_header_mobile_submenu();
	});

	//데스크탑 서브메뉴
	$("#header_mobile").ready(function() {
		$('#header').hover(function(){
			$("#header_layout",this).stop().animate({height:190},'fast');
			$(".submenu", this).stop().animate({height:190},'fast');			
		},function(){
			$("#header_layout",this).stop().animate({height:40},'fast');
			$(".submenu", this).stop().animate({height:0},'fast');
		});
	});

	// //데스크탑 서브메뉴
	// $("#header_mobile").ready(function() {
	// 	//관리자급 이상만 보기
	// 	if (sessionStorage.getItem(token_yj_rfms) == null) {
	// 		return;
	// 	}

	// 	var getUserInfo = parseJwt(sessionStorage.getItem(token_yj_rfms));
    // 	if (getUserInfo == null) {
	// 		return;
	// 	}

	// 	if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
	// 		$('#header').hover(function(){
	// 			$("#header_layout",this).stop().animate({height:320},'fast');
	// 			$(".submenu", this).stop().animate({height:320},'fast');			
	// 		},function(){
	// 			$("#header_layout",this).stop().animate({height:60},'fast');
	// 			$(".submenu", this).stop().animate({height:0},'fast');
	// 		});
	// 	}
	// });

	//데스크탑 서브메뉴 (아이콘 클릭 후 서브메뉴 출력)
	$("#header_layout h1.logo").click(function(){
		//관리자급 이상만 보기
		if (sessionStorage.getItem(token_yj_rfms) == null) {
			return;
		}
		
		var getUserInfo = parseJwt(sessionStorage.getItem(token_yj_rfms));
    	if (getUserInfo == null) {
			return;
		}

		if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
			if ($("#header_layout").height() < 250) {
				$("#header_layout").stop().animate({height:320},'fast');
				$(".submenu").stop().animate({height:3230},'fast');
			} else {
				$("#header_layout").stop().animate({height:60},'fast');
				$(".submenu").stop().animate({height:0},'fast');
			}
		}
	});




	//모바일웹 메인메뉴
	// var btn_menu_mobile_open = this.document.getElementsByClassName('btn_menu_mobile_open');
	// for	(var i = 0; i < btn_menu_mobile_open.length; i++) {
	// 	btn_menu_mobile_open[i].addEventListener('touchend', function(e){
	// 		hide_header_mobile_submenu();
	// 		show_menu_mobile("0px", 1);
	
	// 		event.preventDefault();
	// 		event.stopPropagation();
	// 		return false;
	// 	}, false)
	// }	
	// var btn_menu_mobile_close = this.document.getElementsByClassName('btn_menu_mobile_close');
	// btn_menu_mobile_close[0].addEventListener('touchend', function(e){
	// 	show_menu_mobile(mobile_menu_pannel_x, 0);

	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	return false;
	// }, false)

	//모바일웹 메인메뉴
	$("#btn_menu_mobile_open").click(function(){
		hide_header_mobile_submenu();
		show_menu_mobile("0px", 1);	
	});
	$(".btn_menu_mobile_close").click(function(){
		show_menu_mobile(mobile_menu_pannel_x, 0);
	});

	//모바일웹 서브 메뉴
	$(".header_mobile_submenu").click(function(){
		show_header_mobile_submenu();
	});

	//언어선택
	$(".language").click(function(){
		$(".layout_language").show();
	});
	$(".language").mouseleave(function(){
		$(".layout_language").hide();
	});

	//모바일 메뉴 보이기 / 숨기기
	function show_menu_mobile(input_value, showOverlay) {
		$(".submenu").animate({left:"-200px"},150,"easeOutQuart");
		$(".menu_mobile").animate({left:input_value},150,"easeOutQuart");
		if (showOverlay == 1){
			darkbackground_show("0.75");		//어두운 화면 보이기
			mobile_menu_pannel_opend = true;	//메뉴 오픈 신호

			//scroll off
			scroll_body_on_off(false);

			// //뒤로가기 버튼 처리 (메인 슬라이딩 메뉴가 오픈된 경우 뒤로가기버튼을 눌렀을 경우 메인 슬라이디이 메뉴를 숨기기 위함)
			// history.replaceState("isopen_menu_main", null, null);
			// history.pushState(null, null, "/#mainmenu");
		} else {
			darkbackground_hide();
			mobile_menu_pannel_opend = false;

			//scroll on
			scroll_body_on_off(true);

			// //뒤로가기 버튼 처리 (메인 슬라이딩 메뉴가 오픈된 경우 뒤로가기버튼을 눌렀을 경우 메인 슬라이디이 메뉴를 숨기기 위함)
			// if (window.history.state != "isopen_menu_main") {
			// 	window.history.back();
			// }

			//hide
			startMainMenuMove = 0;
		}
	}

	//모바일 좌측 메인메뉴 서브메뉴
	$('.menu_mobile>ul>li>a').toggle(function(){
		$(this).siblings(".submenu").slideDown("fast");
		$(this).addClass("opened");
	},function(){
		$(this).siblings(".submenu").slideUp("fast");
		$(this).removeClass("opened");
	});


	// var cur_m_menu = $('.menu_mobile>ul>li>a');
	// var len_m_menu = cur_m_menu.length;
	// for(var i=0; i<len_m_menu; i++){
	// 	if($(cur_m_menu).eq(i).hasClass("selected")){
	// 		$(cur_m_menu).eq(i).siblings(".submenu").show();
	// 	}
	// }

	//우측 상단 서브메뉴 보이기
	function show_header_mobile_submenu(){
		mobile_menu_subpannel_opend = true;
		darkbackground_show(0.2);

		$(".menu_mobile_header_submenu").css("display", "block");
		$(".menu_mobile_header_submenu").animate({width:"200px"},80,"easeOutQuart");
		$(".menu_mobile_header_submenu").animate({height:"260px"},100,"easeOutQuart");


		// //뒤로가기 버튼 처리 (메인 슬라이딩 메뉴가 오픈된 경우 뒤로가기버튼을 눌렀을 경우 메인 슬라이디이 메뉴를 숨기기 위함)
		// history.replaceState("isopen_menu_sub", null, null);
		// history.pushState(null, null, "/#submenu");
	}

	//우측 상단 서브메뉴 숨기기
	function hide_header_mobile_submenu(){
		mobile_menu_subpannel_opend = false;
		darkbackground_hide();

		$(".menu_mobile_header_submenu").animate({width:"0px"},80,"easeOutQuart");
		$(".menu_mobile_header_submenu").animate({height:"0px"},100,"easeOutQuart");
		setTimeout(function() {
			$(".menu_mobile_header_submenu").css("display", "none");
		}, 180);

		// //뒤로가기 버튼 처리 (메인 슬라이딩 메뉴가 오픈된 경우 뒤로가기버튼을 눌렀을 경우 메인 슬라이디이 메뉴를 숨기기 위함)
		// if (window.history.state != "isopen_menu_sub") {
		// 	window.history.back();
		// }
	}
	

	// //service worker
	// if ('serviceWorker' in navigator) {		
	// 	navigator.serviceWorker.register('./service-worker.js').then(function() {
	// 		console.log('Service Worker Registered'); 
	// 	});
	// }
//}, false)
});

	



// if ($.mobile.activePage.attr('id') === 'firstpage') {
// 	// Prompt to confirm the exit
// 	alert("ㅇ러ㅣㄹㅇ");
// } else {
// 	alert("ㅇ러ㅣㄹ3223232ㅇ");
//   window.history.back();
// }















//////////////////////////////
/////////////예제//////////////
//////////////////////////////

//클릭
// document.getElementById('butRefresh').addEventListener('click', function() {
//     // Refresh all of the forecasts
//     app.updateForecasts();
//   });

//딜레이
// setTimeout(function() {
//     console.log("All task was done.");
// }, 5000);

//Request
//     // Fetch the latest data.
//     var request = new XMLHttpRequest();
//     request.onreadystatechange = function() {
//       if (request.readyState === XMLHttpRequest.DONE) {
//         if (request.status === 200) {
//           var response = JSON.parse(request.response);
//           var results = response.query.results;
//           results.key = key;
//           results.label = label;
//           results.created = response.query.created;
//           app.updateForecastCard(results);
//         }
//       } else {
//         // Return the initial weather forecast since no data is available.
//         app.updateForecastCard(initialWeatherForecast);
//       }
//     };
//     request.open('GET', url);
//     request.send();
//   };

//add service worker 
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//              .register('./service-worker.js')
//              .then(function() { console.log('Service Worker Registered'); });
//   }