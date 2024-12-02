// models/user.js
import bcrypt from "bcrypt";

export class User {
  constructor(data = {}) {
    const VALID_ROLES = ["USER", "ADMIN", "MODERATOR"];

    this.id = Number(data?.id ?? null);
    this.username = data.username || "";
    this.email = data.email || "";
    // this.password = data?.password ? this.hashPassword(data.password) : "";
    this.password = data?.password ? data.password : "";
    this.avatar = data.avatar || null;

    // Use optional chaining for nested object properties
    this.profile = data?.profile ?? null;

    // Enhanced type conversion
    this.isBan = !!data?.isBan;
    this.enabledFlag = data?.enabledFlag ?? true;
    // this.isBan = data.isBan !== undefined ? Boolean(Number(data.isBan)) : false;
    // this.enabledFlag =
    //   data.enabledFlag !== undefined ? Boolean(Number(data.enabledFlag)) : true;
    // this.role = data.role || "USER";

    // Enum-like role validation
    this.role = VALID_ROLES.includes(data?.role) ? data.role : "USER";
    this.createdBy = data.createdBy ? Number(data.createdBy) : null;
    this.creationDate = data.creationDate
      ? new Date(data.creationDate)
      : new Date();
    this.lastUpdatedBy = data.lastUpdatedBy ? Number(data.lastUpdatedBy) : null;
    this.lastUpdateDate = data.lastUpdateDate
      ? new Date(data.lastUpdateDate)
      : new Date();
    this.objectVersionId = data.objectVersionId
      ? Number(data.objectVersionId)
      : 1;
  }

  // Add a method for password hashing
  hashPassword(password) {
    // Consider using a more modern hashing method
    return bcrypt.hashSync(password, 12); // increased salt rounds
  }

  // Optional: Add validation methods
  validate() {
    const errors = [];

    if (!this.username?.trim()) {
      errors.push("Username is required");
    }

    if (
      this.username &&
      (this.username.length < 5 || this.username.length > 50)
    ) {
      errors.push("Username must be between 5 and 50 characters");
    }

    // Advanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.email || !emailRegex.test(this.email)) {
      errors.push("Invalid email format");
    }

    // Password complexity requirements
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    console.log(this.password);
    if (!passwordRegex.test(this.password)) {
      errors.push(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // More secure JSON serialization
  toJSON() {
    const { password, ...safeUser } = this;
    return {
      ...safeUser,
      creationDate: this.creationDate.toISOString(),
      lastUpdateDate: this.lastUpdateDate.toISOString(),
    };
  }
}

// export default User;
export default User;
