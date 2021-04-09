//공통 사용 변수
//var url_json = "http://www.yjsoft.kr/"            //node.js배포
var url_json = "http://127.0.0.1:31419/"            //node.js디버그

//var url_json = "http://203.245.44.21:8357/"       //tomcat servlet - 디버그
//var url_json = "http://yjsoft.kr:8357/";          //tomcat servlet - 배포
//var url_json = "http://127.0.0.1:8080/"           //tomcat servlet - 디버그
//var url_json = "http://192.168.35.217:8080/"      //tomcat servlet - 디버그
//var url_json = "http://192.168.35.217:7777/"      //tomcat servlet - 디버그
var token_yj_rfms = "token_yj_rfms";

var page_pause_time_display_menu = 60;              //디스플레이 주기적 회전시간 (메뉴)                            (600 = 10분)           //db초기 로딩시 사용
var page_pause_time_display_contents = 10;          //디스플레이 주기적 회전시간 (컨텐츠)		                   (6000 = 100분)         //개별 페이지 타이머 재동작 시간으로 사용
var page_pause_time = 600;                          //사용자 터치 시 디스플레이 주기적 회전 대기시간 (일반 사용자)   (600 = 10분)            //사용자가 입력할 경우 사용
var page_pause_time_adminmenu = 6000;               //사용자 터치 시 디스플//레이 주기적 회전 대기시간 (관리자)	     (6000 = 100분)         //관리자가 입력할 경우 사용
var snap_size = 0;
var canvas_marginleft = 0;
var canvas_margintop = 0;

var admin_1 = "관리자";
var admin_2 = "시스템관리자";

var boardType_data = "boardType_data";
var common_split_string = "*-*,*-*"
var url_file_user_setDir = "http://www.yjsoft.kr/userFiles";	//파일 저장 디렉터리

var file_fromserver = "file_fromserver";    //이미 전송완료된 파일(서버에서 링크만 가져오는 파일)

//주기적으로 화면을 변경
//설정된 시간을 세션에 저장하여 1초에 한번씩 1초의 값을 삭제하여 시간이 다 된 경우 다음 화면으로 넘어감
//selectConfigration();
//check_rotate_page_display_menu();

function check_rotate_page_display_menu() {
    setInterval(function(e){
        //권한 정보
        var getUserInfo = parseJwt(sessionStorage.getItem(token_yj_rfms));

        //주기적 회전 대기시간 감소
        var get_pause_time = sessionStorage.getItem("pause_time");                              //사용자가 터치한 경우 화면 회전 취소 (사용자가 터치할 경우마다 pause_time의 값을 채워줌)
        var get_pause_time_menu = sessionStorage.getItem("page_pause_time_display_menu");       //디스플레이의 주기적 화면 회전

        //예외 처리
        if (get_pause_time < -1)
            get_pause_time = -1;
        
        if (get_pause_time_menu < -1)
            get_pause_time_menu = -1;

        //주기적 회전 설정이 'notuse'일 경우 화면 회전 취소
        if (get_pause_time_menu == "notuse") {
            return;
        }

        // if ((get_pause_time < 0) || (get_pause_time == null)) {                              //사용자 터치 후 대기시간을 설정하지 않은 경우 기본값 설정
        //     get_pause_time = 600;
        // }
        if ((get_pause_time_menu < 0) || (get_pause_time_menu == null)) {                       //디스플레이 주기적 회전시간을 설정하지 않은 경우 기본값 설정
            get_pause_time_menu = 60;
        }

        sessionStorage.setItem("pause_time", get_pause_time - 1);                               //설정된 시간을 1초씩 감소 (사용자가 터치시간)
        sessionStorage.setItem("page_pause_time_display_menu", get_pause_time_menu - 1);        //설정된 시간을 1초씩 감소 (디스플레이의 주기적 화면 회전대기시간)

        //화면 이동대기 시간의 남은 여부 확인
        if (page_pause_time != "notuse") {
            if (get_pause_time > 0) {                           //환경 설정에서 사용안함이 아닌 경우는 get_pause_time이 "notuse" 로 설정
                return;                                     //사용자가 터치한 경우 화면 회전 취소      
            }
        }

        if (get_pause_time_menu > 0) {
            return;                                     //디스플레이의 주기적 화면 회전대기시간이 남은경우 화면 회전 취소                                             
        }

        if (getUserInfo != null) {
            if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
                return;
            }
        }

        //다음 페이지 디스플레이
        var get_current_menu = sessionStorage.getItem("current_menu");
        if (get_current_menu == null) {
            //첫페이지로 이동
            sessionStorage.setItem("current_menu", "mainmenu_canvas_1");
            location.href="content_userscanvas.html";
        } else {
            checkNextPage(get_current_menu);
        }        

    }, 1000);
}

//db로부터 가져온 메인메뉴의 정보를 이용하여 다음 페이지를 보여줌
//sessionStorage 사용
function checkNextPage(input_current) {
    if (list_statususerinfo == null)
        return;

    var isCheck = false;
    for (var i = 0; i<list_statususerinfo.length; i++) {
        if (isCheck) {
            if (list_statususerinfo[i].su_view) {
                if (i < 6) {                                    //캔버스는 총 6개 (list_statususerinfo 에는 6개의 canvas와 6개의 content_image 가 순서대로 저장되어 있음)                    
                    sessionStorage.setItem("current_menu", list_statususerinfo[i].su_pagename);
                    location.href="content_userscanvas.html";
                    isCheck = false;
                    break;
                } else {                    
                    sessionStorage.setItem("current_menu", list_statususerinfo[i].su_pagename);
                    location.href = "content_images.html"
                    isCheck = false;
                    break;
                }
            }
        }

        //현재 저장된 위치 정보와 동일한 위치정보가 나왔다면 다음 페이지를 확인할 때 저장하도록 준비
        if (input_current == list_statususerinfo[i].su_pagename) {
            isCheck = true;
        }
    }

    //마지막 페이지일 경우 첫페이지로 이동
    if (isCheck == true) {
        sessionStorage.setItem("current_menu", "mainmenu_canvas_1");
        location.href="content_userscanvas.html";
    }
}

//현재 페이지 명 가져오기
function getPageName(){
    var pageName = "";
 
    var tempPageName = window.location.href;
    var strPageName = tempPageName.split("/");
    pageName = strPageName[strPageName.length-1].split("?")[0];
 
    return pageName;
}

function selectConfigration() {
    indexedDB_open(function(e) {
      var transaction = e.transaction(["yj_config"], "readwrite");
      var store = transaction.objectStore("yj_config");

      var request = store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.no == 2) {
                var configinfo = {
                    co_menu: cursor.value.co_menu,
                    co_contents: cursor.value.co_contents,
                    co_usertouch: cursor.value.co_usertouch,
                    co_managertouch: cursor.value.co_managertouch,
                    co_snapsize: cursor.value.co_snapsize,
                    co_canvasmarginleft: cursor.value.co_canvasmarginleft,
                    co_canvasmargintop: cursor.value.co_canvasmargintop,
                };
                // list_Configinfo.push(configinfo);
                
                page_pause_time_display_menu = configinfo.co_menu;                                      //디스플레이 주기적 회전시간 (메뉴)            
                page_pause_time_display_contents = configinfo.co_contents;                              //디스플레이 주기적 회전시간 (컨텐츠)            
                page_pause_time = configinfo.co_usertouch;                                              //사용자 터치 대기시간 설정 (일반사용자)
                page_pause_time_adminmenu = configinfo.co_managertouch;                                 //사용자 터치 대기시간 설정 (관리자)
                snap_size = configinfo.co_snapsize;                                                     //Canvas Snap Size
                canvas_marginleft = configinfo.co_canvasmarginleft;                                      //Element Margin left
                canvas_margintop = configinfo.co_canvasmargintop;                                      //Element Margin top
                
                if ((canvas_marginleft == "undefined") ||(canvas_marginleft == undefined)) {
                    canvas_marginleft = 0;
                }

                if ((canvas_margintop == "undefined") ||(canvas_margintop == undefined)) {
                    canvas_margintop = 0;
                }

                sessionStorage.setItem("page_pause_time_display_menu", page_pause_time_display_menu);   //디스플레이 주기적 회전시간 (메뉴) - 세션
                sessionStorage.setItem("snap_size", snap_size);                                         //canvas snap size
                sessionStorage.setItem("canvas_marginleft", canvas_marginleft);                         //canvas margin left
                sessionStorage.setItem("canvas_margintop", canvas_margintop);                           //canvas margin top
            }

            cursor.continue();
        } else {
        //   result(list_Configinfo);
        }
        
        // e.close();        
      };
    });
  }


  //db로부터 메인메뉴의 정보를 불러와서 list_statususerinfo 에 저장함
  //(canvas화면 6개, image화면 6개의 정보를 가지고 있음)
