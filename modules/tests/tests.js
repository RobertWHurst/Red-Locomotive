RedLocomotive('tests', function(){

    function createTest(parentElementSelector, tests) {

        var test = {},
            result = '',
            table = jQuery('<table></table>');

        jQuery(parentElementSelector).append(table);

        for (var i = 0; i < tests.length; i += 1) {
            test = tests[i];

            if (test.test()) {
                result = '<span style="color: #00C407">Successful</h1>';
            } else {
                result = '<span style="color: #C40000">Failed</h1>';
            }

            var row = jQuery('<tr><td>' + test.label + '</td><td>' + result + '</td></tr>');

            table.append(row);

        }
    }

    return {
        "create": createTest
    }
});