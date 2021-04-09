
var app_dialog;

$(document).ready(function() {
    loadScript("/js/table_style_manage.js", function(){
        //해쉬태그의 변화로 뒤로가기 구현
        //1. 게시판의 detail 화면을 볼때 고유번호를 hash 정보에 저장해둠
        //2. $("#content_main").load 기능을 이용하여 div의 내용만 변경
        //3. 뒤로가기를 선택할 경우 #view123 과 같은 번호가 사라짐을 hashchage 이벤트에서 감지
        //4. 게시판의 모든 데이터에서(클라이언트에서 다운로드 되어있는 리스트) 해당 내용 찾기
        //5. GUI에 데이터 적용
        // window.onpopstate = function(event) {
        //     var getUrl = document.location + "?" + JSON.stringify(event.state);
        //     this.location.href = getUrl;
        //     //alert(`location: ${document.location},    state: ${JSON.stringify(event.state)}`)
        // }

        jQuery(window).on('hashchange', function (e) {
            var hash_tag = location.hash.split("=");
            if (hash_tag[0] == "#view") {
                //id로 해당 정보 찾기
                var customClassInfo;
                var history_view;
                
                //리스트가 없는 경우 초기화
                if (sessionStorage.getItem("history_view") == null) {
                    history_view = app_dialog.dataSet;
                    sessionStorage.setItem("history_view", JSON.stringify(history_view));
                } else {
                    history_view = JSON.parse(sessionStorage.getItem("history_view"));

                    //리스트에상세정보 저장하기
                    for (var k = 0; k < app_dialog.dataSet.length; k++) {
                        //중복 데이터인지 확인
                        var isDuplicate = false;
                        for (var i=0; i<history_view.length; i++) {
                            if (app_dialog.dataSet[k].no == history_view[i].no) {
                                isDuplicate = true;
                                break;
                            }
                        }

                        //중복데이터가 아닌 경우 저장
                        if (isDuplicate == false) {
                            history_view.push(app_dialog.dataSet[k]);
                            sessionStorage.setItem("history_view", JSON.stringify(history_view));
                        }
                    }
                }

                //디테일 정보 리스트에 저장된 내용을 해쉬태그의 정보와 동일한지 확인 후 디테일 정보 저장
                for (var k = 0; k < history_view.length; k++) {
                    if (history_view[k].no == hash_tag[1]) {
                        customClassInfo = history_view[k];
                        break;
                    }
                }

                showEditView(false, customClassInfo);
            } else if (hash_tag[0] == "#list") {
                app_dialog.table.page(parseInt(hash_tag[1])).draw("page");
                
                document.getElementById("table_main_wrapper").style.visibility = "visible";
                document.getElementById("content_main").innerHTML = "";
            } else {
                document.getElementById("table_main_wrapper").style.visibility = "visible";
                document.getElementById("content_main").innerHTML = "";   
            }
        });


        //서버사이드 테이블일 경우 true로 변경
        var isServerSide = true;

        // //테스트
        // app_dialog = tableInfo('dialog_container_main', JSON_POST_TEST());        //리스트뷰 생성
        // //TEST====> JSON 데이터가 이미 존재함
        // //모바일 디스플레이일 경우 카드뷰로 시작
        // if (matchMedia("screen and (max-width:480px)").matches) {           //스마트폰이 세로인 경우
        //     //카드뷰로설정
        //     setView_cardview();

        //     //페이징 기능 중 1, 2, 3, 4, 5 와 같이 페이지를 나누어 주는 곳의 최대 카운트 설정
        //     $.fn.DataTable.ext.pager.numbers_length = 4;
        // }


        if (isServerSide) {
            //serverside
            //var url = url_json + "jsonservice/rest/boardmanage/select_boardmanageinfo_all_serverside";
            var url = url_json + "jsonservice/rest/test_servlet/dgh_data";
            JSON_POST(url, null, true, sessionStorage.getItem(token_yj_rfms), function (result) {
                setTimeout(function() {
                    //json 데이터 수신 후 테이블 생성하기
                    if (result[0] == "ok") {
                        app_dialog = tableInfo('dialog_container_main', result[1], url, isServerSide);      //리스트뷰 생성
                    } else {                                
                        messagebox_show(false, "데이터 가져오기 실패", result, null, false, true);
                    }
                    
                    //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                    setPaginateCount(5);                                                                    //paginate size                    
                    if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
                        setView_cardview();                                                                 //카드뷰로설정                        
                        setPaginateCount(5);                                                                //paginate size
                    }
                }, 0);                                                                                    //지연시켜서 메시지박스를 호출하지 않으면 메시지 박스 내용(텍스트)가 변경되지 않음 
            });





            //json 데이터 수신 후 테이블 생성하기
            app_dialog = tableInfo('dialog_container_main', null, url, isServerSide);           //리스트뷰 생성            
            setPaginateCount(5);                                                                //paginate size

            //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
            if (matchMedia("screen and (max-width:480px)").matches) {                           //스마트폰이 세로인 경우                
                setView_cardview();                                                             //카드뷰로설정
                setPaginateCount(5);                                                            //paginate size
            }
            
            // if (sessionStorage.getItem(token_yj_rfms) != null) {
            //     //serverside
            //     var url = url_json + "jsonservice/rest/boardmanage/select_boardmanageinfo_all_serverside";
            //     //json 데이터 수신 후 테이블 생성하기
            //     app_dialog = tableInfo('dialog_container_main', null, url, isServerSide);           //리스트뷰 생성            
            //     setPaginateCount(5);                                                                //paginate size

            //     //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
            //     if (matchMedia("screen and (max-width:480px)").matches) {                           //스마트폰이 세로인 경우                
            //         setView_cardview();                                                             //카드뷰로설정
            //         setPaginateCount(5);                                                            //paginate size
            //     }
            // }
        } else {
            //client side
            var url = url_json + "jsonservice/rest/boardmanage/select_boardmanageinfo_all";
            JSON_POST(url, null, true, sessionStorage.getItem(token_yj_rfms), function (result) {
                setTimeout(function() {
                    //json 데이터 수신 후 테이블 생성하기
                    if (result[0] == "ok") {
                        app_dialog = tableInfo('dialog_container_main', result[1], url, isServerSide);      //리스트뷰 생성
                    } else {                                
                        messagebox_show(false, "데이터 가져오기 실패", result, null, false, true);
                    }
                    
                    //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                    setPaginateCount(5);                                                                    //paginate size                    
                    if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
                        setView_cardview();                                                                 //카드뷰로설정                        
                        setPaginateCount(5);                                                                //paginate size
                    }
                }, 0);                                                                                    //지연시켜서 메시지박스를 호출하지 않으면 메시지 박스 내용(텍스트)가 변경되지 않음 
            });
        }


        //////////////////////////
        //postMessage receive
        //////////////////////////
        //dialog 내용 재정의
        window.addEventListener('message', function(event) {
            check_visible_admin_button_visiblility_collapse();

            //파일 리스트 초기화 (upload 필드가 false이면 서버로부터 다운로드받은 파일, true이면 서버에 올릴 파일)
            uploadFileList = new Array();
            uploadFileList_text = "";

            var customClassInfo = event.data[1];

            switch (event.data[0]) {
                case 1: //추가
                    if (document.getElementById('dialog-title1-dialog_container_main') == null) {
                        return;
                    }       

                    $("#content_main").load("/content_board_default_edit.html", function(e) {
                        //추가화면 보이게 하기
                        scroll_body_on_off(true);
                        document.getElementById("table_main_wrapper").style.visibility = "collapse";


                        document.getElementById('dialog-title1-dialog_container_main').textContent = "게시판 정보 추가";                  //title 변경
                        document.getElementById('dialog-title2-dialog_container_main').textContent = "게시판 정보를 추가합니다.";          //title 변경
                        init_input();
                        
                        //mustimage
                        document.getElementById('dialog_write_board_type').classList.add('mustimage');

                        // //css
                        // document.getElementById('dialog_write_user_id').style.backgroundColor = "#fff";             //아이디 background-color
                        // document.getElementById('dialog_write_user_id').readOnly = false;                           //아이디 수정 가능하게
                        // document.getElementById('dialog_write_user_id_wrap').style.right = "80px";                  //아이디 중복 확인 버튼 보익기
                        // document.getElementById('dialog_write_user_id_wrap').style.marginRight = "5px";
                        // document.getElementById('dialog_write_check_user_wrap').style.display = "block";

                        document.getElementById('dialog_write_no').style.backgroundColor = "#ddd";                  //고유번호 background-color
                        document.getElementById('dialog_write_regist_user').style.backgroundColor = "#ddd";     //등록일자 background-color
                        document.getElementById('dialog_write_regist_datetime').style.backgroundColor = "#ddd";     //등록일자 background-color
                        document.getElementById('dialog_write_lastsave_datetime').style.backgroundColor = "#ddd";   //최종수정일자 background-color
                    
                        //팝업
                        //app_dialog.addDialog.classList.add('dialog-container--visible');

                        //gui 초기화 => 파일
                        document.getElementById("ul_addFile").innerHTML = "";
                    });






                    // document.getElementById('dialog-title1-dialog_container_main').textContent = "게시판 정보 추가";                  //title 변경
                    // document.getElementById('dialog-title2-dialog_container_main').textContent = "게시판 정보를 추가합니다.";          //title 변경
                    // init_input();
                    
                    // //mustimage
                    // document.getElementById('dialog_write_board_type').classList.add('mustimage');

                    // // //css
                    // // document.getElementById('dialog_write_user_id').style.backgroundColor = "#fff";             //아이디 background-color
                    // // document.getElementById('dialog_write_user_id').readOnly = false;                           //아이디 수정 가능하게
                    // // document.getElementById('dialog_write_user_id_wrap').style.right = "80px";                  //아이디 중복 확인 버튼 보익기
                    // // document.getElementById('dialog_write_user_id_wrap').style.marginRight = "5px";
                    // // document.getElementById('dialog_write_check_user_wrap').style.display = "block";

                    // document.getElementById('dialog_write_no').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    // document.getElementById('dialog_write_regist_user').style.backgroundColor = "#ddd";     //등록일자 background-color
                    // document.getElementById('dialog_write_regist_datetime').style.backgroundColor = "#ddd";     //등록일자 background-color
                    // document.getElementById('dialog_write_lastsave_datetime').style.backgroundColor = "#ddd";   //최종수정일자 background-color
                   
                    // app_dialog.addDialog.classList.add('dialog-container--visible');

                    // //gui 초기화 => 파일
                    // document.getElementById("ul_addFile").innerHTML = "";
                    break;
                case 2: //수정
                    showEditView(true, app_dialog.selectedObject);

                    //this.document.location.hash = "#view=" + customClassInfo.no;
                    
                    
                    // if (customClassInfo.bo_board_type == null) {
                    //     return;
                    // }

                    // document.getElementById('dialog-title1-dialog_container_main').textContent = "게시판 정보 수정";                  //title 변경
                    // document.getElementById('dialog-title2-dialog_container_main').textContent = "게시판 정보를 수정합니다.";          //title 변경
                    // init_input();

                    // document.getElementById('dialog_write_board_type').value = customClassInfo.bo_board_type;
                    // document.getElementById('dialog_write_count_click').value = customClassInfo.bo_count_click;
                    // document.getElementById('dialog_write_count_like').value = customClassInfo.bo_count_like;
                    // document.getElementById('dialog_write_count_hate').value = customClassInfo.bo_count_hate;
                    // document.getElementById('dialog_write_title').value = customClassInfo.bo_title;
                    // document.getElementById('dialog_write_content').value = customClassInfo.bo_content;
                    // document.getElementById('dialog_write_mobile').value = customClassInfo.bo_mobile;
                    // document.getElementById('dialog_write_email').value = customClassInfo.bo_email;
                    // document.getElementById('dialog_write_no').value = customClassInfo.no; 
                    // document.getElementById('dialog_write_regist_user').value = customClassInfo.bo_regist_user;
                    // document.getElementById('dialog_write_regist_datetime').value = customClassInfo.bo_regist_datetime;                    
                    // document.getElementById('dialog_write_lastsave_datetime').value = customClassInfo.bo_lastsave_datetime;
                    // document.getElementById('dialog_write_etc').value = customClassInfo.bo_etc;

                    // //gui 초기화 => 파일
                    // document.getElementById("ul_addFile").innerHTML = "";

                    // //file
                    // var file_source = customClassInfo.bo_file;
                    // if (file_source != "") {
                    //     var file_div = file_source.split("**,**");
                    //     var files = file_div[1].split("@,@");
                    //     var file = null;
    
                    //     //파일을 가져와서 리스트박스 GUI 만들기
                    //     for (var i = 0; i < files.length; i++) {
                    //         file = file_div[0] + files[i];
    
                    //         //input container 추가
                    //         var li = document.createElement("li");
                    //         li.tabIndex = "-1";
                    //         li.setAttribute('role', 'option');
                    //         li.setAttribute("aria-checked", "true");
    
                    //         //input
                    //         var input = document.createElement("input");
                    //         input.tabIndex = "-1";
                    //         input.type = "checkbox";
                    //         input.style.border = "none";
                    //         input.style.float = "left";
                    //         input.style.marginTop = "4px";
                    //         input.style.marginRight = "4px";
    
                    //         //input text
                    //         var a_link = document.createElement("a");
                    //         a_link.textContent = files[i];
                    //         a_link.setAttribute("href", file);
                    //         a_link.setAttribute("download", files[i]);
                    //         a_link.style.setProperty("font-weight", "300");
                    //         a_link.style.setProperty("font-size", "12px");
    
                    //         li.appendChild(input);
                    //         li.appendChild(a_link);
                            
                    //         document.getElementById("ul_addFile").appendChild(li);
                    //     }
                    // }
                    

                    // // //image
                    // // // document.getElementById('print_selected_filename').value = customClassInfo.bo_file;   //이미지 경로 input
                    // // if ((customClassInfo.bo_file == "") || (customClassInfo.bo_file == null)) {
                    // //     document.getElementById('dialog_write_file_1').src = "/images/dbms1.png";      //다이어로그 창 기본이미지
                    // //     $('#dialog_write_file_1').attr('data-src', "/images/dbms1.png");               //이미지 상세보기 기본이미지
                    // // } else {
                    // //     document.getElementById('dialog_write_file_1').src = customClassInfo.bo_file;
                    // //     $('#dialog_write_file_1').attr('data-src', customClassInfo.bo_file);
                    // // }
                    // // //image round
                    // // if (document.getElementById("dialog_write_file_1").classList.contains("round_image") == false) {
                    // //     document.getElementById("dialog_write_file_1").classList.add("round_image");   
                    // // }


                    // // //css
                    // // document.getElementById('dialog_write_user_id').style.backgroundColor = "#ddd";             //아이디 background-color
                    // // document.getElementById('dialog_write_user_id').readOnly = true;                            //아이디 수정못하게
                    // // document.getElementById('dialog_write_user_id_wrap').style.right = "0px";                   //아이디 중복 확인 버튼 없애기
                    // // document.getElementById('dialog_write_user_id_wrap').style.marginRight = "0px";
                    // //document.getElementById('dialog_write_check_user_wrap').style.display = "none";

                    // document.getElementById('dialog_write_no').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    // document.getElementById('dialog_write_regist_user').style.backgroundColor = "#ddd";     //등록일자 background-color
                    // document.getElementById('dialog_write_regist_datetime').style.backgroundColor = "#ddd";     //등록일자 background-color
                    // document.getElementById('dialog_write_lastsave_datetime').style.backgroundColor = "#ddd";   //최종수정일자 background-color

                    // //mustimage

                    //팝업
                    // //app_dialog.addDialog.classList.add('dialog-container--visible');
                    break;
                case 3: //일괄 수정
                    if (document.getElementById('dialog-title1-dialog_container_main') == null) {
                        return;
                    }     

                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-dialog_container_main').textContent = "게시판 정보 일괄 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main').textContent = "선택하신 " + getSCount + "개의 데이터에 아래의 각 항목에 입력된 정보만 일괄 변경되며, 입력되지 않은 필드의 정보는 기존의 데이터 그대로 유지됩니다.";           //title 변경
                    init_input();

                    //css
                     document.getElementById('dialog_write_board_type').readOnly = true;                                  //게시판명 수정못하게
                    // document.getElementById('dialog_write_password').readOnly = true;                           //비밀번호 수정못하게
                    
                    app_dialog.addDialog.classList.add('dialog-container--visible');
                    break;
                case 4: //삭제
                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-messagebox1').textContent = "데이터 삭제";                  //title 변경
                    document.getElementById('dialog-title2-messagebox').textContent = "선택하신 " + getSCount + "개의 데이터를 삭제 하시겠습니까?";
                    document.getElementById('loading_spinner').style.display = "none";
                    // document.getElementById('dialog_write_content').value = "";
                    // document.getElementById('dialog_write_mobile').value = "";
                    // document.getElementById('dialog_write_email').value = "";    

                    app_dialog.removeDialog.classList.add('dialog-container--visible');
                    break;
                case 5: //보기
                    window.location.hash = "#view=" + customClassInfo.no;       //해쉬 설정
                    break;
                default:
                    break;
            }
        }, false);

        function init_input() {
            document.getElementById('dialog_write_board_type').value = "";
            document.getElementById('dialog_write_count_click').value = "";
            document.getElementById('dialog_write_count_like').value = "";
            document.getElementById('dialog_write_count_hate').value = "";
            document.getElementById('dialog_write_title').value = "";
            document.getElementById('dialog_write_content').value = "";
            document.getElementById('dialog_write_mobile').value = "";
            document.getElementById('dialog_write_email').value = "";
            document.getElementById('dialog_write_no').value = "";
            document.getElementById('dialog_write_regist_user').value = parseJwt(sessionStorage.getItem(token_yj_rfms)).mb_id;
            document.getElementById('dialog_write_regist_datetime').value = "";
            document.getElementById('dialog_write_lastsave_datetime').value = "";
            document.getElementById('dialog_write_etc').value = "";
            
            //image 경로
            document.getElementById('dialog_write_file').value = "";
            //image
            document.getElementById('dialog_write_file_1').src = "/images/dbms1.png";
            $('#dialog_write_file_1').attr('data-src', "/images/dbms1.png");    //이미지 상세보기  기본이미지
            if (document.getElementById("dialog_write_file_1").classList.contains("round_image") == false) {
                document.getElementById("dialog_write_file_1").classList.add("round_image");   
            }
        }

        function showEditView(isEidt, customClassInfo) {
            //view, edit 설정
            var loadPath;
            if (isEidt) {
                loadPath = "/content_board_default_edit.html";
            } else {
                loadPath = "/content_board_default_view.html";
            }

            //확보된 디테일 정보를 이용하여 GUI에 출력
            document.getElementById("content_main").innerHTML = "";
            $("#content_main").load(loadPath, function(e) {
                //수정화면 보이게 하기
                scroll_body_on_off(true);
                document.getElementById("table_main_wrapper").style.visibility = "collapse";

                document.getElementById('dialog-title1-dialog_container_main').textContent = "게시판 정보 수정";                  //title 변경
                document.getElementById('dialog-title2-dialog_container_main').textContent = "게시판 정보를 수정합니다.";          //title 변경
                init_input();

                document.getElementById('dialog_write_board_type').value = customClassInfo.bo_board_type;
                document.getElementById('dialog_write_count_click').value = customClassInfo.bo_count_click;
                document.getElementById('dialog_write_count_like').value = customClassInfo.bo_count_like;
                document.getElementById('dialog_write_count_hate').value = customClassInfo.bo_count_hate;
                document.getElementById('dialog_write_title').value = customClassInfo.bo_title;
                document.getElementById('dialog_write_content').value = customClassInfo.bo_content;
                document.getElementById('dialog_write_mobile').value = customClassInfo.bo_mobile;
                document.getElementById('dialog_write_email').value = customClassInfo.bo_email;
                document.getElementById('dialog_write_no').value = customClassInfo.no; 
                document.getElementById('dialog_write_regist_user').value = customClassInfo.bo_regist_user;
                document.getElementById('dialog_write_regist_datetime').value = customClassInfo.bo_regist_datetime;                    
                document.getElementById('dialog_write_lastsave_datetime').value = customClassInfo.bo_lastsave_datetime;
                document.getElementById('dialog_write_etc').value = customClassInfo.bo_etc;

                //gui 초기화 => 파일
                document.getElementById("ul_addFile").innerHTML = "";
                
                //var files = document.getElementById("dialog_write_file").files;
                //file
                var file_source = customClassInfo.bo_file;
                if (file_source != "") {
                    var getFiles = file_source.split(common_split_string);
                    var file_url_list = new Array();                    
                    for (var i=0; i<getFiles.length; i++){
                        var newFile = null;
                        newFile = {
                            name: getFiles[i].substring(getFiles[i].lastIndexOf('/') + 1),
                            src: getFiles[i],
                            type: file_fromserver,
                        };
                        file_url_list.push(newFile);
                    }
                    
                    //서버 db에 저장할 이미지 이름 (서버에 이미 저장되어 있는 리스트)
                    //uploadFileList_text = file_source;
                    
                    create_file_list(file_url_list, file_source);
                    // //파일을 가져와서 리스트박스 GUI 만들기
                    // for (var i = 0; i < file_url_list.length; i++) {
                    //     var file_name = file_url_list[i].substring(file_url_list[i].lastIndexOf('/')+1);

                    //     //input container 추가
                    //     var li = document.createElement("li");
                    //     li.tabIndex = "-1";
                    //     li.setAttribute('role', 'option');
                    //     li.setAttribute("aria-checked", "true");

                    //     //input
                    //     var input = document.createElement("input");
                    //     input.tabIndex = "-1";
                    //     input.type = "checkbox";
                    //     input.style.border = "none";
                    //     input.style.float = "left";
                    //     input.style.marginTop = "4px";
                    //     input.style.marginRight = "4px";

                    //     //input text
                    //     var a_link = document.createElement("a");
                    //     a_link.textContent = file_name;
                    //     a_link.setAttribute("href", file_url_list[i]);
                    //     a_link.setAttribute("download", file_url_list[i]);
                    //     a_link.style.setProperty("font-weight", "300");
                    //     a_link.style.setProperty("font-size", "12px");

                    //     li.appendChild(input);
                    //     li.appendChild(a_link);
                        
                    //     document.getElementById("ul_addFile").appendChild(li);
                    // }
                }
                

                // //image
                // // document.getElementById('print_selected_filename').value = customClassInfo.bo_file;   //이미지 경로 input
                // if ((customClassInfo.bo_file == "") || (customClassInfo.bo_file == null)) {
                //     document.getElementById('dialog_write_file_1').src = "/images/dbms1.png";      //다이어로그 창 기본이미지
                //     $('#dialog_write_file_1').attr('data-src', "/images/dbms1.png");               //이미지 상세보기 기본이미지
                // } else {
                //     document.getElementById('dialog_write_file_1').src = customClassInfo.bo_file;
                //     $('#dialog_write_file_1').attr('data-src', customClassInfo.bo_file);
                // }
                // //image round
                // if (document.getElementById("dialog_write_file_1").classList.contains("round_image") == false) {
                //     document.getElementById("dialog_write_file_1").classList.add("round_image");   
                // }


                // //css
                // document.getElementById('dialog_write_user_id').style.backgroundColor = "#ddd";             //아이디 background-color
                // document.getElementById('dialog_write_user_id').readOnly = true;                            //아이디 수정못하게
                // document.getElementById('dialog_write_user_id_wrap').style.right = "0px";                   //아이디 중복 확인 버튼 없애기
                // document.getElementById('dialog_write_user_id_wrap').style.marginRight = "0px";
                //document.getElementById('dialog_write_check_user_wrap').style.display = "none";

                document.getElementById('dialog_write_no').style.backgroundColor = "#ddd";                  //고유번호 background-color
                document.getElementById('dialog_write_regist_user').style.backgroundColor = "#ddd";     //등록일자 background-color
                document.getElementById('dialog_write_regist_datetime').style.backgroundColor = "#ddd";     //등록일자 background-color
                document.getElementById('dialog_write_lastsave_datetime').style.backgroundColor = "#ddd";   //최종수정일자 background-color

            });
        }
    });
});


