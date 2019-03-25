const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const schema = new Schema({
    email: { type: String, unique: true },
    password: { type: String },
    name: { type: String },
    isVerified: { type: Boolean, default: false },
    isFirstLogin: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

// On Save Hook, encrypt password
// Before saving a model, run this function
schema.pre('save', function(next) {
  // Get access to the user model
  const user = this;

  // Skip the hashing if password isn't changed
  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
  });
});

schema.pre("update", function(next) {
  // Get all the modifed fields of the user
  const modifiedFields = this.getUpdate().$set;
  // Skip the hashing procedure if password isn't changed
  if (!modifiedFields.password) { return next(); }

  // Otherwise, rehash the new password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(modifiedFields.password, salt, (err, hash) => {
        this.getUpdate().$set.password = hash;
        next();
    });
  });
});

// NOT USED AT THE MOMENT
// Rehash the password given and check if it's the same with the hashed passowrd saved in db
// schema.methods.comparePassword = function(candidatePassword, callback) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) { return callback(err); }

//     callback(null, isMatch);
//   });
// }

const User = mongoose.model('User', schema);

// Methods exported
module.exports = {
  create: (obj) => {
    let userDoc = new User(obj);
    return userDoc.save(userDoc)
  },

  findById: async (_id) => {
    return User.findOne({ _id });
  },

  findByEmail: (email) => {
    return User.findOne({ email });
  },

  deleteById: (_id) => {
    return User.deleteOne({ _id });
  },

  updateUserToVerified: (_id) => {
    return User.findOneAndUpdate(
      { _id }, 
      { $set: { isVerified: true } },
      { new: true }
    );
  },

  saveUpdatedUser: (user) => {
    return user.save();
  },

  updateUserPasswordAndToVerified: (_id) => {
    return User.findByIdAndUpdate(
      { _id }, 
      { $set: { isVerified: true } },
      { new: true }
    );
  },

  updateUserFacebookId: (args) => {
    const { _id, facebookId, facebookName } = args;

    return User.findByIdAndUpdate(
      { _id }, 
      { $set: { 
        "social.facebook.id": facebookId, 
        "social.facebook.name": facebookName 
      } },
      { new: true }
    );
  },

    /**
   * Universal update method
   * Parameters (args) should be passed as an object with correct property names according to the database schema.
   * @param query (object)
   * @param properties (object)
   * 
   * @example
   * updateProperties({ _id: XXX, isVerified: false }, { "social.facebook.id": 'YYY', isVerified: true })
   */
  updateOne: (query, args) => {
    return User.updateOne(
      { ...query },
      { $set: { ...args } },
      {new: true }
    );
  }

// END OF METHODS
}


// Export the model and its methods
// module.exports = { User, ...userMethods }