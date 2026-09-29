"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";

export type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: { accessToken: string; refreshToken: string };
} | null;

type RegisterSuccessState = {
  success: true;
  statusCode: number;
  message: string;
  data: { user: Record<string, unknown> };
};

type RegisterApiErrorState = {
  success: false;
  statusCode: number;
  name?: string;
  message: string;
  error?: string;
};

type RegisterValidationErrorState = {
  success: false;
  statusCode: 400;
  message: string;
  errors: Record<string, string>;
};

export type RegisterState =
  | RegisterSuccessState
  | RegisterApiErrorState
  | RegisterValidationErrorState
  | null;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

const isProd = process.env.NODE_ENV === "production";

export const loginAction = async (
  redirectTo: string,
  prevState: LoginState,
  formdata: FormData,
) => {
  const payload = {
    email: formdata.get("email"),
    password: formdata.get("password"),
  };

  let result;
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    result = await res.json();
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }

  if (result.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    const decoded = jwt.decode(result.data.accessToken) as JwtPayload | null;

    if (
      redirectTo &&
      typeof redirectTo === "string" &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//")
    ) {
      redirect(redirectTo);
    }

    // Adjust these routes to your real dashboards
    switch (decoded?.role) {
      case "ADMIN":
        redirect("/admin-dashboard");
      case "TECHNICIAN":
        redirect("/technician-dashboard");
      default:
        redirect("/dashboard");
    }
  }

  return result;
};

async function uploadImgbb(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const body = new FormData();
  body.append("image", file);

  try {
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_HOST_KEY}`,
      { method: "POST", body },
    );
    const result = await res.json();
    if (!result.success) {
      console.error("imgbb upload failed", result);
      return null;
    }
    return result.data.url as string;
  } catch (err) {
    console.error("imgbb upload error", err);
    return null;
  }
}

export const registerAction = async (
  prevState: RegisterState,
  formdata: FormData,
) => {
  const name = formdata.get("name") as string;
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;
  const confirmPassword = formdata.get("confirmPassword") as string;
  const avatar = formdata.get("avatar") as File | null;
  const role = formdata.get("role") as string;
  const phone = (formdata.get("phone") as string)?.trim();
  const address = (formdata.get("address") as string)?.trim();

  const errors: Record<string, string> = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }
  if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      "At least 6 characters with an uppercase letter, a lowercase letter, a number, and a special character.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  if (!role || !["CUSTOMER", "TECHNICIAN"].includes(role)) {
    errors.role = "Please select a valid role";
  }
  if (!phone || !/^\+?[0-9]{10,15}$/.test(phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid phone number, e.g. +8801911122233";
  }
  if (!address || address.length < 3) {
    errors.address = "Please enter your address";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      statusCode: 400,
      message: "Please fix the errors below",
      errors,
    };
  }

  const photoURL = avatar ? await uploadImgbb(avatar) : null;
  const payload = {
    name,
    email,
    password,
    role,
    phone: phone.replace(/[\s-]/g, ""),
    address,
    ...(photoURL && { profilePhoto: photoURL }),
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/users/register`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    return await res.json();
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Could not reach the server. Please try again.",
    };
  }
};
