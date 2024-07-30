-- Custom SQL migration file, put you code below! --
-- Step 1: Create a new table without the foreign key constraint
CREATE TABLE new_profileImage(
  id text PRIMARY KEY NOT NULL,
  created_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  updated_at text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  userId text NOT NULL,
  name text NOT NULL,
  size integer NOT NULL,
  format text NOT NULL,
  crop text,
  transformations text,
  selected integer DEFAULT FALSE NOT NULL
);

-- Step 2: Copy data from the old table to the new table
INSERT INTO new_profileImage(id, created_at, updated_at, userId, name, size, format, crop, transformations, selected)
SELECT
  id,
  created_at,
  updated_at,
  userId,
  name,
  size,
  format,
  crop,
  transformations,
  selected
FROM
  profileImage;

-- Step 3: Drop the old table
DROP TABLE profileImage;

-- Step 4: Rename the new table to the original table name
ALTER TABLE new_profileImage RENAME TO profileImage;

-- Step 5: Recreate indexes
CREATE UNIQUE INDEX userId_name_idx ON profileImage(userId, name);

CREATE UNIQUE INDEX selected_by_user_idx ON profileImage(userId, selected)
WHERE
  profileImage.selected = 1;
