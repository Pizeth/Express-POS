// models/user.js
import util from "util";
import bcrypt from "bcrypt";
import z from "zod";

// Zod schema for user validation
export const UserSchema = z.object({
  id: z.coerce.number().int().nullable().optional(),
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(50, "Username must be at most 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().refine(
    (password) => {
      // If it's a bcrypt hash, consider it valid
      if (password.startsWith("$2") && password.length >= 60) {
        return true;
      }
      // Otherwise, apply the original regex
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
    },
    {
      message:
        "Password must be at least 8 characters, including uppercase, lowercase, number, and special character",
    }
  ),
  avatar: z.string().nullable().optional(),
  profile: z.record(z.any()).nullable().optional(),
  role: z
    .enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "CASHIER", "USER"])
    .optional()
    .default("USER"),
  authMethod: z
    .enum([
      "PASSWORD",
      "GOOGLE",
      "MICROSOFT",
      "APPLE",
      "FACEBOOK",
      "TWITTER",
      "GITHUB",
    ])
    .optional()
    .default("PASSWORD"),
  mfaSecret: z.string().nullable().optional(),
  mfaEnabled: z.coerce.boolean().optional().default(false),
  loginAttempts: z.coerce.number().int().default(0),
  lastLogin: z.date().optional(),
  refreshTokens: z.record(z.any()).optional(),
  isBan: z.coerce.boolean().optional().default(false),
  enabledFlag: z.coerce.boolean().optional().default(true),
  isLocked: z.coerce.boolean().optional().default(false),
  deletedAt: z.date().nullable().optional(),
  createdBy: z.coerce.number().int(),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
  lastUpdatedBy: z.coerce.number().int(),
  lastUpdatedAt: z
    .date()
    .optional()
    .default(() => new Date()),
  objectVersionId: z.number().int().optional().default(1),
  auditTrail: z.record(z.any()).optional(),
});

// Input schema for creation (exclude optional/generated fields)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  creationDate: true,
  lastUpdateDate: true,
  objectVersionId: true,
});

// Input schema for update (make all fields optional)
export const UpdateUserSchema = CreateUserSchema.partial();

export class User {
  constructor(data = {}) {
    try {
      // If password is already hashed, use it directly
      // Otherwise, hash the password if it's a plain text password
      const processedData = {
        ...data,
        // Check if password looks like a bcrypt hash
        password:
          data.password &&
          (data.password.startsWith("$2") || data.password.length >= 60)
            ? data.password
            : data.password
            ? this.hashPassword(data.password)
            : undefined,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        lastUpdatedAt: data.lastUpdatedAt
          ? new Date(data.lastUpdatedAt)
          : new Date(),
      };

      // Validate and parse input data
      this._data = UserSchema.parse(processedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Collect and throw validation errors
        const errorMessages = error.errors.map((err) => err.message);
        throw new Error(`Validation failed: ${errorMessages.join(", ")}`);
      }
      throw error;
    }
  }

  // Getter methods for accessing properties
  get id() {
    return this._data.id;
  }
  get username() {
    return this._data.username;
  }
  get email() {
    return this._data.email;
  }
  get avatar() {
    return this._data.avatar;
  }
  get profile() {
    return this._data.profile;
  }
  get isBan() {
    return this._data.isBan;
  }
  get enabledFlag() {
    return this._data.enabledFlag;
  }
  get deletedAt() {
    return this._data.deletedAt;
  }
  get role() {
    return this._data.role;
  }
  get createdBy() {
    return this._data.createdBy;
  }
  get createdAt() {
    return this._data.createdAt;
  }
  get lastUpdatedBy() {
    return this._data.lastUpdatedBy;
  }
  get lastUpdatedAt() {
    return this._data.lastUpdatedAt;
  }
  get objectVersionId() {
    return this._data.objectVersionId;
  }

  // Password hashing method
  hashPassword(password) {
    return bcrypt.hashSync(password, 12);
  }

  // Method to set a new password with hashing
  setPassword(password) {
    // Validate password first using Zod schema
    UserSchema.pick({ password: true }).parse({ password });

    // Hash and update password
    this._data = {
      ...this._data,
      password: this.hashPassword(password),
    };
  }