var list_statususerinfo = new Array();
selectStatususer();
function selectStatususer() {
    //indexed db select all
    indexedDB_open(function(e) {
      var transaction = e.transaction(["yj_statususer"], "readwrite");
      var store = transaction.objectStore("yj_statususer");

      store.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
              var statususerinfo = {
                  no: cursor.key,
                  select: false,
                  su_name: cursor.value.su_name,
                  su_view: cursor.value.su_view,
                  su_pagename: cursor.value.su_pagename,
                  su_regist_datetime: cursor.value.su_regist_datetime,
                  su_lastsave_datetime: cursor.value.su_lastsave_datetime,
                  su_image: cursor.value.su_image,
                  su_etc: cursor.value.su_etc,
              };
              list_statususerinfo.push(statususerinfo);

              cursor.continue();
          } else {
            for (var i = 0; i<list_statususerinfo.length; i++){
            }
          }
      };
    });
  }

//html 파일을 특정 div에 불러오기
function load_html(input_divname, input_html){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/' + input_html);
    xhr.send(); 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                document.getElementById(input_divname).innerHTML = xhr.responseText;
            } else {
                //console.log('[' + xhr.status + ']: ' + xhr.statusText);
            }
        }
    };
}

//팝업창 (NewWindow("member_ck_id.php?mem_id="+ id_value,'ckeckid','500','315','no');)
var win= null;
function PopupWindow(page,name,input_width,input_height,scrollbars){
    var result_width = (screen.width-input_width)/2;
    var result_height = (screen.height-input_height)/2;
    var features ='width=' + input_width + ',';
        features +='height=' + input_height + ',';
        features +='left=' + result_width + ',';
        features +='top=' + result_height + ',';        
        features +='scrollbars=' + scrollbars + ',';
        features +='resizable=yes';
        win=window.open(page,name,features);
   if(parseInt(navigator.appVersion) >= 4){win.window.focus();}
}

//html body 스크롤 on off
function scroll_body_on_off(scroll_on) {
    if (scroll_on) {
        $('html, body').css({'overflow': 'auto', 'height': '100%'});        //scroll on
        $('#element').off('click scroll touchmove mousewheel');             //터치무브 및 마우스휠 스크롤 가능
    } else {
        $('html, body').css({'overflow': 'hidden', 'height': '100%'});      //scroll off
        $('#element').on('click scroll touchmove mousewheel', function(event) {
        });        
    }
}

//다이아로그 박스(모달)가 출력되었는지 확인합니다.
function check_dialog_visible(dialog_name) {
    var dialog_messagebox = document.getElementById(dialog_name);
    if (dialog_messagebox == null)
        return false;

    if (dialog_messagebox.classList.contains('dialog-container--visible')) {
        return true;
    }

    return false;
}

//메시지 박스
function messagebox_show(visible_oneButton, title, content, result, visible_spinner, scroll_body_on) {
    //dialog 생성여부 확인
    var dialog_messagebox = document.getElementById("dialog_messagebox");
    if (dialog_messagebox != null) {
        dialog_messagebox.classList.add('dialog-container--visible');
        dialog_messagebox.style.zIndex = 5002;
    }

    if (document.getElementById('dialog-title1-messagebox1') == null)
    return;

    // dialog 내용 변경
    document.getElementById('dialog-title1-messagebox1').textContent = title;
    if (Array.isArray(content) == true) {
        document.getElementById('dialog-title2-messagebox').textContent = content[1];
        document.getElementById('dialog-title2-messagebox_hidden_status').textContent = content[0];
    } else {
        document.getElementById('dialog-title2-messagebox').textContent = content;
    }

    if (visible_oneButton) {
        document.getElementById('btnSave_messagebox').style.display = "inline-block";
        document.getElementById('btnCancel_messagebox').style.display = "inline-block";

        document.getElementById('btnSave_messagebox').style.display = 'inline-block';
        document.getElementById('btnCancel_messagebox').textContent = "취소";
    } else {
        document.getElementById('btnSave_messagebox').style.display = 'none';
        document.getElementById('btnCancel_messagebox').textContent = "확인";

        //body scoll on
        if (scroll_body_on) {
            scroll_body_on_off(true);
        }        
    }

    if (visible_spinner) {
        document.getElementById('loading_spinner').style.display = "inline-block";
        document.getElementById('btnSave_messagebox').style.display = "none";
        document.getElementById('btnCancel_messagebox').style.display = "none";
    } else {
        document.getElementById('loading_spinner').style.display = "none";
    }

    document.getElementById('btnSave_messagebox').focus();

    //확인 메시지 (custom event message 이벤트 수신)
    document.getElementById('btnSave_messagebox').addEventListener('event_messagebox', function(e) {
        if (result != null) {
            result(e.detail.message);
        }

        this.removeEventListener("event_messagebox", arguments.callee);
    }, false);
}

function hex2rgba(hex, opacity)
{
    //extract the two hexadecimal digits for each color
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hex);

    //convert them to decimal
    var r = parseInt(matches[1], 16);
    var g = parseInt(matches[2], 16);
    var b = parseInt(matches[3], 16);

    //create rgba string
    var rgba = "rgba(" + r + "," + g + "," + b + ", " + opacity + ")";

    //return rgba colour
    return rgba;
}

// function scroll_on() {
//     $('html, body').css({'overflow': 'auto', 'height': '100%'}); //scroll hidden 해제 
//     $('#element').off('scroll touchmove mousewheel'); // 터치무브 및 마우스휠 스크롤 가능
// }

// function scroll_off() {
//     $('html, body').css({'overflow': 'hidden', 'height': '100%', 'position': 'fixed', 'width': '100%'});
//     $('#element').on('scroll touchmove mousewheel', function(event) {
//         event.preventDefault();
//         event.stopPropagation();
//         return false;
//     });
// }

function scroll_on() {
    $('html, body').css({'overflow': 'auto', 'height': '100%'}); //scroll hidden 해제 
    $('#element').off('scroll touchmove mousewheel'); // 터치무브 및 마우스휠 스크롤 가능
}

function scroll_off() {
    $('html, body').css({'overflow': 'hidden', 'height': '100%'});
    $('#element').on('scroll touchmove mousewheel', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });
}

//css 스타일 변경
//예제 
//var el = document.querySelector('.dialog');
//change_css(el, { 'marginTop': '120px' });
function change_css(el, styles) {
    for (var property in styles)
        el.style[property] = styles[property];
}


