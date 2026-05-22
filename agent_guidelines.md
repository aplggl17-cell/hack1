# AGENT GOVERNANCE: 4-HOUR SPRINT MODE
1. **NO YAK SHAVING:** Do not suggest new npm libraries unless absolutely critical. Use what is in package.json.
2. **ATOMIC COMMITS:** Do not rewrite entire files. Use AST patching or minimal diffs. Keep UI and Logic decoupled.
3. **MOCK DATA FIRST:** If an API endpoint is not ready, instantly create a mock JSON array to unblock UI development.
4. **SHADCN & TAILWIND ONLY:** Do not write custom CSS files. Use Tailwind utility classes and existing shadcn components. 
5. **ERROR HANDLING:** If you hit an error, DO NOT blindly loop. Read the stack trace, analyze the root cause, and propose a fix before writing code.