  // Validate method (optional, as Zod does validation during construction)
  validate() {
    try {
      UserSchema.parse(this._data);
      // this.setPassword(this.data.password);
      return {
        isValid: true,
        errors: [],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map((err) => err.message),
        };
      }
      throw error;
    }
  }

  // Method to update user data with validation
  update(updates = {}) {
    try {
      // Merge existing data with updates and re-validate
      this._data = UserSchema.parse({
        ...this._data,
        ...updates,
        lastUpdatedAt: new Date(),
      });
      return this;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        throw new Error(
          `Update validation failed: ${errorMessages.join(", ")}`
        );
      }
      throw error;
    }
  }

  // Secure JSON serialization
  toJSON() {
    const { password, ...safeUser } = this._data;
    return {
      ...safeUser,
      createdAt: this.createdAt.toISOString(),
      lastUpdatedAt: this.lastUpdatedAt.toISOString(),
    };
  }

  // Method to get data ready for Prisma creation
  toData() {
    const { id, createdAt, lastUpdatedAt, objectVersionId, ...prismaInput } =
      this._data;
    return prismaInput;
  }

  [util.inspect.custom]() {
    return this.toJSON();
  }
}

// export default User;
export default User;

// export class User {
//   constructor(data = {}) {
//     const VALID_ROLES = ["USER", "ADMIN", "MODERATOR"];

//     this.id = Number(data?.id ?? null);
//     this.username = data.username || "";
//     this.email = data.email || "";
//     // this.password = data?.password ? this.hashPassword(data.password) : "";
//     this.password = data?.password ? data.password : "";
//     this.avatar = data.avatar || null;

//     // Use optional chaining for nested object properties
//     this.profile = data?.profile ?? null;

//     // Enhanced type conversion
//     this.isBan = !!data?.isBan;
//     this.enabledFlag = data?.enabledFlag ?? true;
//     // this.isBan = data.isBan !== undefined ? Boolean(Number(data.isBan)) : false;
//     // this.enabledFlag =
//     //   data.enabledFlag !== undefined ? Boolean(Number(data.enabledFlag)) : true;
//     // this.role = data.role || "USER";

//     // Enum-like role validation
//     this.role = VALID_ROLES.includes(data?.role) ? data.role : "USER";
//     this.createdBy = data.createdBy ? Number(data.createdBy) : null;
//     this.creationDate = data.creationDate
//       ? new Date(data.creationDate)
//       : new Date();
//     this.lastUpdatedBy = data.lastUpdatedBy ? Number(data.lastUpdatedBy) : null;
//     this.lastUpdateDate = data.lastUpdateDate
//       ? new Date(data.lastUpdateDate)
//       : new Date();
//     this.objectVersionId = data.objectVersionId
//       ? Number(data.objectVersionId)
//       : 1;
//   }

//   // Add a method for password hashing
//   hashPassword(password) {
//     // Consider using a more modern hashing method
//     return bcrypt.hashSync(password, 12); // increased salt rounds
//   }

//   // Optional: Add validation methods
//   validate() {
//     const errors = [];

//     if (!this.username?.trim()) {
//       errors.push("Username is required");
//     }

//     if (
//       this.username &&
//       (this.username.length < 5 || this.username.length > 50)
//     ) {
//       errors.push("Username must be between 5 and 50 characters");
//     }

//     // Advanced email validation
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!this.email || !emailRegex.test(this.email)) {
//       errors.push("Invalid email format");
//     }

//     // Password complexity requirements
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     console.log(this.password);
//     if (!passwordRegex.test(this.password)) {
//       errors.push(
//         "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
//       );
//     }

//     return {
//       isValid: errors.length === 0,
//       errors,
//     };
//   }

//   // More secure JSON serialization
//   toJSON() {
//     const { password, ...safeUser } = this;
//     return {
//       ...safeUser,
//       creationDate: this.creationDate.toISOString(),
//       lastUpdateDate: this.lastUpdateDate.toISOString(),
//     };
//   }
// }
