function tableInfo_A(function_addDialog, input_dataset, input_url, input_isServerSide) {
    ////////////////////////
    //dialog List
    ////////////////////////
    var app_dialog = {
        table: null,                    //listview
        dataSet: input_dataset,         //listview data
    
        select_multi: false,            //row 의 여러라인 선택 여부 (아직 multi select 구현 안함)
        index_id_position: 0,
        index_id: "no",                 //json데이터 중 id로 사용할 index (데이터베이스로부터 가져온 고유 일련번호)
        index_checkboxStatus: "select", //json데이터 중 checkbox 선택여부로 사용할 index (listview에서 사용자가 체크박스로 선택한 항목)

        //항목 정보
        fileds: null,

        //addDialog: document.getElementById('dialog1'),
        addDialog: document.getElementById(function_addDialog),
        removeDialog: document.getElementById('dialog_messagebox'),
        messageboxDialog: document.getElementById('dialog_messabebox'),
        fileuploadDialog: document.getElementById('dialog_fileupload'),
    };
    
    //추가창 보이기, 숨기기 (visible: dialog창 보이기/숨기기,   isAdd: 1-데이터추가시 초기화, 2-데이터 수정시 선택한 항목 보이지기, 3-일괄 데이터 변경시 초기화)
    app_dialog.function_addDialog = function(visible, option) {
        setDialogInit(option, null);
    };

    //삭제창 보이기 (체크박스로 선택한 row)
    app_dialog.function_removeDialog = function(visible, option) {
        setDialogInit(option, null);
    };

    //체크박스로 선택한 row 고유인덱스(no) 반환
    app_dialog.function_getSelectDataValue = function() {
        var k = 0;
        var selectionValue = new Array();
        for (var i=0; i<app_dialog.dataSet.length; i++) {
            if (app_dialog.dataSet[i][app_dialog.index_checkboxStatus] == "true") {
                //선택 번호 저장하기
                selectionValue[k++] = app_dialog.dataSet[i][app_dialog.index_id];
            }
        }
        return selectionValue;
    }

    //팝업창 기본 정의  => 다이어로그의 각 텍스트는 사용자정의 자바스크립트 (ex: table_content_1.js) 에서 재정의 함
    function setDialogInit(option, row_object) {
        //scroll off
        scroll_body_on_off(false);
        try{
            document.getElementsByClassName("modal-window")[0].scrollTop = 0;
        } catch (e) {
        }

        try{
            $('html, body').animate({scrollTop:0},0);
        } catch (e) {
        }

        if (option == 1) {              //add
            if (document.getElementById('dialog-title1-dialog_assetmanage_A') == null) {
                return;
            }
            
            document.getElementById('dialog-title1-dialog_assetmanage_A').textContent = "데이터 추가";           //title 변경
            document.getElementById('dialog-title2-dialog_assetmanage_A').textContent = "각 항목의 데이터를 추가합니다.";           //title 변경
            setBackgroundColorInputbox_init('dialog_write_A');     //dialog의 모든 inputbox의 색상을 초기화
        } else if (option == 2) {       //edit
            if (document.getElementById('dialog-title1-dialog_assetmanage_A') == null) {
                return;
            }

            document.getElementById('dialog-title1-dialog_assetmanage_A').textContent = "데이터 수정";           //title 변경
            document.getElementById('dialog-title2-dialog_assetmanage_A').textContent = "각 항목의 데이터를 수정합니다.";           //title 변경
            setBackgroundColorInputbox_init('dialog_write_A');     //dialog의 모든 inputbox의 색상을 초기화
        } else if (option == 3) {       //edit (일괄 수정)
            if (document.getElementById('dialog-title1-dialog_assetmanage_A') == null) {
                return;
            }

            var getSCount = getSelectDataCount();
            if (getSCount < 1) {
                messagebox_show(false, "데이터 일괄 수정", "수정하실 데이터를 체크박스로 선택하여 주시기 바랍니다.", null, false, true);
                return false;
            } else {
                document.getElementById('dialog-title1-dialog_assetmanage_A').textContent = "데이터 일괄 수정";           //title 변경
                document.getElementById('dialog-title2-dialog_assetmanage_A').textContent = "각 항목에 입력된 정보만 일괄 변경되며, 입력되지 않은 필드의 정보는 기존의 데이터 그대로 유지됩니다.";           //title 변경
                setBackgroundColorInputbox_dark('dialog_write_A');     //dialog의 모든 inputbox 를 사용하지 못하게 하기
                row_object = getSCount;
            }
        } else if (option == 4) {
            var getSCount = getSelectDataCount();
            if (getSCount < 1) {
                messagebox_show(false, "데이터 삭제 오류", "삭제하실 항목을 선택하여 주시기 바랍니다.", null, false, true);
                return false;
            } else {
                document.getElementById('btnSave_messagebox').style.display = 'inline-block';
                document.getElementById('btnCancel_messagebox').textContent = "취소";
                document.getElementById('dialog-title2-messagebox').textContent = "선택하신 " + getSCount + "개의 데이터를 삭제 하시겠습니까?";
                row_object = getSCount;
            }
        }

        //postMessage send
        window.postMessage([option, row_object], window.location.href);       //다이어로그의 각 텍스트는 사용자정의 자바스크립트 (ex: table_content_1.js) 에서 재정의 함

        return true;
    }

    //주어진 id 하단의 모든 inputbox 를 정상적으로 표현함
    function setBackgroundColorInputbox_init(layout_id) {
        var getInputBoxs = document.getElementById(layout_id).querySelectorAll('input, select');
        for (var i=0; i<getInputBoxs.length; i++) {
            getInputBoxs[i].style.backgroundColor = "#fff";
            //getInputBoxs[i].style.backgroundImage = "none";
        }
    }

    //주어진 id 하단의 모든 inputbox 를 어둡게 표현함
    function setBackgroundColorInputbox_dark(layout_id) {
        var getInputBoxs = document.getElementById(layout_id).querySelectorAll('input, select');
        for (var i=0; i<getInputBoxs.length; i++) {
            getInputBoxs[i].style.backgroundColor = "#ddd";
            //getInputBoxs[i].style.backgroundImage = "none";
            getInputBoxs[i].classList.remove('mustimage');
        }
    }

    //체크박스로 선택한 row count 반환
    function getSelectDataCount() {
        var selectionCount = 0;
        for (var i=0; i<app_dialog.dataSet.length; i++) {
            if (app_dialog.dataSet[i][app_dialog.index_checkboxStatus] == "true") {
                selectionCount++;
            }                
        }
        return selectionCount;
    }

    //체크박스의 선택여부 저장하기
    function setSelectRowStatus(input_selectedIndex, input_selectionStatus) {            
        for (var i=0; i<app_dialog.dataSet.length; i++){
            if (app_dialog.dataSet[i][app_dialog.index_id] == input_selectedIndex) {
                app_dialog.dataSet[i][app_dialog.index_checkboxStatus] = input_selectionStatus;
                return;
            }
        }
    }

    //체크박스로 모든 항목 선택하기
    function setCheckboxSelectAll(input_setCurrentPage, input_checked) {
        var rows;
        if (input_setCurrentPage) {
            //GUI 변경 (현재 테이블의 보이는 페이지 부분만 선택하기)
            rows = app_dialog.table.rows({ page: 'current' }).nodes();
            var result = $('input[type="checkbox"]', rows).prop('checked', input_checked);

            //데이터 변경
            for (var i=0; i<rows.length; i++) {
                var rowInfo = app_dialog.table.row(rows[i].closest('tr')).data();    //체크박스로 선택한 Row의 정보 가져오기
                setSelectRowStatus(rowInfo[app_dialog.index_id], String(input_checked));
            }
        } else {
            //GUI 변경 (현재 테이블의 모든 Row 선택, 선택취소)
            rows = app_dialog.table.rows({ 'search': 'applied' }).nodes();
            $('input[type="checkbox"]', rows).prop('checked', input_checked);

            //데이터 변경
            for (var i=0; i<rows.length; i++) {
                var rowInfo = app_dialog.table.row(i).data();    //체크박스로 선택한 Row의 정보 가져오기
                setSelectRowStatus(rowInfo[app_dialog.index_id], String(input_checked));
            }
        }
    }

    ////////////////////////
    //테이블 초기화 (스타일 적용)
    ////////////////////////
    var tableOption = table_style_A(app_dialog, input_url, input_isServerSide);
    //서버 사이드 테이블일 경우 아래 내용 추가
    if (input_isServerSide) {        
        //tableOption.jQueryUI = true;

        //tableOption.bJQueryUI = true,
       // tableOption.bRetrieve = true,
        //tableOption.bFilter = true,
        //tableOption.bProcessing = false;
        //tableOption.bServerSide = true;
        tableOption.processing = false;
        tableOption.serverSide = true;
        //tableOption.asSorting = "asc";
        // tableOption.sAjaxSource = input_url;
        //tableOption.sServerMethod = "POST";
        //tableOption.bLengthChange = false;

        tableOption.ajax = ({
            url: input_url,
            type: "POST",
            //aync: true,
            
            beforeSend: function(request) {
                request.setRequestHeader("Content-Type", "application/json");
                //request.setRequestHeader("Authority", authorizationToken);
                request.setRequestHeader('Authorization','Bearer '+ sessionStorage.getItem(token_yj_rfms));
            },    
            data:function(outData){
                //console.log(outData);
                return JSON.stringify(outData);
            },
            dataFilter:function(inData){
                //console.log(inData);
                return inData; 
            },
            complete: function (result) {
                app_dialog.dataSet = result.responseJSON.aaData;
            }
        });


        // tableOption.ajax = ({
        //     "url": input_url,
        //     "type": "GET",
        //     beforeSend: function(request) {
        //         request.setRequestHeader("Content-Type", "application/json");
        //         //request.setRequestHeader("Authority", authorizationToken);
        //     },
        //     //"contentType": "application/json; charset=utf-8",
        //     "dataType": "jsonp",
        //     "data":function(outData){
        //         console.log(outData);
        //         return outData;
        //     },
        //     dataFilter:function(inData){
        //         console.log(inData);
        //         return inData;
        //     },
        //     error:function(err, status){
        //         console.log(err);
        //     }
        // });

    }
    //테이블 초기화
    app_dialog.table = $('#table_main_A').DataTable(
        tableOption
    )    
    
    ////////////////////////
    //이벤트 설정
    ////////////////////////

    //시퀀스 전체 선택 (child  보이기, 숨기기)
    $('#table_main_A thead').on('click', 'th', function(e){
        //첫번째 헤더를 선택하였는지 확인
        var isFind = false;
        for (var i=0; i < this.classList.length; i++) {
            if (this.classList[i] == "class_table_column_sequence_wrap") {
                isFind = true;
            }            
        }

        //첫번째 헤더가 아니라면 종료
        if (isFind == false) {
            return;
        }

        //child 전체확대, 축소
        if (this.textContent == "+") {
            this.textContent = "-";
            app_dialog.table.rows(':not(.parent)').nodes().to$().find('td:first-child').trigger('click');
        } else {
            this.textContent = "+";
            app_dialog.table.rows('.parent').nodes().to$().find('td:first-child').trigger('click');           //Child 확대 => 원래대로 줄이기
        }
    });


    $('#id_table_column_sequence_A').click(function(e) {
        // if (this.textContent == "+") {
        //     this.textContent = "-";
        //     app_dialog.table.rows(':not(.parent)').nodes().to$().find('td:first-child').trigger('click');
        // } else {
        //     this.textContent = "+";
        //     app_dialog.table.rows('.parent').nodes().to$().find('td:first-child').trigger('click');           //Child 확대 => 원래대로 줄이기
        // }


        // document.getElementById("table_main").classList.remove("responsive");                                   //컬럼 자동정렬 해제
        //             document.getElementById("table_main").classList.add("datatables_cardview");                      //카드뷰 적용
        //             input_app_dialog.table.rows('.parent').nodes().to$().find('td:first-child').trigger('click');           //Child 확대 => 원래대로 줄이기
                    
        //             node.get(0).innerText = "카드뷰";
        //         } else if (node.get(0).innerText == "카드뷰") {     //현재 카드뷰인데 버튼을 눌렀을 경우 기본뷰로 전환
        //             //기본뷰일 경우의 설정들
        //             document.getElementById("table_main_A").classList.add("responsive");                                      //컬럼 자동정렬 설정
        //             document.getElementById("table_main_A").classList.remove("datatables_cardview");                   //카드뷰 삭제 (기본뷰 적용)
        //             node.get(0).innerText = "기본뷰";
    });
    
    //체크박스 전체 선택
    app_dialog.table.column(1).visible(true);
    $('#id_checkbox_selectAll_A').click(function(e) {
        var select_currentPage = true;     //모든 데이터 선택 (현재 보이는 페이지만 선택하려면 true로 설정)
        setCheckboxSelectAll(select_currentPage, this.checked);
    });
    app_dialog.table.column(1).visible(false);
    
    //체크박스 개별 선택 (컬럼1번 안의 체크박스 클릭)
    $('#table_main_A').on('click', 'input[type="checkbox"]', function (e) {
        //app_dialog.dataSet에 체크박스 선택여부 저장
        var selected_object = app_dialog.table.row($(this).closest('tr')).data();    //체크박스로 선택한 Row의 정보 가져오기
        //var rowInfo = app_dialog.table.row(row_clicked).data();    //체크박스로 선택한 Row의 정보 가져오기
        if (selected_object != null) {
            setSelectRowStatus(selected_object.no, String(e.target.checked));
        }            
        
        event.stopPropagation();
    });

    // //mouse over
    // $('#table_main_A').on('mouseenter', 'tbody tr', function (e) {

    // } );

    //mouse over
    $('#table_main_A').on('mouseenter', 'tbody td', function (e) {
        var selected_columnIndex = this.cellIndex;

        this.style.cursor = "pointer";
        // //선택한 컬럼이 0번과 1번 컬럼인 경우 default, 그 외 'pointer;
        // switch (selected_columnIndex) {
        //     case 0:
        //     case 1:
        //         this.style.cursor = "default"
        //         break;
        //     default:        
        //         this.style.cursor = "pointer"
        //         break;
        // }
    });

    //Row를 선택하여 정보 수정 
    //카드뷰 인 경우 row를 선택
    $('#table_main_A tbody').on('click', 'tr', function(e){
        if ($('.datatables_setview_clss')[0].textContent  != "카드뷰") {
            return;
        }

        //체크박스를 선택한 경우 종료
        if (e.target.id == "id_checkbox1") {
            return;
        }

        //var selected_object = app_dialog.table.row($(this).closest('tr')).data();    //선택한 셀정보 (방법 1)
        var row_clicked          = $(this).closest('tr');                              //선택한 셀정보 (방법 2)
        var row_object           = app_dialog.table.row(row_clicked).data();
        var selected_columnIndex = this.cellIndex;

        show_detail(row_clicked, row_object, selected_columnIndex);

        event.stopPropagation();
    });

    //Row를 선택하여 정보 수정 (각 컬럼에 대한 이벤트로서 0, 1번 컬럼 제외)
    //기본뷰인 경우 column을 선택
    $('#table_main_A tbody').on('click', 'td', function(e){
        //첫번째 헤더를 선택하였는지 확인
        var isFind = false;
        for (var i=0; i < this.classList.length; i++) {
            if (this.classList[i] == "class_table_column_sequence_wrap") {
                isFind = true;
            }
        }

        //첫번째 헤더를 선택하였다면 종료
        if (isFind == true) {
            return;
        }

        
        //if ($('.datatables_setview_clss').text() != "기본뷰") {
        if ($('.datatables_setview_clss')[0].textContent  != "기본뷰") {
            return;
        }

        //var selected_object = app_dialog.table.row($(this).closest('tr')).data();    //선택한 셀정보 (방법 1)
        var row_clicked          = $(this).closest('tr');                              //선택한 셀정보 (방법 2)
        var row_object           = app_dialog.table.row(row_clicked).data();
        var selected_columnIndex = this.cellIndex;

        show_detail(row_clicked, row_object, selected_columnIndex);

    });    

    function show_detail(row_clicked, row_object, selected_columnIndex) {
        // //Row 선택 (색상 변경)
        // if (app_dialog.select_multi) {                          //Row selection (multi)
        //     $(row_clicked).toggleClass('selected');
        // } else {                                                //Row selection (single)
        //     if ($(row_clicked).hasClass('selected') ) {
        //         //gui 변경
        //         $(row_clicked).removeClass('selected');
        //         $(row_clicked).addClass('selected');
        //     }
        //     else { 
        //         app_dialog.table.$('tr.selected').removeClass('selected');
        //         $(row_clicked).addClass('selected');
        //     }
        // }

        //셀 선택
        // $(row_clicked).removeClass('selected');
        // $(row_clicked).addClass('selected');
    
        //관리자 여부 확인
        var isAdmin = false;
        var getUserInfo = parseJwt(sessionStorage.getItem(token_yj_rfms));    
        if ((getUserInfo.mb_auth == admin_1) || (getUserInfo.mb_auth == admin_2)) {
            isAdmin = true;
        }

        //선택한 컬럼이 0번과 1번 컬럼인 경우 Dialog창 띄우지 않기   
        if (isAdmin) {
            switch (selected_columnIndex) {
                case 0:
                case 1:
                    return;
                default:                    
            }
        }    
    
        //창 보이기 (Edit Dialog)            
        if (row_object != null) {
            setDialogInit(5, row_object);
        }
    }


    
    // app_dialog.table.on('init', function () {
    //     setTimeout(function(){
    //         table.columns.adjust().responsive.recalc(); 
    //     }, 500);     
    // });


    //리사이즈 될 경우 숨겨진 컬럼이 존재한다면 '모두보기'버튼 보이게 하기
    app_dialog.table.on('responsive-resize', function ( e, datatable, columns ) {
        //보이는 컬럼 수 확인 후 첫번째 컬럼 +, - (확대하기, 축소하기) 버튼 보이기/숨기기
        check_visible_sequence_A(1);

        //리사이즈 시 카드뷰를 강제로 설정할 경우 수동 view 변경이 되지 않음
        // //모바일 디스플레이일 경우 카드뷰로 시작
        // if (matchMedia("screen and (max-width:480px)").matches) {           //스마트폰이 세로인 경우
        //     setView_cardview_A();
        // }
    });


    //일련번호 출력 (추가,삭제 시 필요함)
    app_dialog.table.on('order.dt search.dt', function () {
        app_dialog.table.column(app_dialog.index_id_position, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            //cell.innerHTML = i+1;     //Asc (주석 해제 시 Desc)
        } );
    }).draw();

    return app_dialog;
}


    // //초기화 이벤트
    // $('#table_main_A').on('draw.dt', function () {
    //     app_dialog.table.reduce(function (a, b) {
    //         return a + b;
    //     });
    // });

