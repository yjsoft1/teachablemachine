var list_users;             //모든 사용자 정보
var isUseGrid = true;       //모눈 사용 여부
var grid_gap = 10;          //모눈의 크기 설정   
var isShowGrid = false;         //모눈의 보여짐 여부
var isEnableElement = true;  //클릭하여 사용자 정보 보기
var isMoveElement = true;   //클릭하여 Element 이동하기
// var scaleFactor = 1.1;      //마우스 휠 줌인 아웃

$(document).ready(function(e) {    
    grid_gap = sessionStorage.getItem("snap_size");
    if (grid_gap == null || grid_gap == "undefined")
        grid_gap = 10;
    else
        grid_gap = Number(grid_gap);

    current_userinfo = null;
    sessionStorage.setItem("canvas_menu", "isShowUserInfo");    

    //관리자 메뉴 표시
    var getUserInfo = parseJwt(sessionStorage.getItem(token_yj_rfms));
    if (getUserInfo != null) {
        if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
        //document.getElementsByClassName('wrap_image_click_state')[0].style.display = "block";
        document.getElementsByClassName('wrap_image_click_state')[0].style.display = "flex";

        //모눈 그리기
        draw_grid();
        isShowGrid = true;
      }
    }

    var os_value = getOS();
    if(os_value == "Windows") {
        //관리자 메뉴 기능
        document.getElementsByClassName('image_view_state_show_grid')[0].addEventListener('click', function() {
            //sessionStorage.setItem("canvas_menu", "isSelectUser");
            if (isShowGrid == false) {
                draw_grid();
            } else {
                remove_grid();
            }
        }, false);
        document.getElementsByClassName('image_view_state_select_userinfo')[0].addEventListener('click', function() {
            sessionStorage.setItem("canvas_menu", "isSelectUser");
        }, false);
        document.getElementsByClassName('image_view_state_info_userinfo')[0].addEventListener('click', function() {
            sessionStorage.setItem("canvas_menu", "isShowUserInfo");
        }, false);
        document.getElementsByClassName('image_view_state_move_userinfo')[0].addEventListener('click', function() {
            sessionStorage.setItem("canvas_menu", "isMoveUserElement");
        }, false);
        document.getElementsByClassName('image_view_state_add_userinfo')[0].addEventListener('click', function(e) {
            sessionStorage.setItem("canvas_menu", "isAddUserElement");

            //show add gui
            userinfo_show_add(false, "담당자 정보", "확인버튼을 터치하시면 이전의 화면으로 되돌아 갑니다.", null, false, e);
        }, false);    
        document.getElementsByClassName('image_view_state_remove_userinfo')[0].addEventListener('click', function(e) {
            removeUserInfo();
        }, false);   
    } else {
        //관리자 메뉴 기능
        document.getElementsByClassName('image_view_state_show_grid')[0].addEventListener('touchstart', function() {
            //sessionStorage.setItem("canvas_menu", "isSelectUser");
            if (isShowGrid == false) {
                draw_grid();
            } else {
                remove_grid();
            }
        }, false);

        document.getElementsByClassName('image_view_state_select_userinfo')[0].addEventListener('touchstart', function() {
            sessionStorage.setItem("canvas_menu", "isSelectUser");
        }, false);
        document.getElementsByClassName('image_view_state_info_userinfo')[0].addEventListener('touchstart', function() {
            sessionStorage.setItem("canvas_menu", "isShowUserInfo");
        }, false);
        document.getElementsByClassName('image_view_state_move_userinfo')[0].addEventListener('touchstart', function() {
            sessionStorage.setItem("canvas_menu", "isMoveUserElement");
        }, false);
        document.getElementsByClassName('image_view_state_add_userinfo')[0].addEventListener('touchstart', function(e) {
            sessionStorage.setItem("canvas_menu", "isAddUserElement");
    
            //show add gui
            userinfo_show_add(false, "담당자 정보", "확인버튼을 터치하시면 이전의 화면으로 되돌아 갑니다.", null, false, e);
        }, false);    
        document.getElementsByClassName('image_view_state_remove_userinfo')[0].addEventListener('touchstart', function(e) {
            removeUserInfo();
        }, false); 
    }

    

    function removeUserInfo() {
        var canvas_main = document.getElementById('userscanvas_main');
        var get_elements = canvas_main.getElementsByClassName("user_info_canvas_label_text_no")

        var isChekedElement = false;
        for (var i = 0; i<get_elements.length; i++){
            var selected_element = get_elements[i].parentElement.parentElement.getElementsByClassName("user_info_template_content_1")[0];
            if (selected_element.style.backgroundColor == "rgb(120, 255, 84)") {
                isChekedElement = true;
            }
        }
        if (isChekedElement == false) {
            messagebox_show(false, "데이터 삭제", "선택된 사용자 정보가 존재하지 않습니다.", null, false, false);
            return;
        }


        messagebox_show(true, "데이터 삭제", "선택하신 정보를 모두 삭제합니다. 계속하시겠습니까?", function(e) {
            if (e == "ok") {
                //선택한 정보 가져오기
                var sendData = new Array();
                //gui 삭제                
                for (var i = 0; i<get_elements.length; i++){
                    var selected_element = get_elements[i].parentElement.parentElement.getElementsByClassName("user_info_template_content_1")[0];
                    if (selected_element.style.backgroundColor == "rgb(120, 255, 84)") {
                        sendData.push(get_elements[i].textContent);

                        canvas_main.removeChild(selected_element.parentElement.parentElement);
                        i--;
                    }
                }

                //indexed DB delete
                indexedDB_open(function(e) {
                    var transaction = e.transaction(["yj_member"], "readwrite");
                    var store = transaction.objectStore("yj_member");

                    //db삭제
                    for (var i = 0; i<sendData.length; i++){
                        var request = store.delete(Number(sendData[i]));
                    }

                    //결과 출력
                    messagebox_show(false, "데이터 삭제 완료", "데이터가 삭제 되었습니다.", null, false, false);
                });
            }
        }, false, false);
    }

    //get template
    var canvas_main = document.getElementById('userscanvas_main');    
    var template1 = document.getElementsByClassName("user_info_template_1")[0];     //get user_info_template_1
    var template2 = document.getElementsByClassName("user_info_template_2")[0];     //get user_info_template_2
    var template3 = document.getElementsByClassName("user_info_template_3")[0];     //get user_info_template_3
    var template4 = document.getElementsByClassName("user_info_template_4")[0];     //get user_info_template_4
    var template5 = document.getElementsByClassName("user_info_template_5")[0];     //get user_info_template_5    
    // var canvas_grid_gap_x = canvas_main.offsetWidth / 50;
    // var canvas_grid_gap_y = canvas_main.offsetHeight / 50;






    //사용자 데이터 수신

    //indexed db select all
    var list_memberinfo = new Array();

    indexedDB_open(function(e) {
        var transaction = e.transaction(["yj_member"], "readwrite");
        var store = transaction.objectStore("yj_member");

        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var memberinfo = {
                    no: cursor.key,
                    select: false,
                    mb_id: cursor.value.mb_id,
                    mb_password: cursor.value.mb_password,
                    mb_name: cursor.value.mb_name,
                    mb_email: cursor.value.mb_email,
                    mb_tel: cursor.value.mb_tel,
                    mb_mobile: cursor.value.mb_mobile,
                    mb_sex: cursor.value.mb_sex,
                    mb_mobile: cursor.value.mb_mobile,
                    mb_addr_1: cursor.value.mb_addr_1,
                    mb_addr_2: cursor.value.mb_addr_2,
                    mb_addr_2: cursor.value.mb_addr_3,
                    mb_regist_datetime: cursor.value.mb_regist_datetime,
                    mb_lastsave_datetime: cursor.value.mb_lastsave_datetime,
                    mb_out_datetime: cursor.value.mb_out_datetime,
                    mb_userinfo_delete: cursor.value.mb_userinfo_delete,
                    mb_license: cursor.value.mb_license,
                    mb_license_date: cursor.value.mb_license_date,
                    mb_sns: cursor.value.mb_sns,
                    mb_image: cursor.value.mb_image,
                    mb_auth: cursor.value.mb_auth,
                    mb_dept: cursor.value.mb_dept,
                    mb_position: cursor.value.mb_position,
                    mb_statususer: cursor.value.mb_statususer,
                    mb_type: cursor.value.mb_type,
                    mb_task_1: cursor.value.mb_task_1,
                    mb_task_2: cursor.value.mb_task_2,
                    mb_task_3: cursor.value.mb_task_3,
                    mb_task_4: cursor.value.mb_task_4,
                    mb_x: cursor.value.mb_x,
                    mb_y: cursor.value.mb_y,
                    mb_scale: cursor.value.mb_scale,
                    mb_code_device: cursor.value.mb_code_device,
                    mb_etc: cursor.value.mb_etc
                };
                list_memberinfo.push(memberinfo);

                cursor.continue();
            } else {
                //수신한 사용자 데이터
                list_users = list_memberinfo;                

                //사용자 그리기
                create_Element(list_users, canvas_main, template1, template2, template3, template4, template5);
            }
         };
    });

    // //사용자 데이터 수신
    // var url = url_json + "jsonservice/rest/user/select_userinfo_all";
    // JSON_POST(url, null, true, sessionStorage.getItem(token_yj_rfms), function (result) {
    //     setTimeout(function() {
    //         //json 데이터 수신 후 테이블 생성하기
    //         if (result[0] == "ok") {
    //             //수신한 사용자 데이터
    //             list_users = result[1];                

    //             //사용자 그리기
    //             create_Element();
    //             //create_Element(users, template2);
    //         } else {                                
    //             messagebox_show(false, "데이터 가져오기 실패", result, null, false, false);
    //         }
            
    //         // //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
    //         // setPaginateCount(5);                                                                    //paginate size                    
    //         // if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
    //         //     setView_cardview();                                                                 //카드뷰로설정                        
    //         //     setPaginateCount(5);                                                                //paginate size
    //         // }
    //     }, 0);                                                                                    //지연시켜서 메시지박스를 호출하지 않으면 메시지 박스 내용(텍스트)가 변경되지 않음 
    // });


    
});









