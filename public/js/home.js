

$(document).ready(function() {
    
    $('#favorite').on('submit', function(e) {
        e.preventDefault();

        var id = $("#id").val();
        var gpName = $("#gp_Name").val();

        $.ajax({
          url: "/home",
          type: "POST",
          data: {
            id: id,
            gpName: gpName
          },
          success: function() {
            //console.log(gpName);
          }
        })
    });
});