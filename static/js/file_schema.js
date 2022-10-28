$(document).ready(() => {
    $('[id^=schema_icon').click(function () {
        var file = $(this).attr('id').split("--")[1];
        $('#schema_panel--' + file).toggle();
        var show = $('#schema_panel--' + file).css("display") == "none" ? false : true;
        $(this).children(':first').attr('class', show ? "far fa-minus-square" : "far fa-plus-square");
    })


    // apply for dynamic html generation
    // $(document).on("operation", "element", function () {
    //     // do something
    // })

    $(document).on("click", "[id^=hie--]", function () {
        console.log($(this));
        var hie_name = $(this).attr('id').split("--")[1];
        var tag = $(this).find('i');
        console.log('tag ==> ' + tag)
        if (tag.attr('class') == "fa fa-caret-up") {
            tag.attr('class', "fa fa-sort");
        } else {
            tag.attr('class', "fa fa-caret-up");
        }
        $('.detail_hie--' + hie_name).toggle();
    })
    
    $(document).on("click", "[id^=all_hie--]", function () {
        var tag = $(this).find('i');
        console.log('tag ==> ' + $(this).find('i').attr('class'));
        if (tag.attr('class') === "fa fa-caret-up") {
            tag.attr('class', "fa fa-sort");
        } else {
            tag.attr('class', "fa fa-caret-up");
        }
        $(this).nextAll('tr').toggle();
    })

    $('[id^=p_select_date--]').click(function () {
        console.log("before " + $(this).children('input').prop("checked"))
        $(this).children('input').prop('checked', !$(this).children('input').prop('checked'))
        console.log("after " + $(this).children('input').prop("checked"))
        $(this).next('form').children("input[name='date']").prop('checked', $(this).prop('checked'))

        console.log($(this).next('form').children("input[name='date']"))
        $(this).next('form').children("input[name='date']").prop('checked', $(this).children('input').prop('checked'))
        console.log($(this).parent('p').next('form').children("input[name='date']"))
    })




    // $("[id^='edit_name_icon--']").click(function(){
    //     var file = $(this).attr('id').split("--")[1];
    //     let $table = $('#edit-table--'+file);
    //     console.log('table => '+ $table)
    //     let node = document.getElementById('edit-table--'+file).children[0].getElementsByTagName('th')[0].firstChild.nodeValue;
    //     let expert =  node.indexOf("Dimension")? true: false;
    //     console.log('expert => '+ expert)
    //     $table.bootstrapTable({
    //         url: '',
    //         toolbar: '',
    //         clickEdit: true,
    //         showToggle: true,
    //         pagination: true, //show page
    //         showColumns: true,
    //         showPaginationSwitch: true, // show the switch page button
    //         // showRefresh: true, // show refresh button, if have json data url, can try it
    //         // clckToSelect: true, // select row by clicking radio or checkbox
    //     //     columns:[// {checkbox: true},
    //     // {field:'name', title: expert? 'Dimension': 'Axis'},
    //     // {field:'attributes', title: 'Attributes'},
    //     // {field:'hierarchy', title:'Hierarchy'},
    //     // {field:'parameters', title:'Parameters'},
    //     // {field:'wk', title:'Weak Attributes'}]
    //     })
    // })

    $("[id^=btn_date--]").click(function(){
        var ids = $(this).attr('id').split("--")
        var file = ids[1];
        var index = ids[2];
        var formdata = new FormData(document.getElementById('select_date_form--' + file + "--" + index));
        formdata.append('session', $('#session_val').text().trim());
        formdata.append('index', index);
        var classname = $("#msg_footer").attr('class');
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:80/files/' + file + '/datedim',
            dataType: 'json',
            data: formdata,
            // Doesn't deal with the data and the contenu
            processData: false,
            xhrFields: { withCredentials: true },
            contentType: false, //'application/json;charset=utf-8',
            // contentType: 'text/html; charset=utf-8',
            success(response, textStatus) {
                if (response.code === 200) {
                    $('#btn_date_close--' + file + "--" + index).trigger('click');
                    $('#table_schema--'+file+"--"+index).html(response.tablehtml);
                    $("#json-display--" + file).html("<span class='" + response.cls + "'>" + response.schema + "</span>");
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-green").replace(" w3-blue", " w3-green"));
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Save successfully</p>")
                } else {
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue"));
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't save changes, please try again!</p>")
                }

            },
            error() {
                $("#msg_footer").attr('class', classname.replace(" w3-blue", " w3-yellow").replace(" w3-green", " w3-yellow"));
                $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Internet Error, please try again!</p>")
            }
        })
    })

    $("[id^='edit_name_icon--']").click(function () {
        var file = $(this).attr('id').split("--")[1];
        var editAttrs = $('.editattribute');
        for (let i = 0; i < editAttrs.length; i++) {
            if (editAttrs.eq(i).find('input').length < 1) {
                // let name = editAttrs.eq(i).attr('class').indexOf('dimname') ? 'dimension': 'hierarchy';
                let name = ""
                let index = editAttrs.eq(i).attr('class').substr(-1);
                if (editAttrs.eq(i).attr('class').indexOf('dimname') > -1) {
                    name = 'dimension' + editAttrs.eq(i).attr('class').substr(-1);
                } else if (editAttrs.eq(i).attr('class').indexOf('factname') > -1) {
                    name = 'fact' + editAttrs.eq(i).attr('class').substr(-1);
                } else {
                    name = 'hierarchy' + editAttrs.eq(i).attr('class').split(" ")[1].replace("hiename_", "");
                }
                editAttrs.eq(i).html("<input type='text' class='form-control' placeholder='Create a new name' name='" + name + "' value='" + editAttrs.eq(i).text() + "' form='edit_name_form--" + file + "'> ");
            }
        }
        this.parentNode.querySelector('[id^=save_name_icon]').disabled = false;;
    })



    $('.editattribute').find("input").keypress(function () {
        console.log("input ... " + $(this))
        console.log($(this).val())
    })

    $("[id^='save_name_icon--']").click(function () {
        var editAttrs = $('.editattribute');
        var file = $(this).attr('id').split("--")[1];
        var formdata = new FormData(document.getElementById('edit_name_form--' + file));
        formdata.append('session', $('#session_val').text().trim());
        var classname = $("#msg_footer").attr('class');
        $.ajax({
            type: 'post', 
            url: 'http://127.0.0.1:80/files/' + file + '/editname',
            dataType: 'json',
            data: formdata,
            // Doesn't deal with the data and the contenu
            processData: false,
            xhrFields: { withCredentials: true },
            contentType: false, //'application/json;charset=utf-8',
            // contentType: 'text/html; charset=utf-8',
            success(response) {
                if (response.code === 200) {
                    for (let i = 0; i < editAttrs.length; i++) {
                        editAttrs.eq(i).html(editAttrs.eq(i).children(':first').val());
                        document.getElementById('save_name_icon--' + file).disabled = true;
                    }
                    $("#json-display--" + file).html("<span class='" + response.cls + "'>" + response.schema + "</span>");
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow",).replace(" w3-blue", " w3-green"));
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Save successfully</p>")
                } else {
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue"));
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't save changes, please try again!</p>")
                }

            },
            error() {
                $("#msg_footer").attr('class', classname.replace(" w3-blue", " w3-yellow").replace(" w3-green", " w3-yellow"));
                $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Internet Error, please try again!</p>")
            }
        })
    })

    $("[id^='btn_edit_schema--']").click(function () {
        var classname = $("#msg_footer").attr('class');
        var file = $(this).attr('id').split("--")[1];
        console.log(`edit schema ${file}`)
        var schemaData= JSON.parse($("#json-display--" + file).text().trim())
        schemaData.session = $('#session_val').text().trim()
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:80/files/' + file + '/editschema',
            dataType: 'json',
            data: JSON.stringify(schemaData),
            xhrFields: { withCredentials: true },
            contentType: 'application/json;charset=utf-8',
            success(response, textStatus) {
                if (response.code === 200) {
                    $('#btn_edit_schema_close--' + file).trigger('click');
                    $('#schema_panel--' + file).html(response.html);
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow",).replace(" w3-blue", " w3-green"));
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Save successfully</p>");
                } else {
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue"));
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't save changes, please try again!</p>")
                }
            },
            error() {
                $("#msg_footer").attr('class', classname.replace(" w3-blue", " w3-yellow").replace(" w3-green", " w3-yellow"));
                $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Internet Error, please try again!</p>")
            }

        })
    })

    function simulateClick(btn){
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        btn.dispatchEvent(event);
    }

    // $('[id^=btn_schema--]').click(function () {
    $('[id^=btn_createdb_save--]').click(function () {
        var file = $(this).attr('id').split("--")[1].trim();
        if ($('db_panel--' + file) !== undefined) {
            console.log('db_panel ' + $('db_panel--' + file))
            $('#db_panel--' + file).remove();
        }
        console.log($('#session_val').text().trim())
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:80/files/' + file + '/adddb',
            data: $('#createdb_form--' + file).serialize() + "&session=" + $('#session_val').text().trim(),
            xhrFields: { withCredentials: true },
            // Doesn't deal with the data and the contenu
            processData: false,
            // contentType: 'application/json;charset=utf-8',
            contentType: false, //'text/html; charset=utf-8',
            success(response, textStatus) {
                console.log(response)
                $('#file_panel--' + file).append(response);
                //  Add tab
                var x, tablinks;
                x = $('#step_tab--' + file).children();
                tablinks = x.eq(1);
                tablinks.attr('class', tablinks.attr('class').replace(" w3-border-blue", ""));
                x.eq(2).attr('class', x.eq(1).attr('class') + " w3-border-blue")
                $('#db_icon--' + file).children(':first').attr("class", "far fa-minus-square");
                $('#schema_panel--' + file).hide();
                $(".modal-backdrop.fade.show").remove();
                if ($("#err_exist").attr('class').indexOf(" w3-blue")) {
                    document.getElementById("err_exist").style.display = "none";
                }
            },
            error() {
                alert("Get DB Faild!")
                var classname = $("#err_exist").attr('class');
                $("#err_exist").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue"))
                $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't creat data warehouse, please try again!</p>")
            }
        })
    })


    // $('[id^=btn_createdb_modal--]').click(function () {
    //     $('#createdb_form--' + file).parent('div').children("div table tr td input[type='text']").removeAttr("readonly");
    // })

    // $('[id^=btn_createdb_save--]').click(function () {
    //     var file = $(this).attr('id').split("--")[1].trim();
    //     $('#createdb_form--' + file).parent('div').children("div table tr td input[type='text']").attr("readonly", "readonly");
    //     $('#createdb_form--' + file).parent('div').children("div table tr td input[type='text']").show();
    // })

    $('[id^=btn_schema--]').click(function () {
        var file = $(this).attr('id').split("--")[1].trim();
        $('#createdb_form--' + file).parent('div').children("div table tr td input[type='text']").attr("readonly", "readonly");
        $('#createdb_form--' + file).parent('div').children("div table tr td input[type='text']").show();
    })


    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    if ( $("#select_version").prop("checked") ){
        $("a[name='expert']").show()
        $("span[name='expert']").show()
        $("th[name='expert']").show()
        $("button[name='expert']").show()
        $("h1[name='expert']").show()
        $("p[name='expert']").show()

        $("a[name='noExpert']").hide()
        $("span[name='noExpert']").hide()
        $("th[name='noExpert']").hide()
        $("button[name='noExpert']").hide()
        $("h1[name='noExpert']").hide()
        $("p[name='noExpert']").hide()
    }

})