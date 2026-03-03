import Profile from "../models/Profile.js";
import cloudinary from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ student: req.user.id });

    if (!profile) {
      profile = await Profile.create({
        student: req.user.id,
        name: req.user.name, // sync name
      });
    }

    res.json(profile);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to load profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const data = { ...req.body };

    // sync name with user account
    data.name = req.user.name;

    // convert skills string → array
    if (typeof data.skills === "string") {
      data.skills = data.skills.split(",").map(s => s.trim());
    }

    // file uploads
    if (req.files?.collegeIdCard)
      data.collegeIdCard =
        "/uploads/" + req.files.collegeIdCard[0].filename;

    if (req.files?.resume)
      data.resume =
        "/uploads/" + req.files.resume[0].filename;

    if (req.files?.photo)
      data.photo =
        "/uploads/" + req.files.photo[0].filename;

    const profile = await Profile.findOneAndUpdate(
      { student: req.user.id },
      data,
      { new: true, upsert: true }
    );

    res.json(profile);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Profile update failed" });
  }
};

// Profile photo upload with Cloudinary
export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Upload to Cloudinary
    const base64 = req.file.buffer.toString("base64");
    const upload = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64}`,
      {
        folder: "microintern/profiles",
        resource_type: "image",
      }
    );

    // Update profile with Cloudinary URL
    const profile = await Profile.findOneAndUpdate(
      { student: req.user.id },
      { photo: upload.secure_url },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ msg: "Photo upload failed" });
  }
};
