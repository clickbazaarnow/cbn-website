var excelParser = require('excel');

excelParser('/Users/sramoji/Downloads/master.xlsx', function(err, data) {
    if(err) throw err;
    for(var i = 0; i < data.length; i++) {
        console.log(JSON.stringify(data[i]));
    }
});
