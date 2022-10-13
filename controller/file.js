// const upload = (formData) => {
function upload(formData){
    $ajax({
        type: 'post',
        url:'/files',
        data: formData,
        // Doesn't deal with the data and the contenu
        processData: false,
        contentType:false,
        //listener xhr
        xhr: () => {
            const xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener( $('#progress'), e => {
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


function selectpropose(){
    // var selectform = document.getElementById("select_form");
    // var selectpropose = selectform.select_propose;
    // var propose = selectform.proposed_measure;
    var selectpropose = document.getElementById("select_propose");
    var propose = document.getElementsByClassName("proposed_measure");
    if(selectpropose.value == "All"){
        selectpropose.innerText = "None";
        selectpropose.style.color = "grey";
        for (let i = 0; i < propose.length; i++) {
            propose[i].checked = true;
        }
    }else{
        selectpropose.innerText = "All";
        selectpropose.style.color = "black";
        for (let i = 0; i < propose.length; i++) {
            propose[i].checked = false;
        }
    }
}

function selectadditional(){
    // var selectform = document.getElementById("select_form");
    // var selectadd = selectform;
    // var add = selectform.additional_measure;
    var selectadd = document.getElementById("select_add");
    var add = document.getElementsByClassName("additional_measure");
    if(selectadd.innerText == "All"){
        selectadd.innerText = "None";
        selectadd.style.color = "grey";
        for (let i = 0; i < add.length; i++) {
            add[i].checked = true;
        }
    }else{
        selectadd.innerText = "All";
        selectadd.style.color = "black";
        for (let i = 0; i < add.length; i++) {
            add[i].checked = false;
        }
    }
}

function isExisted(files){
    console.log("Stage 3 files =======> " + files)
    $ajax({
        type: 'post',
        url:'/files/upload',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify({filenames : files}),
        success(response) {
            if (response.code == 200 ){
                if (response.result) {
                    $("#err_exist").innerText("File name exist !");
                }else{
                    const formData = new FormData();
                    formData.append($("#input_file"), this.files);
                    upload(formData);
                }
            }
        },
        error(){
            alert("Can not upload !!!");
        }
    })
}

function listenFile(){
    const formData = new FormData();
    // var inputFile = document.querySelector("#input_file"); //------------
    // formData.append(inputFile, this.files); //------------
    var files = this.files; // var e = e || window.event; var files = e.target.files; 
    console.log('Satage 1: this file ======> ' + files)
    if (files.length > 0) {
        // get files name and show them
        //var filename = files[0].name;  //------------
        var filenames = [];
        files.forEach(file => {
            console.log("Stage 2 each file =======> " + file.name)
            filenames.push(file.name);
});
        isExisted(filenames)
    }else{
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

