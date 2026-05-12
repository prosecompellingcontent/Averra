/**
 * Realtime Connection Manager
 * Manages Supabase realtime subscriptions with proper cleanup and error handling
 */

import { supabase } from "../supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { logError, createAppError } from "../errorHandling";

type SubscriptionCallback<T = any> = (payload: T) => void;

interface SubscriptionConfig {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  callback: SubscriptionCallback;
}

class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private isCleaningUp = false;

  /**
   * Subscribe to realtime events on a table
   */
  subscribe<T = any>(
    channelName: string,
    config: SubscriptionConfig
  ): () => void {
    // Don't create new subscriptions during cleanup
    if (this.isCleaningUp) {
      console.warn("Cannot create subscription during cleanup");
      return () => {};
    }

    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName);
    }

    try {
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: config.event || "*",
            schema: "public",
            table: config.table,
            filter: config.filter,
          },
          (payload) => {
            try {
              config.callback(payload);
            } catch (error) {
              const appError = createAppError(
                error,
                "realtime",
                "Error processing realtime update"
              );
              logError(`Realtime callback error (${channelName})`, appError);
            }
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log(`✓ Subscribed to ${channelName}`);
          } else if (status === "CHANNEL_ERROR") {
            const appError = createAppError(
              new Error("Channel error"),
              "realtime",
              "Lost connection to realtime updates"
            );
            logError(`Realtime subscription error (${channelName})`, appError);
          } else if (status === "TIMED_OUT") {
            const appError = createAppError(
              new Error("Connection timeout"),
              "realtime",
              "Connection timed out"
            );
            logError(`Realtime timeout (${channelName})`, appError);
          }
        });

      this.channels.set(channelName, channel);

      // Return cleanup function
      return () => this.unsubscribe(channelName);
    } catch (error) {
      const appError = createAppError(
        error,
        "realtime",
        "Failed to create realtime subscription"
      );
      logError(`Realtime subscribe error (${channelName})`, appError);
      return () => {};
    }
  }

  /**
   * Unsubscribe from a specific channel
   */
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);

    if (channel) {
      try {
        supabase.removeChannel(channel);
        this.channels.delete(channelName);
        console.log(`✓ Unsubscribed from ${channelName}`);
      } catch (error) {
        logError(`Realtime unsubscribe error (${channelName})`, error);
      }
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.isCleaningUp = true;

    try {
      for (const [channelName, channel] of this.channels.entries()) {
        try {
          supabase.removeChannel(channel);
          console.log(`✓ Cleaned up ${channelName}`);
        } catch (error) {
          logError(`Realtime cleanup error (${channelName})`, error);
        }
      }

      this.channels.clear();
      console.log("✓ All realtime subscriptions cleaned up");
    } finally {
      this.isCleaningUp = false;
    }
  }

  /**
   * Get active subscription count
   */
  getActiveCount(): number {
    return this.channels.size;
  }

  /**
   * Check if a channel is active
   */
  isActive(channelName: string): boolean {
    return this.channels.has(channelName);
  }

  /**
   * Get all active channel names
   */
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }
}

// Export singleton instance
export const realtimeManager = new RealtimeManager();

/**
 * React hook for realtime subscriptions with automatic cleanup
 */
export function useRealtimeSubscription<T = any>(
  channelName: string,
  config: SubscriptionConfig,
  dependencies: any[] = []
) {
  const { useEffect } = require("react");

  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe<T>(channelName, config);

    return () => {
      unsubscribe();
    };
  }, dependencies);
}
