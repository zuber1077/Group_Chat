$(document).ready(function () {
    
    // for hobby
    $('#AddHobby').on('click', function() { //click event for add btn(a)
        var Hobby = $('#Hobby').val(); //value from input

        var valid = true;

        if(Hobby === ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can not submit an Empity Field</div>');
        }else{
            $('#error').html('');
        }

        if(valid === true){
            $.ajax({
                url: '/settings/userinfo',
                type: 'POST',
                data: {
                    Hobby: Hobby
                },
                success: function() {
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                }
            })
        }else{
            return false;
        }
    });

    // fov Profecinal
    $('#AddProf').on('click', function() { //click event for add btn(a)
        var Profecinal = $('#Profecinal').val(); //value from input

        var valid = true;

        if(Profecinal === ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can not submit an Empity Field</div>');
        }else{
            $('#error').html('');
        }

        if(valid === true){
            $.ajax({
                url: '/settings/userinfo',
                type: 'POST',
                data: {
                    Profecinal: Profecinal
                },
                success: function() {
                    $('Profecinal').val('');
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                }
            })
        }else{
            return false;
        }
    });

    //  Add Group
    $('#AddGroup').on('click', function() { //click event for add btn(a)
        var FavGroup = $('#FavGroup').val(); //value from input

        var valid = true;

        if(FavGroup === ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can not submit an Empity Field</div>');
        }else{
            $('#error').html('');
        }

        if(valid === true){
            $.ajax({
                url: '/settings/userinfo',
                type: 'POST',
                data: {
                    FavGroup: FavGroup
                },
                success: function() {
                    $('FavGroup').val('');
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                }
            })
        }else{
            return false;
        }
    });

});