/**
 * Centralized Supabase Query Utilities
 * Provides consistent error handling and retry logic for all database operations
 */

import { supabase } from "./client";
import { createAppError, logError, type AppError } from "../errorHandling";

export interface QueryResult<T> {
  data: T | null;
  error: AppError | null;
  loading: boolean;
}

/**
 * Execute a Supabase query with error handling
 */
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  context: string
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      const appError = createAppError(error, "database", undefined);
      logError(context, appError);
      return { data: null, error: appError };
    }

    return { data, error: null };
  } catch (err) {
    const appError = createAppError(err, "database", "An unexpected error occurred");
    logError(context, appError);
    return { data: null, error: appError };
  }
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(
  username: string
): Promise<{ available: boolean; error: AppError | null }> {
  if (!username || username.length < 3) {
    return {
      available: false,
      error: createAppError(
        new Error("Username too short"),
        "validation",
        "Username must be at least 3 characters long"
      ),
    };
  }

  const { data, error } = await executeQuery(
    () =>
      supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle(),
    `checkUsernameAvailability(${username})`
  );

  if (error) {
    return { available: false, error };
  }

  return { available: !data, error: null };
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string) {
  return executeQuery(
    () =>
      supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single(),
    `getUserProfile(${userId})`
  );
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Record<string, any>
) {
  return executeQuery(
    () =>
      supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single(),
    `updateUserProfile(${userId})`
  );
}

/**
 * Create username for user
 */
export async function createUsername(userId: string, username: string) {
  // First check availability
  const { available, error: availError } = await checkUsernameAvailability(username);

  if (availError) {
    return { data: null, error: availError };
  }

  if (!available) {
    return {
      data: null,
      error: createAppError(
        new Error("Username taken"),
        "validation",
        "This username is already taken. Please choose another."
      ),
    };
  }

  // Update profile with username
  return updateUserProfile(userId, { username });
}

/**
 * Get community posts with authors
 */
export async function getCommunityPosts(limit: number = 10) {
  return executeQuery(
    () =>
      supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_author_id_fkey(
            id,
            username,
            full_name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit),
    `getCommunityPosts(limit=${limit})`
  );
}

/**
 * Get user's saved posts
 */
export async function getSavedPosts(userId: string) {
  return executeQuery(
    () =>
      supabase
        .from("saved_posts")
        .select(`
          *,
          post:posts(
            *,
            author:profiles!posts_author_id_fkey(
              id,
              username,
              full_name
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    `getSavedPosts(${userId})`
  );
}

/**
 * Create a new post
 */
export async function createPost(authorId: string, content: string, postType: string = "discussion") {
  return executeQuery(
    () =>
      supabase
        .from("posts")
        .insert({
          author_id: authorId,
          content,
          post_type: postType,
        })
        .select(`
          *,
          author:profiles!posts_author_id_fkey(
            id,
            username,
            full_name
          )
        `)
        .single(),
    `createPost(${authorId})`
  );
}

/**
 * Get storage bucket files
 */
export async function getStorageFiles(bucketName: string, path: string = "") {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      const appError = createAppError(error, "database", "Failed to load files");
      logError(`getStorageFiles(${bucketName})`, appError);
      return { data: null, error: appError };
    }

    return { data, error: null };
  } catch (err) {
    const appError = createAppError(err, "database", "Failed to load files");
    logError(`getStorageFiles(${bucketName})`, appError);
    return { data: null, error: appError };
  }
}

/**
 * Upload file to storage
 */
export async function uploadFile(
  bucketName: string,
  path: string,
  file: File
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      const appError = createAppError(error, "database", "Failed to upload file");
      logError(`uploadFile(${bucketName}, ${path})`, appError);
      return { data: null, error: appError };
    }

    return { data, error: null };
  } catch (err) {
    const appError = createAppError(err, "database", "Failed to upload file");
    logError(`uploadFile(${bucketName}, ${path})`, appError);
    return { data: null, error: appError };
  }
}
