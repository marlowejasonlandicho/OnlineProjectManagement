
INSERT INTO `opm`.`user`
(`firstname`,
`lastname`,
`email`,
`username`,
`departmentid`,
`hashedPassword`,
`roleid`)
VALUES('Default',
'Default',
'default@opm.com',
'defaultuser',
1,
'defaultuser' ,
2);



INSERT INTO `opm`.`user`
(`firstname`,
`lastname`,
`email`,
`username`,
`hashedPassword`,
`roleid`)
VALUES('Default',
'Admin',
'admin@opm.com',
'admin',
'admin' ,
2);