function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function loadScript_module(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'module';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

// //sqlite
// function load_sqlitefile(path, result) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", path, true); 
//     xhr.responseType = "arraybuffer";
//     xhr.onload = function() {
//         var uInt8Array = new Uint8Array(this.response);
//         // var db = new SQL.Database(uInt8Array);
//         // var contents = db.exec("SELECT * FROM employees");

//         // var data = new Uint8Array(xhr.response);
//         // var db = new SQL.Database(uInt8Array);
//         // var arr = new Array();
//         // for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
//         // success(arr.join(""));
//         result(uInt8Array);
//     };
//     xhr.send();
// };

////////////////////////////////
//indexed db
////////////////////////////////

function indexedDB_open (result) {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    var openDB = indexedDB.open("ftms_db", 4);       //db생성  

    openDB.onupgradeneeded = function(e) {               //테이블 생성
        var getDB = e.target.result;
        if(!getDB.objectStoreNames.contains("yj_asset")) {
            getDB.createObjectStore("yj_asset", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_asset_manage")) {
            getDB.createObjectStore("yj_asset_manage", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_auth")) {
            getDB.createObjectStore("yj_auth", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_company")) {
            getDB.createObjectStore("yj_company", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_dept")) {
            getDB.createObjectStore("yj_dept", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_device")) {
            getDB.createObjectStore("yj_device", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_historyasset")) {
            getDB.createObjectStore("yj_historyasset", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_location")) {
            getDB.createObjectStore("yj_location", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_member")) {
            getDB.createObjectStore("yj_member", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_position")) {
            getDB.createObjectStore("yj_position", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_status")) {
            getDB.createObjectStore("yj_status", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_statususer")) {
            getDB.createObjectStore("yj_statususer", {keyPath: 'key', autoIncrement: true});
        }

        if(!getDB.objectStoreNames.contains("yj_config")) {
            getDB.createObjectStore("yj_config", {keyPath: 'key', autoIncrement: true});
        }
        if(!getDB.objectStoreNames.contains("yj_rotateimage")) {
            getDB.createObjectStore("yj_rotateimage", {keyPath: 'key', autoIncrement: true});
        }
    };

    openDB.onsuccess = function(e) {
        var getDB = e.target.result;

        result(getDB);
    };

    openDB.onerror = function(e) {
        result("error");
    };
}

function indexedDB_fileTolist(input_file, result) {
    var fileReader = new FileReader();
    fileReader.onload = function(e) {
        result(JSON.parse(e.target.result));
    };
    fileReader.readAsText(input_file);
}

function indexedDB_selectTolist(store_name, result) {
    var list_storeinfo = new Array();

    indexedDB_open(function(e) {
        var transaction = e.transaction([store_name], "readwrite");
        var store = transaction.objectStore(store_name);

        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            
            if (cursor) {
                list_storeinfo.push(cursor.value);
                cursor.continue();
            } else {
                result(list_storeinfo);
            }
        };
    });
}

function indexedDB_storeClear(store_name, result) {
    indexedDB_open(function(e) {
        var transaction = e.transaction([store_name], "readwrite");
        var store = transaction.objectStore(store_name);
        var request = store.clear();

        request.onerror = function(e) {
            result("error");
        }
        
        request.onsuccess = function(e) {
            result("complete");
        }
    });
}

var indexedDB_put_i;
function indexedDB_insert(store_name, list_storeinfo, result) {
    indexedDB_put_i = 0;
    indexedDB_open(function(e) {
        var transaction = e.transaction([store_name], "readwrite");
        var store = transaction.objectStore(store_name);
        
        putNext();

        function putNext() {
            if (indexedDB_put_i < list_storeinfo.length) {
                store.put(list_storeinfo[indexedDB_put_i]).onsuccess = putNext;
                ++indexedDB_put_i;
            } else {   // complete
                result("ok");
            }
        }
    });
}

//   function getStoreIndexedDB (input_storename, openDB) {
//     var db = {};
//     db.result = openDB.result;
//     db.tx = db.result.transaction(input_storename, "readwrite");
//     db.store = db.tx.objectStore(input_storename);
//     //db.index = db.store.index("NameIndex");
  
//     return db;
//   }

//   function saveIndexedDB (input_dbname, input_storename, filename, filedata, fileindex) {
//     var openDB = openIndexedDB(input_dbname, input_storename, fileindex);
  
//     openDB.onsuccess = function() {
//       var db = getStoreIndexedDB(input_storename, openDB);
  
//       db.store.put({id: filename, data: filedata});
//     }
  
//     return true;
//   }

//   function findIndexedDB (filesearch, callback) {
//     return loadIndexedDB(null, callback, filesearch);
//   }
  
//   function loadIndexedDB (input_dbname, input_storename, filename, callback, filesearch) {
//     var openDB = openIndexedDB(input_dbname, input_storename);
  
//     openDB.onsuccess = function() {
//       var db = getStoreIndexedDB(input_storename, openDB);
  
//       var getData;
//       if (filename) {
//         getData = db.store.get(filename);
//       } else {
//         getData = db.index.get(filesearch);
//       }
      
//       getData.onsuccess = function() {
//         callback(getData.result.data);
//       };
  
//       db.tx.oncomplete = function() {
//         db.result.close();
//       };
//     }
  
//     return true;
//   }


//   function example () {
//     var fileindex = ["name.last", "name.first"];
//     saveIndexedDB(12345, {name: {first: "John", last: "Doe"}, age: 42});
//     saveIndexedDB(67890, {name: {first: "Bob", last: "Smith"}, age: 35}, fileindex);
  
//     loadIndexedDB(12345, callbackJohn);
//     findIndexedDB(["Smith", "Bob"], callbackBob);
//   }
  
//   function callbackJohn (filedata) {
//     console.log(filedata.name.first);
//   }
  
//   function callbackBob (filedata) {
//     console.log(filedata.name.first);
//   }
////////////////////////////////
//indexed db
////////////////////////////////








////////////////////////////
//JSON
////////////////////////////
function JSON_POST_TEST() {
    return dataSetList = [
        {"no":182,"select":false,"mb_id":"aaa1","mb_password":"gRRRB83DxdovZI8W9ntUhfQ==","mb_name":"홍서방","mb_email":"2mail@mail.com","mb_tel":"","mb_mobile":"01010101010","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 17:30:28.0","mb_lastsave_datetime":"2019-01-22 17:31:25.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
        ,{"no":181,"select":false,"mb_id":"bbbb","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 17:25:16.0","mb_lastsave_datetime":"2019-01-22 17:25:16.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":180,"select":false,"mb_id":"1111","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"박박박성3442323434","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 17:00:44.0","mb_lastsave_datetime":"2019-01-22 17:01:04.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":170,"select":false,"mb_id":"fssd","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"안뇽11111","mb_email":"22266","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:40:53.0","mb_lastsave_datetime":"2019-01-22 16:35:54.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":167,"select":false,"mb_id":"asd3","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:38:34.0","mb_lastsave_datetime":"2019-01-22 15:38:34.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":166,"select":false,"mb_id":"a333","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍홍홍111","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:33:45.0","mb_lastsave_datetime":"2019-01-22 16:18:16.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":165,"select":false,"mb_id":"12121","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:21:26.0","mb_lastsave_datetime":"2019-01-22 15:21:26.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":164,"select":false,"mb_id":"1212","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:17:15.0","mb_lastsave_datetime":"2019-01-22 15:17:15.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":163,"select":false,"mb_id":"77777","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:13:36.0","mb_lastsave_datetime":"2019-01-22 16:59:46.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/77777_20190122_165946.png","mb_auth":"1","mb_etc":""}
,{"no":162,"select":false,"mb_id":"1113","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"김서방","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:13:24.0","mb_lastsave_datetime":"2019-01-22 16:59:32.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/1113_20190122_165934.jpeg","mb_auth":"1","mb_etc":""}
,{"no":161,"select":false,"mb_id":"111","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:09:46.0","mb_lastsave_datetime":"2019-01-22 15:09:46.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":160,"select":false,"mb_id":"a3322","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 15:03:04.0","mb_lastsave_datetime":"2019-01-22 15:03:04.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":159,"select":false,"mb_id":"a33","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:53:10.0","mb_lastsave_datetime":"2019-01-22 14:53:10.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":157,"select":false,"mb_id":"bb","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"333","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:37:07.0","mb_lastsave_datetime":"2019-01-22 14:49:40.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":156,"select":false,"mb_id":"avb","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:37:05.0","mb_lastsave_datetime":"2019-01-22 14:37:05.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":155,"select":false,"mb_id":"a1123444555666","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:37:02.0","mb_lastsave_datetime":"2019-01-22 14:37:02.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":154,"select":false,"mb_id":"a1123444555","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍정222ddfssdfsf","mb_email":"","mb_tel":"","mb_mobile":"2","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:37:00.0","mb_lastsave_datetime":"2019-01-22 16:36:01.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":153,"select":false,"mb_id":"a1123444","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:36:58.0","mb_lastsave_datetime":"2019-01-22 14:36:58.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":152,"select":false,"mb_id":"a1123","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"1221","mb_email":"21","mb_tel":"","mb_mobile":"211221","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:36:56.0","mb_lastsave_datetime":"2019-01-22 14:48:21.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-12","mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":151,"select":false,"mb_id":"a112","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:36:53.0","mb_lastsave_datetime":"2019-01-22 14:36:53.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":150,"select":false,"mb_id":"a11","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:36:47.0","mb_lastsave_datetime":"2019-01-22 14:36:47.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":149,"select":false,"mb_id":"121221","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"22","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:36:15.0","mb_lastsave_datetime":"2019-01-22 16:55:19.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":148,"select":false,"mb_id":"99","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"2222","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:36:02.0","mb_lastsave_datetime":"2019-01-22 16:55:39.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":147,"select":false,"mb_id":"88","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:36:00.0","mb_lastsave_datetime":"2019-01-22 14:36:00.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":146,"select":false,"mb_id":"77","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:35:59.0","mb_lastsave_datetime":"2019-01-22 14:35:59.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":145,"select":false,"mb_id":"66","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:35:58.0","mb_lastsave_datetime":"2019-01-22 14:35:58.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":144,"select":false,"mb_id":"55","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:35:56.0","mb_lastsave_datetime":"2019-01-22 14:35:56.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":143,"select":false,"mb_id":"44","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:35:54.0","mb_lastsave_datetime":"2019-01-22 14:35:54.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":142,"select":false,"mb_id":"33","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"222333222","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:35:51.0","mb_lastsave_datetime":"2019-01-22 16:47:53.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":141,"select":false,"mb_id":"22","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:35:49.0","mb_lastsave_datetime":"2019-01-22 14:35:49.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":"","mb_auth":"1","mb_etc":""}
,{"no":140,"select":false,"mb_id":"11","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"2222244444222","mb_email":"","mb_tel":"","mb_mobile":"","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 14:35:47.0","mb_lastsave_datetime":"2019-01-22 16:39:09.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":129,"select":false,"mb_id":"aa17","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십칠동","mb_email":"1717@gmail.com","mb_tel":"","mb_mobile":"010-1717-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:26:18.0","mb_lastsave_datetime":"2019-01-22 16:56:13.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":128,"select":false,"mb_id":"aa16","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십오동","mb_email":"1616@gmail.com","mb_tel":"","mb_mobile":"010-1616-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:26:09.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa16_20190122_102609.jpeg","mb_auth":"1","mb_etc":""}
,{"no":127,"select":false,"mb_id":"aa15","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십오동","mb_email":"1515@gmail.com","mb_tel":"","mb_mobile":"010-1515-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:26:00.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa15_20190122_102600.jpeg","mb_auth":"1","mb_etc":""}
,{"no":126,"select":false,"mb_id":"aa14","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십사동11","mb_email":"1414@gmail.com","mb_tel":"","mb_mobile":"010-1414-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:25:50.0","mb_lastsave_datetime":"2019-01-22 16:51:06.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":125,"select":false,"mb_id":"aa13","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십삼동","mb_email":"1212@gmail.com","mb_tel":"","mb_mobile":"010-1313-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:25:37.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa13_20190122_102537.jpeg","mb_auth":"1","mb_etc":""}
,{"no":124,"select":false,"mb_id":"aa12","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십이동22","mb_email":"1212@gmail.com","mb_tel":"","mb_mobile":"010-1212-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:25:30.0","mb_lastsave_datetime":"2019-01-22 16:56:04.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":123,"select":false,"mb_id":"aa11","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십일동","mb_email":"1111@gmail.com","mb_tel":"","mb_mobile":"010-1111-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:25:21.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa11_20190122_102521.jpeg","mb_auth":"1","mb_etc":""}
,{"no":122,"select":false,"mb_id":"aa10","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍십동2","mb_email":"888@gmail.com","mb_tel":"","mb_mobile":"010-1010-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:25:10.0","mb_lastsave_datetime":"2019-01-22 16:49:54.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":121,"select":false,"mb_id":"aa9","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍구동","mb_email":"888@gmail.com","mb_tel":"","mb_mobile":"010-9999-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:25:00.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa9_20190122_102500.jpeg","mb_auth":"1","mb_etc":""}
,{"no":120,"select":false,"mb_id":"aa8","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍팔동","mb_email":"888@gmail.com","mb_tel":"","mb_mobile":"010-8888-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:24:53.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa8_20190122_102453.jpeg","mb_auth":"1","mb_etc":""}
,{"no":119,"select":false,"mb_id":"aa7","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍칠동","mb_email":"777@gmail.com","mb_tel":"","mb_mobile":"010-7777-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:24:45.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa7_20190122_102445.jpeg","mb_auth":"1","mb_etc":""}
,{"no":117,"select":false,"mb_id":"aa5","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍오동2","mb_email":"444@gmail.com","mb_tel":"","mb_mobile":"010-5555-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:24:29.0","mb_lastsave_datetime":"2019-01-22 16:48:42.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":116,"select":false,"mb_id":"aa4","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍사동","mb_email":"444@gmail.com","mb_tel":"","mb_mobile":"010-4444-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:24:19.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-11","mb_sns":"","mb_image":"http://www.yjsoft.kr/db\\user_images/aa4_20190122_102419.jpeg","mb_auth":"1","mb_etc":""}
,{"no":115,"select":false,"mb_id":"aa3","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍삼동","mb_email":"a333ㅁ@gmail.com","mb_tel":"","mb_mobile":"010-3333-1122","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:23:54.0","mb_lastsave_datetime":"2019-01-22 10:51:53.0","mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":null,"mb_sns":"","mb_image":null,"mb_auth":"1","mb_etc":""}
,{"no":114,"select":false,"mb_id":"aa2","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍이동","mb_email":"two@naver.com","mb_tel":"","mb_mobile":"010-2222-3332","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 10:20:40.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-17","mb_sns":"","mb_image":"http://www.yjsoft.kr\\db\\user_images\\aa2_20190122_102048.png","mb_auth":"1","mb_etc":""}
,{"no":107,"select":false,"mb_id":"aa1","mb_password":"gRRRB83DxdovZI8WntUhfQ==","mb_name":"홍길동","mb_email":"hong@naver.com","mb_tel":"","mb_mobile":"010-1111-1234","mb_sex":true,"mb_addr_1":"","mb_addr_2":"","mb_addr_3":"","mb_post":"","mb_regist_datetime":"2019-01-22 09:40:36.0","mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"0","mb_license":1,"mb_license_date":"2019-01-01","mb_sns":"","mb_image":"D:\\eclipse\\user_images\\aa1_20190122_094151.png","mb_auth":"1","mb_etc":""}
,{"no":132,"select":false,"mb_id":"aaaa333","mb_password":"1","mb_name":"","mb_email":null,"mb_tel":null,"mb_mobile":null,"mb_sex":false,"mb_addr_1":null,"mb_addr_2":null,"mb_addr_3":null,"mb_post":null,"mb_regist_datetime":null,"mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"1","mb_license":1,"mb_license_date":null,"mb_sns":null,"mb_image":null,"mb_auth":"일반사용자","mb_etc":null}
,{"no":133,"select":false,"mb_id":"aaaa322233","mb_password":"1","mb_name":null,"mb_email":null,"mb_tel":null,"mb_mobile":null,"mb_sex":false,"mb_addr_1":null,"mb_addr_2":null,"mb_addr_3":null,"mb_post":null,"mb_regist_datetime":null,"mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"1","mb_license":1,"mb_license_date":null,"mb_sns":null,"mb_image":null,"mb_auth":"일반사용자","mb_etc":null}
,{"no":134,"select":false,"mb_id":"aaaa32222233","mb_password":"1","mb_name":null,"mb_email":null,"mb_tel":null,"mb_mobile":null,"mb_sex":false,"mb_addr_1":null,"mb_addr_2":null,"mb_addr_3":null,"mb_post":null,"mb_regist_datetime":null,"mb_lastsave_datetime":null,"mb_out_datetime":null,"mb_userinfo_delete":"1","mb_license":1,"mb_license_date":null,"mb_sns":null,"mb_image":null,"mb_auth":"일반사용자","mb_etc":null}

    ];;
}


function saveJSON(data, filename){
    if(!data) {
        console.error('No data')
        return;
    }

    if(!filename) {
        filename = 'console.json';
    }
 
    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4);
    }

    //var blob = new Blob([data], {type: 'text/json'}),
    var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}

function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
}




function fetchHtml(url, elementID, result) {
    fetch(url)
    .then((response) => {
        return response.text();
    })
    .then((response) => {
        document.getElementById(elementID).innerHTML = response;
        result(response);
    });
}



let abortController_fetch = new AbortController();
function clearTimeout() {
    setTimeout(function() {
        abortController_fetch.abort();
    }, 5000);
}

function JSON_POST(url, sendData, isJsonParse, token, result) {
    abortController_fetch = new AbortController();

    var sData = null;
    if (sendData !== null) {
        sData = JSON.stringify(sendData);
    } else {
        sData = "";
    }
    
    const config = {
        credentials: 'same-origin', // 'same-origin', 'include', default: 'omit'
        method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
        body: sData, // Coordinate the body type with 'Content-Type'
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token
        }),
        signal: abortController_fetch.signal
    }
    fetch(url, config)
    .then(function (response, a, b) {
        // var contentType = response.headers.get('content-type');
        // if(contentType && contentType.includes('application/json')) {
        //   return response.json();
        // }

        // var getAuthorization = response.headers.get("Authorization");
        // var get_token = null;
        // if (getAuthorization != null) {
        //     get_token = getAuthorization.substring(6, getAuthorization.length).trim();
        //     if (get_token != null) {
        //         sessionStorage.setItem(token_yj_rfms, get_token); 	//session 에 토큰 정보 저장
        //     }
        // }
        

        return response.json();
    })
    .then((response) => {
        result(response);

        if (response.messageinfo.state === "checkrefresh") {
            request_refresh_token();
        }
        //JSON_POST_SUCCESS(response, isJsonParse, result);
    })
    .catch((err) => {
        //alert(err);
        if (err.code === 20) {
            messagebox_show(false, "서버연결 오류", err.message, null, false, true);
        } else {
            alert(err);
        }
        
        //result(response);
        //JSON_POST_ERROR(err, result)
    });

    clearTimeout();
}

function request_refresh_token() {
    var url = url_json + "user/jwtrefresh";

    //refresh token
    JSON_POST(url, null, false, null, function (response) {
        if (response.messageinfo.state == "ok") {
            messagebox_show(false, "성공", response.messageinfo.message, null, false, true);
        }
    });
}

// function JSON_POST(url, sendData, isJsonParse, token, result) {
//     fetch(url, {
//         credentials: 'same-origin', // 'same-origin', 'include', default: 'omit'
//         method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
//         body: JSON.stringify(sendData), // Coordinate the body type with 'Content-Type'
//         headers: new Headers({
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer '+ token
//         }),
//     })
//     .then(function (response) {
//         // var contentType = response.headers.get('content-type');
//         // if(contentType && contentType.includes('application/json')) {
//         //   return response.json();
//         // }

//         var getAuthorization = response.headers.get("Authorization");
//         var get_token = null;
//         if (getAuthorization != null) {
//             get_token = getAuthorization.substring(6, getAuthorization.length).trim();
//             if (get_token != null) {
//                 sessionStorage.setItem(token_yj_rfms, get_token); 	//session 에 토큰 정보 저장
//             }
//         }

//         return response.json();
//     })
//     .then((response) => {
//         JSON_POST_SUCCESS(response, isJsonParse, result);
//     })
//     .catch((err) => {
//         JSON_POST_ERROR(err, result)
//     });
// }

function JSON_POST_SUCCESS(response, isJsonParse, result) {
    var rValule = new Array();
    if (isJsonParse == true) {
        rValule[0] = JSON.parse(response[0]); 
        rValule[1] = JSON.parse(response[1]);                
        result(rValule);
    } else {
        result(response);
    }
}

function JSON_POST_ERROR(err, result) {
    var rValule = new Array()
    //기존 주소 저장
    sessionStorage.setItem("previousLocation", window.location.href);

    //rValule[0] = "error";
    rValule[0] = err.stack;
    rValule[1] = err.message;
    sessionStorage.removeItem(token_yj_rfms);
    
    result(rValule);
}

// function postRequest(url, data, token) {
//   return fetch(url, {
//     credentials: 'same-origin', // 'include', default: 'omit'
//     method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
//     body: JSON.stringify(data), // Coordinate the body type with 'Content-Type'
//     headers: new Headers({
//       'Content-Type': 'application/json'
//     }),
//   })
//   .then(response => response.json())
// }

// function JSON_POST_xmlHttp(url, sendData, isJsonParse, token, result) {
//     var rValule = new Array();
//     var xmlhttpRequest = new XMLHttpRequest();

//     xmlhttpRequest.open("POST", url, true);
//     xmlhttpRequest.timeout = 2000;

//     //set header
//     if (token != null) {
//         xmlhttpRequest.setRequestHeader('Authorization','Bearer '+ token);
//     }
    
//     xmlhttpRequest.setRequestHeader("Content-Type", "application/json");

//     // alert("url: \n" + url
//     //     + "\n token: " + token       
//     //     + "\n senddata: " + JSON.stringify(sendData)
//     // );

//     // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Origin","*");
//     // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Headers", "*");    
//     // xmlhttpRequest.setRequestHeader("Access-Control-Expose-Headers", "*");
//     // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Credentials", true);
//     // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

//     //readyState
//     //0: UNSENT, OPENED, 2: HEADERS_RECEIVED, 3: LOADING, 4: DONE 
//     xmlhttpRequest.onreadystatechange = function(e) {
//         //alert(xmlhttpRequest.statusText);
//         if (this.readyState == 4 && this.status == 200) {
//             //get token
//             var getAuthorization = xmlhttpRequest.getResponseHeader("Authorization");
//             var get_token = null;
//             if (getAuthorization != null) {
//                 get_token = getAuthorization.substring(6, getAuthorization.length).trim();
//                 if (get_token != null) {
//                     sessionStorage.setItem(token_yj_rfms, get_token); 	//session 에 토큰 정보 저장
//                 }
//             }

//             //return data
//             if (isJsonParse == true) {
//                 rValule[0] = "ok";
//                 rValule[1] = JSON.parse(this.responseText);                
//                 result(rValule);
//             } else {
//                 result(JSON.parse(this.responseText));
//             }
//         } else if (this.readyState == 4 && this.status == 5959) {
//             //기존 주소 저장
//             sessionStorage.setItem("previousLocation", window.location.href);

//             //rValule[0] = "error";
//             rValule[0] = this.status;
//             rValule[1] = "사용자 로그인이 필요합니다.";
//             sessionStorage.removeItem(token_yj_rfms);
            
//             result(rValule);            
//         } else if (this.readyState == 4 && this.status == 0) {
//             // rValule[0] = "error";
//             // rValule[1] = "서버로부터 응답이 없습니다.";
//             // result(rValule);
//         }
//     };

//     xmlhttpRequest.send(JSON.stringify(sendData));
// }

function setInterval_progress(){
    progress_timer_object = setInterval(function() {
        progress_timer += 1000;
    }, 1000);
}

var xmlhttpRequest_fileupload;         
var progress_timer_object = null;
var progress_timer = 1000;
var trans_time_total = 0;
var total_file_save_size = 0;              //메인 프로그래스바에 디스플레이할 값
var total_file_save_size_count = 0;        //전송 완료 파일 수를 디스플레이할 값
var total_file_size = 0;                   //메인 프로그래스바의 100퍼센트 값을 계산할 변수
var total_file_array = new Array();         //[row][0]번은 총 파일크기, [row][1]번은 로딩된 값
function send_files(url, file, filesLength, board_type, view_no, result) {
    event.stopPropagation();
    event.preventDefault();

    var formData = new FormData();
    formData.append("uploadFile", file);    
    formData.append("boardType", board_type);
    formData.append("viewNo", view_no);

    xmlhttpRequest_fileupload = new XMLHttpRequest();

    //다 만들었더니 좋은거 발견.
    //http://adnan-tech.com/tutorial/show-progress-of-download-with-remaining-time-javascript
    xmlhttpRequest_fileupload.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            //총 업로드할 파일의 값을 계산하기 위함
            if (contains(e.total.toString(), total_file_array) == false) {
                total_file_array.push([e.total.toString(), ""]);     //중복 방지용 배열
                total_file_size += e.total;
                if (total_file_save_size < filesLength) {
                    total_file_save_size++;
                }                
            }

            //개별 프로그래스 바 현재 진행량 저장 (key = e.total)
            for (var i=0; i<total_file_array.length; i++) {
                if (total_file_array[i][0] == e.total) {
                    total_file_array[i][1] = e.loaded;
                }
            }

            //main progress - 전송할 파일의 크기가 모두 저장되었다면 메인 프로그래스 바 설정
            if (filesLength == total_file_save_size) {
                //총 진행값 저장 (key = e.total)
                var current_child_pregress_value = 0;
                for (var i=0; i<total_file_array.length; i++) {
                    current_child_pregress_value += parseInt(total_file_array[i][1]);
                }
                
                var current_value_total = Math.round((current_child_pregress_value / total_file_size) * 100);
                document.getElementById("prgMain").value = current_value_total;     
                document.getElementById("prgMain").setAttribute("data-label", current_value_total + "%");    

                //전송 속도 계산 (KB/sec) = 현재까지 전송된 파일크기 /  현재까지 전송이 진행된 시간(TotalSeconds);
                var trans_speed = current_child_pregress_value / progress_timer;
                trans_speed = Math.floor(trans_speed / 1024);
                if (trans_speed >= 1000) {
                    trans_speed = (trans_speed / 100) + "MB/초";
                } else {
                    trans_speed = trans_speed + "KB/초";
                }
                document.getElementById("lblTransSpeed").textContent = trans_speed;

                //전송 시간 계산
                //(전체크기 - 지금까지 전송크기) * 현재 소요시간 / 지금까지의 전송크기 = 앞으로의 잔여시간
                var trans_time = (total_file_size - current_child_pregress_value) * progress_timer / current_child_pregress_value;
                trans_time = Math.round(trans_time / 1000);
                if (trans_time < 60) {
                    trans_time = trans_time + "초";
                } else if (trans_time < 3600){
                    trans_time = Math.floor(trans_time % 3600 / 60) + '분 ' + trans_time % 60 + '초';
                } else {
                    trans_time = Math.floor(trans_time / 3600) + '시간 ' + Math.floor(trans_time % 3600 / 60) + '분 ' + trans_time % 60 + '초';
                }
                
                //총 걸리는 시간
                if (trans_time_total == 0) {
                    trans_time_total = (total_file_size - current_child_pregress_value) * 1000 / current_child_pregress_value;
                    trans_time_total = Math.round(trans_time_total / 1000);
                }                
                if (trans_time_total < 1) {
                    trans_time_total = 1;
                }

                //document.getElementById("lblTransTime").textContent = trans_time + " / " + trans_time_total + "초";         //남은 시간 / 총걸리는 예상 시간
                document.getElementById("lblTransTime").textContent = trans_time;                                        //남은 시간
            }

            //child progress
            var current_value = Math.round((e.loaded / e.total) * 100);
            document.getElementById("prgChild" + file.name).value = current_value;
            document.getElementById("prgChild" + file.name).setAttribute("data-label", current_value + "%");

            // //개별 파일 전송 완료 시
            // if (e.loaded == e.total) {
            //     total_file_save_size_count++;
            //     document.getElementById("lblTransFile").textContent = total_file_save_size_count + "/" + filesLength;
            //     //document.getElementById("prgChild" + filename).setAttribute("data-label", "100%");

            //     //모든 파일 전송 완료 시
            //     if (filesLength == total_file_save_size_count) {
            //         clearInterval(progress_timer_object);

            //         result("ended_file_trans");
            //     }
            // }
        }
     }
     
    xmlhttpRequest_fileupload.onprogress = function (e) {
        if (e.lengthComputable) {
            console.log("ended: " + e.loaded+  " / " + e.total)
        }        
    }
    
    xmlhttpRequest_fileupload.onreadystatechange = function(e) {
        if (this.readyState == 4 && this.status == 200) {
            //파일 전송 완료
            total_file_save_size_count++;
            document.getElementById("lblTransFile").textContent = total_file_save_size_count + "/" + filesLength;
            //document.getElementById("prgChild" + filename).setAttribute("data-label", "100%");

            //모든 파일 전송 완료 시
            if (filesLength == total_file_save_size_count) {
                clearInterval(progress_timer_object);

                var rValule = new Array();
                rValule[0] = "ended_file_trans";
                rValule[1] = this.responseText;
                result(rValule);
            } else {
                var rValule = new Array();
                rValule[0] = "saveFile";
                rValule[1] = this.responseText;
                result(rValule);
            }
        } else if (this.readyState == 4 && this.status == 0) {
            // rValule[0] = "error";
            // rValule[1] = "서버로부터 응답이 없습니다.";
            // result(rValule);
        }
    }

    xmlhttpRequest_fileupload.open("POST", url);
    xmlhttpRequest_fileupload.send(formData);
}

function FormData_POST(url, sendData, isJsonParse, token, result) {
    var rValule = new Array();
    var xmlhttpRequest = new XMLHttpRequest();

    xmlhttpRequest.open("POST", url, true);
    xmlhttpRequest.timeout = 4000;
    //set header
    if (token != null) {
        xmlhttpRequest.setRequestHeader('Authorization','Bearer '+ token);
    }
    
    xmlhttpRequest.setRequestHeader("Content-Type", "application/json");

    // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Origin","*");
    // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Headers", "*");    
    // xmlhttpRequest.setRequestHeader("Access-Control-Expose-Headers", "*");
    // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Credentials", true);
    // xmlhttpRequest.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

    //readyState
    //0: UNSENT, OPENED, 2: HEADERS_RECEIVED, 3: LOADING, 4: DONE 
    xmlhttpRequest.onreadystatechange = function(e) {
        //alert(xmlhttpRequest.statusText);
        if (this.readyState == 4 && this.status == 200) {
            //get token
            var getAuthorization = xmlhttpRequest.getResponseHeader("Authorization");
            var get_token = null;
            if (getAuthorization != null) {
                get_token = getAuthorization.substring(6, getAuthorization.length).trim();
                if (get_token != null) {
                    sessionStorage.setItem(token_yj_rfms, get_token); 	//session 에 토큰 정보 저장
                }
            }

            //return data
            if (isJsonParse == true) {
                rValule[0] = "ok";
                rValule[1] = JSON.parse(this.responseText);                
                result(rValule);
            } else {
                result(JSON.parse(this.responseText));
            }
        } else if (this.readyState == 4 && this.status == 5959) {
            //기존 주소 저장
            sessionStorage.setItem("previousLocation", window.location.href);

            //rValule[0] = "error";
            rValule[0] = this.status;
            rValule[1] = "사용자 로그인이 필요합니다.";
            sessionStorage.removeItem(token_yj_rfms);
            
            result(rValule);            
        } else if (this.readyState == 4 && this.status == 0) {
            rValule[0] = "error";
            rValule[1] = "서버로부터 응답이 없습니다.";
            result(rValule);
        }
    };

    xmlhttpRequest.send(JSON.stringify(sendData));
}

function FileToBase64(file, cb) {
    if (file == null) {
        cb(null);
    } else {
        try {
            var reader = new FileReader();
            //reader.readAsText(file);
            
            reader.readAsDataURL(file);
            reader.onload = function () {
              //console.log(reader.result);//outputs random looking characters for the image
              // Return the result in the callback
              cb(reader.result);
            };
            reader.onerror = function (error) {
              console.log('Error: ', error);
            };
        } catch (err) {
            cb("");
        }
    }    
 }


 function check_string1(input_data, result){
    // if( input_data.value == '' || input_data.value == null ){
    //     result('값을 입력해주세요');
    //     return false;
    // }
    
    // var blank_pattern = /^\s+|\s+$/g;
    // if( input_data.value.replace( blank_pattern, '' ) == "" ){
    //     result('공백만 입력되었습니다');
    //     return false;
    // }
    
    //공백 금지
    //var blank_pattern = /^\s+|\s+$/g;(/\s/g
    var rValue = new Array();
    var blank_pattern = /[\s]/g;
    if(blank_pattern.test( input_data) == true){
        rValue[0] = input_data;
        rValue[1] = "공백은 사용할 수 없습니다.";
        result(rValue);
        return;
    }
    
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    //var special_pattern = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;//정규식 구문
    if(special_pattern.test(input_data) == true ){
        rValue[0] = input_data;
        rValue[1] = "특수문자는 사용할 수 없습니다.";
        result(rValue);
        return;
    }
    
    /*
    if( str.value.search(/\W|\s/g) > -1 ){
        alert( '특수문자 또는 공백을 입력할 수 없습니다.' );
        str.focus();
        return false;
    }*/
    
}

function check_string2(input_data){
    //공백 금지
    var blank_pattern = /[\s]/g;
    if(blank_pattern.test( input_data) == true){
        return "공백은 사용할 수 없습니다.";
    }
    
    //var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    var special_pattern = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;    //정규식 구문
    if(special_pattern.test(input_data) == true ){
        return "특수문자는 사용할 수 없습니다.";
    }

    return "ok";
}

function remove_space_string(input_data) {
    var pattern = / /g;
    return input_data.replace(/ /g,'');
    
}

function remove_special_string(input_data) {
    var pattern = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;    //정규식 구문
    return input_data.replace(pattern,'');
}

function currentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() +1; //1월은 0
    var day = date.getDate();

    //월이 한자리 수인 경우 앞에 0을 붙임
    if ((month + "").length < 2) {
        month = "0" + month;
    }

    //일이 한자리 수인 경우 앞에 0을 붙임
    if ((day + "").length < 2) {
        day = "0" + day;
    }

    var today = year + "-" + month + "-" + day;
    return today;
}

//yyyy-MM-dd HH:mm:ss 형식
function currentDateTime() {
    return new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0].replace('T',' ');
}

//문자열 빈값 확인
function IsNullOrWhiteSpace(value) {
    if (value== null) return true;
    return value.replace(/\s/g, '').length == 0;
}

//문자열 포함 확인
// var target = "bonjour le monde vive le javascript";
// var pattern = ['bonjour','europe', 'c++'];
// function contains(target, pattern){
//     var value = 0;
//     pattern.forEach(function(word){
//       value = value + target.includes(word);  //incluldes 는 explorer, opera 에서 지원 안함
//     });
//     return (value === 1)
// }
function contains(target, pattern){
    var value = 0;
    pattern.forEach(function(word){
        if (target.indexOf(word) > -1) {
            value = 1;
        }
    });
    return (value === 1)
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
        break;
        }
    }
}

//UTF8 인코딩 ⇢ base64
function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

//디코딩 base64 ⇢ UTF8
function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function parseJwt (token) {
    if ((token == null) || (token == "")){
        var token_result = {};
        token_result.mb_id = "";
        token_result.mb_auth = "";
        return token_result;
    }

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var rValue = b64DecodeUnicode(base64);
    return JSON.parse(rValue);
};



//이미지 오류시 대체 이미지 설정
function imgError_user(image) {
    image.onerror = "";
    image.src = "/images/excel4.png";
    return true;
}

function imageViewer_init() {
    //이미지 뷰어
    var defaultOpts = {
        draggable: true,
        resizable: true,
        movable: true,
        keyboard: true,
        title: true,
        modalWidth: 320,
        modalHeight: 320,
        fixedContent: true,
        fixedModalSize: false,
        initMaximized: true,
        gapThreshold: 0.02,
        ratioThreshold: 0.1,
        minRatio: 0.05,
        maxRatio: 16,
        headToolbar: ['maximize', 'close'],
        footToolbar: ['zoomIn', 'zoomOut', 'prev', 'fullscreen', 'next', 'actualSize', 'rotateRight'],
        multiInstances: true,
        initEvent: 'click',
        initAnimation: true,
        fixedModalPos: false,
        zIndex: 5002,
        dragHandle: '.magnify-modal',
        progressiveLoading: true
      };
  
      $("[data-magnify=gallery]").magnify(defaultOpts);

      //이벤트 (이미지 뷰어 사용 페이지에서 사용 할것)
    //   $("[data-magnify=gallery]").magnify({
    //     callbacks: {
    //       beforeOpen: function(el){
    //         // Will fire before modal is opened
    //       },
    //       opened: function(el){
    //         // Will fire after modal is opened
    //       },
    //       beforeClose: function(el){
    //         // Will fire before modal is closed
    //       },
    //       closed: function(el){
    //         // Will fire after modal is closed
    //       },
    //       beforeChange: function(index){
    //         // Will fire before image is changed
    //         // The arguments is the current image index of image group
    //       },
    //       changed: function(index){
    //         // Will fire after image is changed
    //         // The arguments is the next image index of image group
    //       }
    //     }
    //   });
    }

    function comma(str) {
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }
    
    //콤마풀기
    function uncomma(str) {
        str = String(str);
        return str.replace(/[^\d]+/g, '');
    }
    
    //값 입력시 콤마찍기
    function inputNumberFormat(obj) {
        obj.value = comma(uncomma(obj.value));
    }
    
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }

    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };




    ///////////////////
    //Android Bridge
    ///////////////////
    //javascript to android
    function request_rf_on(data){
        window.rfms_rfcontrol.rf_on(data);
    }

    function request_toAndroid(input_method, input_param1, input_param2){
        //window.rfms_rfcontrol.rf_on(data);
        try {
            if (input_method == "save_indexedDB") {
                window.webview_datatrans.fromJavascriptCommand_savejson(input_param1);
            } else if (input_method == "import_indexedDB") {
                window.webview_datatrans.fromJavascriptCommand_getjson(input_param1);
            } else if (input_method == "fromJavascriptCommand_bluetoothOn") {
                window.webview_datatrans.fromJavascriptCommand_bluetoothOn(input_param1);
            } else if (input_method == "fromJavascriptCommand_bluetoothOff") {
                window.webview_datatrans.fromJavascriptCommand_bluetoothOff(input_param1);
            } else if (input_method == "fromJavascriptCommand_listPairedDevices") {
                window.webview_datatrans.fromJavascriptCommand_listPairedDevices(input_param1);
            } else if (input_method == "fromJavascriptCommand_serialsend") {
                window.webview_datatrans.fromJavascriptCommand_serialsend(input_param1);
            }
            
            //window.webview_datatrans.fromJavascriptCommand(JSON.stringify({ method: input_method, input_param1: input_param1, input_param2: input_param2 }));
          }
        catch(err) {
            //messagebox_show(false, "uwp error", err.message, null, false, true);
        }
    }

    //android to javascript
    function rf_read(data){
        var getTemp = document.getElementById('id_hybrid_test');
        getTemp.textContent = data;
    }
    
    //데이터가 1메가가 넘어갈 경우 속도저하 및 다운현상 발생
    //분할하여 데이터 송수신함
    //단순 프로토콜 사용: 시작 'stx:', 종료 ':etx'
    var receiveStart = false;
    var row_buffer;
    function fromAndroid_importIndexedDB(buffer){
        if (buffer == "stx:") {
            //loading message
            document.getElementsByClassName('loading-container')[0].style.display = 'block';

            receiveStart = true;
            
            row_buffer = "";
        } else if (buffer == ":etx") {
            receiveStart = false;

            try {
                var indexedDB_backup = JSON.parse(row_buffer);
                //저장할 테이블 이름 설정
                // var list_storeName = new Array("yj_asset", "yj_asset_manage", "yj_auth", "yj_company", "yj_dept", "yj_device", "yj_historyasset", "yj_location", "yj_member", "yj_position", "yj_status", "yj_statususer", "yj_config", "yj_rotateimage");
    
                ///////////////////////////////////////
                //중요!!!
                //백업 및 복원 테이블 순서가 같아야 함
                //다음 파일의 정보도 같이 변경하여야함
                //utill.js(function name: fromAndroid_importIndexedDB), header.html(function name: import_indexedDB_store, function name: export_indexedDB_store)
                ///////////////////////////////////////
                var list_storeName = new Array("yj_auth", "yj_dept", "yj_member", "yj_config", "yj_position", "yj_rotateimage", "yj_statususer");
    
                var import_icount = 0;
    
                //데이터베이스의 기존 내용을 모두 삭제 후 저장
                saveListNext(list_storeName[import_icount]);
    
                function saveListNext(store_name) {
                    indexedDB_storeClear(store_name, function(e) {
                        for (vari=0; i<indexedDB_backup.length; i++) {
                            if (indexedDB_backup[i][0] == store_name) {
                                indexedDB_insert(store_name, indexedDB_backup[i][1], function(e) {		//새로운 데이터베이스 내용 저장
                                    //데이터를 모두 저장했다면 종료
                                    if (import_icount == list_storeName.length - 1) {
                                        //loading message
                                        document.getElementsByClassName('loading-container')[0].style.display = 'none';
                                        
                                        messagebox_show(false, "DBMS", "백업 데이터의 복사가 종료되었습니다. (Copy of backup data has ended.)", null, true, true);
                                        
                                        //안드로이드에서 간혹 css 배경색이 안변하는 상황 발생하여 별도 설정  추가
				                        document.getElementById('dialog_messagebox').style.backgroundColor = "#00000080";
                                    } else {
                                        saveListNext(list_storeName[++import_icount]);
                                    }
                                });
    
                                break;
                            }
                        }
                    });
                }
            } catch (e) {
                alert(e);
            }
        } else {
            if (receiveStart == true) {                
                row_buffer += buffer;
            }
        }
    }

    // function fromAndroid_importIndexedDB(input_indexedDB_backup){
    //     var indexedDB_backup = JSON.parse(input_indexedDB_backup);

    //     //저장할 테이블 이름 설정
    //     // var list_storeName = new Array("yj_asset", "yj_asset_manage", "yj_auth", "yj_company", "yj_dept", "yj_device", "yj_historyasset", "yj_location", "yj_member", "yj_position", "yj_status", "yj_statususer", "yj_config", "yj_rotateimage");

    //     ///////////////////////////////////////
    //     //중요!!!
    //     //백업 및 복원 테이블 순서가 같아야 함
    //     //다음 파일의 정보도 같이 변경하여야함
    //     //utill.js(function name: fromAndroid_importIndexedDB), header.html(function name: import_indexedDB_store, function name: export_indexedDB_store)
    //     ///////////////////////////////////////
    //     var list_storeName = new Array("yj_auth", "yj_dept", "yj_member", "yj_config", "yj_position", "yj_rotateimage", "yj_statususer");

    //     var import_icount = 0;

	// 	//데이터베이스의 기존 내용을 모두 삭제 후 저장
	// 	saveListNext(list_storeName[import_icount]);

	// 	function saveListNext(store_name) {
    //         indexedDB_storeClear(store_name, function(e) {
	// 			for (var i=0; i<indexedDB_backup.length; i++) {
	// 				if (indexedDB_backup[i][0] == store_name) {
	// 					indexedDB_insert(store_name, indexedDB_backup[i][1], function(e) {		//새로운 데이터베이스 내용 저장
    //                         //데이터를 모두 저장했다면 종료
	// 						if (import_icount == list_storeName.length - 1) {
	// 							messagebox_show(false, "DBMS", "백업 데이터의 복사가 종료되었습니다. (Copy of backup data has ended.)", null, true, true);
	// 						} else {
    //                             saveListNext(list_storeName[++import_icount]);
	// 						}
	// 					});

	// 					break;
	// 				}
	// 			}
	// 		});
	// 	}
    // }
    
    ///////////////////
    //uwp Bridge
    ///////////////////
    //javascript to uwp
    function request_toUwp(input_method, input_type_reader) {
        //window.external.notify(data);
        // alert("start");
        // var result = AllowFromWebExample.getPlusResult(1, 2);
        // alert(result);

        // var result = window.HtmlCommunicator.getPlusResult(1, 2);   
        // alert(result);
        try {
            window.external.notify(JSON.stringify({ method: input_method, type_reader: input_type_reader, content: "this value is from webView." }));
          }
        catch(err) {
            //messagebox_show(false, "uwp error", err.message, null, false, true);
        }
    }   

    function stopWorker() {
        if (worker) {
            worker.terminate();
            worker = null;
        }
    }
    
    var worker;
    var timer_rfid;
    var buffer_rfdata = new Array();        //rf 수신 버퍼
    var isProcessRF = false;                //버퍼 사용 신호
    //uwp to javascript
    function jsondata_fromUwp(input_jsondata){
        //100개가 넘어가는 경우 먼저 읽은 데이터 삭제
        if (app_dialog_pop.table.rows().count() > 99) {
            app_dialog_pop.table.rows(0).remove();
        }


        var jsondata = JSON.parse(input_jsondata);
        if (jsondata.method == "error") {
            messagebox_show(false, "uwp error", jsondata.message, null, false, true);
        } else if (jsondata.method == "rf_reader_gun") {
            if (jsondata.message == "start") {          //하드웨어 버튼으로 읽기 시작
                document.getElementsByClassName('btn_rfid_inventorystart')[0].disabled = true;
                document.getElementsByClassName('btn_rfid_inventorystop')[0].disabled = false;
                document.getElementsByClassName('btn_rfid_inventorystart')[0].style.color = '#777777';
                document.getElementsByClassName('btn_rfid_inventorystop')[0].style.color = '#000000';
            } else if (jsondata.message == "stop") {    //하드웨어 버튼으로 읽기 중지
                document.getElementsByClassName('btn_rfid_inventorystart')[0].disabled = false;
                document.getElementsByClassName('btn_rfid_inventorystop')[0].disabled = true;
                document.getElementsByClassName('btn_rfid_inventorystart')[0].style.color = '#000000';
                document.getElementsByClassName('btn_rfid_inventorystop')[0].style.color = '#777777';
            }
        } else if (jsondata.method == "rf_receivedata") {
            for (var i = 0; i < jsondata.app_data.length; i++) {
                var row_item = {
                    no: jsondata.app_data[i].id,
                    rf_value: jsondata.app_data[i].code,
                    rf_regist_datetime: jsondata.app_data[i].datetime
                }
    
                app_dialog_pop.table.row.add(row_item);    //gui 추가
            }
            if (jsondata.app_data.length > 0){
                //$($.fn.dataTable.tables(true)).DataTable().columns.adjust();
                app_dialog_pop.table.draw();
                $('.dataTables_scrollBody').scrollTop($('.dataTables_scrollBody')[0].scrollHeight);     //스크롤 하단으로 이동
                //document.getElementsByClassName("modal-window")[0].scrollTop = 0;
                // var nRow = app_dialog_pop.table.rows().count() - 1;
                
                // $('td', nRow).css('background-color', 'Red');
                //app_dialog_pop.table.order([0, 'desc']).draw();
            }
        }

        


    //     $('.dataTables_scrollBody').scrollTop($('.dataTables_scrollBody')[0].scrollHeight);
        
    // } );
    
        // var jsondata = JSON.parse(input_jsondata);        
        // var sendData = {
        //     no: jsondata.id,
        //     rf_value: jsondata.code,
        //     rf_regist_datetime: jsondata.datetime
        // }

        // if (jsondata.state == "error") {
        //     messagebox_show(false, "uwp error", jsondata.message, null, false, true);
        //     return;
        // }
      
        // app_dialog_pop.table.row.add(sendData).draw();    //gui 추가

        //test
        // var text1 = jsondata.id;
        // document.getElementById('id_hybrid_test').textContent = text1;

        
        // //버퍼 사용 신호를 준 후 버퍼에 데이터 추가
        // while(true) {
        //     if (isProcessRF == false) {
        //         isProcessRF = true;

        //         /////////////////////////////////////////////////////////////////////
        //         buffer_rfdata.push(sendData);
        //         /////////////////////////////////////////////////////////////////////

        //         isProcessRF = false;
        //         break;
        //     }

        //     setTimeout(function() {
        //     }, 100);
        // }
        
        
        //app_dialog_pop.table.clear().rows.add(sendData).draw();
        //document.getElementById('id_hybrid_test').textContent = sequence + " " + tag_data;


        // var get_dcount = app_dialog_pop.table.data().count();
        // if (get_dcount > 5) {
        //     app_dialog_pop.table.row(get_dcount - 1).remove().draw();
        //     //app_dialog_pop.dataset.row(0).remove();
        // }



        // worker.postMessage(sendData);
        //var text1 = sendData.no + ", " + sendData.rf_value + ", " + sendData.rf_regist_datetime;        
    }

    ///////////////////
    //xamarin Bridge
    ///////////////////
    // function invokeCSCode(data) {
    //     try {
    //         log("Sending Data:" + data);
    //         invokeCSharpAction(data);
    //     }
    //     catch (err){
    //           log(err);
    //     }
    // }













///////////////////
//chrome serial
///////////////////
var connectionId;

function getSerialDevices() {
    var list = [];

    chrome.serial.getDevices(function(devices) {
        for (var i = 0; i < devices.length; i++) {
            list.push($('select#portList').append('<option value="' + devices[i].path + '">' + devices[i].path + '</option>'));
        }
    });
}

function getSerialDevices1() {
    // ui hook
    $('button#open').click(function() {
        var clicks = $(this).data('clicks');

        if (!clicks) {
            var port = $('select#portList').val();
            chrome.serial.connect(port, {bitrate: 9600}, function(info) {
                connectionId = info.connectionId;
                $("button#open").html("Close Port");
                console.log('Connection opened with id: ' + connectionId + ', Bitrate: ' + info.bitrate);
            });
        } else {
            chrome.serial.disconnect(connectionId, function(result) {
                $("button#open").html("Open Port");
                console.log('Connection with id: ' + connectionId + ' closed');
            });
        }

        $(this).data("clicks", !clicks);
    });
}



// ////////////////
// //css 추가
// ////////////////
// var dialog1_css;
// if (!document.getElementById(dialog1_css)){
//   var head  = document.getElementsByTagName('head')[0];
//     var link  = document.createElement('link');    
//     link.id   = dialog1_css;
//     link.rel  = 'stylesheet';
//     link.type = 'text/css';
//     link.href = '/css/dialog1.css';
//     link.media = 'all';
//     head.appendChild(link);
// }