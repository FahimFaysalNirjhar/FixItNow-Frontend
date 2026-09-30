"use server";

import { revalidateTag, updateTag } from "next/cache";
import { uploadImgbb } from "@/lib/uploadImgbb";
import { isAccessTokenExist } from "@/service/isAccessTokenExist";

export type ProfileState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
} | null;

type ApiResult = { success: boolean; statusCode?: number; message?: string };

type Method = "PATCH" | "POST" | "PUT";

const authedRequest = async (
  method: Method,
  path: string,
  body: unknown,
): Promise<ApiResult> => {
  let token: string | null = null;
  try {
    token = await isAccessTokenExist();
  } catch {
    token = null;
  }

  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Your session has expired. Please log in again.",
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        cookie: `accessToken=${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const result = await res.json();

    if (!result?.success) {
      console.error(
        "Profile request failed:",
        method,
        path,
        res.status,
        JSON.stringify(result, null, 2),
      );
      return {
        success: false,
        statusCode: result?.statusCode ?? res.status,
        message: result?.message ?? "Request failed.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }
};

const refreshCaches = () => {
  updateTag("my-profile"); // the user sees their own edit immediately
  updateTag("technicians"); // technician details shown on the profile page
  revalidateTag("services", "max"); // public listings can be stale for a moment
};

export const updateProfileAction = async (
  prevState: ProfileState,
  formdata: FormData,
): Promise<ProfileState> => {
  const text = (key: string) =>
    ((formdata.get(key) as string | null) ?? "").trim();

  const name = text("name");
  const phone = text("phone");
  const address = text("address");
  const avatar = formdata.get("avatar") as File | null;

  // "create" | "update" for technicians, absent for everyone else
  const technicianMode = text("technicianMode");
  const experience = text("experience");
  const hourlyRate = text("hourlyRate");
  const location = text("location");
  const bio = text("bio");
  const isAvailable = formdata.get("isAvailable") === "on";

  // Sent back on failure so the form keeps what the user typed
  const values: Record<string, string> = {
    name,
    phone,
    address,
    experience,
    hourlyRate,
    location,
    bio,
    isAvailable: isAvailable ? "on" : "",
  };

  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Name must be at least 2 characters";

  if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid phone number, e.g. +8801911122233";
  }

  if (address.length < 3) errors.address = "Please enter your address";

  const hasNewPhoto = Boolean(avatar && avatar.size > 0);
  if (hasNewPhoto && avatar) {
    if (!avatar.type.startsWith("image/")) {
      errors.avatar = "Profile picture must be an image";
    } else if (avatar.size > 5 * 1024 * 1024) {
      errors.avatar = "Image must be smaller than 5 MB";
    }
  }

  if (technicianMode) {
    const exp = Number(experience);
    const rate = Number(hourlyRate);

    if (experience === "" || !Number.isInteger(exp) || exp < 0 || exp > 60) {
      errors.experience = "Enter your years of experience (0-60)";
    }
    if (hourlyRate === "" || !(rate > 0)) {
      errors.hourlyRate = "Enter a valid hourly rate";
    }
    if (location.length < 2) errors.location = "Enter the area you work in";
    if (bio.length > 500) errors.bio = "Bio must be 500 characters or less";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors,
      values,
    };
  }

  // 1) Account details (name, phone, address, photo)
  let profilePhoto: string | null = null;
  if (hasNewPhoto && avatar) {
    profilePhoto = await uploadImgbb(avatar);
    if (!profilePhoto) {
      return {
        success: false,
        message: "Could not upload your profile photo. Please try again.",
        values,
      };
    }
  }

  const userResult = await authedRequest("PUT", "/api/users/my-profile", {
    name,
    phone: phone.replace(/[\s-]/g, ""),
    address,
    ...(profilePhoto && { profilePhoto }),
  });

  if (!userResult.success) {
    const message = userResult.message ?? "Could not update your profile.";

    if (message.toLowerCase().includes("phone")) {
      return {
        success: false,
        message: "This phone number is already registered",
        errors: { phone: "This phone number is already registered" },
        values,
      };
    }

    return { success: false, message, values };
  }

  // 2) Technician details (only for technicians)
  if (technicianMode === "create" || technicianMode === "update") {
    const technicianResult = await authedRequest(
      technicianMode === "create" ? "POST" : "PATCH",
      "/api/technician/profile",
      {
        experience: Number(experience),
        hourlyRate: Number(hourlyRate),
        location,
        bio: bio || undefined,
        ...(technicianMode === "update" && { isAvailable }),
      },
    );

    if (!technicianResult.success) {
      refreshCaches(); // the account part was saved
      return {
        success: false,
        message: `Account details saved, but technician details failed: ${
          technicianResult.message ?? "unknown error"
        }`,
        values,
      };
    }
  }

  refreshCaches();
  return { success: true, message: "Profile updated successfully" };
};
