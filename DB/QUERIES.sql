CREATE OR REPLACE FUNCTION division_update() RETURNS trigger AS $insert_to_division$
DECLARE
TOTAL integer;
SUBJECTCOUNT integer;
PERCENTAGE float;
DIVISION varchar;
BEGIN
IF(TG_OP='DELETE')THEN
select sum(marks),count(subjectid) into TOTAL,SUBJECTCOUNT from studentsubjects 
where studentid= OLD.studentid and datedeleted is null group by studentid;
PERCENTAGE :=TOTAL/SUBJECTCOUNT;
IF PERCENTAGE>'75' 
 THEN DIVISION='DISTINCTION';
 ELSEIF PERCENTAGE between'60'and'75' 
 THEN DIVISION='FIRST'; 
 ELSEIF PERCENTAGE between'50'and'60' 
 THEN DIVISION='SECOND';
 ELSEIF PERCENTAGE between'40'and'50' 
 THEN DIVISION='THIRD';
 ELSEIF PERCENTAGE<'40'
 THEN DIVISION='FAILED'; 
 ELSE
 DIVISION='NO RESULT FOUND!';
 END IF;
 update students set division = DIVISION, datemodified = now() where studentid=OLD.studentid;
 ELSE
 select sum(marks),count(subjectid) into TOTAL,SUBJECTCOUNT from studentsubjects 
where studentid= NEW.studentid and datedeleted is null group by studentid;
PERCENTAGE :=TOTAL/SUBJECTCOUNT;
IF PERCENTAGE>'75' 
 THEN DIVISION='DISTINCTION';
 ELSEIF PERCENTAGE between'60'and'75' 
 THEN DIVISION='FIRST'; 
 ELSEIF PERCENTAGE between'50'and'60' 
 THEN DIVISION='SECOND';
 ELSEIF PERCENTAGE between'40'and'50' 
 THEN DIVISION='THIRD';
 ELSEIF PERCENTAGE<'40'
 THEN DIVISION='FAILED'; 
 ELSE
 DIVISION='NO RESULT FOUND!';
 END IF;
 update students set division = DIVISION, datemodified = now() where studentid=NEW.studentid;
 END IF;
 RETURN NULL;
END;
$insert_to_division$ LANGUAGE plpgsql;
 

CREATE TRIGGER insert_to_division 
AFTER 
INSERT OR UPDATE OR DELETE ON studentsubjects 
FOR EACH ROW 
EXECUTE PROCEDURE division_update();

drop trigger insert_to_division on studentsubjects