## Steps

1. Create a vite app

2. Configure whole tailwind setup
    1. ```npm install tailwindcss @tailwindcss/vite```
    2. In vite.config.js
        *   javascript
            import { defineConfig } from 'vite';
            import tailwindcss from '@tailwindcss/vite';

            export default defineConfig({
            plugins: [
                tailwindcss(),
            ],
            });

3. @import "tailwindcss"; in index.css

4. Create js.config.json on same level as index.html
    1.  In js.config.json
        *   {
                "compilerOptions": {
                "baseUrl": ".",
                "paths": {
                        "@/*": [
                        "./src/*"
                        ]
                    }          
                }
            }
    2.  In vite.config.js
        *   import { defineConfig } from 'vite'
            import path from "path"
            import tailwindcss from "@tailwindcss/vite"
            import react from '@vitejs/plugin-react'

            // https://vite.dev/config/
            export default defineConfig({
            plugins: [react(), tailwindcss()],
            resolve: {
                    alias: {
                    "@": path.resolve(__dirname, "./src"),
                    },
                },
            })

5. Install this : ```npm install -D @types/node```

6. Run this command : ```npx shadcn@latest init```

7. Theme nu setting and then font poppins nu.

  
