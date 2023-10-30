import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
// dotenv.config({
// 	path: "./../.env",
// })
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		// "process.env.JWT_SECRET": JSON.stringify(process.env.JWT_SECRET),
	},
})
