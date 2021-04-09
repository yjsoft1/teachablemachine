
var app_dialog;
$(document).ready(function() {
    loadScript("/js/table_style_manage.js", function(){
        setTimeout(function() {
        //서버사이드 테이블일 경우 true로 변경
        // var isServerSide = false;
        // var isLocalSide = true;     //indexed DB 사용 사용
        var isServerSide = true;
        var isLocalSide = false;     //indexed DB 사용 사용


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

        if (isLocalSide) {
            //indexed db select all
            var list_memberinfo = new Array();

            indexedDB_open(function(e) {
                var transaction = e.transaction(["yj_member"], "readwrite");
                var store = transaction.objectStore("yj_member");

                store.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        var memberinfo = {
                            mb_no: cursor.key,
                            mb_select: false,
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
                        app_dialog = tableInfo('dialog_container_main', list_memberinfo, url, isServerSide);      //리스트뷰 생성

                        //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                        //setPaginateCount_pop(5);                                                                    //paginate size                    
                        if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
                            try {
                                setView_cardview_pop();                                                                 //카드뷰로설정                        
                                setPaginateCount_pop(5);                                                                //paginate size
                            } catch (e) {

                            }
                        }
                    }
                 };
            });
        } else {
            if (isServerSide) {
                if (sessionStorage.getItem(token_yj_rfms) != null) {
                    //serverside
                    var url = url_json + "jsonservice/rest/user/select_userinfo_all_serverside";
                    //json 데이터 수신 후 테이블 생성하기
                    app_dialog = tableInfo('dialog_container_main', null, url, isServerSide);           //리스트뷰 생성            

                    //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                    setPaginateCount(5);                                                                    //paginate size                    
                    if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
                        setView_cardview();                                                                 //카드뷰로설정                        
                        setPaginateCount(5);                                                                //paginate size
                    }
                }
            } else {
                //client side
                var url = url_json + "jsonservice/rest/user/select_userinfo_all";
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
        }


        //////////////////////////
        //postMessage receive
        //////////////////////////
        //dialog 내용 재정의
        window.addEventListener('message', function(event) {
            $('#dialog_write_position').css('pointer-events','auto');
            var customClassInfo = event.data[1];

            switch (event.data[0]) {
                case 1: //추가
                    document.getElementById('dialog-title1-dialog_container_main').textContent = "사용자 정보 추가";                       //title 변경
                    document.getElementById('dialog-title2-dialog_container_main').textContent = "사용자 정보를 추가합니다.";          //title 변경
                    init_input();

                    //mustimage
                    document.getElementById('dialog_write_user_id').classList.add('mustimage');
                    document.getElementById('dialog_write_password').classList.add('mustimage');

                    //css
                    document.getElementById('dialog_write_user_id').style.backgroundColor = "#fff";             //아이디 background-color
                    document.getElementById('dialog_write_user_id').readOnly = false;                           //아이디 수정 가능하게
                    document.getElementById('dialog_write_user_id_wrap').style.right = "80px";                  //아이디 중복 확인 버튼 보익기
                    document.getElementById('dialog_write_user_id_wrap').style.marginRight = "5px";
                    document.getElementById('dialog_write_check_user_wrap').style.display = "block";

                    document.getElementById('dialog_write_no').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    document.getElementById('dialog_write_regist_datetime').style.backgroundColor = "#ddd";     //등록일자 background-color
                    document.getElementById('dialog_write_lastsave_datetime').style.backgroundColor = "#ddd";   //최종수정일자 background-color
                    document.getElementById('dialog_write_password_wrap').style.right = "0px";                  //비밀번호 변경 버튼 없애기
                    document.getElementById('dialog_write_password_wrap').style.marginRight = "0px";
                    document.getElementById('dialog_write_password_change_warp').style.display = "none";

                    app_dialog.addDialog.classList.add('dialog-container--visible');
                    break;
                case 2: //수정
                    document.getElementById('dialog-title1-dialog_container_main').textContent = "사용자 정보 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main').textContent = "사용자 정보를 수정합니다.";          //title 변경
                    init_input();
                    
                    document.getElementById('dialog_write_user_id').value = customClassInfo.mb_id;
                    document.getElementById('dialog_write_password').value = "";
                    document.getElementById('dialog_write_name').value = customClassInfo.mb_name;
                    document.getElementById('dialog_write_email').value = customClassInfo.mb_email;
                    document.getElementById('dialog_write_mobile').value = customClassInfo.mb_mobile;      
                    document.getElementById('dialog_write_no').value = customClassInfo.no; 
                    document.getElementById('dialog_write_regist_datetime').value = customClassInfo.mb_regist_datetime;
                    document.getElementById('dialog_write_lastsave_datetime').value = customClassInfo.mb_lastsave_datetime;
                    document.getElementById('dialog_write_license_date').value = customClassInfo.mb_license_date;
                    
                    // document.getElementById('dialog_write_auth').options.value = customClassInfo.mb_auth;
                    // document.getElementById('dialog_write_dept').value = customClassInfo.mb_dept;   
                    
                    //셀렉트 박스
                    var dwa = document.getElementById('dialog_write_auth');
                    for (var k=0; k<dwa.length; k++) {
                        if (dwa.options[k].text == customClassInfo.mb_auth) {
                            dwa.selectedIndex = k;
                        }
                    }

                    var dwd = document.getElementById('dialog_write_dept');
                    for (var k=0; k<dwd.length; k++) {
                        if (dwd.options[k].text == customClassInfo.mb_dept) {
                            dwd.selectedIndex = k;
                        }
                    }

                    var dwp = document.getElementById('dialog_write_position');
                    for (var k=0; k<dwp.length; k++) {
                        if (dwp.options[k].text == customClassInfo.mb_position) {
                            dwp.selectedIndex = k;
                        }
                    }

                    var dws = document.getElementById('dialog_write_statususer');
                    if (customClassInfo.mb_statususer == "mainmenu_canvas_1")
                        dws.selectedIndex = 0;
                    else if (customClassInfo.mb_statususer == "mainmenu_canvas_2")
                        dws.selectedIndex = 1;
                    else if (customClassInfo.mb_statususer == "mainmenu_canvas_3")
                        dws.selectedIndex = 2;
                    else if (customClassInfo.mb_statususer == "mainmenu_canvas_4")
                        dws.selectedIndex = 3;
                    else if (customClassInfo.mb_statususer == "mainmenu_canvas_5")
                        dws.selectedIndex = 4;
                    else if (customClassInfo.mb_statususer == "mainmenu_canvas_6")
                        dws.selectedIndex = 5;
                    else if (customClassInfo.mb_statususer == "mainmenu_content_1")
                        dws.selectedIndex = 6;

                    for (var k=0; k<dws.length; k++) {
                        if (dws.options[k].text == customClassInfo.mb_statususer) {
                            dws.selectedIndex = k;
                        }
                    }

                    var dwt = document.getElementById('dialog_write_type');
                    for (var k=0; k<dwt.length; k++) {
                        if (dwt.options[k].text == customClassInfo.mb_type) {
                            dwt.selectedIndex = k;
                        }
                    }

                    var dwsc = document.getElementById('dialog_write_scale');
                    for (var k=0; k<dwsc.length; k++) {
                        if (dwsc.options[k].text == customClassInfo.mb_scale) {
                            dwsc.selectedIndex = k;
                        }
                    }

                    document.getElementById('dialog_write_task_1').value = customClassInfo.mb_task_1;
                    document.getElementById('dialog_write_task_2').value = customClassInfo.mb_task_2;
                    document.getElementById('dialog_write_task_3').value = customClassInfo.mb_task_3;
                    document.getElementById('dialog_write_task_4').value = customClassInfo.mb_task_4;

                    document.getElementById('dialog_write_x').value = customClassInfo.mb_x;
                    document.getElementById('dialog_write_y').value = customClassInfo.mb_y;
                    document.getElementById('dialog_write_code_device').value = customClassInfo.mb_code_device;
                    //image
                    //document.getElementById('print_selected_imagename').value = customClassInfo.mb_image;   //이미지 경로 input
                    if ((customClassInfo.mb_image == "") || (customClassInfo.mb_image == null)) {
                        document.getElementById('dialog_write_image_1').src = "/images/user3.png";      //다이어로그 창 기본이미지
                        $('#dialog_write_image_1').attr('data-src', "/images/user3.png");               //이미지 상세보기 기본이미지
                    } else {
                        document.getElementById('dialog_write_image_1').src = customClassInfo.mb_image;
                        $('#dialog_write_image_1').attr('data-src', customClassInfo.mb_image);
                    }
                    //image round
                    if (document.getElementById("dialog_write_image_1").classList.contains("round_image") == false) {
                        document.getElementById("dialog_write_image_1").classList.add("round_image");   
                    }


                    //css
                    document.getElementById('dialog_write_user_id').style.backgroundColor = "#ddd";             //아이디 background-color
                    document.getElementById('dialog_write_user_id').readOnly = true;                            //아이디 수정못하게
                    document.getElementById('dialog_write_user_id_wrap').style.right = "0px";                   //아이디 중복 확인 버튼 없애기
                    document.getElementById('dialog_write_user_id_wrap').style.marginRight = "0px";
                    document.getElementById('dialog_write_check_user_wrap').style.display = "none";

                    document.getElementById('dialog_write_no').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    document.getElementById('dialog_write_regist_datetime').style.backgroundColor = "#ddd";     //등록일자 background-color
                    document.getElementById('dialog_write_lastsave_datetime').style.backgroundColor = "#ddd";   //최종수정일자 background-color
                    document.getElementById('dialog_write_password_wrap').style.right = "80px";                 //비밀번호 변경 버튼 보이기
                    document.getElementById('dialog_write_password_wrap').style.marginRight = "5px";
                    document.getElementById('dialog_write_password_change_warp').style.display = "block";
                    //mustimage

                    app_dialog.addDialog.classList.add('dialog-container--visible');
                    break;
                case 3: //일괄 수정
                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-dialog_container_main').textContent = "사용자 정보 일괄 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main').textContent = "선택하신 " + getSCount + "개의 데이터에 아래의 각 항목에 입력된 정보만 일괄 변경되며, 입력되지 않은 필드의 정보는 기존의 데이터 그대로 유지됩니다.";           //title 변경
                    init_input();

                    //css
                    document.getElementById('dialog_write_user_id').readOnly = true;                            //아이디 수정못하게
                    document.getElementById('dialog_write_password').readOnly = true;                           //비밀번호 수정못하게
                    
                    document.getElementById('dialog_write_password_wrap').style.right = "0px";                  //비밀번호 변경 버튼 없애기
                    document.getElementById('dialog_write_password_wrap').style.marginRight = "0px";
                    document.getElementById('dialog_write_password_change_warp').style.display = "none";

                    app_dialog.addDialog.classList.add('dialog-container--visible');
                    break;
                case 4: //삭제
                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-messagebox1').textContent = "데이터 삭제";                  //title 변경
                    document.getElementById('dialog-title2-messagebox').textContent = "선택하신 " + getSCount + "개의 데이터를 삭제 하시겠습니까?";
                    document.getElementById('loading_spinner').style.display = "none";
                    // document.getElementById('dialog_write_name').value = "";
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
            document.getElementById('dialog_write_user_id').value = "";
            document.getElementById('dialog_write_password').value = "";
            document.getElementById('dialog_write_name').value = "";
            document.getElementById('dialog_write_email').value = "";
            document.getElementById('dialog_write_mobile').value = "";
            document.getElementById('dialog_write_no').value = "";
            document.getElementById('dialog_write_regist_datetime').value = "";
            document.getElementById('dialog_write_lastsave_datetime').value = "";
            document.getElementById('dialog_write_license_date').value = "";
            document.getElementById('dialog_write_auth').value = "";
            document.getElementById('dialog_write_dept').value = "";
            document.getElementById('dialog_write_position').value = "";
            document.getElementById('dialog_write_statususer').value = "";
            document.getElementById('dialog_write_type').value = "";
            document.getElementById('dialog_write_task_1').value = "";
            document.getElementById('dialog_write_task_2').value = "";
            document.getElementById('dialog_write_task_3').value = "";
            document.getElementById('dialog_write_task_4').value = "";
            document.getElementById('dialog_write_x').value = "";
            document.getElementById('dialog_write_y').value = "";
            document.getElementById('dialog_write_scale').value = "";
            document.getElementById('dialog_write_code_device').value = "";
            document.getElementById('print_selected_imagename').value = "";

            //image 경로
            document.getElementById('dialog_write_image').value = "";
            //상단 기본이미지
            document.getElementById('dialog_write_image_1').src = "/images/user3.png";
            $('#dialog_write_image_1').attr('data-src', "/images/user3.png");    //이미지 상세보기  기본이미지
            if (document.getElementById("dialog_write_image_1").classList.contains("round_image") == false) {
                document.getElementById("dialog_write_image_1").classList.add("round_image");   
            }
        }

        }, 0);
    });
});


