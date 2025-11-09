import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			success: 'hsl(var(--success))',
  			warning: 'hsl(var(--warning))',
  			'pfizer-blue': 'hsl(var(--pfizer-blue))',
  			'cyan-glow': 'hsl(var(--cyan-glow))',
  			'deep-navy': 'hsl(var(--deep-navy))',
  			'dark-charcoal': 'hsl(var(--dark-charcoal))',
  			'panel-gray': 'hsl(var(--panel-gray))',
  			'text-off-white': 'hsl(var(--text-off-white))',
  			'text-light-gray': 'hsl(var(--text-light-gray))',
  			purple: {
  				'400': 'hsl(270 91% 65%)',
  				'500': 'hsl(270 91% 55%)'
  			},
  			green: {
  				'400': 'hsl(142 71% 55%)',
  				'500': 'hsl(142 71% 45%)'
  			},
  			orange: {
  				'400': 'hsl(25 95% 63%)',
  				'500': 'hsl(25 95% 53%)'
  			},
  			cyan: {
  				'400': 'hsl(189 85% 60%)',
  				'500': 'hsl(189 85% 50%)'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			'glow-blue': '0 0 10px 2px hsl(195 100% 41% / 0.7)',
  			'glow-cyan': '0 0 12px 3px hsl(189 100% 50% / 0.5)',
  			'glow-red': '0 0 10px 2px hsl(0 84% 60% / 0.7)',
  			'glow-amber': '0 0 10px 2px hsl(43 96% 56% / 0.7)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
