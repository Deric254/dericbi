alter table student_exams ;--  student name and id are not needed since it is the same one student exams 
-- drop student_id;
-- drop student_name;
select * from  student_exams;-- cheking the table standing after drops
/* We are claning the data  
Lets now check all the distinct entries we have in every collumn */

 select distinct exam  from student_exams;-- checking all the exams we have 
  select distinct score  from student_exams;-- checking all the scores we have 
   select distinct exam_date  from student_exams;-- checking all the exam_dates  we have 
    select distinct subject_code  from student_exams;-- checking all the subject_codes  we have 
     select distinct teacher_id  from student_exams;-- checking all the teacher_ids we have  
     -- 1. Cleaning exams
    -- since we have a messed exam "Maths" we have to make it "Mathemactics activities"as it should be
  UPDATE student_exams SET exam = 'Mathematics Activities' WHERE exam ='mathemactics activities';-- update mathematics to quired strings
  -- 2. Cleaning Scores
  -- since we cannot have less tha 1, above 4 we wil have to fix it 
  update student_exams 
  set score=(
  select avg_score from (
  select avg(score) as avg_score  from
  student_exams) as Temp
  )
  where score <1 or score>4;
  -- fixing exam dates
  -- we have an illelevant date "'01/00/1900'" we gonna fix it 
  select *from student_exams where exam_date='01/00/1900'; -- instance 1
  update student_exams
  set exam_date='08/01/2024' where exam='Kiswahili'
  limit 1;
  
    select *from student_exams where exam_date='01/00/1900';-- instance 2
  update student_exams
  set exam_date='08/01/2024' where teacher_id='T006'
  limit 1;
      select *from student_exams where exam_date='01/00/1900';-- instance 3
  update student_exams
  set exam_date='02/01/2025' where exam_date='08/01/2024'
  limit 1;
  -- fixing unknown subject codes
  UPDATE student_exams SET subject_code = CASE 
WHEN exam = 'Language Activities' THEN 'LANG001' 
WHEN exam = 'Religious Activities' THEN 'REL001' 
WHEN exam = 'Mathematics Activities' THEN 'MATH001' 
WHEN exam = 'Environment Activities' THEN 'ENV001' 
WHEN exam = 'Creative Activities' THEN 'CRE001' 
WHEN exam = 'Kiswahili' THEN 'LANG002' 
ELSE subject_code 
END ;

-- fixing unknown teacher ids 

  UPDATE student_exams SET teacher_id = CASE 
WHEN exam = 'Language Activities' THEN 'T001' 
WHEN exam = 'Religious Activities' THEN 'T002' 
WHEN exam = 'Mathematics Activities' THEN 'T003' 
WHEN exam = 'Environment Activities' THEN 'T004' 
WHEN exam = 'Creative Activities' THEN 'T005' 
WHEN exam = 'Kiswahili' THEN 'T006' 
ELSE teacher_id
END ;

/*
 Analysis Formulas:
 Average Score: AVG(score)
 Average by Subject: AVG(score) GROUP BY exam
 Average by Month: AVG(score) GROUP BY exam_date
*/
 create view Average_score 
 as 
 SELECT AVG(score) AS avg_score FROM student_exams; 
 
create view Average_score_by_exam 
as 
SELECT exam, AVG(score) AS avg_score FROM student_exams GROUP BY exam;
 
create view Average_score_by_exam_andExam_date 
as 
SELECT exam,exam_date, AVG(score) AS avg_score FROM student_exams GROUP BY exam,exam_date;

