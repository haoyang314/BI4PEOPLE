$(document).ready(() => {
    function isExisted(files) {
        var classname = $("#err_exist").attr('class');
        var filenames = [];
        for (let i = 0; i < files.length; i++) {
            console.log("Stage 2 each file =======> " + files[i].name)
            filenames.push(files[i].name);
        }

        console.log("Stage 3 files =======> " + filenames)
        $.ajax({
            type: 'post',
            url: '/files/upload',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({ filenames: filenames }),
            success(response) {
                console.log('Stage 6: response.code ' + response.code)
                if (response.code == 200) {
                    $("#err_exist").attr('class', classname.replace(" w3-green", " w3-yellow").replace(" w3-blue", " w3-yellow")).show();
                    $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-display-topright'>&times;</span><h4>Warning!</h4><p>File name exist: " + response.result + "</p>");
                    console.log('Stage 7: err_exist.value ' + $("#err_exist").text())
                }
                // else {
                //     upload(files);
                // }
            },
            error() {
                $("#err_exist").attr('class', classname.replace(" w3-green", " w3-yellow").replace(" w3-blue", " w3-yellow")).show();
                $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-display-topright'>&times;</span><h4>Warning!</h4><p>Can not upload !!!</p>");
            }
        })
    }

    $("#input_file").on('change', function (e) {
        var files = $(this)[0].files; // var e = e || window.event; var files = e.target.files; 
        if (files.length > 0) {
            isExisted(files);
        } else {
            $("#err_exist").text("Please choose a file.");
        }
    })


    // $('#btn_upload').click(function () {
    $(document).on('submit', '#uplod_form', function (e) {
        e.preventDefault();
        // ==== end modify ====
        var classname = $("#err_exist").attr('class');
        if ($("#err_exist").text() === "") {
            var files = $("#input_file")[0].files;
            for (let i = 0; i < files.length; i++) {
                $('.upload-container').append('<div class="upload-file"><i class="fas fa-file-alt"></i><div class="file-content"><div><span>' + files[i].name + '</span><span class="uploading">uploading 0%</span><span class="delete-file"><i class="fa fa-times fa-fw"></i></span></div><div></div></div><div class="progress-bar" id="progressbar' + i + '" role="progressbar" style="width: 0%;" aria-valuenow="0"aria-valuemin="0" aria-valuemax="100">0%</div></div>');
            }
            // const formData = new FormData();
            // for (let i = 0; i < files.length; i++) {
            //     formData.append('file', files[i]);
            // }
            // formData.append('session', $('#session_val').text().trim());


            $.ajax({
                // ==== start modify ====
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.onprogress = ({ loaded, total }) => {
                        var percentComplete = loaded / total;
                        percentComplete = parseInt(percentComplete * 100);
                        $('#progressbar').html(percentComplete + "%");
                        $('#progressbar').width(percentComplete + "%");

                        var filesize = 0;
                        var fileConent = $('.file-content');
                        let i = 0;
                        while (i < files.length) {
                            var percentComplete_i = (loaded - filesize) / files[i].size;
                            if (percentComplete_i <= 1) {
                                percentComplete_i = parseInt(percentComplete_i * 100);
                                $('#progressbar' + i).html(percentComplete_i + "%");
                                $('#progressbar' + i).width(percentComplete_i + "%");
                                fileConent.eq(i).find("div span.uploading").html("uploading " + percentComplete_i + "%");
                            }

                            if (percentComplete_i >= 1) {
                                $('#progressbar' + i).html(percentComplete_i + "%");
                                $('#progressbar' + i).width(percentComplete_i + "%");

                                filesize += files[i].size;
                                percentComplete_i = 0;
                                var uploaded = $('#progressbar' + i).parent();
                                fileConent.eq(i).find('div span.uploading').replaceWith('<i class="fas fa-check"></i>');
                                var fileKB = Math.floor(files[i].size / 1024);
                                fileConent.eq(i).children().eq(1).replaceWith(`<div class="size">${fileKB} KB</div>`);
                                uploaded.attr('class', uploaded.attr('class') + " uploaded");
                                $('#progressbar' + i).remove();
                                i++;
                            }
                        }
                    };

                    // xhr.upload.addEventListener("progress", function(evt){
                    //     if(evt.lengthComputable){
                    //         var percentComplete = evt.loaded/evt.total;
                    //         percentComplete = parseInt(percentComplete * 100);
                    //         $('#progressbar').html(percentComplete + "%");
                    //         $('#progressbar').width(percentComplete + "%");
                    //     }
                    // },false);

                    return xhr;
                },
                // ==== end modify ====

                type: 'post',
                url: 'http://127.0.0.1:80/files',

                // ==== start modify ====
                data: new FormData(this), // data: formData,
                cache: false,
                // ==== end modify ====


                xhrFields: { withCredentials: true },
                // Doesn't deal with the data and the contenu
                processData: false,
                // contentType: 'application/json;charset=utf-8',
                contentType: false,

                success(response) {
                    // ==== start modify ====
                    var status = response.status;
                    console.log(status);
                    if (status === 200) {
                        $("#file_measure").html(response.html);
                        $("#err_exist").attr('class', classname.replace(" w3-yellow", " w3-green").replace(" w3-blue", " w3-green")).show().delay(5000).hide(1000);
                        $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Successfully Uploaded!</p>")
                    } else {
                        $("#err_exist").text("Upload Failed!");
                    }
                    // ==== end modify ====
                    // $("#file_measure").html(response)
                    // $("#err_exist").attr('class',  classname.replace(" w3-yellow", " w3-green").replace(" w3-blue", " w3-green"))
                    // $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Upload successfully</p>")
                    // // $("#err_exist").text("Upload successfully!")
                }
            })

        } else {
            $("#err_exist").attr('class', classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue")).show().delay(5000).hide(1000);
            $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Please choose the file dosn't exist!</p>");
        }

        // ============  Way 2 fetch ==============
        //    fetch('/files',{
        //     method:'POST',
        //     headers:{
        //         // 'Content-Type': 'application/json',
        //         'Content-Type': false,
        //     },
        //     body: files,
        //    })
        //    .then((response) => response.json())
        //    .then((result) => {console.log('Success:', result);})
        //    .catch((error) => {
        //     console.error('Error:', error);
        //    })

    })

    // delete a uploaded file
    $(document).on('click', '.delete-file', function (e) {

        var file = $(this).prevAll('span').eq(0).text().trim();
        var filename = file.split('.')[0];
        var files = $("#input_file")[0].files;

        $.ajax({
            type: 'delete',
            url: "files/delete/" + filename,
            data: { file: file }, // data: formData,
            cache: false,
            xhrFields: { withCredentials: true },
            // Not deal with the data and the contenu
            processData: false,
            success(response) {
                if (response.code === 200) {
                    var newFiles = new DataTransfer();

                    for (let i = 0; i < files.length; i++) {
                        if (files[i].name !== file) {
                            console.log(true);
                            let newFile = new File(["content"], files[i].name);
                            newFiles.items.add(newFile);
                        }
                    }
                    document.getElementById('input_file').files = newFiles.files;
                    var rmDiv = e.currentTarget.parentElement.parentElement.parentElement;
                    rmDiv.parentNode.removeChild(rmDiv);
                    $('#file_panel--' + filename).remove();
                    var tablinks = $('.w3-third.firsttablink');
                    for(let i = 0; i<tablinks.length; i++){
                        var text = tablinks.eq(i).text().trim();
                        if (text == filename){
                            tablinks.eq(i).parent().remove();
                            break;
                        }
                    }
                    if(document.getElementById('input_file').files.length===0){
                        $('.progress').remove();
                    }
                } else {
                    $("#err_exist").attr('class', classname.replace(" w3-green", " w3-yellow").replace(" w3-blue", " w3-yellow")).show().delay(5000).hide(1000);
                    $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Delete file failed!</p>")
                }
            }
        })
    })

    var upIndex = 0;
    function upload(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            i
            formData.append('file', files[i]);
            sindex = $('#progress').eq(upIndex).find('.progress_line').length;
            progressBar(upIndex, sindex, files[i].name)
            console.log('input_file  ==> ' + files[i].name)
        }
        console.log('Stage 7: formData ' + formData + " " + formData.file)
        $.ajax({
            type: 'post',
            url: '/files',
            data: formData,
            // Not deal with the data and the contenu
            processData: false,
            // contentType: 'application/json;charset=utf-8',
            contentType: false,
            success(response) {
                $("#err_exist").text("Upload successfully!").show().delay(5000).hide(1000);
                $("#file_container").html(response);
            }
        })
    }


    //expert version
    $("#expert").click(function () {
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
        //console.log($("input[name=viewInitial]").val())
    })

    //noExpert version
    $("#noExpert").click(function () {
        $("a[name='noExpert']").show()
        $("span[name='noExpert']").show()
        $("th[name='noExpert']").show()
        $("button[name='noExpert']").show()
        $("h1[name='noExpert']").show()
        $("p[name='noExpert']").show()

        $("a[name='expert']").hide()
        $("span[name='expert']").hide()
        $("th[name='expert']").hide()
        $("button[name='expert']").hide()
        $("h1[name='expert']").hide()
        $("p[name='expert']").hide()
        //console.log($("input[name=viewInitial]").val())
    })
})