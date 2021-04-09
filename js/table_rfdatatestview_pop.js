
var app_dialog_pop;
$(document).ready(function() {
    loadScript("/js/table_style_pop.js", function(){
        //rfid 준비
        request_toUwp("init_rfid", "ef500");



        //서버사이드 테이블일 경우 true로 변경
        var isServerSide = false;

        //테스트
        //app_dialog_pop = tableInfo_pop('dialog_rfdatatestview_pop', JSON_POST_TEST());        //리스트뷰 생성
        app_dialog_pop = tableInfo_pop('dialog_rfdatatestview_pop',"");        //리스트뷰 생성
        //TEST====> JSON 데이터가 이미 존재함
        //모바일 디스플레이일 경우 카드뷰로 시작
        if (matchMedia("screen and (max-width:480px)").matches) {           //스마트폰이 세로인 경우
            //카드뷰로설정
            //setView_cardview_pop();

            //페이징 기능 중 1, 2, 3, 4, 5 와 같이 페이지를 나누어 주는 곳의 최대 카운트 설정
            $.fn.DataTable.ext.pager.numbers_length = 4;
        }


        // if (isServerSide) {
        //     if (sessionStorage.getItem(token_yj_rfms) != null) {
        //         //serverside
        //         var url = url_json + "jsonservice/rest/rfdatatestview/select_rfdatatestviewinfo_all_serverside";
        //         //json 데이터 수신 후 테이블 생성하기
        //         app_dialog_pop = tableInfo_pop('dialog_rfdatatestview_pop', null, url, isServerSide);           //리스트뷰 생성            
        //         setPaginateCount_pop(5);                                                                //paginate size

        //         //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
        //         if (matchMedia("screen and (max-width:480px)").matches) {                           //스마트폰이 세로인 경우                
        //             setView_cardview_pop();                                                             //카드뷰로설정
        //             setPaginateCount_pop(5);                                                            //paginate size
        //         }
        //     }
        // } else {
        //     //client side
        //     var url = url_json + "jsonservice/rest/rfdatatestview/select_rfdatatestviewinfo_all";
        //     JSON_POST(url, null, true, sessionStorage.getItem(token_yj_rfms), function (result) {
        //         setTimeout(function() {
        //             //json 데이터 수신 후 테이블 생성하기
        //             if (result[0] == "ok") {
        //                 app_dialog_pop = tableInfo_pop('dialog_rfdatatestview_pop', result[1], url, isServerSide);      //리스트뷰 생성
        //             } else {                                
        //                 messagebox_show(false, "데이터 가져오기 실패", result, null, false, true);
        //             }
                    
        //             //JSON 데이터를 모두 가져온 후 카드뷰 설정 시작 (모바일 디스플레이일 경우 카드뷰로 시작)
        //             setPaginateCount_pop(5);                                                                    //paginate size                    
        //             if (matchMedia("screen and (max-width:480px)").matches) {                               //스마트폰이 세로인 경우
        //                 setView_cardview_pop();                                                                 //카드뷰로설정                        
        //                 setPaginateCount_pop(5);                                                                //paginate size
        //             }
        //         }, 0);                                                                                    //지연시켜서 메시지박스를 호출하지 않으면 메시지 박스 내용(텍스트)가 변경되지 않음 
        //     });
        // }


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

                    document.getElementById('dialog-title1-dialog_container_main_pop').textContent = "품목 정보 추가";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main_pop').textContent = "품목 정보를 추가합니다.";          //title 변경
                    init_input();

                    // //css
                    // document.getElementById('dialog_write_user_id_pop').style.backgroundColor = "#fff";             //아이디 background-color
                    // document.getElementById('dialog_write_user_id_pop').readOnly = false;                           //아이디 수정 가능하게
                    // document.getElementById('dialog_write_user_id_wrap_pop').style.right = "80px";                  //아이디 중복 확인 버튼 보익기
                    // document.getElementById('dialog_write_user_id_wrap_pop').style.marginRight = "5px";
                    // document.getElementById('dialog_write_check_user_wrap_pop').style.display = "block";

                    document.getElementById('dialog_write_no_pop').style.backgroundColor = "#ddd";                  //고유번호 background-color
                    document.getElementById('dialog_write_regist_datetime_pop').style.backgroundColor = "#ddd";     //등록일자 background-color
                    document.getElementById('dialog_write_lastsave_datetime_pop').style.backgroundColor = "#ddd";   //최종수정일자 background-color
                   
                    app_dialog_pop.addDialog.classList.add('dialog-container--visible');
                    break;
                case 2: //수정
                    if (customClassInfo.rf_name == null) {
                        return;
                    }    

                    document.getElementById('dialog-title1-dialog_container_main_pop').textContent = "품목 정보 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main_pop').textContent = "품목 정보를 수정합니다.";          //title 변경
                    init_input();
                    
                    document.getElementById('dialog_write_rfdatatestviewinfo_name_pop').value = customClassInfo.rf_name;
                    document.getElementById('dialog_write_no_pop').value = customClassInfo.no; 
                    document.getElementById('dialog_write_regist_datetime_pop').value = customClassInfo.rf_regist_datetime;
                    document.getElementById('dialog_write_lastsave_datetime_pop').value = customClassInfo.rf_lastsave_datetime;


                    //image
                    if (customClassInfo.rf_image != null) {
                        document.getElementById('print_selected_imagename_pop').value = customClassInfo.rf_image;   //이미지 경로 input
                    }
                    
                    if ((customClassInfo.rf_image == "") || (customClassInfo.rf_image == null)) {
                        document.getElementById('dialog_write_image_1_pop').src = "/images/user3.png";      //다이어로그 창 기본이미지
                        $('#dialog_write_image_1_pop').attr('data-src', "/images/user3.png");               //이미지 상세보기 기본이미지
                    } else {
                        document.getElementById('dialog_write_image_1_pop').src = customClassInfo.rf_image;
                        $('#dialog_write_image_1_pop').attr('data-src', customClassInfo.rf_image);
                    }
                    //image round
                    if (document.getElementById("dialog_write_image_1_pop").classList.contains("round_image") == false) {
                        document.getElementById("dialog_write_image_1_pop").classList.add("round_image");   
                    }


                    // //css
                    // document.getElementById('dialog_write_user_id_pop').style.backgroundColor = "#ddd";             //아이디 background-color
                    // document.getElementById('dialog_write_user_id_pop').readOnly = true;                            //아이디 수정못하게
                    // document.getElementById('dialog_write_user_id_wrap_pop').style.right = "0px";                   //아이디 중복 확인 버튼 없애기
                    // document.getElementById('dialog_write_user_id_wrap_pop').style.marginRight = "0px";
                    //document.getElementById('dialog_write_check_user_wrap_pop').style.display = "none";

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
                    document.getElementById('dialog-title1-dialog_container_main_pop').textContent = "품목 정보 일괄 수정";                  //title 변경
                    document.getElementById('dialog-title2-dialog_container_main_pop').textContent = "선택하신 " + getSCount + "개의 데이터에 아래의 각 항목에 입력된 정보만 일괄 변경되며, 입력되지 않은 필드의 정보는 기존의 데이터 그대로 유지됩니다.";           //title 변경
                    init_input();

                    //css
                    // document.getElementById('dialog_write_user_id_pop').readOnly = true;                            //아이디 수정못하게
                    // document.getElementById('dialog_write_password_pop').readOnly = true;                           //비밀번호 수정못하게
                    
                    app_dialog_pop.addDialog.classList.add('dialog-container--visible');
                    break;
                case 4: //삭제
                    var getSCount = event.data[1];
                    document.getElementById('dialog-title1-messagebox1').textContent = "데이터 삭제";                  //title 변경
                    document.getElementById('dialog-title2-messagebox').textContent = "선택하신 " + getSCount + "개의 데이터를 삭제 하시겠습니까?";
                    document.getElementById('loading_spinner').style.display = "none";
                    // document.getElementById('dialog_write_name_pop').value = "";
                    // document.getElementById('dialog_write_mobile_pop').value = "";
                    // document.getElementById('dialog_write_email_pop').value = "";    

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
            document.getElementById('dialog_write_rfdatatestviewinfo_name_pop').value = "";
            document.getElementById('dialog_write_no_pop').value = "";
            document.getElementById('dialog_write_regist_datetime_pop').value = "";
            document.getElementById('dialog_write_lastsave_datetime_pop').value = "";               

            //image 경로
            document.getElementById('dialog_write_image_pop').value = "";
            //상단 기본이미지
            document.getElementById('dialog_write_image_1_pop').src = "/images/user3.png";      //다이어로그 창 기본이미지
            $('#dialog_write_image_1_pop').attr('data-src', "/images/user3.png");               //이미지 상세보기 기본이미지
            if (document.getElementById("dialog_write_image_1_pop").classList.contains("round_image") == false) {
                document.getElementById("dialog_write_image_1_pop").classList.add("round_image");   
            }
            //mustimage
            document.getElementById('dialog_write_rfdatatestviewinfo_name_pop').classList.add('mustimage');
        }

        $(window).on("beforeunload", function(){
            request_toUwp("deinit_rfid", "ef500");
        });
    });
});


