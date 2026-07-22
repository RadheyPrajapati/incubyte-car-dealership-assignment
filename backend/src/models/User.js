const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return emailRegex.test(v);
        },
        message: props => `${props.value} is not a valid email format`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'DEALER', 'SALES_REP'],
      default: 'USER'
    }
  },
  {
    timestamps: true
  }
);

// Method to manually or pre-save hash user password
userSchema.methods.hashPassword = async function() {
  if (this.password && !(this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
};

// Pre-save middleware hook to hash passwords before saving to DB
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    await this.hashPassword();
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare candidate password with stored password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  return candidatePassword === this.password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
