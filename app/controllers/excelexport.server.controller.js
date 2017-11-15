var xl = require('excel4node'),
        db = require('../../config/db');
var wb = new xl.Workbook();

exports.exportToExcel = function (req, res, next) {

    var query = 'SELECT t.taskid, d.departmentName, t.taskname, concat(u.lastname, \', \' , u.firstname) as assignedto, t.datecompleted ' +
            'FROM task t, department d, user u ' +
            'WHERE d.departmentid = t.departmentid and t.assignedto = u.userid and t.progress >= 1';

    db.get(db.READ, function (err, connection) {
        if (err) {
            res.json({message: err});
        }
        connection.query(
                query,
                function (err, result) {
                    if (err) {
                        res.json({message: err});
                    }
                    if (result.length > 0) {

                        var ws = wb.addWorksheet('Sheet 1');

                        var completedTasks = result;
                        var headerStyle = wb.createStyle({
                            font: {
                                bold: true,
                                wrapText: false,
                                color: 'white'
                            },
                            alignment: {
                                wrapText: true,
                                horizontal: 'fill',
                                shrinkToFit: false
                            },
                            fill: {
                                type: 'pattern',
                                patternType: 'solid',
                                fgColor: 'blue'
                            }
                        });

                        ws.cell(1, 1).string('Department').style(headerStyle);
                        ws.cell(1, 2).string('Project Name').style(headerStyle);
                        ws.cell(1, 3).string('Assigned To').style(headerStyle);
                        ws.cell(1, 4).string('Date Completed').style(headerStyle);

                        for (var i = 0, rowctr = 2; i < completedTasks.length; i++, rowctr++) {
                            ws.cell(rowctr, 1).string(completedTasks[i].departmentName);
                            ws.cell(rowctr, 2).string(completedTasks[i].taskname);
                            ws.cell(rowctr, 3).string(completedTasks[i].assignedto);
                            ws.cell(rowctr, 4).date(completedTasks[i].datecompleted);
                        }
                        wb.write('CompletedTasks.xlsx', res);
                    } else if (result.length === 0) {
                        res.json([]);
                    }
                });
    });

};