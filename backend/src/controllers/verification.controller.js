import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const uploadStudentId = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "student-ids",
      resource_type: "auto",
    });

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.studentIdImage = uploadResult.secure_url;
    user.verificationStatus = "pending";
    user.isVerifiedStudent = false;

    await user.save();

    res.json({ 
      msg: "ID uploaded. Waiting for admin approval.",
      imageUrl: uploadResult.secure_url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Upload failed", error: error.message });
  }
};

// Upload company registration document for employers
export const uploadEmployerDoc = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "employer") {
      return res.status(400).json({ msg: "Only employers can upload company documents" });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "employer-docs",
      resource_type: "auto",
    });

    user.companyRegistrationDoc = uploadResult.secure_url;
    user.verificationStatus = "pending";
    user.isVerifiedEmployer = false;

    await user.save();

    res.json({ 
      msg: "Company document uploaded. Waiting for admin approval.",
      imageUrl: uploadResult.secure_url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Upload failed", error: error.message });
  }
};