function getButtons_A(input_app_dialog, authStatus){
    var buttonStyle = [];
    if (authStatus) {
      buttonStyle = [
        {
            text: '기본뷰',            
            //   float: 'left',
            titleAttr: "리스트의 보이는 형태를 변경합니다.",
            position: 'relative',
            action: function ( e, dt, node, config ) {
                if (node.get(0).innerText == "기본뷰") {     //현재 확대뷰인데 버튼을 눌렀을 경우 카드뷰로 전환
                    setView_cardview_A();
                } else if (node.get(0).innerText == "카드뷰") {     //현재 카드뷰인데 버튼을 눌렀을 경우 기본뷰로 전환
                    setView_normalviews_A();
                }
            },
            className: 'btn btn-primary datatables_setview_clss datatables_button_image_view'
        },
        { 
          label: 'Create',
          titleAttr: "새로운 항목을 생성합니다.",
          text: ' ',
          //   float: 'left',
          action: function ( e, dt, node, config ) {          
            input_app_dialog.function_addDialog(true, 1);
          },
          className: 'btn btn-primary datatables_button_image_create'
        },
        {
          label: 'Edit',
          titleAttr: "체크 박스가 선택된 항목을 사용자가 입력한 값으로 한꺼번에 모두 변경합니다.",
          text: '',
          //   float: 'left',
          action: function ( e, dt, node, config ) {
            input_app_dialog.function_addDialog(true, 3);
            // $.getJSON("http://localhost:8080/jsonservice/rest/jsonservice/rest/user/getUserInfo", function(data){
            //   document.write(data);
            // });
          },
          className: 'btn btn-primary useid_datatables_edit datatables_button_image_edit'        //useid_datatables_edit 클래스 네임을 id대신 사용
        },
        {
          label: 'Remove',
          titleAttr: "체크박스가 선택된 항목을 삭제합니다.",
          text: '',
          position: 'relative',
          //   float: 'left',
          action: function ( e, dt, node, config ) {
            input_app_dialog.function_removeDialog(true, 4);
          },
          className: 'btn btn-primary datatables_button_image_remove'
        },
        {
          extend: 'excel',
          titleAttr: "리스트의 데이터를 엑셀파일로 다운로드 합니다.",
          text: '엑셀',
          //   float: 'left',
          // title: $('h1').text(),
          exportOptions: {
            modifier: {
                // DataTables core
                order : 'index',  // 'current', 'applied', 'index',  'original'
                page : 'all',      // 'all',     'current'
                search : 'none'     // 'none',    'applied', 'removed'
            }
          },
          className: 'btn btn-primary datatables_button_image_excel'
          // select: true,
          // dom: 'Bfrtip',
        },
        
        // {
        //   extend: 'pdfHtml5',
        //   customize: function ( doc ) {
        //     doc.content.splice( 1, 0, {
        //       margin: [ 0, 0, 0, 12 ],
        //       alignment: 'center',
        //       image: 'data:image/png;base64,
        //     });
        //   }
        // },
        // {
        //   extend: 'pdf',
        //   text: '<i class="fa fa-file-pdf-o"></i> PDF',
        //   title: $('h1').text(),
        //   exportOptions: {
        //     modifier: {
        //       page: 'applied'
        //     }
        //   },
        //   footer: true
        // }    
      ];
    }
  
    return buttonStyle;
  }

  
  function setView_normalviews_A() {
    if (document.getElementsByClassName("datatables_setview_clss")[0] != null) {
        document.getElementsByClassName("datatables_setview_clss")[0].childNodes[0].textContent = "기본뷰";
    } else {
        document.getElementsByClassName("datatables_setview_clss")[0].childNodes[0].textContent = "기본뷰";
    }    

    //기본뷰일 경우의 설정들
    document.getElementById("table_main_A").classList.add("responsive");                               //컬럼 자동정렬 설정
    document.getElementById("table_main_A").classList.remove("datatables_cardview");                   //카드뷰 삭제 (기본뷰 적용)
    app_dialog_A.table.columns.adjust().responsive.recalc();                                           //새로 고침
    //getButton.innerText = "기본뷰";    
  }

  function setView_cardview_A() {
    if (document.getElementsByClassName("datatables_setview_clss")[0] != null) {
        document.getElementsByClassName("datatables_setview_clss")[0].childNodes[0].textContent = "카드뷰";
    } else {
        document.getElementsByClassName("datatables_setview_clss")[0].childNodes[0].textContent = "카드뷰";
    }
    
    //카드뷰일 경우의 설정들
    document.getElementById("table_main_A").classList.remove("responsive");                            //컬럼 자동정렬 해제
    document.getElementById("table_main_A").classList.add("datatables_cardview");                      //카드뷰 적용
    

    app_dialog_A.table.columns.adjust().responsive.recalc();                                           //새로 고침
    //getButton.innerText = "카드뷰";
}