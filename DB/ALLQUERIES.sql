--Update division by calculating percentage
CREATE OR REPLACE FUNCTION division_update() RETURNS trigger AS $insert_to_division$
DECLARE
TOTAL integer;
SUBJECTCOUNT integer;
PERCENTAGE float;
DIV varchar;
student_id integer;
BEGIN
IF(TG_OP='DELETE')THEN
student_id:=OLD.studentid;
ELSE
student_id:=NEW.studentid;
select sum(marks),count(subjectid) into TOTAL,SUBJECTCOUNT from studentsubjects 
where studentid= student_id and datedeleted is null group by studentid;
PERCENTAGE :=TOTAL/SUBJECTCOUNT;
IF PERCENTAGE>'75' 
 THEN DIV='DISTINCTION';
 ELSEIF PERCENTAGE between'60'and'75' 
 THEN DIV='FIRST'; 
 ELSEIF PERCENTAGE between'50'and'60' 
 THEN DIV='SECOND';
 ELSEIF PERCENTAGE between'40'and'50' 
 THEN DIV='THIRD';
 ELSEIF PERCENTAGE<'40'
 THEN DIV='FAILED'; 
 ELSE
 DIV='NO RESULT FOUND!';
 END IF;
 update students set division = DIV, datemodified = now() where studentid=student_id;
 END IF;
 RETURN NULL;
END;
$insert_to_division$ LANGUAGE plpgsql;

drop trigger insert_to_division on studentsubjects

CREATE OR REPLACE FUNCTION results_by_student_v1(student_id integer) 
RETURNS TABLE(subjectid integer, subjectname varchar, marks integer) AS $$
BEGIN
RETURN QUERY
select studentsubjects.subjectid, subjects.subjectname, studentsubjects.marks 
from studentsubjects 
join subjects on subjects.subjectid = studentsubjects.subjectid
where studentsubjects.studentid= student_id;
END;
$$ LANGUAGE plpgsql;

drop function results_by_student_v1(integer)

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

--INSERT using JSON data
CREATE OR REPLACE FUNCTION insert_using_json(json_data json)
RETURNS void AS $$
BEGIN
	WITH studentrecord AS (
	INSERT INTO students (studentname,address) 
	SELECT studentname, address 
	FROM json_populate_record(null::students,json_data::json)
	returning studentid)
	INSERT INTO studentsubjects(studentid, subjectid, marks) 
	SELECT studentid,(rec->>'subjectid')::integer,(rec->>'marks')::integer
	FROMjson_array_elements(json_data::json->'subjects')rec, studentrecord;
END;
$$ LANGUAGE plpgsql

--OR--

CREATE OR REPLACE FUNCTION insert_json_data(json_data json)
RETURNS void AS $$
BEGIN
	WITH studentrecord AS (
	INSERT INTO students(studentname,address)
		SELECT studentname, address FROM json_populate_record(null::students,json_data::json)
	RETURNING studentid
	)
	INSERT INTO studentsubjects(studentid,subjectid,marks)
	SELECT studentrecord.studentid, subjectid, marks 
	FROM json_populate_recordset(null::studentsubjects, json_data::json->'subjects'), studentrecord;
END;
$$ LANGUAGE plpgsql

--UPSERT QUERY
CREATE OR REPLACE FUNCTION insert_json_data(json_data json)
RETURNS void AS $$
BEGIN
	with studentrecord as (
	INSERT INTO students(studentid,studentname,address)
		SELECT studentid,studentname, address FROM json_populate_record(null::students,json_data::json)
			ON CONFLICT (studentid) DO UPDATE SET studentname= students.studentname
	RETURNING studentid
	)
--OPTIONAL
-- ,temptable as (
-- SELECT studentrecord.studentid, subjectid,marks 
-- 	FROM json_populate_recordset(null::studentsubjects, (select * from json_data)::json->'subjects'), studentrecord
-- )
	INSERT INTO studentsubjects(studentid,subjectid,marks)
	SELECT studentrecord.studentid, subjectid, marks 
	FROM json_populate_recordset(null::studentsubjects, json_data::json->'subjects'), studentrecord
	ON CONFLICT ON CONSTRAINT studentsubject_unique DO UPDATE SET
	marks=EXCLUDED.marks;
END;
$$ LANGUAGE plpgsql