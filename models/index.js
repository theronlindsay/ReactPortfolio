import mongoose from 'mongoose';

const PortfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // Rich text or markdown
  customHtml: { type: String }, // Raw HTML
  imageUrl: { type: String },
  isLogo: { type: Boolean, default: false },
  tags: [{ type: String }],
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const EducationItemSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  type: { type: String, enum: ['Formal', 'Technical'], required: true },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const SkillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Icon', 'Emoji'], required: true },
  value: { type: String, required: true }, // FA class or Emoji char
  category: { type: String }, // e.g., "Frontend", "Backend", "Tools"
  createdAt: { type: Date, default: Date.now },
});

const ProfileSchema = new mongoose.Schema({
  aboutText: { type: String }, // Rich text
  imageUrl: { type: String },
  socialLinks: [{
    platform: String,
    url: String,
    icon: String // FA Class
  }],
});

// Check if models exist before defining to prevent overwrite errors in dev
export const PortfolioItem = mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', PortfolioItemSchema);
export const EducationItem = mongoose.models.EducationItem || mongoose.model('EducationItem', EducationItemSchema);
export const SkillItem = mongoose.models.SkillItem || mongoose.model('SkillItem', SkillItemSchema);
export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
