CREATE TABLE "task" (
    "id" SERIAL PRIMARY KEY,
    "task" VARCHAR(80) NOT NULL,
    "category" VARCHAR(40) NOT NULL,
    "priority" VARCHAR(40) NOT NULL,
	"priority_id" INT NOT NULL,
    "date_created" DATE,
    "deadline" VARCHAR (20),
	"note" VARCHAR (200),
	"completed" VARCHAR (20)
);

INSERT INTO "task" (task, category, priority, priority_id, deadline, date_created, note, completed) VALUES ('Pay credit card bill', 'Finances', 'Soon', '3', '3/1/2019','2/17/2019','check to make sure there are no fraudulent charges','');
INSERT INTO "task" (task, category, priority, priority_id, deadline, date_created, note, completed) VALUES ('Take Sophia to swimming lessons', 'Family', 'Tomorrow', '2', '2/18/2019' ,'2/17/2019' ,'remember to pay next months bill','');
INSERT INTO "task" (task, category, priority, priority_id, deadline, date_created, note, completed) VALUES ('Plan a vacation', 'Personal', 'Eventually', '4', '','2/17/2019','research Iceland','');
INSERT INTO "task" (task, category, priority, priority_id, deadline, date_created, note, completed) VALUES ('Buy groceries', 'Shopping', 'Today', '1','' ,'2/17/2019','list is on notes in iPhone','');




CREATE TABLE "category" (
    "id" SERIAL PRIMARY KEY,
    "category" VARCHAR(25) NOT NULL
);

INSERT INTO "category" (category) VALUES ('School');
INSERT INTO "category" (category) VALUES ('Work');
INSERT INTO "category" (category) VALUES ('Family');
INSERT INTO "category" (category) VALUES ('Personal');
INSERT INTO "category" (category) VALUES ('Finances');
INSERT INTO "category" (category) VALUES ('Shopping');