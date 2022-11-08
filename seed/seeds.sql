INSERT INTO departments(name)
    VALUES ("Sales"),
           ("Development"),
           ("Executive");

INSERT INTO positions(title, salary, department_id)
    VALUES ('Manager', 1000, 2),
           ("CEO", 100000, 3),
           ('Head of Sales', 100, 1);

INSERT INTO employees(first_name, last_name, manager_id, position_id)
    VALUES ('John', 'Hamm', 1, 1),
           ('Mary', 'Johnson', 1, 2),
           ('Frank', 'Reynolds', 1, 3);
