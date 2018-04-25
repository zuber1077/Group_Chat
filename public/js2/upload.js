$(document).ready(function () { //
    $('.upload-btn').on('click',function () { //button display form once click
        $("#upload-input").click(); //z input field click will be trigerd
    });
    $('#upload-input').on('change',function () { //chacking to see if there is a change in z input field //get z input stored in uploadInput 
        var uploadInput = $('#upload-input'); //i add AJAX code to send from client to server
        //to make sure z input is not empity
        if(uploadInput.val() != ''){ //chack if z value is not empty
            var formData = new FormData(); //created new instance formData constracure //allow img to be upload or send to server
            //get z name of input field for z img 
            formData.append('upload',uploadInput[0].files[0]); //get from z file array 
            //z value they place at index 0 //this automaticly create a key value pair
            //developer.mozilla.org/en/docs/Web/API/FormData

            $.ajax({ //use ajax method to send z data to db
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                uploadInput.val(''); //once z submition successful z data send z input field will be impty
                }
            })
        }
    })
})
//  next pass this form data directly using AJAX from client server to db
//  next use formidable allow to pass any type meltipart from data type 
 // becouse body-parser doest allow to pass multipart from data type

// document.getElementsByClassName("upload-btn").onload = function() {
//   var text = document.querySelector("#content .group p:first-child strong")
//     .innerHTML;
//   this.contentDocument.getElementById("input_4").value = text;
// };