import bcrypt from "bcryptjs";

/**
 * Gerçek bir projede bu veriler bir veritabanından gelir. Bu demo, dış
 * bağımlılık eklemeden bcrypt ile hash'lenmiş şifre karşılaştırmasını
 * göstermek için process içi sabit bir kullanıcı listesi kullanıyor.
 */
export interface DemoUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

const DEMO_PASSWORD = "demo1234";

export const DEMO_USERS: DemoUser[] = [
  {
    id: "1",
    name: "Ayşe Yılmaz",
    email: "ayse@example.com",
    passwordHash: bcrypt.hashSync(DEMO_PASSWORD, 10),
  },
];

export function findUserByEmail(email: string): DemoUser | undefined {
  return DEMO_USERS.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  return bcrypt.compareSync(password, passwordHash);
}
