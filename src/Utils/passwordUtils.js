import bcrypt from "bcrypt";

export class PasswordUtils {
  // Password hashing method
  static hashPassword(password) {
    return bcrypt.hashSync(password, 12);
  }
  static comparePassword(password, userPassword, salt) {
    bcrypt.compareSync(password, userPassword);
  }
  static generateSalt(salt) {
    return (salt = bcrypt.genSaltSync(salt));
  }
}