function table_style_1(input_app_dialog, input_url, input_isServerSide){    
    var returnObject = {
        order: [[ 2, "desc" ]],           //기본 컬럼 정렬 설정
        ordering: true,                   //컬럼 정렬 여부        
        dom: 'Bfrtip',
        responsive: true,                 //column 반응형 width 조절 (보이기, 안보이기 포함)        
        paging: true,                     //페이지 나누기 여부        
        info: true,                       //페이지 위치 정보 (좌측 하단 ex: 1/3)
        filter: true,                     //검색창
        lengthChange: false,              
        stateSave: false,                  //새로고침 시에도 현재 상태 유지        
        pagingType: 'simple_numbers',     // numbers simple simple_numbers full full_numbers first_last_numbers
        lengthMenu: [[10, 15, 20, 30, 40, 50, -1], [10, 15, 20, 30, 40, 50, "All"]],
        pageLength: 15,                   //한 페이지에 출력될 게시물 수
        data: input_app_dialog.dataSet,        
        processing: false,                 //테이블이 처리 될 때 (예 : 정렬) '처리 중'표시기의 표시를 활성화 또는 비활성화

        retrieve: true,
        //deferRender:    true,
        initComplete: function () {       //초기화가 완료된 후 이벤트 메시지
            messagebox_close();

            $('.useid_datatables_edit').css("display", "none");     //게시판정보에서 일괄 수정이 필요없으므로 보이지 않게 함



            //////////////////////////////////////////////////
            //검색 방법을 버튼형식으로 GUI 변경
            //////////////////////////////////////////////////
            var input = $('.dataTables_filter input').unbind();
            var self = this.api();
            //검색 아이콘 클릭 시 검색
            $searchButton = $('<button class="dt-button btn btn-primary datatables_setview_clss datatables_button_image_search" title="검색">')
            //    .text('검색')
                .click(function() {
                    self.search(input.val()).draw();
                });
            //취소 아이콘 클릭 시 원래대로
            $clearButton = $('<button class="dt-button btn btn-primary datatables_setview_clss datatables_button_image_cancel" title="검색 취소">')
            //    .text('취소')
                .click(function() {
                    input.val('');
                    $searchButton.click(); 
                });

            //기간 설정 아이콘
            $clearButtonA = $('<button class="dt-button btn btn-primary datatables_setview_clss datatables_button_image_findall_term" style="font-size:14px;padding-left:6.5px;color:#696969;font-weight:800;" title="검색 기간 선택">')
                .text('기간')
                .click(function() {
                    var layer_date = document.getElementById("dialog_toggle_date");
                    
                    if (layer_date.style.display == "none") {
                        layer_date.style.setProperty("display", "block");
                    } else {
                        layer_date.style.setProperty("display", "none");
                    }
                    
                    if (this.parentNode.contains(layer_date) == false) {
                        this.parentNode.appendChild(layer_date);
                    }                    
                });

            //필드 검색 아이콘
            $clearButtonB = $('<button class="dt-button btn btn-primary datatables_setview_clss datatables_button_image_findall_field" style="float: left;font-size:14px;padding-left:6.5px;color:#696969;font-weight:800;" title="검색 필드 선택">')
                .text('필드')
                .click(function() {
                    input.val('');
                    $searchButton.click(); 
                });


            //dataTables_filter에 아이콘 추가할 경우 layout.css .dataTables_filter label 에서 padding-right, margin-right 를 수정해야 함
            $('.dataTables_filter').prepend($clearButtonA,$clearButtonB);
            $('.dataTables_filter').append($clearButton, $searchButton);

            //엔터 입력 시 검색
            $(document).on('keypress',function(e) {
                if(e.which == 13) {
                    self.search(input.val()).draw();
                }
            });
            //ESC누를 경우 원래대로
            $(document).on('keydown',function(e) {
                if(e.which == 27) {
                    input.val('');
                    $searchButton.click(); 
                }
            });
        },
        
        // json: ({
        //    beforeSend: function(){
        //         $("#loadMessage").show();
        // }, success: function(response){
        //     column.search( val ? '^' + val + '$' : '', true, false).draw();
        // }, complete:function(data){
        //     $("#loadMessage").hide();
        // },
      
        language: {
            processing: "Loading...",
            LoadingRecords: "Please wait - loading...", 
            EmptyTable: "Please wait - loading...", 
            zeroRecords: "Please wait - loading...", 

            lengthMenu: '한 페이지에 출력될 데이터 수 _MENU_ ',
            zeroRecords: '데이터가 없습니다.',
            info: '_PAGE_/_PAGES_',
            infoEmpty: '0/0',
            infoFiltered: '(총 _MAX_ 의 데이터로부터 검색되었습니다.)',
            paginate: {
                first: '<<',
                last: '>>',
                previous: '<',
                next: '>'
            },
            // search: '검색'
            search: ''
        },
        select: {
            style: 'multi',    //os, multi
            selector: 'td:first-child'
        },
        columns: [{     //순차적 인덱스 (client에서만 사용)
                title: '<div id="id_table_column_sequence" style="cursor: pointer;font-size:15px;padding:0 5px 0 5px">+</div>',
                data: null,
                defaultContent: '',
                orderable: false,
                searchable: false,
                //cardview_sequence: 카드뷰일 경우 시퀀스 번호 폰트 사이즈 
                //tableid_table_database => 현재 테이블을 구분짓는 고유 이름(팝업 찾기에서 고유이름 필요)
                className: 'dt-body-center dataTables_column_sequence_id class_table_column_sequence_wrap cardview_sequence cardview_tr_leftzero tableid_table_database',
                
                // visible: false,    //visible 브라우저 캐쉬삭제 후 테스트 필요
                // width: '3%',
                width:'20px',       //크롬을 제외한 나머지 브라우저는 width 항목이 동작되지 않기 때문에 dataTables_column_sequence_id css 에서 width를 !important로 설정해야 함
                render: function (data, type, full, meta){              //시퀀스 번호
                  //return  meta.row + meta.settings._iDisplayStart + 1;                                //Asc
                  return meta.settings._iRecordsTotal - meta.settings._iDisplayStart - meta.row;        //Desc
                }
            },{         //체크박스 (관리자만 사용)
                visible: false,
                title: '<input style="width:20px;height:20px;vertical-align:middle;" type="checkbox" id="id_checkbox_selectAll"></input>',
                data: null,
                defaultContent: '',
                orderable: false,
                searchable: false,
                className: 'dt-body-center dataTables_column_select_checkbox cardview_tr_leftzero',
                padding: 'padding: 10px 0px;',
                // visible: false,   //visible 브라우저 캐쉬삭제 후 테스트 필요
                width:'20px',       //크롬을 제외한 나머지 브라우저는 width 항목이 동작되지 않기 때문에 dataTables_column_sequence_id css 에서 width를 !important로 설정해야 함
                render: function (data, type, full, meta){
                    return '<input style="width:20px;height:20px;vertical-align:middle;" type="checkbox" selectRow="true" id="id_checkbox1" class="class_checkbox1" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                }
            },{         //고유 자동 증가 인덱스 (db로부터 가져온 번호, 화면에 보이지 않게 함)
                visible: false,     //화면에 보이지 않고, 고유번호 데이터만 사용
                //id: 'no',
                data: 'no',
                title: 'NO',
                defaultContent: '',
                orderable: false,
                searchable: false,
                className: 'dt-body-center dataTables_column_sequence_id',
            },{
                data: 'bo_title',
                title: '제목',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight truncate datatables_maxColumn_500px',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                overflow: 'hidden',
                width: '500px',
            },{
                data: 'bo_content',
                title: '내용',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight truncate',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                visible: false,
            },{
                data: 'bo_regist_user',
                title: '작성자',
                className: 'dt-body-center cardview_tr_setheight',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                width:'100px',
                marginRight: '0px',
            },{
                data: 'bo_regist_datetime',
                title: '작성일',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_topright: cardview인 경우 오른쪽 상단에 출력
                orderable: true,
                searchable: true,
                width:'100px',
                //숫자 표현
                render: function (data, type, full, meta) {
                    return data.split(' ')[0];
                }                
                //className: 'dt-body-right',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap     
            },{
                data: 'bo_count_click',
                title: '조회수',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                width:'20px',
            },{
                data: 'bo_count_like',
                title: '좋아요',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                visible: false,
            },{
                data: 'bo_count_hate',
                title: '싫어요',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight ',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                visible: false,
            },{
                data: 'bo_file',
                title: '첨부파일',
                className: 'dt-body-center cardview_leftimage',   //cardview_leftimage: 카드뷰 일경우 왼쪽 이미지
                orderable: false,
                searchable: false,
                visible: true,
                render: function (data, type, full, meta) {
                    var get_row_image = set_defaultview_image(data);
                    var get_type = get_row_image.substring(get_row_image.lastIndexOf('.') + 1);
                    var r_value = null;

                    if ((get_type == "gif") || (get_type == "jpg") || (get_type == "bmp") || (get_type == "png")) {
                        return r_value = '<img src="' + get_row_image + '" style="height:20px;width:auto;overflow: hidden;padding:0px;vertical-align: middle;" onerror="imgError_user(this);"/>';     
                    } else if (get_type == "") {               
                        return null;         
                    } else {
                        return r_value = '<img src="/images/file2.png" style="height:20px;width:auto;overflow: hidden;padding:0px;vertical-align: middle;" onerror="imgError_user(this);"/>';     
                    }
                    // return '<img src="' + data + '" style="height:20px;width:20px;padding:0px;vertical-align: middle;" onerror="imgError_user(this);"/>';     
                    //var sampledata = "http://127.0.0.1:31419/images/logo-yjsoft-63x66.png";
                    // var sampleImage = "";
                    // if (IsNullOrWhiteSpace(data) == false) {
                    //     return '<img src="' + data + '" style="height:20px;width:20px;padding:0px;vertical-align: middle;"/>';                        
                    // } else {
                    //     return '<img src="' + sampleImage + '" style="height:20px;width:20px;padding:0px;vertical-align: middle;"/>';                        
                    // }                    
                }
            },
        ],
        buttons: getButtons(input_app_dialog, true),

        //초기화 이벤트         
        "fnDrawCallback": function(event){
            //$('#table_main').columns.adjust().responsive.recalc();
            setTimeout(function(){
                //보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
                check_visible_sequence(1);
                check_visible_checkbox(input_app_dialog.table);
                check_visible_admin_button();
            });
        },
        
    }
    
    return returnObject;
};

//페이징 기능 중 1, 2, 3, 4, 5 와 같이 페이지를 나누어 주는 곳의 최대 카운트 설정
function setPaginateCount(input_len) {    
    // $.fn.DataTable.ext.pager.numbers_length = input_len;
}

//보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
function check_visible_sequence(count_hideColumn) {
    var count_allColumn = $('#table_main').DataTable().columns().count() - count_hideColumn;
    var count_visibleColumn = $('#table_main').DataTable().columns(':visible').count();
    if (count_visibleColumn < count_allColumn) {        //숨김 컬럼이 생기는 경우
        document.getElementById('id_table_column_sequence').style.display = 'inline-block';
    } else {
        document.getElementById('id_table_column_sequence').style.display = 'none'; 
    }
}

//관리자만 체크박스 보이게 하기
function check_visible_checkbox(inputTable) {
    //관리자 여부 확인
    var isAdmin = false;
    var getUserInfo = parseJwt(sessionStorage.getItem(token_yj_rfms));    
    if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
        isAdmin = true;
    }

    //GUI 보이기 안보이기
    if (isAdmin) {
        inputTable.column(1).visible(true);
    } else {
        inputTable.column(1).visible(false);
    }
}

