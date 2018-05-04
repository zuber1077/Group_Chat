
module.exports = function(async, gpNames) {
    return {
        SetRouting: function(router) {
            router.get('/results', this.getResults);
            router.post('/results', this.postResults); 
        },
        //user not be able to vist results unless they come from apply button 
        getResults: function (req,res) {
            res.redirect('/home');
        },
        postResults: function (req,res) {
            async.parallel([
                function (callback) {
                    const regex = new RegExp((req.body.country), 'gi');
                    //search for country and name
                    gpNames.find({'$or': [{'country': regex}, {'name': regex}]}, (err, result) => {
                        callback(err, result);
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk = [];
                const chunkSize = 4;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }

                res.render('results', {title: 'GPchat - Results', user: req.user, chunks: dataChunk});
            });
        }
    }
}