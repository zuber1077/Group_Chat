$(document).ready(function(){
    LoadData('.paginate');
    return GetResult();
});

function GetResult() {
    $.ajax({
        url: 'http://content.guardianapis.com/technology?page-size=40&order-by=newest&show-fields=all&api-key=9179b4d2-7b0f-44b3-becc-8a8813be5cbb',
        type: 'GET',
        datatype: 'json',
        success: function(data) {
            var results = '';
            $.each(data.response.results, function(i) {
                results += '<form class="paginate">'
                results += '<article class="post">';
                results += '<div class="post-content with-background">';
                
               

                    results += '<h2  class="post-title center">';
                    results += '<a  href="'+data.response.results[i].webUrl+'" class="read-more" target="_blank" >'+data.response.results[i].fields.headline+'</a>';
                    results += '</h2>';

                    results += '<div class="post-info center">'
                        results += '<span class="post-date">'+new Date(Date.parse(data.response.results[i].webPublicationDate)).toDateString()+'</span> in <span class="post-category"><a href="#">'+data.response.results[i].sectionId+'</a></span>, <span class="post-tags"><span><a href="#" class="post-tag label small rounded border-pink color-pink bkg-hover-pink bkg-hover-white">Press Review</a></span></span>'
                    results += '</div>'

                    
                    
                    results += '<div class="post-media">';
                    results += '<div class="thumbnail img-scale-in" data-hover-easing="easeInOut" data-hover-speed="700" data-hover-bkg-color="#ffffff" data-hover-bkg-opacity="0.9">';
                    
                    results += '<a class="overlay-link" href="'+data.response.results[i].webUrl+'">';
                            results += '<img style="transition-duration: 700ms;" src="'+data.response.results[i].fields.thumbnail+'"/>'
                            results += '<span class="overlay-info" style="transition-duration: 700ms; background-color: rgba(255, 255, 255, 0.9);"><span><span>Read Full Article →</span></span></span>'
                    results += '</a>';

                    results += '</div>';
                    results += '</div>';

                    results += '<p>'+data.response.results[i].fields.standfirst+'</p>';

                    results += '<a  href="'+data.response.results[i].webUrl+'" class="read-more" target="_blank" ></a>';


                results += '</div>';
                results += '</article>';

                results += '</form>'
            });

            $('#newsResults').html(results);
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