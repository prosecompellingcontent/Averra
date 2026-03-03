import { projectId, publicAnonKey } from '/utils/supabase/info';
import { logger } from '@/utils/logger';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-61755bec`;

// Rate limiting: Track last call time to prevent excessive requests
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 1000; // Max 1 call per second per action type

function isRateLimited(key: string): boolean {
  const lastCall = rateLimitMap.get(key);
  const now = Date.now();
  
  if (lastCall && now - lastCall < RATE_LIMIT_MS) {
    logger.warn(`Rate limited: ${key}`);
    return true;
  }
  
  rateLimitMap.set(key, now);
  return false;
}

/**
 * Track quiz completion with results
 */
export async function trackQuizCompletion(
  recommendedTier: string,
  answers: number[]
): Promise<void> {
  if (isRateLimited('quiz_completion')) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/track-quiz-completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        recommendedTier,
        answers,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Failed to track quiz completion:', error);
    } else {
      const result = await response.json();
      logger.log('Quiz completion tracked:', result.quizId);
    }
  } catch (error) {
    logger.error('Error tracking quiz completion:', error);
  }
}

/**
 * Track user actions (button clicks, navigation, etc.)
 */
export async function trackAction(
  actionType: string,
  actionData?: Record<string, any>
): Promise<void> {
  const key = `action_${actionType}`;
  if (isRateLimited(key)) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/track-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        actionType,
        actionData: actionData || {},
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Failed to track action:', error);
    }
  } catch (error) {
    logger.error('Error tracking action:', error);
  }
}

/**
 * Get analytics summary for the dashboard
 */
export async function getAnalyticsSummary(): Promise<any> {
  if (isRateLimited('get_analytics_summary')) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/analytics-summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Failed to fetch analytics summary:', error);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching analytics summary:', error);
    return null;
  }
}

/**
 * Set analytics consent preferences
 */
export async function setAnalyticsConsent(
  consentType: 'accepted_all' | 'custom' | 'declined',
  preferences?: Record<string, boolean>
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/track-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        actionType: 'cookie_consent',
        actionData: {
          consentType,
          preferences: preferences || {},
        },
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Failed to track consent:', error);
    }
  } catch (error) {
    logger.error('Error tracking consent:', error);
  }
}