// $('id^=btn_genedb').click(function () {
//     var sele_hies = [];
//     $("input[name='proposed_hierarchy']:checked").each(function () {
//         sele_hies[i] = $(this).val();
//     });
//     if (sele_hies.length < 1) {
//         $('#sele_hie_err').text('Please choose at least a hierarchy!');
//         $('#sele_hie_err').css('color', 'red');
//     } else {
//         fetch('/files/upload/:id/db', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': false,
//             },
//             body: {'proposed_hierarchy': sele_hies }
//         })
//             .then((response) => response.json())
//             .then((result) => {
//                 console.log('Success:', result);
//                 $('#selec_hierarchies_panel--' + $(this).attr('id').split("--")[1]).append(result);
//             })
//     }
// })
$(document).ready(() => {

    $('[id^=db_icon').click(function () {
        var file = $(this).attr('id').split("--")[1];
        $('#db_panel--' + file).toggle();
        var show = $('#db_panel--' + file).css("display")=="none"? false: true;
         console.log( $('#db_panel--' + file).css("display") + "  show ==> " + show);
        $(this).children(':first').attr('class', show ? "far fa-minus-square" : "far fa-plus-square");

        // var show = $(this).children(':first').attr('class') == "far fa-plus-square" ? true : false;
        // console.log("show ==> " + show);
        // $(this).children(':first').attr('class', show ? "far fa-minus-square" : "far fa-plus-square");
        // // $(this).parent().next().toggle();
        // $('#db_panel--' + file).toggle();
    })
})