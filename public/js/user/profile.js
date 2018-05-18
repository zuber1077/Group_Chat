$(document).ready(function () { //
    $('.add-btn').on('click',function () { //button display form once click
        $("#add-input").click(); //z input field click will be trigerd
    });
    $('#add-input').on('change',function () { //chacking to see if there is a change in z input field //get z input stored in uploadInput 
        var addInput = $('#add-input'); //i add AJAX code to send from client to server
        //to make sure z input is not empity
        if(addInput.val() != ''){ //chack if z value is not empty
            var formData = new FormData(); //created new instance formData constracure //allow img to be upload or send to server
            //get z name of input field for z img 
            formData.append('upload',addInput[0].files[0]); //get from z file array 
            $('#completed').html('File Uploaded Successfully');
            //z value they place at index 0 //this automaticly create a key value pair
            //developer.mozilla.org/en/docs/Web/API/FormData

            $.ajax({ //use ajax method to send z data to db
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function() {
                addInput.val(''); //once z submition successful z data send z input field will be impty
                }
            })
        }
         ShowImage(this);
    });

    //personal information data
    $('#profile').on('click', function() {
        var username = $('#username').val(); 
        var fullname = $('#fullname').val(); 
        var gender = $('#gender').val(); 
        var country = $('#country').val(); 
        var bio = $('#bio').val(); 
        var upload = $('#add-input').val(); 
        var image = $('#user-image').val();

        var valid = true;

        if(upload === ''){
            $('#add-input').val(image); 
        }

        if(username == '' || fullname == '' || country == '' || gender == '' || bio == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can not submit an Empity Field</div>');
        }else{
            upload = $('#add-input').val();
            $('#error').html('');
        }

        if(valid === true){
            $.ajax({
                url: '/settings/profile',
                type: 'POST',
                data: {
                    username: username,
                    fullname: fullname,
                    gender: gender,
                    country: country,
                    bio: bio,
                    upload: upload
                },
                success: function() {
                    setTimeout( function() {
                        window.location.reload();
                    }, 200);
                }
            })
        }else{
            return false;
        }
    });

});


function ShowImage(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $('#show_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
//  next pass this form data directly using AJAX from client server to db
//  next use formidable allow to pass any type meltipart from data type 
 // becouse body-parser doest allow to pass multipart from data type

// document.getElementsByClassName("upload-btn").onload = function() {
//   var text = document.querySelector("#content .group p:first-child strong")
//     .innerHTML;
//   this.contentDocument.getElementById("input_4").value = text;
// };