function table_style_1(input_app_dialog, input_url, input_isServerSide){
    var returnObject = {
        
        /////////////////////////
        //가로 스크롤 가능하게 설정 (추가로 responsive: false로 설정해야 함)
        // scrollX: true,                  //responsive: false 일 경우 내용은 가로 스크롤이 되지만 scrollX를 false로 설정할 경우 헤더가 움직이지 않음
        // scrollY: '410px',              //height 사이즈
        // scrollCollapse: false,
        // scroller:       true,
        /////////////////////////
        responsive: true,                 //column 반응형 width 조절 (보이기, 안보이기 포함)        가로 스크롤 가능하게 설정하려면 false로 설정

        order: [[ 7, "desc" ]],           //기본 컬럼 정렬 설정
        ordering: true,                   //컬럼 정렬 여부        
        dom: 'Bfrtip',        
        paging: true,                     //페이지 나누기 여부        
        info: true,                       //페이지 위치 정보 (좌측 하단 ex: 1/3)
        filter: true,                     //검색창
        lengthChange: false,              
        stateSave: false,                  //새로고침 시에도 현재 상태 유지        
        pagingType: 'simple_numbers',     // numbers simple simple_numbers full full_numbers first_last_numbers
        lengthMenu: [[10, 15, 20, 30, 40, 50, -1], [10, 15, 20, 30, 40, 50, "All"]],
        pageLength: 15,                   //한 페이지에 출력될 게시물 수   
        data: input_app_dialog.dataSet,        
        //processing: true,                 //테이블이 처리 될 때 (예 : 정렬) '처리 중'표시기의 표시를 활성화 또는 비활성화

        retrieve: true,
        //deferRender:    true,
        initComplete: function () {       //초기화가 완료된 후 이벤트 메시지
            //messagebox_close();
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
                //tableid_table_statususer_pop => 현재 테이블을 구분짓는 고유 이름(팝업 찾기에서 고유이름 필요)
                className: 'dt-body-center dataTables_column_sequence_id class_table_column_sequence_wrap cardview_sequence cardview_tr_leftzero tableid_table_users',
                
                // visible: false,    //visible 브라우저 캐쉬삭제 후 테스트 필요
                // width: '3%',
                //width:'20px',
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
                data: 'mb_id',
                title: 'ID',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight datatables_maxColumn',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,

            },{ 
                data: 'mb_name',
                title: '이름',
                className: 'dt-body-center cardview_tr_leftzero cardview_tr_setheight datatables_maxColumn',    //datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,                
            },{
                data: 'mb_email',
                title: '메일',
                className: 'dt-body-center cardview_tr_leftzero cardview_tr_setheight',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap
                //숫자 표현
                // render: $.fn.dataTable.render.number( ',', '.', 0, '','' )  //number(세자리마다 표현할 문자, 소수점앞에 표현할 문자, 소수점 자리수, 값 앞에 붙일문자, 값 뒤에 붙일 문자)
            },{ 
                data: 'mb_mobile',
                title: '모바일 번호',
                className: 'dt-body-center cardview_tr_leftzero cardview_tr_setheight',
                orderable: true,
                searchable: true,
            },{
                data: 'mb_regist_datetime',
                title: '등록일',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_topright: cardview인 경우 오른쪽 상단에 출력
                orderable: true,
                searchable: true,
                //className: 'dt-body-right',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap
            },{
                data: 'mb_lastsave_datetime',
                title: '최종 수정일',
                className: 'dt-body-center cardview_tr_leftzero cardview_tr_setheight',
                orderable: true,
                searchable: true,
                //className: 'dt-body-right',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap
            },{ 
                data: 'mb_auth',
                title: '권한',
                className: 'dt-body-center cardview_tr_leftzero cardview_tr_setheight',
                orderable: true,
                searchable: true,
            },{
                data: 'mb_image',
                title: '이미지',
                className: 'dt-body-center cardview_leftimage',   //cardview_leftimage: 카드뷰 일경우 왼쪽 이미지
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    return '<img src="' + data + '" style="height:20px;width:20px;padding:0px;vertical-align: middle;" onerror="imgError_user(this);"/>';     
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
        //document.getElementById('id_table_column_sequence').style.display = 'inline-block';
    } else {
        document.getElementById('id_table_column_sequence').style.display = 'none'; 
    }
}