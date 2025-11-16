import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { COLLECTIONS } from "../../utils/constants";

/**
 * Бүртгүүлэх
 */
export const registerUser = async (email, password, name) => {
  try {
    // Firebase Auth бүртгэл
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Profile шинэчлэх
    await updateProfile(user, { displayName: name });

    // Firestore-д хэрэглэгчийн мэдээлэл хадгалах
    const userData = {
      uid: user.uid,
      email: user.email,
      name: name,
      role: "user",
      avatar: null,
      phone: null,
      address: null,
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData);

    return {
      ...userData,
      displayName: name,
    };
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

/**
 * Нэвтрэх
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Firestore-оос хэрэглэгчийн дэлгэрэнгүй мэдээлэл авах
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Гарах
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Нууц үг сэргээх
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

/**
 * Хэрэглэгчийн мэдээлэл шинэчлэх
 */
export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);

    await setDoc(
      userRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Firebase Auth profile шинэчлэх
    if (data.name && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.name });
    }

    return true;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

/**
 * Хэрэглэгчийн мэдээлэл авах
 */
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    return {
      uid: userId,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error("Get user data error:", error);
    throw error;
  }
};

/**
 * Auth state өөрчлөлтийг сонсох
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userData = await getUserData(user.uid);
        callback(userData);
      } catch (error) {
        console.error("Auth state change error:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
