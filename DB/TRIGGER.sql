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