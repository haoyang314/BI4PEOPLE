$(document).ready(()=>{
    function isExisted(files) {
        var classname =  $("#err_exist").attr('class');
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
            data: JSON.stringify({filenames: filenames }),
            success(response) {
                console.log('Stage 6: response.code ' + response.code)
                if (response.code == 200) {
                    $("#err_exist").attr('class',  classname.replace(" w3-green"," w3-yellow").replace(" w3-blue", " w3-yellow"))
                    $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>File name exist: " + response.result + "</p>");
                    console.log('Stage 7: err_exist.value ' + $("#err_exist").text())
                } 
                // else {
                //     upload(files);
                // }
            },
            error() {
                $("#err_exist").attr('class',  classname.replace(" w3-green"," w3-yellow").replace(" w3-blue", " w3-yellow"))
                $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Can not upload !!!</p>");
            }
        })
    }
    
    $("#input_file").change(function(){
        console.log($(this)[0].files)
        var files = $(this)[0].files; // var e = e || window.event; var files = e.target.files; 
        console.log('Satage 1: this file ======> ' + files)
        if (files.length > 0) {
            isExisted(files);
        } else {
            $("#err_exist").innerText("Please choose a file.");
        }
    })
    
    
    $('#btn_upload').click(function () {
        var classname =  $("#err_exist").attr('class');
        if( $("#err_exist").text() === ""){
           var files =  $("#input_file")[0].files;
           console.log('files ' + files)
           const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
        formData.append('session', $('#session_val').text().trim())
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:80/files',
            data: formData,
            xhrFields:{withCredentials:true},
            // Doesn't deal with the data and the contenu
            processData: false,
            // contentType: 'application/json;charset=utf-8',
            contentType: false,

            success(response) {
                console.log("stage end ! ")
                console.log($("#file_measure").attr('id'))
                $("#file_measure").html(response)
                $("#err_exist").attr('class',  classname.replace(" w3-yellow", " w3-green").replace(" w3-blue", " w3-green"))
                $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Success!</h3><p>Upload successfully</p>")
                // $("#err_exist").text("Upload successfully!")
            }
        })
        }else{
            $("#err_exist").attr('class',  classname.replace(" w3-yellow", " w3-blue").replace(" w3-green", " w3-blue"))
            $("#err_exist").html("<span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Info!</h3><p>Please choose the file dosn't exist!</p>")
            // alert("Please choose the file dosn't exist!")
        }
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
            // Doesn't deal with the data and the contenu
            processData: false,
            // contentType: 'application/json;charset=utf-8',
            contentType: false,
            success(response) {
                console.log("stage end ! ")
                $("#err_exist").text("Upload successfully!")
                $("#file_container").html(response)
            }
        })
    }
    
    
    
    function progressBar(findex, sindex, name){
        var max = 100;
        var init = 0;
        var uploaded ;
        $('#progress').eq(findex).show();
        $('#progress').eq(findex).append('<div class="line-box clearfix"><div class="document-icon pull-left"></div><div class="document-headline pull-left"><div class="document-text pull-left">' + name + '</div><div class="delete-icon pull-right">+</div><div class="progress-line-back"><div class="progress-line" style="width: '+ init + '%;"><div></div></div></div></div>')
        var test = setInterval(() => {
            init += 5;
            uploaded = init + "%";
    
            $('#progress').eq(findex).find('.line-box').eq(sindex).find('.progress-line').css({width:uploaded});
             if (init === 1000) {
                clearInterval(test);
                let overTest = setTimeout('$("#progress").find(".line-box").eq('+ (sindex - 1 ) + ').find(".progress-line").css({width:"100%" })', 200);
                let overTestBack =  setTimeout('$("#progress").find(".line-box").eq('+ (sindex ) + ').find(".progress-line-back").hide()', 400);
             }    
        }, 100);
    }
    
    //expert version
    $("#expert").click(function(){
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
    $("#noExpert").click(function(){
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

    
    // //  ============================ Listener ======================================
    // document.addEventListener("DOMContentLoaded", () => {
    //     document.getElementById("input_file").addEventListener("change", listenFile);
    // });
})