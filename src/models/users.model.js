const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    firstName:String,
    lastName:String,
    // fullName:
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: {type:String,required:true},
    DOB:Date
  },
   {
  toJSON: { virtuals: true },   // Include virtuals in JSON
  toObject: { virtuals: true }  // Include virtuals in objects
},
  { timestamps: true }

);

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('age').get(function() {
  if (!this.DOB) return null;
  
  const today = new Date();
  const birth = new Date(this.DOB);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
});

// userSchema.virtual('fullName').get(()=>{
//   return `${this.firstName} ${this.lastName}`;
// })



userSchema.pre('save', async function() {
  // this = the document being saved
  console.log('About to save:', this.username);

});

userSchema.post('save', function(doc) {
  // Runs AFTER document is saved
  console.log('Saved:', doc.username);
});

userSchema.pre('find', async function() {
  // this = the query
  console.log('Finding users...');
  // next();
});

userSchema.post('find', async function(docs) {
  console.log(`Found ${docs.length} users`);
  // next();
});


// Pre-save middleware
userSchema.pre('save', async function() {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return;
  }
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
     console.log(error)
  }
});


const User = mongoose.model('User', userSchema);



const user = new User({
  firstName: 'Alice',
  lastName: 'Johnson'
});

console.log(user.fullName);  // "Alice Johnson"
// Computed on the fly, not stored in database


module.exports = User;