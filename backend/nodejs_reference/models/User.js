const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  mobileNumber: { type: String, required: true, unique: true, index: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
        'ADMIN',
        'FARMER',
        'EQUIPMENT_OWNER'
    ],
    required: true
},
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  profileImage: { type: String, default: '' },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

// Automatically hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Helper method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);