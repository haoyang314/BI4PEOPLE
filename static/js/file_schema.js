$(document).ready(function () {
    // Show or fold the detail information of a schema
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

    // Select the attributes for the date dimension
    $('[id^=p_select_date--]').click(function () {
        $(this).children('input').prop('checked', !$(this).children('input').prop('checked'));
        $(this).next('form').children("input[name='date']").prop('checked', $(this).prop('checked'));
        $(this).next('form').children("input[name='date']").prop('checked', $(this).children('input').prop('checked'));
    })


    // Save the chosen attributes for the date dimension
    $("[id^=btn_date--]").click(function () {
        $("#overlay").fadeIn(300);

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
                    $('#table_schema--' + file + "--" + index).replaceWith(response.tablehtml);
                    $("#json-display--" + file).html("<span class='" + response.cls + "'>" + response.schema + "</span>");
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-green").replace(" w3-blue", " w3-green")).show().delay(5000).hide(1000);
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Save successfully</p>")
                } else {
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue")).show().delay(5000).hide(1000);
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't save changes, please try again!</p>")
                }

            },
            error() {
                setTimeout(function () {
                    $("#overlay").fadeOut(300);
                }, 500);

                $("#msg_footer").attr('class', classname.replace(" w3-blue", " w3-yellow").replace(" w3-green", " w3-yellow")).show().delay(5000).hide(1000);
                $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Internet Error, please try again!</p>")
            }
        }).done(function () {
            setTimeout(function () {
                $("#overlay").fadeOut(300);
            }, 500);
        });
    })

    // Open edit function to modify the names of hierarchies, dimensions and so on 
    $("[id^='edit_name_icon--']").click(function () {
        var file = $(this).attr('id').split("--")[1];
        var editAttrs = $('.editattribute.' + file);
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
                    name = 'hierarchy' + editAttrs.eq(i).attr('class').split("hiename_")[1];
                }
                editAttrs.eq(i).html("<input type='text' class='form-control' placeholder='Create a new name' name='" + name + "' value='" + editAttrs.eq(i).text() + "' form='edit_name_form--" + file + "'> ");
            }
        }
        this.parentNode.querySelector('[id^=save_name_icon]').disabled = false;;
    })


    // Save the name modifications for hierarchies, dimensions and so on 
    $("[id^='save_name_icon--']").click(function () {
        $("#overlay").fadeIn(300);

        var file = $(this).attr('id').split("--")[1];
        var editAttrs = $('.editattribute.' + file);
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
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow"," w3-green").replace(" w3-blue", " w3-green")).show().delay(5000).hide(1000);
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Save successfully</p>")
                } else {
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue")).show().delay(5000).hide(1000);
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't save changes, please try again!</p>")
                }
            },
            error() {
                setTimeout(function () {
                    $("#overlay").fadeOut(300);
                }, 500);

                $("#msg_footer").attr('class', classname.replace(" w3-blue", " w3-yellow").replace(" w3-green", " w3-yellow")).show().delay(5000).hide(1000);
                $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Internet Error, please try again!</p>")
            }
        }).done(function () {
            setTimeout(function () {
                $("#overlay").fadeOut(300);
            }, 500);
        });
    })

    // Edit Schema
    $("[id^='btn_edit_schema--']").click(function () {
        $("#overlay").fadeIn(300);

        var classname = $("#msg_footer").attr('class');
        var file = $(this).attr('id').split("--")[1];
        var schemaData = JSON.parse($("#json-display--" + file).text().trim())
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
                    $('#schema_panel--' + file).replaceWith(response.html);
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-green").replace(" w3-blue", " w3-green")).show().delay(5000).hide(1000);
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Save successfully</p>");
                } else {
                    $("#msg_footer").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue")).show().delay(5000).hide(1000);
                    $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't save changes, please try again!</p>")
                }
            },
            error() {
                setTimeout(function () {
                    $("#overlay").fadeOut(300);
                }, 500);

                $("#msg_footer").attr('class', classname.replace(" w3-blue", " w3-yellow").replace(" w3-green", " w3-yellow")).show().delay(5000).hide(1000);
                $("#msg_footer").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Internet Error, please try again!</p>")
            }

        }).done(function () {
            setTimeout(function () {
                $("#overlay").fadeOut(300);
            }, 500);
        });
    })

    function simulateClick(btn) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        btn.dispatchEvent(event);
    }

    //check password
    $('[id^=gndb_pwd--],[id^=gndb_cf_pwd--], [id^=gndb_username--]').keyup(function () {
        //check password
        var file = $(this).attr('id').split("--")[1].trim();
        if ($('#gndb_pwd--' + file).val() == $('#gndb_cf_pwd--' + file).val() && $('#gndb_pwd--' + file).val() !== "") {
            $('#gndb_pwd_message--' + file).html('Correct password.').css('color', 'green');
            if ($('#gndb_username--' + file).val() === "") {
                $('#gndb_cpt_message--' + file).html("<a href='#gndb_username--" + file + "' style='text-decoration: none; color: red;'>Please enter a username.</a>");
                $('#gndb_username--' + file).focus();
            } else {
                $('#gndb_cpt_message--' + file).html("");
            }
        } else if ($('#gndb_cf_pwd--' + file).val() != "") {
            $('#gndb_pwd_message--' + file).html('Please enter the same password.').css('color', 'red');
        }

        if ($('#gndb_username--' + file).val() !== "" && $('#gndb_pwd--' + file).val() === "") {
            $('#gndb_cpt_message--' + file).html("<a href='#gndb_pwd--" + file + "' style='text-decoration: none; color: red;'>Please enter your password.</a>");
        }
    })

    // Create DB
    $('[id^=btn_createdb_save--]').click(function () {
        var file = $(this).attr('id').split("--")[1].trim();
        if ($('#gndb_username--' + file).val() === "") {
            $('#gndb_cpt_message--' + file).html("<a href='#gndb_username--" + file + "' style='text-decoration: none; color: red;'>Please enter a username.</a>");
            $('#gndb_username--' + file).focus();
        } else if ($('#gndb_pwd--' + file).val() === "") {
            $('#gndb_cpt_message--' + file).html("<a href='#gndb_pwd--" + file + "' style='text-decoration: none; color: red;'>Please enter your password.</a>");
            $('#gndb_pwd--' + file).focus();
        } else if ($('#gndb_pwd_message--' + file).text() !== "Correct password.") {
            $('#gndb_cpt_message--' + file).html("<a href='#gndb_pwd--" + file + "' style='text-decoration: none; color: red;'>Please check your two passwords.</a>");
            $('#gndb_cf_pwd--' + file).focus();
        } else {
            $('#gndb_cpt_message--' + file).html("");
        }

        if ($('#gndb_cpt_message--' + file).html() === "") {
            $("#overlay").fadeIn(300);

            if ($('#db_panel--' + file) !== undefined) {
                $('#db_panel--' + file).remove();
            }
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
                    $('#file_panel--' + file).append(response);
                    //  Add tab
                    var x, tablinks;
                    x = $('#step_tab--' + file).children();
                    tablinks = x.eq(1);
                    tablinks.attr('class', tablinks.attr('class').replace(" w3-border-blue", ""));
                    x.eq(2).attr('class', x.eq(1).attr('class') + " w3-border-blue")
                    $('#db_icon--' + file).children(':first').attr("class", "far fa-minus-square");
                    $('#schema_panel--' + file).hide();
                    $('#btn_createdb_close--' + file).trigger('click');
                    // $(".modal-backdrop.fade.show").remove();
                    if ($("#err_exist").attr('class').indexOf(" w3-blue")) {
                        document.getElementById("err_exist").style.display = "none";
                    }
                },
                error() {
                    setTimeout(function () {
                        $("#overlay").fadeOut(300);
                    }, 500);

                    var classname = $("#err_exist").attr('class');
                    $("#err_exist").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue")).show().delay(5000).hide(1000);
                    $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Can't creat data warehouse, please try again!</p>")
                }
            }).done(function () {
                setTimeout(function () {
                    $("#overlay").fadeOut(300);
                }, 500);
            });
        }

    })


    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


    // if ( $("#select_version").prop("checked") ){
    //     $("a[name='expert']").show()
    //     $("span[name='expert']").show()
    //     $("th[name='expert']").show()
    //     $("button[name='expert']").show()
    //     $("h1[name='expert']").show()
    //     $("p[name='expert']").show()

    //     $("a[name='noExpert']").hide()
    //     $("span[name='noExpert']").hide()
    //     $("th[name='noExpert']").hide()
    //     $("button[name='noExpert']").hide()
    //     $("h1[name='noExpert']").hide()
    //     $("p[name='noExpert']").hide()
    // }

    if ($("#select_version").prop("checked")) {
        $("[name='expert']").show()
        $("[name='noExpert']").hide()
    } else {
        $("[name='expert']").hide()
        $("[name='noExpert']").show()
    }

})