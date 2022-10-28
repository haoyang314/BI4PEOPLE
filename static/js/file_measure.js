$(document).ready(() => {
    $('[id^=file_fold]').click(function () {
        var show = $(this).find('i:eq(0)').attr('class') == "far fa-plus-square" ? true : false;
        console.log("show ==> " + show);
        $(this).find('i:eq(0)').attr('class', show ? "far fa-minus-square" : "far fa-plus-square");
        if(show){
            $(this).parent().nextAll().show();
        }else{
            $(this).parent().nextAll().hide();
        }
    })

    $('[id^=selec_measure_icon').click(function () {
        file = $(this).attr('id').split("--")[1];
        $('#measure_panel--' + file).toggle();
        var show = $('#measure_panel--' + file).css("display")=="none"? false: true;
        $(this).children(':first').attr('class', show ? "far fa-minus-square" : "far fa-plus-square");
        // var show = $(this).children(':first').attr('class') == "far fa-plus-square" ? true : false;
        // console.log("show ==> " + show);
        // $(this).children(':first').attr('class', show ? "far fa-minus-square" : "far fa-plus-square");
        // // $('#selec_measure_panel--' + file).toggle();
        // $('#measure_panel--' + file).toggle();
    })


    $('[id^=select_propose]').click(function () {
        var targetselect = '.propose--' + $(this).attr("id").split("--")[1];
        if ($(this).text() === "All") {
            $(this).text("None");
            console.log($(this).text());
            $(this).css("color", "grey");
            console.log('targetselect =>' + targetselect);
            $(targetselect).prop("checked", true);

        } else {
            $(this).text("All");
            $(this).css("color", "black");
            $(targetselect).prop("checked", false);
        }
    })


    $('[id^=select_add]').click(function () {
        var targetselect = '.additional--' + $(this).attr("id").split("--")[1];
        if ($(this).text() === "All") {
            $(targetselect).prop("checked", true)
            $(this).text("None");
            console.log($(this).text())
            $(this).css("color", "grey");

        } else {
            $(this).text("All");
            $(this).css("color", "black");
            $(targetselect).prop("checked", false);

        }
    })


    $('[id^=btn_measure]').click(function () {
        // var file = $(this).parent().parent().prev().prop('firstChild').nodeValue;
        var file = $(this).attr('id').split("--")[1].trim();
        console.log(`Stage 1 : filename ${file}  `);
        var form = document.getElementById('form--' + file);
        var formdata = new FormData(form);
        var arraydata = $('#form--' + file).serialize();
        console.log(`measure arraydata ${arraydata}`)
        // var listdata = arraydata.split("&");
        // for(let i=0; i< listdata.length; i++ ){
        //     var kv = listdata[i].split("=")
        //     formdata.append(kv[0], kv[1])
        //     console.log(kv[0], kv[1])
        // }
        // console.log(`measure formdata ${formdata.getAll('proposed_measure')}`)

        // =========== end modify ===========
        formdata.append('session', $('#session_val').text().trim())
        var selec_div = "#selec_measure_panel--" + $(this).attr('id').split("--")[1];
        if ($('schema_panel--' + file) !== undefined) {
            $('#schema_panel--' + file).remove();
            $('#db_panel--' + file).remove();
        }

        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:80/files/' + file.trim()+ "/schema",
            data: formdata,
            xhrFields:{withCredentials:true},
            // Doesn't deal with the data and the contenu
            processData: false,
            // contentType: 'application/json;charset=utf-8',
            contentType: false,
            // contentType: 'application/x-www-form-urlencoded', //'application/json;charset=utf-8',
            // contentType: 'text/html; charset=utf-8',
            success(response, textStatus) {
                //  ============ select hierarchies version ============= 
                // $('#file_hierarchy').html(response);
                // $('#select_propose').attr('id', 'select_propose'+form) ;
                // $('.propose').attr('id', 'propose' + form); 
                // $('#'+ form + ">button").attr('id', 'creat' + form) ;
                // $(selec_div).prev().children("span").text("+");
                // $(selec_div).hide();

                //  Add tab
                var x, tablinks;
                console.log("before " + $('#step_tab--' + file).children())
                x = $('#step_tab--' + file).children();
                tablinks = x.eq(0);
                console.log('tablinks ' + tablinks)
                tablinks.attr('class',tablinks.attr('class').replace(" w3-border-blue", ""));
                x.eq(1).attr('class', x.eq(1).attr('class') + " w3-border-blue")
                console.log('tablinks class ' +   tablinks.attr('class'))
                console.log('measure panel ' +  document.getElementById("measure_panel--" + file).id)
                // End add

                //  ============ no select hierarchies version ============= 
                $('#file_panel--' + file).append(response);
                $('#selec_measure_icon--' + file).children(':first').attr("class", "far fa-minus-square");
                $('#schema_icon--' + file).children(':first').attr("class", "far fa-minus-square");
                $('#measure_panel--' + file).hide();
                $('#message-text--'  + file).val()

            },
            error() {
                var classname =  $("#err_exist").attr('class');
                $("#err_exist").attr('class',  classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue"))
                $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't get schema, please try again!</p>")
                // alert("Can not get hierarchies !!!");
            }
        })

    })

    if ( $("#select_version").prop("checked") ){
        $("a[name='expert']").show()
        $("span[name='expert']").show()
        
        $("a[name='noExpert']").hide()
        $("span[name='noExpert']").hide()
    }
})