function table_style_pop(input_app_dialog, input_url, input_isServerSide){    
    var returnObject = {
        //"bDeferRender": true,
        deferRender:    true,

        /////////////////////////
        //가로 스크롤 가능하게 설정 (추가로 responsive: false로 설정해야 함)
        scrollX: true,                  //responsive: false 일 경우 내용은 가로 스크롤이 되지만 scrollX를 false로 설정할 경우 헤더가 움직이지 않음
        scrollY: '410px',              //height 사이즈
        scrollCollapse: false,
        scroller:       true,
        /////////////////////////
        responsive: false,                 //column 반응형 width 조절 (보이기, 안보이기 포함)   ==== true 일 경우 ef500에서 태그리딩시 세로 길이가 길어질 경우 컬럼 길이가 이상해지는 현상 발생
        
        order: [[ 2, "asc" ]],           //기본 컬럼 정렬 설정
        ordering: true,                   //컬럼 정렬 여부        
        dom: 'Bfrtip',        
        paging: false,                    //페이지 나누기 여부        
        info: false,                       //페이지 위치 정보 (좌측 하단 ex: 1/3)
        filter: true,                     //검색창
        lengthChange: false,              
        stateSave: false,                  //새로고침 시에도 현재 상태 유지        
        pagingType: 'simple_numbers',     // numbers simple simple_numbers full full_numbers first_last_numbers
        lengthMenu: [[10, 15, 20, 30, 40, 50, -1], [10, 15, 20, 30, 40, 50, "All"]],
        pageLength: 300,                   //한 페이지에 출력될 게시물 수   
        data: input_app_dialog.dataSet,        
        //processing: true,                 //테이블이 처리 될 때 (예 : 정렬) '처리 중'표시기의 표시를 활성화 또는 비활성화

        retrieve: true,
        //deferRender:    true,
        initComplete: function () {       //초기화가 완료된 후 이벤트 메시지
            //messagebox_close();

            //('.useid_datatables_edit').css("display", "none");     //품목정보에서 일괄 수정이 필요없으므로 보이지 않게 함
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
        columns: [{         //고유 자동 증가 인덱스 (db로부터 가져온 번호, 화면에 보이지 않게 함)
                visible:true,     //화면에 보이지 않고, 고유번호 데이터만 사용
                //id: 'no',                
                data: 'no',
                title: 'NO',
                defaultContent: '',
                orderable: false,
                searchable: false,
                //cardview_sequence: 카드뷰일 경우 시퀀스 번호 폰트 사이즈 
                //tableid_table_rfdatatestview_pop => 현재 테이블을 구분짓는 고유 이름(팝업 찾기에서 고유이름 필요)
                className: 'dt-body-center dataTables_rf_no tableid_table_rfdatatestview_pop',  
                width: '10px',

                render: function (data, type, full, meta){              //시퀀스 번호
                    //return  meta.row + meta.settings._iDisplayStart + 1;                                //Asc
                    return meta.settings._iRecordsTotal - meta.settings._iDisplayStart - meta.row;        //Desc
                }
            },{
                data: 'rf_value',
                title: 'RFID 값',
                className: 'dt-body-center dataTables_rf_value',      //cardview_startcontent: 카드뷰일 경우 이 필드부터 내용 시작 (두번째 줄 출력이며, 첫번째 줄은 시퀀스 번호와 체크박스), datatables_maxColumn: 최대 컬럼 길이 설정
                orderable: true,
                searchable: true,
                width: '100%',
            },{ 
                visible: true,
                data: 'rf_regist_datetime',
                title: '읽은 시간',
                className: 'dt-body-center dataTables_rf_datetime',      //cardview_topright: cardview인 경우 오른쪽 상단에 출력
                orderable: true,
                searchable: true,
                width: '100%',
                //className: 'dt-body-right',   //dt-body-left, dt-body-center, dt-body-right, dt-body-justify, dt-body-nowrap
            },
        ],
        //buttons: getButtons_pop(input_app_dialog, true),
        buttons: [{
              label: 'Create',
              text: 'Read',
              width: '30px',
              //   float: 'left',
              action: function ( e, dt, node, config ) {
                document.getElementsByClassName('btn_rfid_inventorystart')[0].disabled = true;
                document.getElementsByClassName('btn_rfid_inventorystop')[0].disabled = false;
                document.getElementsByClassName('btn_rfid_inventorystart')[0].style.color = '#777777';
                document.getElementsByClassName('btn_rfid_inventorystop')[0].style.color = '#000000';

                request_toUwp("rfid_inventorystart", "ef500");
                
                // UWPJAVASCRIPT.Communicator.init_rfid("ef500");
                // UWPJAVASCRIPT.Communicator.rfid_inventorystart();
                // worker = new Worker('/js/worker_rfdatatestview.js');
                // worker.postMessage("START");
                // worker.onmessage = function(e) {
                //     document.getElementById('id_hybrid_test').textContent = e.data;
                // };

                
                // //타이머 설정 후 리스트뷰 출력 시작
                // timer_rfid = setInterval(timer_rfdatatestview ,5000);
                // function timer_rfdatatestview() {
                //     //버퍼 사용 신호를 준 후 버퍼에 존재하는 데이터 사용
                //     while(true) {
                //         if (isProcessRF == false) {
                //             isProcessRF = true;

                //             /////////////////////////////////////////////////////////////////////
                //             //gui 추가
                //             var RFdata = buffer_rfdata.splice(0, buffer_rfdata.length);
                //             if (RFdata.length > 0) {
                //                 for (var i=0; i<RFdata.length; i++){
                //                     app_dialog_pop.table.row.add(RFdata[i]);    //gui 추가
                //                     //app_dialog_pop.dataset.push(RFdata[i]);     //dataset 추가
                //                 }
                //             }
                //             /////////////////////////////////////////////////////////////////////

                //             isProcessRF = false;
                //             break;
                //         }
            
                //         setTimeout(function() {
                //         }, 100);
                //     }

                    
                //     //gui 삭제
                //     if (app_dialog_pop.table.data().length > 20) {
                //         for (var i=0; i<RFdata.length; i++){
                //             app_dialog_pop.table.row(i).remove();
                //             i--;
                //             //app_dialog_pop.dataset.push(RFdata[i]);     //dataset 추가
                //         }
                //         //app_dialog_pop.dataset.row(0).remove();
                //     }

                //     app_dialog_pop.table.draw();
                // }


                //     app_dialog_pop.table.draw();
                // }                
                // timer_rfid = setInterval(timer_rfdatatestview ,1);
                // function timer_rfdatatestview() {
                //     var sendData = {
                //         no: 1,
                //         rf_value: "epce030330222434",
                //         rf_regist_datetime: currentDateTime()
                //     }
                //     app_dialog_pop.table.row.add(sendData).draw();
                // }


                // //datatables test
                // timer_rfid = setInterval(timer_rfdatatestview ,1);
                // function timer_rfdatatestview() {
                //     var sendData = {
                //         no: 1,
                //         rf_value: "epce030330222434",
                //         rf_regist_datetime: currentDateTime()
                //     }
                //     app_dialog_pop.table.row.add(sendData).draw();
                // }


                
              },
              className: 'btn btn-primary btn_rfid_inventorystart'
            },{
              label: 'Edit',
              text: 'Stop',
              disabled: true,
              //   float: 'left',
              action: function ( e, dt, node, config ) {
                document.getElementsByClassName('btn_rfid_inventorystart')[0].disabled = false;
                document.getElementsByClassName('btn_rfid_inventorystop')[0].disabled = true;
                document.getElementsByClassName('btn_rfid_inventorystart')[0].style.color = '#000000';
                document.getElementsByClassName('btn_rfid_inventorystop')[0].style.color = '#777777';

                request_toUwp("rfid_inventorystop", "ef500");
                //UWPJAVASCRIPT.Communicator.rfid_inventorystop();
                // //타이머 중단
                // clearInterval(timer_rfid);

                // request_toUwp("rfid_inventorystop", "ef500");
              },
              className: 'btn btn-primary useid_datatables_edit btn_rfid_inventorystop'        //useid_datatables_edit 클래스 네임을 id대신 사용
            },{
                label: 'Clear',
                text: 'Clear',
                disabled: true,
                //   float: 'left',
                action: function ( e, dt, node, config ) {
                    app_dialog_pop.table.rows().remove().draw();
                },
                className: 'btn btn-primary'        //useid_datatables_edit 클래스 네임을 id대신 사용
            },{
                text: 'S',      //소리
                action: function ( e, dt, node, config ) {
                    //to uwp
                    request_toUwp("rfid_sound", "");        //클릭 on off

                    if (document.getElementsByClassName('btn_rfid_sound')[0].style.color != 'rgb(119, 119, 119)') {
                        document.getElementsByClassName('btn_rfid_sound')[0].style.color = 'rgb(119, 119, 119)';
                    } else {
                        document.getElementsByClassName('btn_rfid_sound')[0].style.color = '#000000';
                    }
                },
                className: 'btn btn-primary btn_rfid_sound'        //useid_datatables_edit 클래스 네임을 id대신 사용
            },{
                extend: 'excel',
                text: '엑셀',
                //   float: 'left',
                // title: $('h1').text(),
                // exportOptions: {
                //     modifier: {
                            // // DataTables core
                            // order : 'index',  // 'current', 'applied', 'index',  'original'
                            // page : 'all',      // 'all',     'current'
                            // search : 'none'     // 'none',    'applied', 'removed'
                //     }
                // },
                // select: true,
                // dom: 'Bfrtip',
            },{
                text: '기본뷰',
                //   float: 'left',
                position: 'relative',
                action: function ( e, dt, node, config ) {                    
                    if (node.get(0).innerText == "기본뷰") {     //현재 확대뷰인데 버튼을 눌렀을 경우 카드뷰로 전환
                        setView_cardview_pop();
                    } else if (node.get(0).innerText == "카드뷰") {     //현재 카드뷰인데 버튼을 눌렀을 경우 기본뷰로 전환
                        setView_normalview_pop();
                    }
                },
                className: 'btn btn-primary datatables_setview_clss_pop'
            },
        ],






        //초기화 이벤트         
        "fnDrawCallback": function(event){
            //$('#table_main_pop').columns.adjust().responsive.recalc();
            setTimeout(function(){
                //보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
                // check_visible_sequence_pop(1);
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
    // var count_allColumn = $('#table_main_pop').DataTable().columns().count() - count_hideColumn;
    // var count_visibleColumn = $('#table_main_pop').DataTable().columns(':visible').count();
    // if (count_visibleColumn < count_allColumn) {        //숨김 컬럼이 생기는 경우
    //     document.getElementById('id_table_column_sequence_pop').style.display = 'inline-block';
    // } else {
    //     document.getElementById('id_table_column_sequence_pop').style.display = 'none'; 
    // }
}