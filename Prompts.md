design integraiton


I'm integrating a new React frontend design with an existing functional 
React/Node.js application.

CONTEXT:
- New design code location: /design-reference/
- Functional production code location: /src/
- Design documentation: /design-docs/

INTEGRATION STRATEGY:
I need to merge the new design with the functional codebase while 
preserving all backend connections, database operations, and business logic.

REFERENCE MATERIALS:
1. Design documentation at /design-docs/ describes:
   - Component structure and expected functionality
   - User flows and integration points
   - Where backend connections are needed

2. New design code in /design-reference/src/ contains:
   - Visual implementation
   - Component structure
   - UI/UX patterns

3. Current functional code in /src/ contains:
   - Working API integrations
   - Database queries
   - Authentication logic
   - State management
   - Business logic

YOUR TASK:
Analyze [specific component/feature] by:

1. COMPARISON:
   - Compare design-reference/src/[path] with src/[path]
   - Identify visual/structural changes in the new design
   - List all functional elements in the current code (API calls, hooks, 
     state management, database operations, etc.)

2. INTEGRATION PLAN:
   - Describe how to merge the new design while preserving functionality
   - Identify which parts are purely visual vs. behavioral changes
   - Note any new functionality the design introduces that needs backend support
   - Flag potential conflicts or breaking changes

3. IMPLEMENTATION:
   - Provide the integrated code that combines new design with existing functionality
   - Preserve all imports, hooks, API calls, and business logic
   - Maintain error handling and loading states
   - Keep authentication/authorization checks
   - Ensure state management remains intact

4. VERIFICATION CHECKLIST:
   - List what needs testing to ensure nothing broke
   - Identify API endpoints that should still work
   - Note database operations to verify

Please proceed component-by-component, feature-by-feature to ensure 
nothing is lost during migration.



Functional Preservation promt:

I'm migrating a React frontend design while preserving critical backend 
functionality. You must act as a safeguard to ensure no functional code is lost.

CRITICAL PRESERVATION REQUIREMENTS:

BACKEND INTEGRATIONS - Must preserve ALL:
- API endpoint calls (fetch, axios, etc.)
- Request headers (especially authentication tokens)
- Request/response data transformations
- Error handling for API failures

DATABASE OPERATIONS - Must preserve ALL:
- Query patterns
- Data models and schemas
- CRUD operations
- Transaction handling
- Data validation

AUTHENTICATION & AUTHORIZATION - Must preserve ALL:
- Login/logout flows
- Token management (storage, refresh, expiration)
- Protected route logic
- Permission checks
- Session handling

STATE MANAGEMENT - Must preserve ALL:
- Global state (Redux, Context, Zustand, etc.)
- State initialization
- State update patterns
- Side effects (useEffect, etc.)
- Data caching

BUSINESS LOGIC - Must preserve ALL:
- Form validation rules
- Calculations and transformations
- Conditional logic
- Data processing functions
- Workflow orchestration

REAL-TIME FEATURES - Must preserve ALL:
- WebSocket connections
- Polling mechanisms
- Event listeners
- Live data updates

ERROR HANDLING - Must preserve ALL:
- Try-catch blocks
- Error boundaries
- User-facing error messages
- Logging and monitoring

BEFORE MAKING CHANGES:
1. Extract and list ALL functional code from the current component
2. Verify each piece against this preservation checklist
3. Confirm the new design accommodates all these requirements

DURING INTEGRATION:
- Never remove functional code to "simplify"
- Never assume "we'll add it back later"
- Never prioritize aesthetics over functionality
- Flag any functionality that doesn't fit the new design for discussion

AFTER INTEGRATION:
Provide a preservation report:
- ✅ All preserved functionality (be specific)
- ⚠️ Functionality that needed adaptation (explain why and how)
- 🚨 Anything that couldn't be preserved (requires discussion)

Current component to analyze: [component path]

Please review the current functional code and confirm all preservation 
requirements before proceeding with design integration.