//사용자 그리기
function create_Element(list_users, canvas_main, template1, template2, template3, template4, template5) {
    var current_menu_string = sessionStorage.getItem("current_menu");

    for (var i=0; i<list_users.length; i++) {
        //mb_statususer에 해당되는 페이지 확인
        var get_su_name = "";
        for (var k=0; k<list_statususerinfo.length; k++) {
            //if (list_users[i].mb_statususer == list_statususerinfo[k].su_pagename) {
            if (list_users[i].mb_statususer == list_statususerinfo[k].su_name) {
                get_su_name = list_statususerinfo[k].su_pagename;
            }
        }

        //페이지 별 출력
        if (get_su_name != current_menu_string){
            continue;
        }
        
        var getElement = template1.cloneNode(true);      //create element

        //create template
        if (list_users[i].mb_type != null) {
            if (list_users[i].mb_type == "type1") {
                getElement = template1.cloneNode(true);      //create element
            } else if (list_users[i].mb_type == "type2") {
                getElement = template2.cloneNode(true);      //create element
            } else if (list_users[i].mb_type == "type3") {
                getElement = template3.cloneNode(true);      //create element
            } else if (list_users[i].mb_type == "type4") {
                getElement = template4.cloneNode(true);      //create element
            } else if (list_users[i].mb_type == "type5") {
                getElement = template5.cloneNode(true);      //create element
            }
        } else {
            getElement = template1.cloneNode(true);      //create element
        }

        getElement.style.display = "block"; 
        
        canvas_main.appendChild(getElement);            //add gui  
        dragElement(getElement);                        //set drag
        setElement_init(getElement, list_users[i]);     //set data
    }
}