//관리자만 추가,삭제,엑셀다운로드 보이게 하기
function check_visible_admin_button() {
    //관리자 여부 확인
    var isAdmin = false;
    var getUserInfo = parseJwt(sessionStorage.getItem(token_yj_rfms));    
    if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
        isAdmin = true;
    }

    //GUI 보이기 안보이기    
    if (isAdmin) {
        document.getElementsByClassName("useid_datatables_edit")[0].style.setProperty("visibility", "visible");
        document.getElementsByClassName("datatables_button_image_create")[0].style.setProperty("visibility", "visible");
        document.getElementsByClassName("datatables_button_image_remove")[0].style.setProperty("visibility", "visible");
        document.getElementsByClassName("datatables_button_image_excel")[0].style.setProperty("visibility", "visible");        
        
    } else {
        document.getElementsByClassName("useid_datatables_edit")[0].style.setProperty("visibility", "collapse");
        document.getElementsByClassName("datatables_button_image_create")[0].style.setProperty("visibility", "collapse");
        document.getElementsByClassName("datatables_button_image_remove")[0].style.setProperty("visibility", "collapse");
        document.getElementsByClassName("datatables_button_image_excel")[0].style.setProperty("visibility", "collapse");
    }
}

function check_visible_admin_button_visiblility_collapse() {
    document.getElementsByClassName("useid_datatables_edit")[0].style.setProperty("visibility", "collapse");
    document.getElementsByClassName("datatables_button_image_create")[0].style.setProperty("visibility", "collapse");
    document.getElementsByClassName("datatables_button_image_remove")[0].style.setProperty("visibility", "collapse");
    document.getElementsByClassName("datatables_button_image_excel")[0].style.setProperty("visibility", "collapse");
}



