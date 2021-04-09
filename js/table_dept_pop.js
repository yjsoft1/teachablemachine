
var app_dialog_pop;
var ftms_db;

$(document).ready(function() {    
    loadScript("/js/table_style_pop.js", function(){
        //서버사이드 테이블일 경우 true로 변경
        var isServerSide = false;
        var isLocalSide = true;     //indexed DB 사용 사용

        // //테스트
        // app_dialog_pop = tableInfo_pop('dialog_dept_pop', JSON_POST_TEST());        //리스트뷰 생성
        // //TEST====> JSON 데이터가 이미 존재함
        // //모바일 디스플레이일 경우 카드뷰로 시작
        // if (matchMedia("screen and (max-width:480px)").matches) {           //스마트폰이 세로인 경우
        //     //카드뷰로설정
        //     setView_cardview_pop();

        //     //페이징 기능 중 1, 2, 3, 4, 5 와 같이 페이지를 나누어 주는 곳의 최대 카운트 설정
        //     $.fn.DataTable.ext.pager.numbers_length = 4;
        // }


        if (isLocalSide) {
            // //sqlite
            // load_sqlitefile('/db/ftms', function(data){

            //     var list_deptinfo = new Array();
            //     var sqldb = new SQL.Database(data);
            //     // Database is ready
            //     //var res = sqldb.exec("SELECT * FROM ftms.yj_dept ORDER BY de_regist_datetime DESC");
            //     var result = sqldb.prepare("SELECT * FROM yj_dept");
            //     while (result.step()) {
            //         var deptinfo = {
            //             no: result.getAsObject().de_no,
            //             select: false,
            //             de_name: result.getAsObject().de_name,
            //             de_regist_datetime: result.getAsObject().de_regist_datetime,
            //             de_lastsave_datetime: result.getAsObject().de_lastsave_datetime,
            //             de_lastsave_datetime: result.getAsObject().de_lastsave_datetime,
            //             de_image: result.getAsObject().de_image,
            //             de_etc: result.getAsObject().de_etc,
            //         };

            //         list_deptinfo.push(deptinfo);
            //     }
                
            //     //var list_deptinfo_json = JSON.stringify(list_deptinfo);
                
            //     app_dialog_pop = tableInfo_pop('dialog_dept_pop', list_deptinfo, url, isServerSide);      //리스트뷰 생성

            //     //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
            //     setPaginateCount_pop(5);                                                                    //paginate size                    
            //     if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
            //         setView_cardview_pop();                                                                 //카드뷰로설정                        
            //         setPaginateCount_pop(5);                                                                //paginate size
            //     }
            // });

            //indexed db select all
            var list_deptinfo = new Array();

            indexedDB_open(function(e) {
                var transaction = e.transaction(["yj_dept"], "readwrite");
                var store = transaction.objectStore("yj_dept");

                store.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        var deptinfo = {
                            de_no: cursor.key,
                            de_select: false,
                            de_name: cursor.value.de_name,
                            de_regist_datetime: cursor.value.de_regist_datetime,
                            de_lastsave_datetime: cursor.value.de_lastsave_datetime,
                            de_image: cursor.value.de_image,
                            de_etc: cursor.value.de_etc,
                        };
                        list_deptinfo.push(deptinfo);

                        cursor.continue();
                    } else {
                        app_dialog_pop = tableInfo_pop('dialog_dept_pop', list_deptinfo, url, isServerSide);      //리스트뷰 생성

                        //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                        setPaginateCount_pop(5);                                                                    //paginate size                    
                        if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
                            setView_cardview_pop();                                                                 //카드뷰로설정                        
                            setPaginateCount_pop(5);                                                                //paginate size
                        }
                    }
                 };
            });
        } else {
            if (isServerSide) {
                if (sessionStorage.getItem(token_yj_rfms) != null) {
                    //serverside
                    var url = url_json + "jsonservice/rest/dept/select_deptinfo_all_serverside";
                    //json 데이터 수신 후 테이블 생성하기
                    app_dialog_pop = tableInfo_pop('dialog_dept_pop', null, url, isServerSide);           //리스트뷰 생성            
                    setPaginateCount_pop(5);                                                                //paginate size
    
                    //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                    if (matchMedia("screen and (max-width:480px)").matches) {                           //스마트폰이 세로인 경우                
                        setView_cardview_pop();                                                             //카드뷰로설정
                        setPaginateCount_pop(5);                                                            //paginate size
                    }
                }
            } else {
                //client side
                var url = url_json + "jsonservice/rest/dept/select_deptinfo_all";
                JSON_POST(url, null, true, sessionStorage.getItem(token_yj_rfms), function (result) {
                    setTimeout(function() {
                        //json 데이터 수신 후 테이블 생성하기
                        if (result[0] == "ok") {
                            app_dialog_pop = tableInfo_pop('dialog_dept_pop', result[1], url, isServerSide);      //리스트뷰 생성
                        } else {                                
                            messagebox_show(false, "데이터 가져오기 실패", result, null, false, true);
                        }
                        
                        //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
                        setPaginateCount_pop(5);                                                                    //paginate size                    
                        if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
                            setView_cardview_pop();                                                                 //카드뷰로설정                        
                            setPaginateCount_pop(5);                                                                //paginate size
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
            var customClassInfo = event.data[1];

            switch (event.data[0]) {
                case 1: //추가
                    if (document.getElementById('dialog-title1-dialog_container_main_pop') == null) {
                        return;
                    }

                    document.getElementById('dialog-title1-dialog_container_main_pop').textContent = "부서 정보 추가";                       //title 변경
                    document.getElementById('dialog-title2-dialog_container_main_pop').textContent = "부서 정보를 추가합니다.";          //title 변경
                    init_input();

                    //mustimage
                    document.getElementById('dialog_write_deptinfo_name_pop').classList.add('mustimage');

                    // //css
                    // document.getElementById('dialog_write_user_id').style.backgroundColor = "#fff";             //아이디 background-color
                    // document.getElementById('dialog_write_user_id').readOnly = false;                           //아이디 수정 가능하게
                    // document.getElementById('dialog_write_user_id_wrap').style.right = "80px";                  //아이디 중복 확인 버튼 보익기
                    // document.getElementById('dialog_write_user_id_wrap').style.marginRight = "5px";
                    // document.getElementById('dialog_write_check_user_wrap').style.display = "block";

                    document.getElementById('dialog_write_no_pop').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    document.getElementById('dialog_write_regist_datetime_pop').style.backgroundColor = "#ddd";     //등록일자 background-color
                    document.getElementById('dialog_write_lastsave_datetime_pop').style.backgroundColor = "#ddd";   //최종수정일자 background-color
                   
                    app_dialog_pop.addDialog.classList.add('dialog-container--visible');
                    break;
                case 2: //수정
                    if (customClassInfo.de_name == null) {
                        return;
                    }    

                    document.getElementById('dialog-title1-dialog_container_main_pop').textContent = "부서 정보 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main_pop').textContent = "부서 정보를 수정합니다.";          //title 변경
                    init_input();
                    
                    document.getElementById('dialog_write_deptinfo_name_pop').value = customClassInfo.de_name;
                    document.getElementById('dialog_write_no_pop').value = customClassInfo.no; 
                    document.getElementById('dialog_write_regist_datetime_pop').value = customClassInfo.de_regist_datetime;
                    document.getElementById('dialog_write_lastsave_datetime_pop').value = customClassInfo.de_lastsave_datetime;


                    //image
                    if (customClassInfo.at_image != null) {
                        document.getElementById('print_selected_imagename_pop').value = customClassInfo.at_image;   //이미지 경로 input
                    }
                    
                    if ((customClassInfo.at_image == "") || (customClassInfo.at_image == null)) {
                        document.getElementById('dialog_write_image_1_pop').src = "/images/user3.png";      //다이어로그 창 기본이미지
                        $('#dialog_write_image_1_pop').attr('data-src', "/images/user3.png");               //이미지 상세보기 기본이미지
                    } else {
                        document.getElementById('dialog_write_image_1_pop').src = customClassInfo.at_image;
                        $('#dialog_write_image_1_pop').attr('data-src', customClassInfo.at_image);
                    }
                    //image round
                    if (document.getElementById("dialog_write_image_1_pop").classList.contains("round_image") == false) {
                        document.getElementById("dialog_write_image_1_pop").classList.add("round_image");   
                    }


                    // //css
                    // document.getElementById('dialog_write_user_id').style.backgroundColor = "#ddd";             //아이디 background-color
                    // document.getElementById('dialog_write_user_id').readOnly = true;                            //아이디 수정못하게
                    // document.getElementById('dialog_write_user_id_wrap').style.right = "0px";                   //아이디 중복 확인 버튼 없애기
                    // document.getElementById('dialog_write_user_id_wrap').style.marginRight = "0px";
                    //document.getElementById('dialog_write_check_user_wrap').style.display = "none";

                    document.getElementById('dialog_write_no_pop').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    document.getElementById('dialog_write_regist_datetime_pop').style.backgroundColor = "#ddd";     //등록일자 background-color
                    document.getElementById('dialog_write_lastsave_datetime_pop').style.backgroundColor = "#ddd";   //최종수정일자 background-color

                    //mustimage

                    app_dialog_pop.addDialog.classList.add('dialog-container--visible');
                    break;
                case 3: //일괄 수정
                    if (document.getElementById('dialog-title1-dialog_container_main_pop') == null) {
                        return;
                    }  

                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-dialog_container_main_pop').textContent = "부서 정보 일괄 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main_pop').textContent = "선택하신 " + getSCount + "개의 데이터에 아래의 각 항목에 입력된 정보만 일괄 변경되며, 입력되지 않은 필드의 정보는 기존의 데이터 그대로 유지됩니다.";           //title 변경
                    init_input();

                    //css
                    // document.getElementById('dialog_write_user_id').readOnly = true;                            //아이디 수정못하게
                    // document.getElementById('dialog_write_password').readOnly = true;                           //비밀번호 수정못하게
                    
                    app_dialog_pop.addDialog.classList.add('dialog-container--visible');
                    break;
                case 4: //삭제
                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-messagebox1').textContent = "데이터 삭제";                  //title 변경
                    document.getElementById('dialog-title2-messagebox').textContent = "선택하신 " + getSCount + "개의 데이터를 삭제 하시겠습니까?";
                    document.getElementById('loading_spinner').style.display = "none";
                    // document.getElementById('dialog_write_name').value = "";
                    // document.getElementById('dialog_write_mobile').value = "";
                    // document.getElementById('dialog_write_email').value = "";    

                    app_dialog_pop.removeDialog.classList.add('dialog-container--visible');
                    break;
                case 5: //보기
                    window.location.hash = "#view=" + customClassInfo.no;       //해쉬 설정
                    break;
                default:
                    break;
            }
        }, false);

        function init_input() {
            document.getElementById('dialog_write_deptinfo_name_pop').value = "";
            document.getElementById('dialog_write_no_pop').value = "";
            document.getElementById('dialog_write_regist_datetime_pop').value = "";
            document.getElementById('dialog_write_lastsave_datetime_pop').value = "";

            //image 경로
            document.getElementById('dialog_write_image_pop').value = "";
            //상단 기본이미지
            document.getElementById('dialog_write_image_1_pop').src = "/images/user3.png";
            $('#dialog_write_image_1_pop').attr('data-src', "/images/user3.png");    //이미지 상세보기  기본이미지
            if (document.getElementById("dialog_write_image_1_pop").classList.contains("round_image") == false) {
                document.getElementById("dialog_write_image_1_pop").classList.add("round_image");   
            }
        }
    });
});


