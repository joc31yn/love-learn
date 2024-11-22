-- Count duplicates
CREATE OR REPLACE FUNCTION count_duplicates()
RETURNS INTEGER AS $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT SUM(duplicate_rows - 1)
    INTO duplicate_count
    FROM (
        SELECT COUNT(*) AS duplicate_rows
        FROM user_events
        GROUP BY user_id, title, start_date, end_date, description, location
        HAVING COUNT(*) > 1
    ) AS duplicates;

    RETURN COALESCE(duplicate_count, 0); -- Return 0 if no duplicates found
END;
$$ LANGUAGE plpgsql;

-- remove duplicates

CREATE OR REPLACE FUNCTION remove_all_duplicates()
RETURNS VOID AS $$
BEGIN
    DELETE FROM user_events
    WHERE ctid NOT IN (
        SELECT MIN(ctid)
        FROM user_events
        GROUP BY user_id, title, start_date, end_date, description, location
    );
END;
$$ LANGUAGE plpgsql;

