
var app_dialog_A;
$(document).ready(function() {
    loadScript("/js/table_style_manage_A.js", function(){
        //서버사이드 테이블일 경우 true로 변경
        var isServerSide = true;

        // //테스트
        // app_dialog_A = tableInfo_A('dialog_assetmanage_A', JSON_POST_TEST());        //리스트뷰 생성
        // //TEST====> JSON 데이터가 이미 존재함
        // //모바일 디스플레이일 경우 카드뷰로 시작
        // if (matchMedia("screen and (max-width:480px)").matches) {           //스마트폰이 세로인 경우
        //     //카드뷰로설정
        //     setView_cardview_A();

        //     //페이징 기능 중 1, 2, 3, 4, 5 와 같이 페이지를 나누어 주는 곳의 최대 카운트 설정
        //     $.fn.DataTable.ext.pager.numbers_length = 4;
        // }


        if (isServerSide) {
            if (sessionStorage.getItem(token_yj_rfms) != null) {
                //serverside
                var url = url_json + "jsonservice/rest/assetmanage/select_assetmanageinfo_all_serverside";
                //json 데이터 수신 후 테이블 생성하기
                app_dialog_A = tableInfo_A('dialog_assetmanage_A', null, url, isServerSide);           //리스트뷰 생성            
                //setPaginateCount_A(5);                                                                //paginate size

                //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                if (matchMedia("screen and (max-width:480px)").matches) {                           //스마트폰이 세로인 경우                
                    setView_cardview_A();                                                             //카드뷰로설정
                    //setPaginateCount_A(5);                                                            //paginate size
                }
            }
        } else {
            //client side
            var url = url_json + "jsonservice/rest/assetmanage/select_assetmanageinfo_all";
            JSON_POST(url, null, true, sessionStorage.getItem(token_yj_rfms), function (result) {
                setTimeout(function() {
                    //json 데이터 수신 후 테이블 생성하기
                    if (result[0] == "ok") {
                        app_dialog_A = tableInfo_A('dialog_assetmanage_A', result[1], url, isServerSide);      //리스트뷰 생성
                    } else {                                
                        messagebox_show(false, "데이터 가져오기 실패", result, null, false, true);
                    }
                    
                    //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                    //setPaginateCount_A(5);                                                                    //paginate size                    
                    if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
                        setView_cardview_A();                                                                 //카드뷰로설정                        
                        //setPaginateCount_A(5);                                                                //paginate size
                    }
                }, 0);                                                                                    //지연시켜서 메시지박스를 호출하지 않으면 메시지 박스 내용(텍스트)가 변경되지 않음 
            });
        }


        //////////////////////////
        //postMessage receive
        //////////////////////////
        //dialog 내용 재정의
        window.addEventListener('message', function(event) {
            var customClassInfo = event.data[1];

            switch (event.data[0]) {
                case 1: //추가
                    document.getElementById('dialog-title1-dialog_assetmanage_A').textContent = "자산 정보 추가";                       //title 변경
                    document.getElementById('dialog-title2-dialog_assetmanage_A').textContent = "자산 정보를 추가합니다.";          //title 변경                    
                    init_input();

                    //mustimage
                    document.getElementById('dialog_write_name_A').classList.add('mustimage');

                    // //css
                    // document.getElementById('dialog_write_user_A_id').style.backgroundColor = "#fff";             //아이디 background-color
                    // document.getElementById('dialog_write_user_A_id').readOnly = false;                           //아이디 수정 가능하게
                    // document.getElementById('dialog_write_user_A_id_wrap').style.right = "80px";                  //아이디 중복 확인 버튼 보익기
                    // document.getElementById('dialog_write_user_A_id_wrap').style.marginRight = "5px";
                    // document.getElementById('dialog_write_check_user_wrap').style.display = "block";

                    document.getElementById('dialog_write_no_A').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    document.getElementById('dialog_write_regist_datetime_A').style.backgroundColor = "#ddd";     //등록일자 background-color
                    document.getElementById('dialog_write_lastsave_datetime_A').style.backgroundColor = "#ddd";   //최종수정일자 background-color
                   
                    app_dialog_A.addDialog.classList.add('dialog-container--visible');
                    break;
                case 2: //수정
                    document.getElementById('dialog-title1-dialog_assetmanage_A').textContent = "자산 정보 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_assetmanage_A').textContent = "자산 정보를 수정합니다.";          //title 변경
                    init_input();

                    document.getElementById('dialog_write_code_model_A').value = customClassInfo.as_code_model;
                    document.getElementById('dialog_write_code_serial_A').value = customClassInfo.as_code_serial;
                    document.getElementById('dialog_write_name_A').value = customClassInfo.as_name;
                    //document.getElementById('dialog_write_asset_A').value = customClassInfo.as_type;
                    document.getElementById('dialog_write_price_current_A').value =  comma(customClassInfo.as_price_current);
                    document.getElementById('dialog_write_price_purchase_A').value = comma(customClassInfo.as_price_purchase);
                    //document.getElementById('dialog_write_company_purchase_A').value = customClassInfo.as_company_purchase;
                    document.getElementById('dialog_write_no_A').value = customClassInfo.no; 
                    document.getElementById('dialog_write_regist_datetime_A').value = customClassInfo.as_regist_datetime;
                    document.getElementById('dialog_write_lastsave_datetime_A').value = customClassInfo.as_lastsave_datetime;
                    //document.getElementById('dialog_write_status_A').value = customClassInfo.as_status;
                    //document.getElementById('dialog_write_dept_A').value = customClassInfo.as_dept;
                    //document.getElementById('dialog_write_user_A').value = customClassInfo.as_user;
                    //document.getElementById('dialog_write_local_name_A').value = customClassInfo.as_local_name;
                    document.getElementById('dialog_write_code_device_A').value = customClassInfo.as_code_device;
                    document.getElementById('dialog_write_x_A').value = customClassInfo.as_x;
                    document.getElementById('dialog_write_y_A').value = customClassInfo.as_y;
                    document.getElementById('dialog_write_etc_A').value = customClassInfo.as_etc;

                    //셀렉트 박스
                    var dwa = document.getElementById('dialog_write_asset_A');
                    for (var k=0; k<dwa.length; k++) {
                        if (dwa.options[k].text == customClassInfo.as_type) {
                            dwa.selectedIndex = k;
                        }
                    }

                    var dwa = document.getElementById('dialog_write_company_purchase_A');
                    for (var k=0; k<dwa.length; k++) {
                        if (dwa.options[k].text == customClassInfo.as_company_purchase) {
                            dwa.selectedIndex = k;
                        }
                    }

                    var dwa = document.getElementById('dialog_write_status_A');
                    for (var k=0; k<dwa.length; k++) {
                        if (dwa.options[k].text == customClassInfo.as_status) {
                            dwa.selectedIndex = k;
                        }
                    }

                    var dwa = document.getElementById('dialog_write_dept_A');
                    for (var k=0; k<dwa.length; k++) {
                        if (dwa.options[k].text == customClassInfo.as_dept) {
                            dwa.selectedIndex = k;
                        }
                    }

                    var dwa = document.getElementById('dialog_write_user_A');
                    for (var k=0; k<dwa.length; k++) {
                        if (dwa.options[k].text == customClassInfo.as_user) {
                            dwa.selectedIndex = k;
                        }
                    }

                    var dwa = document.getElementById('dialog_write_local_name_A');
                    for (var k=0; k<dwa.length; k++) {
                        if (dwa.options[k].text == customClassInfo.as_local_name) {
                            dwa.selectedIndex = k;
                        }
                    }


                    //image
                    document.getElementById('print_selected_imagename_A').value = customClassInfo.as_image;   //이미지 경로 input
                    if ((customClassInfo.as_image == "") || (customClassInfo.as_image == null)) {
                        document.getElementById('dialog_write_image_1_A').src = "/images/user3.png";      //다이어로그 창 기본이미지
                        $('#dialog_write_image_1_A').attr('data-src', "/images/user3.png");               //이미지 상세보기 기본이미지
                    } else {
                        document.getElementById('dialog_write_image_1_A').src = customClassInfo.as_image;
                        $('#dialog_write_image_1_A').attr('data-src', customClassInfo.as_image);
                    }
                    //image round
                    if (document.getElementById("dialog_write_image_1_A").classList.contains("round_image") == false) {
                        document.getElementById("dialog_write_image_1_A").classList.add("round_image");   
                    }


                    // //css
                    // document.getElementById('dialog_write_user_A_id').style.backgroundColor = "#ddd";             //아이디 background-color
                    // document.getElementById('dialog_write_user_A_id').readOnly = true;                            //아이디 수정못하게
                    // document.getElementById('dialog_write_user_A_id_wrap').style.right = "0px";                   //아이디 중복 확인 버튼 없애기
                    // document.getElementById('dialog_write_user_A_id_wrap').style.marginRight = "0px";
                    //document.getElementById('dialog_write_check_user_wrap').style.display = "none";

                    document.getElementById('dialog_write_no_A').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    document.getElementById('dialog_write_regist_datetime_A').style.backgroundColor = "#ddd";     //등록일자 background-color
                    document.getElementById('dialog_write_lastsave_datetime_A').style.backgroundColor = "#ddd";   //최종수정일자 background-color

                    //mustimage

                    app_dialog_A.addDialog.classList.add('dialog-container--visible');
                    break;
                case 3: //일괄 수정
                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-dialog_assetmanage_A').textContent = "자산 정보 일괄 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_assetmanage_A').textContent = "선택하신 " + getSCount + "개의 데이터에 아래의 각 항목에 입력된 정보만 일괄 변경되며, 입력되지 않은 필드의 정보는 기존의 데이터 그대로 유지됩니다.";           //title 변경
                    init_input();

                    //css
                    //document.getElementById('dialog_write_code_model_A').readOnly = true;                                  //수정못하게 함
                    app_dialog_A.addDialog.classList.add('dialog-container--visible');
                    break;
                case 4: //삭제
                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-messagebox1').textContent = "데이터 삭제";                  //title 변경
                    document.getElementById('dialog-title2-messagebox').textContent = "선택하신 " + getSCount + "개의 데이터를 삭제 하시겠습니까?";
                    document.getElementById('loading_spinner').style.display = "none";
                    // document.getElementById('dialog_write_name_A').value = "";
                    // document.getElementById('dialog_write_mobile').value = "";
                    // document.getElementById('dialog_write_email').value = "";    

                    app_dialog_A.removeDialog.classList.add('dialog-container--visible');
                    break;
                case 5: //보기
                    window.location.hash = "#view=" + customClassInfo.no;       //해쉬 설정
                    break;
                default:
                    break;
            }
        }, false);

        function init_input() {
            document.getElementById('dialog_write_code_model_A').value = "";
            document.getElementById('dialog_write_code_serial_A').value = "";
            document.getElementById('dialog_write_name_A').value = "";
            document.getElementById('dialog_write_asset_A').value = "";
            document.getElementById('dialog_write_price_current_A').value = "";
            document.getElementById('dialog_write_price_purchase_A').value = "";
            document.getElementById('dialog_write_company_purchase_A').value = "";
            document.getElementById('dialog_write_no_A').value = "";
            document.getElementById('dialog_write_regist_datetime_A').value = "";
            document.getElementById('dialog_write_lastsave_datetime_A').value = "";
            document.getElementById('dialog_write_status_A').value = "";
            document.getElementById('dialog_write_dept_A').value = "";
            document.getElementById('dialog_write_user_A').value = "";
            document.getElementById('dialog_write_local_name_A').value = "";
            document.getElementById('dialog_write_x_A').value = "";
            document.getElementById('dialog_write_y_A').value = "";
            document.getElementById('dialog_write_etc_A').value = "";                    

            //image 경로
            document.getElementById('dialog_write_image_A').value = "";
            //상단 기본이미지
            document.getElementById('dialog_write_image_1_A').src = "/images/user3.png";
            $('#dialog_write_image_1_A').attr('data-src', "/images/user3.png");    //이미지 상세보기  기본이미지
            if (document.getElementById("dialog_write_image_1_A").classList.contains("round_image") == false) {
                document.getElementById("dialog_write_image_1_A").classList.add("round_image");   
            }
        }
    });
});


