export async function createUserWithProfile(
  client,
  fullName,
  email,
  passwordHash,
  role,
  phone,
  address,
) {
  const userResult = await client.query(
    `
    INSERT INTO auth.users
      (full_name, email, password_hash, role)
    VALUES
      ($1, $2, $3, $4)
    RETURNING id
    `,
    [fullName, email, passwordHash, role],
  );

  const userId = userResult.rows[0].id;

  await client.query(
    `
    INSERT INTO auth.user_profiles
      (user_id, phone, address)
    VALUES
      ($1, $2, $3)
    `,
    [userId, phone, address],
  );

  return userId;
}
