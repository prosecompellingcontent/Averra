CRITICAL BACKEND + AUTH FIX REQUIRED

The platform currently has unstable authentication architecture causing:
— AuthProvider failures
— failed fetch errors
— redirect loops
— dashboard loading failures
— broken admin previews
— Supabase session desync
— membership routing issues
— infinite auth refresh behavior
— broken protected routes
— realtime failures
— verification issues

THIS IS NOT A UI ISSUE.
This is an application architecture and state management issue.

FIX THE ENTIRE AUTH + FETCH INFRASTRUCTURE ACROSS THE PROJECT.

━━━━━━━━━━━━━━━━━━━
AUTH PROVIDER FIX
━━━━━━━━━━━━━━━━━━━

Audit the ENTIRE authentication architecture.

The current AuthProvider is unstable and likely causing:
— session hydration failures
— undefined auth state
— route rendering before auth resolves
— stale session state
— broken protected routes
— infinite redirects
— failed Supabase refresh cycles

FIX:
— AuthProvider structure
— auth context
— session persistence
— route guards
— middleware timing
— protected route rendering
— async auth loading
— Supabase session refresh handling

IMPORTANT:
DO NOT render protected pages before auth finishes loading.

Create:
isLoadingAuth state

Wait for:
Supabase auth/session resolution BEFORE:
— route redirects
— role checks
— dashboard rendering
— protected content rendering

━━━━━━━━━━━━━━━━━━━
FIX FAILED FETCH ERRORS PROJECT-WIDE
━━━━━━━━━━━━━━━━━━━

Audit ALL:
— fetch requests
— Supabase queries
— realtime subscriptions
— API handlers
— Stripe calls
— auth calls
— profile requests
— membership requests
— username validation requests
— verification requests

Current issue:
The project is failing silently or returning generic:
“Failed to fetch”

THIS IS UNACCEPTABLE.

FIX:
— missing try/catch blocks
— unhandled async errors
— failed Supabase responses
— undefined response handling
— race conditions
— invalid session requests
— broken API endpoints
— stale auth tokens
— frontend hydration issues
— missing environment variables
— failed network retries

━━━━━━━━━━━━━━━━━━━
CREATE GLOBAL ERROR HANDLING
━━━━━━━━━━━━━━━━━━━

Implement:
global fetch + auth error handling system.

Create:
— centralized API error handling
— centralized Supabase error handling
— centralized auth error handling
— realtime subscription cleanup
— request retry handling
— timeout handling

NO generic:
“Failed to fetch”

Instead:
show meaningful errors.

EXAMPLES:
— “Unable to verify session.”
— “Connection lost. Retrying.”
— “Username check failed. Please try again.”
— “Membership status unavailable.”
— “Realtime connection interrupted.”

━━━━━━━━━━━━━━━━━━━
FIX AUTH REDIRECT LOOPS
━━━━━━━━━━━━━━━━━━━

Current issue:
users/admins are being redirected before roles finish loading.

FIX:
— role loading timing
— session hydration timing
— middleware auth checks
— protected route hierarchy
— admin bypass permissions

DO NOT:
redirect users during auth loading state.

WAIT until:
— session resolves
— role resolves
— membership resolves

THEN:
render or redirect correctly.

━━━━━━━━━━━━━━━━━━━
FIX SUPABASE SESSION PERSISTENCE
━━━━━━━━━━━━━━━━━━━

Ensure:
— sessions persist across refreshes
— sessions persist across route changes
— admin sessions remain active
— member sessions remain active
— tokens refresh correctly
— cookies/local storage sync properly

FIX:
— stale token handling
— auth refresh race conditions
— multiple auth listeners
— duplicate providers
— nested provider conflicts

━━━━━━━━━━━━━━━━━━━
FIX USERNAME VALIDATION SYSTEM
━━━━━━━━━━━━━━━━━━━

Current issue:
“Failed to fetch” during username checking.

REBUILD:
username availability checking completely.

REQUIREMENTS:
— instant Supabase lookup
— global uniqueness
— debounce validation
— proper loading states
— meaningful errors
— realtime feedback

SHOW:
— “Checking username…”
— “Username available”
— “This username is already taken”

NO:
silent failures
NO:
generic fetch errors

━━━━━━━━━━━━━━━━━━━
FIX EMAIL VERIFICATION FLOW
━━━━━━━━━━━━━━━━━━━

Current issue:
verification system is unstable.

FIX:
— verification generation
— code matching
— database sync
— resend flow
— auth confirmation timing
— frontend validation

Ensure:
— email sends instantly
— verification code matches database
— code validation works consistently
— resend works immediately
— users never hit dead-end states

━━━━━━━━━━━━━━━━━━━
FIX REALTIME CONNECTIONS
━━━━━━━━━━━━━━━━━━━

Audit ALL Supabase realtime systems.

FIX:
— duplicate subscriptions
— memory leaks
— stale channels
— failed cleanup
— reconnect issues
— auth token expiration in realtime

Ensure:
— comments update live
— DMs update live
— notifications update live
— online status updates live
— group chats update live

WITHOUT:
manual refreshes.

━━━━━━━━━━━━━━━━━━━
CREATE DEBUGGING + QA SYSTEM
━━━━━━━━━━━━━━━━━━━

Create:
— global error logger
— auth debug panel
— Supabase status monitor
— realtime connection monitor
— API request logger
— verification test panel

Create:
— /admin/qa
— /admin/testing

These should allow testing:
— auth
— sessions
— redirects
— verification
— username checks
— Stripe sync
— dashboard access
— role permissions
— realtime updates

━━━━━━━━━━━━━━━━━━━
FINAL REQUIREMENT
━━━━━━━━━━━━━━━━━━━

The platform must behave like:
a production-ready software ecosystem.

NOT:
a frontend prototype.

ALL:
— dashboards
— auth systems
— fetch requests
— verification systems
— realtime systems
— membership systems
— admin systems

must function:
smoothly
reliably
consistently
without breaking routes or throwing failed fetch errors.