var uploadFileList;
var uploadFileList_id = 0;
var uploadFileList_text = "";
function create_file_list(files) {
    //파일을 가져와서 리스트박스 GUI 만들기
    var upload_value = false;
    for (var i = 0; i < files.length; i++) {
        //id, file, upload여부, gui삭제 여부
        if (files[i].type == file_fromserver) {
            upload_value = false;
        } else {
            upload_value = true;
        }

        uploadFileList.push({id: "fileList" + uploadFileList_id, file:files[i], upload: upload_value, isChecked_guiRemove: false});

        //////////////
        //GUI
        //////////////
        //input container 추가
        var li = document.createElement("li");
        li.tabIndex = "-1";
        li.setAttribute("role", "option");
        li.setAttribute("aria-checked", "true");
        // li.style.setProperty("float", "left");
        li.style.setProperty("height", "35px");
        li.style.setProperty("width", "100%");
        li.style.marginRight = "5px";
        li.setAttribute("id", "li_fileList" + uploadFileList_id);
        //li.setAttribute("data-magnify", "gallery");      //이미지 확대 보기 설정


        //input
        var input = document.createElement("input");
        input.tabIndex = "-1";
        input.type = "checkbox";
        input.style.border = "none";
        input.style.float = "left";
        input.style.marginTop = "4px";
        input.style.marginRight = "4px";
        input.style.setProperty("width", "20px");
        input.style.setProperty("height", "20px");
        input.setAttribute("id", "input_fileList" + uploadFileList_id);            
        input.addEventListener('change', function(e) {
            if(this.checked) {
                //체크박스에 체크된 경우 GUI에서 삭제함으로 설정 (삭제 버튼 눌러야 삭제됨)
                var getID = this.id.split("_")[1];
                for(var i =0; i<uploadFileList.length; i++) {
                    if (uploadFileList[i].id == getID) {
                        uploadFileList[i].isChecked_guiRemove = true;
                        break;
                    }
                }
            } else {
                //체크박스에 체크 해제된 경우 GUI에서 삭제안함으로 설정 (삭제 버튼 눌러야 삭제됨)
                var getID = this.id.split("_")[1];
                for(var i =0; i<uploadFileList.length; i++) {
                    if (uploadFileList[i].id == getID) {
                        uploadFileList[i].isChecked_guiRemove = false;
                        break;
                    }
                }
            }
        });

        //input text
        var h3 = document.createElement("h3");
        h3.textContent = files[i].name;
        h3.style.setProperty("font-weight", "300");
        h3.style.setProperty("font-size", "15px");
        h3.style.setProperty("margin-left", "5px");
        h3.style.setProperty("float", "left");
        h3.style.setProperty("line-height", "30px");
        h3.style.setProperty("text-overflow", "hidden");
        h3.style.setProperty("cursor", "pointer");
        //h3.setAttribute("href", files[i].src)
        h3.setAttribute("href", "www.naver.com")

        //div_container
        var div_container = document.createElement("div");
        div_container.classList.add("imgcontainer");          
        div_container.style.setProperty("float", "left");
        div_container.style.setProperty("width", "100%");
        
        //div
        var div_content = document.createElement("div");
        div_content.classList.add("imgcontainer_frame");          

        //img
        var img = document.createElement("img");
        img.setAttribute("src", "/images/dbms1.png");
        img.setAttribute("data-magnify", "gallery");      //이미지 확대 보기 설정
        img.style.setProperty("height", "30px");
        img.style.setProperty("width", "30px");
        img.style.setProperty("float", "left");
        img.classList.add("round_image");
        
        div_content.appendChild(input);
        div_content.appendChild(img);          
        div_content.appendChild(h3);
        div_container.appendChild(div_content);

        
        li.appendChild(div_container);
        
        document.getElementById("ul_addFile").appendChild(li);

        ////////////////////////
        //이미지 확대 보기 설정
        ////////////////////////
        set_image_zoom(files[i], img);
        set_image_zoom(files[i], h3);

        uploadFileList_id++;
    }

    //document.getElementById("print_selected_filename").value = filesName;          
}