//elelment 드래그이벤트 설정
function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (document.getElementById(element.id)) {
        var os_value = getOS();
        if(os_value == "Windows") {
            document.getElementById(element.id).addEventListener('click', function(e) {
                dragMouseDown(e);
            });
        } else {
            document.getElementById(element.id).addEventListener('touchstart', function(e){
                dragMouseDown(e);
            }, false);
        }
    } else {
        var os_value = getOS();
        if(os_value == "Windows") {
            element.onmousedown = dragMouseDown;            
        } else {
            element.ontouchstart = dragMouseDown;
        }
    }

    function dragMouseDown(e) {
        sessionStorage.setItem("pause_time", page_pause_time);		//환경설정(사용자 터치 대기)에 설정된 시간 동안 메인 페이지 이동 대기

        if (sessionStorage.getItem("canvas_menu") == "isShowUserInfo") {
            //중복 터치 막기
            if (sessionStorage.getItem("isTouched") == "true") {
                return;
            }
            
            sessionStorage.setItem("isTouched", "true");            //터치 안되게 적용
            setTimeout(function() {                                 //0.2초 후 터치 가능 상태로 변경
                sessionStorage.setItem("isTouched", "false");
            }, 200);

            //기능 실행
            if (isEnableElement == true) {
                userinfo_show(false, "담당자 정보", "확인버튼을 터치하시면 이전의 화면으로 되돌아 갑니다.", null, false, e);
            }

            return; 
        } else if (sessionStorage.getItem("canvas_menu") == "isSelectUser") {
            //색상 변경하기
            var selected_element = e.target.parentElement.parentElement.parentElement.getElementsByClassName("user_info_template_content_1")[0];
            if (selected_element.style.backgroundColor != "rgb(120, 255, 84)") {
                selected_element.style.backgroundColor = "rgb(120, 255, 84)";
            } else {
                selected_element.style.backgroundColor = "#f1f1f1";
            }
            return;
        }

        //드래그
        if (isMoveElement == false) {
            return;
        }

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        // pos3 = e.clientX;
        // pos4 = e.clientY;        

        var os_value = getOS();
        if(os_value == "Windows") {
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        } else {
            pos3 = e.changedTouches[0].clientX;
            pos4 = e.changedTouches[0].clientY;

            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }

        // document.onmouseup = closeDragElement;
        // // call a function whenever the cursor moves:
        // document.onmousemove = elementDrag;
    }

    function snapToGrid(input_x, input_y) {
        var point = new Array();
        
        if (grid_gap == 0) {
            point[0] = input_x;
            point[1] = input_y;
        } else {
            // point[0] = canvas_grid_gap_x * Math.round(input_x / canvas_grid_gap_x);
            // point[1] = canvas_grid_gap_y * Math.round(input_y / canvas_grid_gap_y);
            point[0] = grid_gap * Math.round(input_x / grid_gap);
            point[1] = grid_gap * Math.round(input_y / grid_gap);
        }

        return point;
    }
    
    function elementDrag(e) {
        // e = e || window.event;
        // e.preventDefault();

        //모눈 적용
        var getSnapPoint = null;
        if (isUseGrid == true) {
            var os_value = getOS();
            if(os_value == "Windows") {
                getSnapPoint = snapToGrid(e.clientX, e.clientY);
            } else {
                getSnapPoint = snapToGrid(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        }

        // calculate the new cursor position:
        pos1 = pos3 - getSnapPoint[0];        //이전위치에서 현재 이동된 위치사이의 거리를 계산
        pos2 = pos4 - getSnapPoint[1];
        pos3 = getSnapPoint[0];               //현재 위치 저장
        pos4 = getSnapPoint[1];
        // set the element's new position:            
        var getSnapPoint_offset = snapToGrid(element.offsetLeft, element.offsetTop);
        element.style.left = (getSnapPoint_offset[0] - pos1) + "px";
        element.style.top = (getSnapPoint_offset[1] - pos2) + "px";


        //부모 엘리먼트의 박스를 넘어가지 않도록 함
        checkRectangle(element);
    }

    //부모 엘리먼트의 박스를 넘어가지 않도록 함
    function checkRectangle(element) {
        var canvas_main = document.getElementById('userscanvas_main');
        var parentElement = canvas_main;
        var parentPos = parentElement.getBoundingClientRect();
        var childPos = element.getBoundingClientRect();

        if (childPos.left < parentPos.left) {                //좌
            element.style.left = (0 + parentPos.left) + "px";
        }

        if (childPos.top < parentPos.top) {                  //상
            element.style.top = 0 + "px";
        }
        // if (childPos.top < parentPos.top) {                  //상
        //     element.style.top = (0 + parentPos.top) + "px";
        // }

        if (childPos.right > parentPos.right) {              //우
            element.style.left = (parentPos.right - element.offsetWidth) + "px";
        }

        if (childPos.top > parentPos.height - footer.clientHeight - element.offsetHeight) {            //하
            element.style.top = ((parentPos.height - parentPos.top) - footer.clientHeight - element.offsetHeight) + "px";
        }        
        // if (childPos.top > parentPos.height - footer.clientHeight - element.offsetHeight) {            //하
        //     element.style.top = (parentPos.height - footer.clientHeight - element.offsetHeight) + "px";
        // }
    }

    function closeDragElement(e) {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;

        //mouse up 상대좌표 (parent = userscanvas_main)
        var canvas_main = document.getElementById('userscanvas_main');
        var parentPos = canvas_main.getBoundingClientRect();
        //var childrenPos = document.getElementById('user_info_wrap').getBoundingClientRect();
        var childrenPos = e.srcElement.getBoundingClientRect();
        var relativePos = {};

        relativePos.top = childrenPos.top - parentPos.top,
        relativePos.right = childrenPos.right - parentPos.right,
        relativePos.bottom = childrenPos.bottom - parentPos.bottom,
        relativePos.left = childrenPos.left - parentPos.left;

        //db에 저장
        //var get_selected_no = e.target.parentElement.parentElement.getElementsByClassName("user_info_canvas_label_text_no")[0].textContent;   //no 가져오기
        var get_selected_no = e.target.parentElement.parentElement.parentElement                  //no 가져오기
        .getElementsByClassName("user_info_template_content_2")[0]
        .getElementsByClassName("user_info_canvas_label_text_no")[0].textContent;
        
        if (get_selected_no == "user no") {
            messagebox_show(false, "위치정보 저장 실패", "고유번호를 가져오지 못했습니다. 마우스로 Element를 선택 후 다시 이동하여 위치정보를 저장하여 주시기 바랍니다.", null, false, false);
            return;
        }

        var get_selected_userinfo = find_userinfo(get_selected_no);
        get_selected_userinfo.mb_x = e.target.parentElement.parentElement.parentElement.style.left;
        get_selected_userinfo.mb_y = e.target.parentElement.parentElement.parentElement.style.top;

        if (get_selected_userinfo.mb_x == "") 
            get_selected_userinfo.mb_x = e.target.parentElement.parentElement.parentElement.parentElement.style.left;

        if (get_selected_userinfo.mb_y == "") 
            get_selected_userinfo.mb_y = e.target.parentElement.parentElement.parentElement.parentElement.style.top;

        if (get_selected_userinfo.mb_x == "") {
            messagebox_show(false, "위치정보 저장 실패", "x좌표값을 가져오지 못했습니다.", null, false, false);
            return;
        }
        if (get_selected_userinfo.mb_y == "") {
            messagebox_show(false, "위치정보 저장 실패", "y좌표값을 가져오지 못했습니다.", null, false, false);
            return;
        }

        send_xyinfo(get_selected_userinfo);
    }
}

//빈 템플릿에 데이터 적용하기
function setElement_init(input_element, users) {
    //mouse up 상대좌표 (parent = userscanvas_main)
    var canvas_main = document.getElementById('userscanvas_main');  
    var parentElement = canvas_main;
    var childElement = input_element;
    var parentPos = parentElement.getBoundingClientRect();

    //좌표 설정
    // childElement.style.left = parseInt(users.mb_x, 10) + "px";
    // childElement.style.top = parseInt(users.mb_y, 10) + "px";
    childElement.style.left = (parseInt(users.mb_x, 10) + parseInt(canvas_marginleft)) + "px";
    childElement.style.top = (parseInt(users.mb_y, 10) +  parseInt(canvas_margintop)) + "px";

    //image 설정
    if (users.mb_image != null) {
        if (users.mb_image != "") {
            childElement.getElementsByClassName("user_info_template_content_image")[0].src= users.mb_image;
        }        
    }

    //Content 설정
    childElement.getElementsByClassName("user_info_canvas_label_text_no")[0].textContent = users.no;
    childElement.getElementsByClassName("user_info_canvas_label_text_title")[0].textContent = users.mb_name;
    childElement.getElementsByClassName("user_info_canvas_label_text_content1")[0].textContent = users.mb_position;
    childElement.getElementsByClassName("user_info_canvas_label_text_content2")[0].textContent = users.mb_task_1;
    childElement.getElementsByClassName("user_info_canvas_label_text_content3")[0].textContent = users.mb_task_2;
    
    //엘리먼트 크기 설정
    input_element.style.transform = set_element_scale(users.mb_scale);   //set scale
}

function set_element_scale(input_scale) {
    var rValue = input_scale;

    if (IsNullOrWhiteSpace(input_scale)) {         //크기 값이 없는 경우 1로 설정
        rValue = 1;
    } else if (input_scale == 0) {             //최소 크기 설정
        rValue = 1;
    }
    
    return "scale(" + rValue + ")";
}

//xy 정보 업데이트
function send_xyinfo(input_userinfo) {
    // if (sendData[0] == "") {
    //     messagebox_show(false, "데이터 입력", "고유번호가 없습니다.", null, false, false);
    //     return;
    // }

    if (input_userinfo.mb_x.trim() == "") {
        messagebox_show(false, "데이터 입력", "x 좌표가 없습니다.", null, false, false);
        return;
    }

    if (input_userinfo.mb_y.trim() == "") {
        messagebox_show(false, "데이터 입력", "y 좌표가 없습니다.", null, false, false);
        return;
    }

    //indexed db create, edit
    indexedDB_open(function(e) {
        var transaction = e.transaction(["yj_member"], "readwrite");
        var store = transaction.objectStore("yj_member");
        var request = store.get(input_userinfo.no);
        

        request.onerror = function(e) {
            //  console.log("Error",e.target.error.name);
        }
        
        request.onsuccess = function(e) {                        
            //db update
            var data = e.target.result;

            data.mb_x = input_userinfo.mb_x;
            data.mb_y = input_userinfo.mb_y;

            var objRequest = store.put(data);

           // messagebox_show(false, "데이터 저장", "사용자 정보가 수정되었습니다.", null, false, false);
        }
    });


    // //JSON
    // var url = url_json + "jsonservice/rest/user/update_xy";
    // JSON_POST(url, sendData, false, sessionStorage.getItem(token_yj_rfms), function (result) {
    //     if (result[0] == "ok") {
    //         //messagebox_show(false, "데이터 저장", "저장되었습니다.", null, false, false);
    //     } else {            
    //         messagebox_show(false, "좌표 저장 실패", result, null, false, false);
    //     }
    // });
}

//사용자 정보 반환
function find_userinfo(input_no) {
    var rValue;
    for (var i =0; i<list_users.length; i++) {
        if (list_users[i].no == input_no) {
            rValue = list_users[i];
            break;
        }
    }

    return rValue;
}


function userinfo_show_add(visible_oneButton, title, content, result, visible_spinner, e) {
    document.getElementsByClassName('userimage_main')[0].src = "/images/user_sample.png";

    //content 적용
    document.getElementById('dialog_write_name').value = "";
    document.getElementById('dialog_write_position').value = "";
    document.getElementById('dialog_write_mobile').value = "";
    document.getElementById('dialog_write_task_1').value = "";
    document.getElementById('dialog_write_task_2').value = "";
    document.getElementById('dialog_write_task_3').value = "";
    document.getElementById('dialog_write_task_4').value = "";
    document.getElementById('dialog_write_type').value = "";
    document.getElementById('dialog_write_scale').value = "";

    set_gui_admin(false);

    //초기화
    selectPosition(null);                                                   //직급
    document.getElementById("dialog_write_type").selectedIndex = 0;         //type
    document.getElementById("dialog_write_scale").selectedIndex = 6;        //크기

    //dialog 생성여부 확인
    var dialog_userscanvas = document.getElementById("dialog_userscanvas");
    if (dialog_userscanvas != null) {
        dialog_userscanvas.classList.add('dialog-container--visible');
        dialog_userscanvas.style.zIndex = 5001;
    }

    if (document.getElementById('dialog-title1-userscanvas') == null)
    return;

    // dialog 내용 변경
    document.getElementById('dialog-title1-userscanvas').textContent = title;
    if (Array.isArray(content) == true) {
        document.getElementById('dialog-title2-userscanvas').textContent = content[1];
        document.getElementById('dialog-title2-userscanvas_hidden_status').textContent = content[0];
    } else {
        document.getElementById('dialog-title2-userscanvas').textContent = content;
    }

    if (visible_oneButton) {
        document.getElementById('btnSave_userscanvas').style.display = "inline-block";
        document.getElementById('btnCancel_userscanvas').style.display = "inline-block";

        document.getElementById('btnSave_userscanvas').style.display = 'inline-block';
        document.getElementById('btnCancel_userscanvas').textContent = "취소";
    } else {
        document.getElementById('btnSave_userscanvas').style.display = 'none';
        document.getElementById('btnCancel_userscanvas').textContent = "확인";

        // //body scoll on
        // scroll_body_on_off(true);
    }

    if (visible_spinner) {
        document.getElementById('loading_spinner_userscanvas').style.display = "inline-block";
        document.getElementById('btnSave_userscanvas').style.display = "none";
        document.getElementById('btnCancel_userscanvas').style.display = "none";
    } else {
        document.getElementById('loading_spinner_userscanvas').style.display = "none";
    }

    document.getElementById('btnSave_userscanvas').focus();

    //확인 메시지 (custom event message 이벤트 수신)
    document.getElementById('btnSave_userscanvas').removeEventListener('event_userscanvas', function(e) {
    }, false);
    document.getElementById('btnSave_userscanvas').addEventListener('event_userscanvas', function(e) {
        result(e.detail.message);
    }, false);    

    document.getElementById('dialog-title1-userscanvas').textContent = "담당자 추가";

    document.getElementById('btnSave_userscanvas').style.display = "inline-block";
    document.getElementById('btnCancel_userscanvas').textContent = "취소";
}


//사용자 정보 보기
// function userinfo_show(visible_oneButton, title, content, result, visible_spinner) {
function userinfo_show(visible_oneButton, title, content, result, visible_spinner, e) {
    //userinfo content
    //사용자 정보 가져오기
    var get_selected_no = e.target.parentElement.parentElement.parentElement                  //no 가져오기
    .getElementsByClassName("user_info_template_content_2")[0]
    .getElementsByClassName("user_info_canvas_label_text_no")[0].textContent;
    
    if (get_selected_no == "user no") {
        //messagebox_show(false, "사용자 정보 오류", "고유번호를 가져오지 못했습니다.", null, false, false);
        return;
    }

    //content 적용        
    var get_selected_userinfo = find_userinfo(get_selected_no);
    this.current_userinfo = null;
    this.current_userinfo = get_selected_userinfo;

    selectPosition(get_selected_userinfo);

    //image 설정
    document.getElementsByClassName('userimage_main')[0].src = "/images/user_sample.png";
    if (get_selected_userinfo.mb_image != null) {
        if (get_selected_userinfo.mb_image != "") {
            document.getElementsByClassName('userimage_main')[0].src = get_selected_userinfo.mb_image;
        }     
    }  
    
    document.getElementById('dialog_write_name').value = get_selected_userinfo.mb_name;
    document.getElementById('dialog_write_position').value = get_selected_userinfo.mb_position;
    document.getElementById('dialog_write_mobile').value = get_selected_userinfo.mb_mobile;
    document.getElementById('dialog_write_task_1').value = get_selected_userinfo.mb_task_1;
    document.getElementById('dialog_write_task_2').value = get_selected_userinfo.mb_task_2;
    document.getElementById('dialog_write_task_3').value = get_selected_userinfo.mb_task_3;
    document.getElementById('dialog_write_task_4').value = get_selected_userinfo.mb_task_4;        
    document.getElementById('dialog_write_type').value = get_selected_userinfo.mb_type;
    document.getElementById('dialog_write_scale').value = get_selected_userinfo.mb_scale;




    //dialog 생성여부 확인
    var dialog_userscanvas = document.getElementById("dialog_userscanvas");
    if (dialog_userscanvas != null) {
        dialog_userscanvas.classList.add('dialog-container--visible');
        dialog_userscanvas.style.zIndex = 5001;
    }

    if (document.getElementById('dialog-title1-userscanvas') == null)
    return;

    // dialog 내용 변경
    document.getElementById('dialog-title1-userscanvas').textContent = title;
    if (Array.isArray(content) == true) {
        document.getElementById('dialog-title2-userscanvas').textContent = content[1];
        document.getElementById('dialog-title2-userscanvas_hidden_status').textContent = content[0];
    } else {
        document.getElementById('dialog-title2-userscanvas').textContent = content;
    }

    if (visible_oneButton) {
        document.getElementById('btnSave_userscanvas').style.display = "inline-block";
        document.getElementById('btnCancel_userscanvas').style.display = "inline-block";

        document.getElementById('btnSave_userscanvas').style.display = 'inline-block';
        document.getElementById('btnCancel_userscanvas').textContent = "취소";
    } else {
        document.getElementById('btnSave_userscanvas').style.display = 'none';
        document.getElementById('btnCancel_userscanvas').textContent = "확인";

        // //body scoll on
        // scroll_body_on_off(true);
    }

    if (visible_spinner) {
        document.getElementById('loading_spinner_userscanvas').style.display = "inline-block";
        document.getElementById('btnSave_userscanvas').style.display = "none";
        document.getElementById('btnCancel_userscanvas').style.display = "none";
    } else {
        document.getElementById('loading_spinner_userscanvas').style.display = "none";
    }

    document.getElementById('btnSave_userscanvas').focus();

    //확인 메시지 (custom event message 이벤트 수신)
    document.getElementById('btnSave_userscanvas').removeEventListener('event_userscanvas', function(e) {
    }, false);
    document.getElementById('btnSave_userscanvas').addEventListener('event_userscanvas', function(e) {
        result(e.detail.message);
    }, false);    
}


function selectPosition(get_selected_userinfo) {
    //indexed db select all
    var list_positioninfo = new Array();
    
    indexedDB_open(function(e) {
        var transaction = e.transaction(["yj_position"], "readwrite");
        var store = transaction.objectStore("yj_position");

        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var positioninfo = {
                    no: cursor.key,
                    select: false,
                    po_name: cursor.value.po_name,
                    po_regist_datetime: cursor.value.po_regist_datetime,
                    po_lastsave_datetime: cursor.value.po_lastsave_datetime,
                    po_image: cursor.value.po_image,
                    po_etc: cursor.value.po_etc,
                };
                list_positioninfo.push(positioninfo);

                cursor.continue();
            } else {
                //GUI 적용
                $('#dialog_write_position').empty()
                var selectElement = document.getElementById('dialog_write_position');
                for (var i = 0; i<list_positioninfo.length; i++){
                    //셀렉트 리스트 추가
                    var opt = document.createElement('option');
                    opt.value = i + 1;
                    opt.innerHTML = list_positioninfo[i].po_name;
                    selectElement.appendChild(opt);

                    //아이템 선택
                    if (get_selected_userinfo != null) {
                        if (list_positioninfo[i].po_name == get_selected_userinfo.mb_position) {
                            selectElement.selectedIndex = i;
                        }
                    }
                    

                    // //관리자 권한일경우
                    // if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
                    //     opt.disabled = true;
                    // }
                }

                //select element 클릭 안되게 
                if (get_selected_userinfo != null) {
                    $('#dialog_write_position').css('pointer-events','none');
                } else {
                    $('#dialog_write_position').css('pointer-events','auto');
                }
                
            }
         };
    });

    // var url = url_json + "jsonservice/rest/position/select_positioninfo_all";
    // JSON_POST(url, null, true, sessionStorage.getItem(token_yj_rfms), function (result) {
    //     setTimeout(function() {
    //         //json 데이터 수신 후 옵션 항목 추가
    //         if (result[0] == "ok") {
    //             $('#dialog_write_position').empty()
    //             var selectElement = document.getElementById('dialog_write_position');
    //             for (var i = 0; i<result[1].length; i++){
    //                 //셀렉트 리스트 추가
    //                 var opt = document.createElement('option');
    //                 opt.value = i + 1;
    //                 opt.innerHTML = result[1][i].po_name;
    //                 selectElement.appendChild(opt);

    //                 //아이템 선택
    //                 if (result[1][i].po_name == get_selected_userinfo.mb_position) {
    //                     selectElement.selectedIndex = i;
    //                 }

    //                 // //관리자 권한일경우
    //                 // if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
    //                 //     opt.disabled = true;
    //                 // }
    //             }

    //             //select element 클릭 안되게 
    //             $('#dialog_write_position').css('pointer-events','none');
                                    
    //             //selectElement.selectedIndex = 0;    //인덱스는 다이어로그가 보이는 시점에서 재설정 됨 (window.addEventListener('message', function(event) { 함수 확인)
    //         } else {                                
    //             messagebox_show(false, "데이터 가져오기 실패", result, null, false, false);
    //         }
    //     }, 0);                                                                                    //지연시켜서 메시지박스를 호출하지 않으면 메시지 박스 내용(텍스트)가 변경되지 않음 
    // });
}

