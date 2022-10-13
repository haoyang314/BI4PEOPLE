// const upload = (formData) => {
var upIndex = 0;
// const upload = (formData) => {
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

    var xhr = new XMLHttpRequest();
    $.ajax({
        type: 'post',
        url: '/files',
        data: formData,
        // Doesn't deal with the data and the contenu
        processData: false,
        // contentType: 'application/json;charset=utf-8',
        contentType: false,
        //listener xhr
        xhr: () => {
            const xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener($('#progress'), e => {
                    const { loaded, total } = e;
                    var process = (loaded / total) * 100;
                    $('#progress').setAttribute('value', process);
                },
                    false
                );
                return xhr;
            }
        },

        success(response) {
            $("#err_exist").text("Upload successfully!");
            // if (response.code === 201){
            //     $("#err_exist").innerText("Upload successfully!");
            //     // response.result.forEach(r =>{
            //     //     if (r.code === 200) {

            //     //     }
            //     // })
            //     console.log('Upload successfully!')
            // }else{
            //     $("#err_exist").innerText(response.msg);
            // }



            // let html ='<h1> Welcome! </h1>'
            // $('#welcome').html(html)
            $("#index").html(response)
        }
    })
}

function fold(){
    var $form = $('#file_container>div>form');
    var foldimg ='\+';
    var puckimg = '-';
    console.log($(this).index())
    console.log(`form click index ${$(this).index()}`)
    var index = $(this).index();    
    var show = $(this).val() == foldimg? true: false;
    console.log(`show ${show}`)
    $(this).val() = show? puckimg: foldimg;
    $form[index].style.display = show? 'display':'block';
    // $form[index].css('display', 'block');
//     for (let i=0; i < $('.fold').length; i++){
//         var show = $('.fold')[i].val() == foldimg? true: false;
//         $('.fold')[i].val() = show? puckimg: foldimg;
//         obj = $('.w3-form')[i]
//     }
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

$(document).ready(() => {
    
})


function selectpropose(span) {
    console.log("this value: " + $(span).attr("id").substr(-1)+ " " +  $(span).text())
    console.log("this text: " + $(span).text())
    var targetselect = '.proposed_measure' + $(span).attr("id").substr(-1);
    console.log('targetselect : ' +  targetselect)
    if ($(span).text() === "All") {
        $(span).text("None") ;
        console.log($(span).text())
        $(span).css("color","grey");
        $(targetselect).prop("checked", true)

    } else {
        $(span).text("All");
        $(span).css("color","black");
        $(targetselect).prop("checked", false);

    }
}

function selectadditional() {
    var selectadd = $('#select_add'); //document.getElementById("select_add");
    if (selectadd.text() === "All") {
        selectadd.text("None");      
        selectadd.css("color","grey");
        $("[name='additional_measure']").prop("checked", true);

    } else {
        selectadd.text("All");
        selectadd.css("color","black");
        $("[name='additional_measure']").prop("checked", false);

    }
}

function isExisted(files) {
    // get files name and show them
    var filenames = []
    // var filename = files[0].name;  //------------
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
                $("#err_exist").text("File name exist: " + response.result);
                console.log('Stage 7: err_exist.value ' + $("#err_exist").text())
            } else {
                upload(files);
            }
        },
        error() {
            alert("Can not upload !!!");
        }
    })
}

function listenFile() {
    const formData = new FormData();
    // var inputFile = document.querySelector("#input_file"); //------------
    // formData.append(inputFile, this.files); //------------
    var files = this.files; // var e = e || window.event; var files = e.target.files; 
    console.log('Satage 1: this file ======> ' + files)
    if (files[0] != undefined) {
        isExisted(files);
    } else {
        $("#err_exist").innerText("Please choose a file.");
    }

    // formData.append($("#input_file"), this.files); //------------
    // upload(formData); //------------

}


//  ============================ Listener ======================================
document.addEventListener("DOMContentLoaded", () => {
    // document.getElementById("select_propose").addEventListener("click", selectpropose);
    // document.getElementById("select_add").addEventListener("click", selectadditional);
    document.getElementById("input_file").addEventListener("change", listenFile);
});

