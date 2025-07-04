module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          global: {
            background1: "var(--global-bg-1)",
            background2: "var(--global-bg-2)",
            background3: "var(--global-bg-3)",
            text1: "var(--global-text-1)",
            text2: "var(--global-text-2)"
          },
          sidebar: {
            background1: "var(--sidebar-bg-1)",
            background2: "var(--sidebar-bg-2)",
            text1: "var(--sidebar-text-1)"
          },
          searchview: {
            text1: "var(--searchview-text-1)"
          },
          table: {
            background1: "var(--table-bg-1)"
          }
        },
        fontFamily: {
          bellefair: ['Bellefair', 'serif'],
          lora: ['Lora', 'serif'],
          cinzel: ['Cinzel', 'serif']
        }
      }
    },
    plugins: []
  };