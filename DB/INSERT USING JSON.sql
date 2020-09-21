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