//캔버스에 모눈 그리기
function draw_grid() {
    isShowGrid = true;

    var canvas_main = document.getElementById('userscanvas_main');
    var canvas_height = canvas_main.offsetHeight;
    var canvas_width = canvas_main.offsetWidth;    

    var h_quotient = parseInt(canvas_height / grid_gap);
    var w_quotient = parseInt(canvas_width / grid_gap);

    //가로줄 그리기
    var y_value = 0;
    for (var i=0; i<h_quotient + 1; i++) {        
        drawline(0, y_value, canvas_width, y_value, "userscanvas_main");
        y_value = y_value + grid_gap;
    }
    //세로줄 그리기
    var x_value = 0;
    for (var i=0; i<w_quotient; i++) {
        x_value = x_value + grid_gap;
        drawline(x_value, 0, x_value, canvas_height, "userscanvas_main");
    }
    
}

//캔버스에 그려진 모눈 삭제
function remove_grid() {
    isShowGrid = false;

    $('.canvas_div_grid').remove();
}

function drawline(ax, ay, bx, by, divName) {
    if (ax > bx) {
        bx = ax + bx;
        ax = bx - ax;
        bx = bx - ax;
        by = ay + by;
        ay = by - ay;
        by = by - ay;
    }

    var angle = Math.atan((ay - by) / (bx - ax));
    angle = (angle * 180 / Math.PI);
    angle = -angle;
    var length = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
    var style = ""
    style += "left:" + (ax) + "px;"
    style += "top:" + (ay) + "px;"
    style += "width:" + length + "px;"
    style += "height:1px;"
    style += "background-color:#ececec;"
    style += "position:absolute;"
    style += "transform:rotate(" + angle + "deg);"
    style += "-ms-transform:rotate(" + angle + "deg);"
    style += "transform-origin:0% 0%;"
    style += "-moz-transform:rotate(" + angle + "deg);"
    style += "-moz-transform-origin:0% 0%;"
    style += "-webkit-transform:rotate(" + angle + "deg);"
    style += "-webkit-transform-origin:0% 0%;"
    style += "-o-transform:rotate(" + angle + "deg);"
    style += "-o-transform-origin:0% 0%;"
    // style += "-webkit-box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, .1);"
    // style += "box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, .1);"
    //style += "z-index:8888;"
    $("<div class=canvas_div_grid style='" + style + "'></div>").appendTo("#" + divName);
}