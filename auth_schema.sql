-- ==========================================================
-- DATABASE : my_next_app
-- SCHEMA   : auth
-- ==========================================================

DROP SCHEMA IF EXISTS auth CASCADE;

CREATE SCHEMA auth;

-- ==========================================================
-- TABLE : users
-- ==========================================================

CREATE TABLE auth.users(
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- REGISTER USER
-- ==========================================================

CREATE OR REPLACE PROCEDURE auth.sp_register_user(
    p_full_name VARCHAR,
    p_email VARCHAR,
    p_password_hash TEXT
)
LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO auth.users(
        full_name,
        email,
        password_hash
    )
    VALUES(
        p_full_name,
        p_email,
        p_password_hash
    );
END;
$$;

-- ==========================================================
-- CREATE USER (ADMIN)
-- ==========================================================

CREATE OR REPLACE PROCEDURE auth.sp_create_user(
    p_full_name VARCHAR,
    p_email VARCHAR,
    p_password_hash TEXT,
    p_role VARCHAR
)
LANGUAGE plpgsql
AS
$$
BEGIN

    INSERT INTO auth.users(
        full_name,
        email,
        password_hash,
        role
    )
    VALUES(
        p_full_name,
        p_email,
        p_password_hash,
        p_role
    );
END;
$$;

-- ==========================================================
-- LOGIN
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_login(
    p_email VARCHAR
)
RETURNS TABLE(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    password_hash TEXT,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN
RETURN QUERY
SELECT
u.id,
u.full_name,
u.email,
u.password_hash,
u.role,
u.created_at
FROM auth.users u
WHERE u.email = p_email;
END;
$$;

-- ==========================================================
-- GET USER BY ID
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_get_user(
    p_id INT
)

RETURNS TABLE(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN
RETURN QUERY
SELECT
u.id,
u.full_name,
u.email,
u.role,
u.created_at
FROM auth.users u
WHERE u.id = p_id;
END;
$$;

-- ==========================================================
-- GET ALL USERS
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_get_users()

RETURNS TABLE(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN
RETURN QUERY
SELECT
u.id,
u.full_name,
u.email,
u.role,
u.created_at
FROM auth.users u
ORDER BY u.id;
END;
$$;

-- ==========================================================
-- GET USER BY ID (ADMIN MODULE)
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_get_user_by_id(
    p_id INT
)

RETURNS TABLE(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN
RETURN QUERY
SELECT
u.id,
u.full_name,
u.email,
u.role,
u.created_at
FROM auth.users u
WHERE u.id = p_id;
END;
$$;

-- ==========================================================
-- UPDATE USER
-- ==========================================================

CREATE OR REPLACE PROCEDURE auth.sp_update_user(
    p_id INT,
    p_full_name VARCHAR,
    p_role VARCHAR
)
LANGUAGE plpgsql
AS
$$
BEGIN
UPDATE auth.users
SET
full_name = p_full_name,
role = p_role,
updated_at = CURRENT_TIMESTAMP
WHERE id = p_id;
END;
$$;

-- ==========================================================
-- DELETE USER
-- ==========================================================

CREATE OR REPLACE PROCEDURE auth.sp_delete_user(
    p_id INT
)
LANGUAGE plpgsql
AS
$$
BEGIN
DELETE FROM auth.users
WHERE id = p_id;
END;
$$;

-- ==========================================================
-- SAMPLE ADMIN USER
-- Password : 123456
-- Replace password hash from Node.js if required
-- ==========================================================

INSERT INTO auth.users(
    full_name,
    email,
    password_hash,
    role
)
VALUES(
    'Sadik',
    'admin@gmail.com',
    '$2b$10$wH6QvVx0D0xJq8m8R4vM9u4D7aA9L8Q7fJj9g0m1Y7PqQv9YlP6iK',
    'admin'
);

-- ==========================================================
-- GET USERS WITH PAGINATION
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_get_users_pagination(
    p_page INT,
    p_limit INT
)

RETURNS TABLE(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN
RETURN QUERY
SELECT
u.id,
u.full_name,
u.email,
u.role,
u.created_at
FROM auth.users u
ORDER BY u.id
LIMIT p_limit
OFFSET (p_page - 1) * p_limit;
END;
$$;

-- ==========================================================
-- GET USERS WITH PAGINATION COUNT
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_get_users_pagination_count()
RETURNS BIGINT
LANGUAGE sql
AS $$
    SELECT COUNT(*)
    FROM auth.users;
$$;

-- ==========================================================
-- SEARCH USERS WITH PAGINATION
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_search_users_pagination
(
    p_search VARCHAR,
    p_page INT,
    p_limit INT
)
RETURNS TABLE
(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN

RETURN QUERY
SELECT
    u.id,
    u.full_name,
    u.email,
    u.role,
    u.created_at
FROM auth.users u
WHERE
    u.full_name ILIKE '%' || p_search || '%'
    OR u.email ILIKE '%' || p_search || '%'
ORDER BY u.id
LIMIT p_limit
OFFSET (p_page - 1) * p_limit;

END;
$$;

-- ==========================================================
-- SEARCH USERS COUNT
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_search_users_count
(
    p_search VARCHAR
)
RETURNS BIGINT
LANGUAGE sql
AS
$$

SELECT COUNT(*)
FROM auth.users u
WHERE
    u.full_name ILIKE '%' || p_search || '%'
    OR u.email ILIKE '%' || p_search || '%';

$$;

-- ==========================================================
-- SEARCH USERS WITH PAGINATION AND SORTING
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_search_sort_users_pagination
(
    p_search VARCHAR,
    p_page INT,
    p_limit INT,
    p_sort_by VARCHAR,
    p_sort_order VARCHAR
)
RETURNS TABLE
(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN

RETURN QUERY
SELECT
    u.id,
    u.full_name,
    u.email,
    u.role,
    u.created_at
FROM auth.users u
WHERE
    u.full_name ILIKE '%' || p_search || '%'
    OR u.email ILIKE '%' || p_search || '%'
ORDER BY
    CASE
        WHEN p_sort_by = 'full_name' AND p_sort_order = 'asc'
        THEN u.full_name
    END ASC,

    CASE
        WHEN p_sort_by = 'full_name' AND p_sort_order = 'desc'
        THEN u.full_name
    END DESC,

    CASE
        WHEN p_sort_by = 'email' AND p_sort_order = 'asc'
        THEN u.email
    END ASC,

    CASE
        WHEN p_sort_by = 'email' AND p_sort_order = 'desc'
        THEN u.email
    END DESC,

    CASE
        WHEN p_sort_by = 'created_at' AND p_sort_order = 'asc'
        THEN u.created_at
    END ASC,

    CASE
        WHEN p_sort_by = 'created_at' AND p_sort_order = 'desc'
        THEN u.created_at
    END DESC,

    u.id ASC

LIMIT p_limit
OFFSET (p_page - 1) * p_limit;

END;
$$;

-- ==========================================================
-- FILTER USERS WITH PAGINATION AND SORTING
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_filter_users_pagination
(
    p_search VARCHAR,
    p_role VARCHAR,
    p_page INT,
    p_limit INT,
    p_sort_by VARCHAR,
    p_sort_order VARCHAR
)
RETURNS TABLE
(
    id INT,
    full_name VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS
$$
BEGIN

RETURN QUERY
SELECT
    u.id,
    u.full_name,
    u.email,
    u.role,
    u.created_at
FROM auth.users u
WHERE
    (
        p_search = ''
        OR u.full_name ILIKE '%' || p_search || '%'
        OR u.email ILIKE '%' || p_search || '%'
    )
    AND
    (
        p_role = ''
        OR u.role = p_role
    )
ORDER BY
    CASE
        WHEN p_sort_by = 'full_name'
             AND p_sort_order = 'asc'
        THEN u.full_name
    END ASC,

    CASE
        WHEN p_sort_by = 'full_name'
             AND p_sort_order = 'desc'
        THEN u.full_name
    END DESC,

    CASE
        WHEN p_sort_by = 'email'
             AND p_sort_order = 'asc'
        THEN u.email
    END ASC,

    CASE
        WHEN p_sort_by = 'email'
             AND p_sort_order = 'desc'
        THEN u.email
    END DESC,

    CASE
        WHEN p_sort_by = 'created_at'
             AND p_sort_order = 'asc'
        THEN u.created_at
    END ASC,

    CASE
        WHEN p_sort_by = 'created_at'
             AND p_sort_order = 'desc'
        THEN u.created_at
    END DESC,

    u.id ASC

LIMIT p_limit
OFFSET (p_page - 1) * p_limit;

END;
$$;

-- ==========================================================
-- FILTER USERS COUNT
-- ==========================================================

CREATE OR REPLACE FUNCTION auth.fn_filter_users_count
(
    p_search VARCHAR,
    p_role VARCHAR
)
RETURNS BIGINT
LANGUAGE sql
AS
$$

SELECT COUNT(*)
FROM auth.users u
WHERE
    (
        p_search = ''
        OR u.full_name ILIKE '%' || p_search || '%'
        OR u.email ILIKE '%' || p_search || '%'
    )
    AND
    (
        p_role = ''
        OR u.role = p_role
    );

$$;






-- ==========================================================
-- TESTING
-- ==========================================================

-- Register
-- CALL auth.sp_register_user('John','john@gmail.com','hash');

-- Create User
-- CALL auth.sp_create_user('Rahul','rahul@gmail.com','hash','user');

-- Login
-- SELECT * FROM auth.fn_login('admin@gmail.com');

-- Get Profile
-- SELECT * FROM auth.fn_get_user(1);

-- Get Users
-- SELECT * FROM auth.fn_get_users();

-- Get User By Id
-- SELECT * FROM auth.fn_get_user_by_id(1);

-- Update
-- CALL auth.sp_update_user(1,'Admin Updated','admin');

-- Delete
-- CALL auth.sp_delete_user(2);

-- pagination
-- SELECT * FROM auth.fn_get_users_pagination(1,5);