function table_style_A(input_app_dialog, input_url, input_isServerSide){    
    var returnObject = {
        order: [[ 8, "desc" ]],           //기본 컬럼 정렬 설정
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
        //processing: true,                 //테이블이 처리 될 때 (예 : 정렬) '처리 중'표시기의 표시를 활성화 또는 비활성화

        retrieve: true,
        //deferRender:    true,
        initComplete: function () {       //초기화가 완료된 후 이벤트 메시지
            //messagebox_close();

            $('.useid_datatables_edit').css("display", "none");     //자산정보에서 일괄 수정이 필요없으므로 보이지 않게 함

            // //버튼 아이콘 변경
           // document.getElementsByClassName('ffffbutton')[0].classList.add("datatables_button_image_1");
            

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
                title: '<div id="id_table_column_sequence_A" style="cursor: pointer;font-size:15px;padding:0 5px 0 5px">+</div>',
                data: null,
                defaultContent: '',
                orderable: false,
                searchable: false,
                //cardview_sequence: 카드뷰일 경우 시퀀스 번호 폰트 사이즈 
                //tableid_table_assetmanage_A => 현재 테이블을 구분짓는 고유 이름(팝업 찾기에서 고유이름 필요)
                className: 'dt-body-center dataTables_column_sequence_id class_table_column_sequence_wrap cardview_sequence cardview_tr_leftzero tableid_table_assetmanage_A',
                
                // visible: false,    //visible 브라우저 캐쉬삭제 후 테스트 필요
                // width: '3%',
                width:'20px',
                render: function (data, type, full, meta){              //시퀀스 번호
                  //return  meta.row + meta.settings._iDisplayStart + 1;                                //Asc
                  return meta.settings._iRecordsTotal - meta.settings._iDisplayStart - meta.row;        //Desc
                }
            },{         //체크박스 (관리자만 사용)
                visible: false,
                title: '<input style="width:20px;height:20px;vertical-align:middle;" type="checkbox" id="id_checkbox_selectAll_A"></input>',
                data: null,
                defaultContent: '',
                orderable: false,
                searchable: false,
                className: 'dt-body-center dataTables_column_select_checkbox cardview_tr_leftzero',
                padding: 'padding: 10px 0px;',
                // visible: false,   //visible 브라우저 캐쉬삭제 후 테스트 필요
                width:'20px',
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
                data: 'as_name',
                title: '자산명',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight datatables_maxColumn',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
            },{
                data: 'as_type',
                title: '자산종류',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
            },{
                data: 'as_price_current',
                title: '현재가',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                //숫자 표현
                render: $.fn.dataTable.render.number( ',', '.', 0, '','' )  //number(세자리마다 표현할 문자, 소수점앞에 표현할 문자, 소수점 자리수, 값 앞에 붙일문자, 값 뒤에 붙일 문자)
            },{
                data: 'as_price_purchase',
                title: '취득가',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                //숫자 표현
                render: $.fn.dataTable.render.number( ',', '.', 0, '','' )  //number(세자리마다 표현할 문자, 소수점앞에 표현할 문자, 소수점 자리수, 값 앞에 붙일문자, 값 뒤에 붙일 문자)
            },{
                data: 'as_local_name',
                title: '위치',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
            },{
                data: 'as_regist_datetime',
                title: '등록일',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_topright: cardview인 경우 오른쪽 상단에 출력
                orderable: true,
                searchable: true,
                //className: 'dt-body-right',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap
            },{ 
                data: 'as_image',
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
        buttons: getButtons_A(input_app_dialog, true),

        //초기화 이벤트         
        "fnDrawCallback": function(event){
            //$('#table_main_A').columns.adjust().responsive.recalc();
            setTimeout(function(){
                //보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
                check_visible_sequence_A(1);
            });
        },
        
        }
    
    return returnObject;
};

//페이징 기능 중 1, 2, 3, 4, 5 와 같이 페이지를 나누어 주는 곳의 최대 카운트 설정
function setPaginateCount_A(input_len) {    
    // $.fn.DataTable.ext.pager.numbers_length = input_len;
}

//보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
function check_visible_sequence_A(count_hideColumn) {
    if (document.getElementById('id_table_column_sequence_A') != null) {
        var count_allColumn = $('#table_main_A').DataTable().columns().count() - count_hideColumn;
        var count_visibleColumn = $('#table_main_A').DataTable().columns(':visible').count();
        if (count_visibleColumn < count_allColumn) {        //숨김 컬럼이 생기는 경우
            document.getElementById('id_table_column_sequence_A').style.display = 'inline-block';
        } else {
            document.getElementById('id_table_column_sequence_A').style.display = 'none'; 
        }
    }
    
    if (document.getElementById('id_table_column_sequence_pop') != null) {
        var count_allColumn = $('#table_main_pop').DataTable().columns().count() - count_hideColumn;
        var count_visibleColumn = $('#table_main_pop').DataTable().columns(':visible').count();
        if (count_visibleColumn < count_allColumn) {        //숨김 컬럼이 생기는 경우
            document.getElementById('id_table_column_sequence_pop').style.display = 'inline-block';
        } else {
            document.getElementById('id_table_column_sequence_pop').style.display = 'none'; 
        }
    }
}