function remove_file() {
    var element_ul_addfile = document.getElementById("ul_addFile");
    
    //이미지 리스트에서 삭제할 파일 중 GUI만 삭제하기
    for (var i=0; i<uploadFileList.length; i++) {            
        if (uploadFileList[i].isChecked_guiRemove == true) {
            //업로드 안함 설정
            uploadFileList[i].upload = false;

            //GUI 삭제
            var getElement = document.getElementById("li_" + uploadFileList[i].id);
            if (getElement != null) {
                getElement.parentNode.removeChild(getElement);
                //getElement.remove();
            }
        }
    }
}

//이미지 확대 보기 설정
//source_image: source, container: 확대해서 보여줄 element, img: 리스트에 보여줄 작은 이미지 설정
function set_image_zoom(source_image, element) {
    var pattern = ["gif", "jpg", "bmp", "png"];
    if (contains(source_image.name, pattern) == true) {
        var img = document.createElement("img");

        //이미지 src 생성
        if (source_image.type == "file_fromserver") {
            //source_image.src = "http://www.yjsoft.kr/userFiles/board_files_archive/boardType_data/contentboarddefaulthtmlview238/댕댕이.png";  //test
            img.src = source_image.src;            //서버로부터 파일명만 가져온 경우
        } else {
            img.src = URL.createObjectURL(source_image);            //사용자가 파일탐색기에서 파일을 선택한 경우
        }

        element.setAttribute("data-src", img.src);          //확대해서 보여줄 element 설정

        //작은 이미지 보여주기
        if (element.localName == "img") {
            element.src = img.src;
        }
    }
}

//bo_file string에 저장된 이미지 중 첫번째 이미지만 src형태의 string으로 반환함
function set_defaultview_image(bo_file) {
    if (bo_file == null) {
        return null;
    }

    var getFiles = bo_file.split(common_split_string);
        if (getFiles[0] != null) {
            return getFiles[0];
        }
    return null;
}