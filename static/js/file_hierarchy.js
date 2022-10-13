$('[id^=btn_schema]').click(function(){
    // var file = $(this).parent().parent().prev().prop('firstChild').nodeValue;
    var file = $(this).attr('id').split("--")[1];
    console.log(`Stage 1 : filename ${file}  `);
    var form = $("#form_hie--" + file);
    var formdata = new FormData(document.getElementById(form));
    // var  index = $(this).parent().parent();
    // $(this).parent().parent().html("<table> New </table>")
    $.ajax({
        type: 'post',
        url: 'files/upload/'+ file.trim() + "/db",
        data: formdata,
        // Doesn't deal with the data and the contenu
        processData: false,
        // contentType: 'application/json;charset=utf-8',
        contentType: 'text/html; charset=utf-8',
        success(response, textStatus) {   
            // index.html(response) 
            $('#file_measure').append(response);
            $('#select_propose').attr('id', 'select_propose--'+form.split("--")[1]) ;
            $('.propose').attr('id', 'propose' + form.split("--")[1]);  
        },
        error() {
            alert("Can not get hierarchies !!!");
        }
    })
})

$('[id^=selec_hierarchies_icon').click(function(){
    var show = $(this).text() == "+"? true: false;
    console.log("show ==> " + show);
    $(this).text(show? "-": "+");
    console.log( $(this).parent().next().attr('id'));
    $(this).parent().next().toggle();
})

$('[id^=select_propose_hierarchies]').click(function(){
    var targetselect = '.propose_hierarchies--' + $(this).attr("id").split("--")[1].trim();
    if ($(this).text() === "All") {
        $(this).text("None") ;
        console.log($(this).text());
        $(this).css("color","grey");
        console.log('targetselect =>' + targetselect);
        $(targetselect).prop("checked", true);
    } else {
        $(this).text("All");
        $(this).css("color","black");
        $(targetselect).prop("checked", false);
    }
})





