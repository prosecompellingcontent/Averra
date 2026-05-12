import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Real-time subscription helpers
export const subscribeToChannel = (channelName: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Subscribe to posts in real-time
export const subscribeToPost = (callback: (payload: any) => void) => {
  return supabase
    .channel('posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, callback)
    .subscribe();
};

// Subscribe to comments in real-time
export const subscribeToComments = (postId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`comments-${postId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
      callback
    )
    .subscribe();
};

// Subscribe to likes in real-time
export const subscribeToLikes = (postId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`likes-${postId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'likes', filter: `post_id=eq.${postId}` },
      callback
    )
    .subscribe();
};

// Subscribe to messages in a conversation
export const subscribeToMessages = (conversationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages-${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      callback
    )
    .subscribe();
};

// Subscribe to typing indicators
export const subscribeToTyping = (conversationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`typing-${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'typing_indicators', filter: `conversation_id=eq.${conversationId}` },
      callback
    )
    .subscribe();
};

// Subscribe to online status
export const subscribeToOnlineStatus = (callback: (payload: any) => void) => {
  return supabase
    .channel('online-status')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'profiles' },
      callback
    )
    .subscribe();
};

// Subscribe to notifications
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      callback
    )
    .subscribe();
};

// Update user online status
export const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_online: isOnline, last_seen: new Date().toISOString() })
    .eq('id', userId);

  if (error) console.error('Error updating online status:', error);
};

// Send typing indicator
export const sendTypingIndicator = async (conversationId: string, userId: string, isTyping: boolean) => {
  const { error } = await supabase
    .from('typing_indicators')
    .upsert({
      conversation_id: conversationId,
      user_id: userId,
      is_typing: isTyping,
      updated_at: new Date().toISOString()
    });

  if (error) console.error('Error sending typing indicator:', error);
};

// Mark message as read
export const markMessageAsRead = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId);

  if (error) console.error('Error marking message as read:', error);
};