function table_style_pop(input_app_dialog, input_url, input_isServerSide){
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
        //processing: true,                 //테이블이 처리 될 때 (예 : 정렬) '처리 중'표시기의 표시를 활성화 또는 비활성화

        retrieve: true,
        //deferRender:    true,
        initComplete: function () {       //초기화가 완료된 후 이벤트 메시지
            //messagebox_close();

            $('.useid_datatables_edit').css("display", "none");     //부서정보에서 일괄 수정이 필요없으므로 보이지 않게 함
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
                title: '<div id="id_table_column_sequence_pop" style="cursor: pointer;font-size:15px;padding:0 5px 0 5px">+</div>',
                data: null,
                defaultContent: '',
                orderable: false,
                searchable: false,
                //cardview_sequence: 카드뷰일 경우 시퀀스 번호 폰트 사이즈 
                //tableid_table_dept_pop => 현재 테이블을 구분짓는 고유 이름(팝업 찾기에서 고유이름 필요)
                className: 'dt-body-center dataTables_column_sequence_id class_table_column_sequence_wrap cardview_sequence cardview_tr_leftzero tableid_table_dept_pop',
                
                // visible: false,    //visible 브라우저 캐쉬삭제 후 테스트 필요
                // width: '3%',
                width:'20px',
                render: function (data, type, full, meta){              //시퀀스 번호
                  //return  meta.row + meta.settings._iDisplayStart + 1;                                //Asc
                  return meta.settings._iRecordsTotal - meta.settings._iDisplayStart - meta.row;        //Desc
                }
            },{         //체크박스 (관리자만 사용)
                visible: false,
                title: '<input style="width:20px;height:20px;vertical-align:middle;" type="checkbox" id="id_checkbox_selectAll_pop"></input>',
                data: null,
                defaultContent: '',
                orderable: false,
                searchable: false,
                className: 'dt-body-center dataTables_column_select_checkbox cardview_tr_leftzero',
                padding: 'padding: 10px 0px;',
                // visible: false,   //visible 브라우저 캐쉬삭제 후 테스트 필요
                width:'20px',
                render: function (data, type, full, meta){
                    return '<input style="width:20px;height:20px;vertical-align:middle;" type="checkbox" selectRow="true" id="id_checkbox1_pop" class="class_checkbox1" name="id[]" value="' + $('<div/>').text(data).html() + '">';
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
                data: 'de_name',
                title: '부서명',
                className: 'dt-body-center cardview_startcontent cardview_tr_leftzero cardview_tr_setheight datatables_maxColumn',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,

            },{ 
                data: 'de_regist_datetime',
                title: '등록일',
                className: 'dt-body-center cardview_topright cardview_tr_setheight',      //cardview_topright: cardview인 경우 오른쪽 상단에 출력
                orderable: true,
                searchable: true,
                //className: 'dt-body-right',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap
            },{ 
                data: 'de_lastsave_datetime',
                title: '최종 수정일',
                className: 'dt-body-center cardview_tr_leftzero cardview_tr_setheight',
                orderable: true,
                searchable: true,
                //className: 'dt-body-right',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap         
            },{
                data: 'de_image',
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
        buttons: getButtons_pop(input_app_dialog, true),

        //초기화 이벤트         
        "fnDrawCallback": function(event){
            //$('#table_main_pop').columns.adjust().responsive.recalc();
            setTimeout(function(){
                //보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
                check_visible_sequence_pop(1);
            });
        },
        
        }
    
    return returnObject;
};

//페이징 기능 중 1, 2, 3, 4, 5 와 같이 페이지를 나누어 주는 곳의 최대 카운트 설정
function setPaginateCount_pop(input_len) {
    // $.fn.DataTable.ext.pager.numbers_length = input_len;
}

//보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
function check_visible_sequence_pop(count_hideColumn) {
    var count_allColumn = $('#table_main_pop').DataTable().columns().count() - count_hideColumn;
    var count_visibleColumn = $('#table_main_pop').DataTable().columns(':visible').count();
    if (count_visibleColumn < count_allColumn) {        //숨김 컬럼이 생기는 경우
        //document.getElementById('id_table_column_sequence_pop').style.display = 'inline-block';
    } else {
        document.getElementById('id_table_column_sequence_pop').style.display = 'none'; 
    }
}