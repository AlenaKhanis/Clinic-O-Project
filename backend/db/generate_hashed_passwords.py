import bcrypt

passwords = '1234'
hashed_passwords = [bcrypt.hashpw(passwords.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') ]

print(hashed_passwords)