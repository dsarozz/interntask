CREATE OR REPLACE FUNCTION insert_json_data(json_data json)
RETURNS void AS $$
BEGIN
	with studentrecord as (
	INSERT INTO students(studentid,studentname,address)
		SELECT studentid,studentname, address FROM json_populate_record(null::students,json_data::json)
			ON CONFLICT (studentid) DO UPDATE SET studentname= students.studentname
	RETURNING studentid
	)
	INSERT INTO studentsubjects(studentid,subjectid,marks)
	SELECT studentrecord.studentid, subjectid, marks 
	FROM json_populate_recordset(null::studentsubjects, json_data::json->'subjects'), studentrecord
	ON CONFLICT ON CONSTRAINT studentsubject_unique DO UPDATE SET
	marks=EXCLUDED.marks;
END;
$$ LANGUAGE plpgsql

--OR

CREATE OR REPLACE FUNCTION insert_json_data(json_data json)
RETURNS void AS $$
BEGIN
	with studentrecord as (
	INSERT INTO students(studentid,studentname,address)
		SELECT studentid,studentname, address FROM json_populate_record(null::students,json_data::json)
			ON CONFLICT (studentid) DO UPDATE SET studentname= students.studentname
	RETURNING studentid
	),
temptable AS(
SELECT studentrecord.studentid, subjectid, marks 
	FROM json_populate_recordset(null::studentsubjects, json_data::json->'subjects'), studentrecord
)
	INSERT INTO studentsubjects(studentid,subjectid,marks)
	SELECT studentid, subjectid, marks 
	FROM temptable
	ON CONFLICT ON CONSTRAINT studentsubject_unique DO UPDATE SET
	marks=EXCLUDED.marks;
END;
$$ LANGUAGE plpgsql