import connectMongoDB from "./mongodb";
import { User } from "./models";

export interface UserData {
  email: string;
  name?: string;
}

export async function findOrCreateUser(userData: UserData) {
  console.log("findOrCreateUser called with:", userData);

  await connectMongoDB();
  console.log("MongoDB connected");

  try {
    // Find user by email
    console.log("Looking for user with email:", userData.email);
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      console.log("User not found, creating new user");
      // Create new user
      user = new User({
        email: userData.email,
        name: userData.name,
        claimedItems: [],
        claim_attempts: [],
      });
      await user.save();
      console.log(`Created new user: ${userData.email}`);
    } else {
      console.log("User found:", user.email);
      // User exists, update name if provided and not already set
      if (userData.name && !user.name) {
        console.log("Updating user name");
        user.name = userData.name;
        await user.save();
      }

      // Initialize claim_attempts if it doesn't exist (for existing users)
      if (!user.claim_attempts) {
        user.claim_attempts = [];
        await user.save();
      }
    }

    return user;
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  await connectMongoDB();

  try {
    const user = await User.findOne({ email }).populate("claimedItems");
    return user;
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    throw error;
  }
}
