$(document).ready(function(){
    LoadData('.paginate');
    return GetResult();
});

function GetResult() {
    $.ajax({
        url: 'https://content.guardianapis.com/lifeandstyle?page-size=122&order-by=newest&show-fields=all&api-key=9179b4d2-7b0f-44b3-becc-8a8813be5cbb',
        type: 'GET',
        datatype: 'json',
        success: function(data) {
            var results = '';
            $.each(data.response.results, function(i) {
                results += '<form class="paginate">';
                results += '<div class="post-content">';
               results += '<a  href="'+data.response.results[i].webUrl+'" class="read-more" target="_blank" >';
                results += '<img class="img-responsive post-image" style="transition-duration: 700ms;" src="'+data.response.results[i].fields.thumbnail +'"/>';

                results += '<div class="post-container">';
                results += '<div class="post-detail">';

            results += '<div class="user-info">';

                results += '<h5><a href="'+ data.response.results[i].webUrl +'" class="profile-link">'+ data.response.results[i].fields.headline +'</a><span class="following">dd</span></h5>';

                results += '<p class="text-muted">'+new Date(Date.parse(data.response.results[i].webPublicationDate)).toDateString()+'</p>';
            results += '</div>';

            // results += ' <div class="reaction">';
            //     results += '<a class="btn text-green"><i class="icon ion-thumbsup"></i> 13</a>';
            //     results += '<a class="btn text-red"><i class="fa fa-thumbs-down"></i> 0</a>';
            // results += '</div>';

                results += '<div class="line-divider"></div>';

            results += '<div class="post-text">';
                results += '<p>'+data.response.results[i].fields.standfirst+'<p/>'
            results += '</div>';

                results += '</div>';
                results += '</div>';
                results += '</a>'
                results += "</div>";
                results += "</form>";
               
               
            });

            $('#lifeStyle').html(results);
            $('.paginate').slice(0, 4).show();
        }
    })
}

function LoadData(divClass) {
    $('#loadMore').on('click', function(e) {
        e.preventDefault();

        $(divClass+":hidden").slice(0, 2).slideDown();

        $('html, body').animate({
            scrollTop:$(this).offset().top
        }, 1700);
    });

    $('#linkTop').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
}