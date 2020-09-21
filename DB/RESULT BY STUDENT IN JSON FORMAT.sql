CREATE OR REPLACE FUNCTION results_by_student(student_id integer) 
RETURNS TABLE(studentname varchar, subjectname varchar, marks integer) AS $$
BEGIN
RETURN QUERY
select students.studentname, subjects.subjectname, studentsubjects.marks 
from studentsubjects 
join students on students.studentid = studentsubjects.studentid
join subjects on subjects.subjectid = studentsubjects.subjectid
where studentsubjects.studentid=student_id;
END;
$$ LANGUAGE plpgsql;

--Get result in json format by studentid
CREATE OR REPLACE FUNCTION results_by_student_to_json(student_id integer) 
RETURNS table (j json) AS $$
BEGIN
IF
student_id=0 then
RETURN QUERY 
select array_to_json(array_agg(row_to_json(results))) as Results
from (
	select distinct on (studentsubjects.studentid) studentsubjects.studentid, students.studentname, students.address, 
	(select array_to_json(array_agg(row_to_json(subject))) 
	 from
	 (select subjects.subjectid, subjects.subjectname,studentsubjects.marks from studentsubjects
		 join subjects on subjects.subjectid = studentsubjects.subjectid
 		 where studentsubjects.studentid = students.studentid
	 )subject
	) as Subjects
from studentsubjects 
join students on students.studentid = studentsubjects.studentid
) results;
ELSEIF
0<(select count(studentsubjects) from studentsubjects where studentid= student_id)  then
RETURN QUERY 
select array_to_json(array_agg(row_to_json(results))) as Results
from (
	select distinct on (studentsubjects.studentid) studentsubjects.studentid, students.studentname, students.address, 
	(select array_to_json(array_agg(row_to_json(subject))) 
	 from
	 (select subjects.subjectid, subjects.subjectname,studentsubjects.marks from studentsubjects
		 join subjects on subjects.subjectid = studentsubjects.subjectid
 		 where studentsubjects.studentid = students.studentid
	 )subject
	) as Subjects
from studentsubjects 
join students on students.studentid = studentsubjects.studentid
where studentsubjects.studentid= student_id
) results;
ELSE
RETURN QUERY
SELECT json_build_object('Result','Student result doesnot exist/ Invalid ID');
END if;
END;
$$ LANGUAGE plpgsql;