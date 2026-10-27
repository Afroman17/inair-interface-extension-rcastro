# Airtable Interface Extension Boilerplate

A modern, production-ready boilerplate for building Airtable Interface Extensions with TypeScript, React 19, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Modern React 19** with TypeScript for type-safe development
- **Tailwind CSS v4** with custom design system and dark/light mode support
- **shadcn/ui Components** - Beautiful, accessible UI components
- **Toast Notifications** with Sonner integration
- **ESLint & TypeScript** - Code quality and type checking
- **Custom Webpack Bundler** - Optimized build process for Airtable Extensions
- **Responsive Design** - Works seamlessly across all device sizes
- **Theme Support** - Automatic dark/light mode detection

## 📋 Prerequisites

- Node.js 18+ and **pnpm** (see install steps below)
- Airtable account with Interface Extensions access
- Basic knowledge of React and TypeScript

> **Why pnpm?** This project migrated from npm to pnpm in response to recent supply-chain security incidents in the npm ecosystem. pnpm's stricter, non-hoisted dependency resolution and explicit build-script approval model reduce the risk of malicious postinstall scripts running silently from transitive dependencies. Only packages listed under `allowBuilds` in `pnpm-workspace.yaml` are permitted to run install scripts.

### Installing pnpm

If pnpm is not yet installed, pick one of:

- **Corepack** (recommended, ships with Node ≥ 16.10):
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```
- **Standalone installer** (macOS/Linux):
  ```bash
  curl -fsSL https://get.pnpm.io/install.sh | sh -
  ```
- **Homebrew** (macOS):
  ```bash
  brew install pnpm
  ```

Verify with `pnpm --version`.

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd custom_interface_boilerplate
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure your Airtable Block ID**

   Update the `.block/remote.json` file with your actual Airtable Interface Extension block ID:

   ```json
   {
     "blockId": "your-actual-block-id-here",
     "baseId": "NONE"
   }
   ```

   To get your block ID:
   - Go to your Airtable base
   - Navigate to Extensions > Interface Designer
   - Create a new Interface Extension or select an existing one
   - The block ID can be found in the URL or extension settings

4. **Configure environments** (Optional)

   The boilerplate supports separate development and production environments. Configure your block IDs in `scripts/block-config.json`:

   ```json
   {
     "dev": {
       "blockId": "your-dev-block-id",
       "baseId": "NONE"
     },
     "prod": {
       "blockId": "your-prod-block-id",
       "baseId": "NONE"
     }
   }
   ```

5. **Start development**
   ```bash
   pnpm dev
   ```

## 🌍 Environment Management

This boilerplate includes built-in support for managing separate development and production environments, allowing you to work on changes without affecting your production interface.

### Configuration

Environment-specific block IDs are configured in `scripts/block-config.json`:

```json
{
  "dev": {
    "blockId": "blkXXXXXXXXXXXXXX",
    "baseId": "NONE"
  },
  "prod": {
    "blockId": "blkYYYYYYYYYYYYYY",
    "baseId": "NONE"
  }
}
```

### How It Works

The `scripts/update-block-config.js` script automatically updates `.block/remote.json` with the appropriate block ID based on the environment you specify. This happens automatically when you run any of the environment-specific pnpm scripts.

### Environment-Specific Scripts

```bash
# Development environment
pnpm dev                 # Run the extension in dev mode
pnpm release:dev         # Release to dev environment

# Production environment
pnpm prod                # Run the extension in prod mode
pnpm release:prod        # Release to prod environment
```

### Authentication for Releases (Multiple Accounts)

When deploying an Interface Extension, you must authenticate using a Personal Access Token (PAT). To facilitate seamless switching between multiple Airtable accounts, the release scripts automatically use the `AIRTABLE_PAT` value defined in your `.env` file.

1. **Create your environment file** by copying the provided example:
   ```bash
   cp .env.example .env
   ```
2. **Add your Personal Access Token** to `.env`:
   ```env
   AIRTABLE_PAT=patYourPersonalAccessTokenHere
   ```

When you run `pnpm release:dev` or `pnpm release:prod`, the script will automatically read `AIRTABLE_PAT` from your `.env` file and set the correct API key prior to deploying. This prevents deploying to the wrong account when managing multiple environments.

### Workflow

1. **Development**: Use `pnpm dev` to work on new features in your development block
2. **Testing**: Test thoroughly in the dev environment
3. **Release to Dev**: Use `pnpm release:dev` to deploy to your dev block
4. **Production**: Once tested, use `pnpm release:prod` to deploy to production

> [!TIP]
> Keep your dev and prod block IDs in separate Airtable bases or clearly labeled in the same base to avoid confusion.

## 🏗️ Project Structure

```
src/
├── components/
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx      # Button component with variants
│       ├── sonner.tsx      # Toast notification component
│       └── index.ts        # Centralized UI component exports
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── styles/
│   └── globals.css        # Global styles and CSS variables
├── types/
│   └── index.ts           # TypeScript type definitions
└── index.tsx              # Main application entry point
```

### TypeScript Path Aliases

The project includes convenient path aliases for cleaner imports:

```tsx
// Instead of: import { Button } from '../../components/ui/button'
import { Button } from "@ui/button";

// Available aliases:
import Component from "@components/..."; // src/components
import { Button } from "@ui/..."; // src/components/ui
import { cn } from "@lib/..."; // src/lib
import Store from "@stores/..."; // src/stores
import "@styles/..."; // src/styles
import type { MyType } from "@types"; // src/types
import api from "@api/..."; // src/api
import { useHook } from "@hooks/..."; // src/hooks
```

## 🎨 Design System

This boilerplate includes a complete design system built on Tailwind CSS with:

- **Color Palette**: Comprehensive light/dark theme support with OKLCH color space
- **Typography**: Responsive text sizing and font weights
- **Spacing**: Consistent spacing scale
- **Shadows**: Subtle shadow system for depth
- **Border Radius**: Customizable border radius system
- **Components**: Pre-built UI components with multiple variants

### Available Components

#### Button Component

```tsx
import { Button } from "@ui/button";

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
<Button variant="default" size="lg">
  Click me
</Button>;
```

#### Toast Notifications

```tsx
import { toast } from "sonner";

toast.success("Success message");
toast.error("Error message");
toast.warning("Warning message");
toast.info("Info message");
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev                 # Run extension in development environment
pnpm prod                # Run extension in production environment

# Release/Deploy
pnpm release:dev         # Deploy to development block
pnpm release:prod        # Deploy to production block

# Code Quality
pnpm lint                # Lint your code
pnpm typecheck           # Type check your code
```

### Code Quality

This boilerplate includes:

- **ESLint** with React and TypeScript rules
- **TypeScript** strict mode for better type safety
- **Prettier** compatible configuration

### Adding New Components

1. Create new components in `src/components/ui/`
2. Follow the established patterns using `class-variance-authority` for variants
3. Use the `cn()` utility for conditional class merging
4. Ensure components support both light and dark themes

## 🎯 Building Your Interface Extension

### Getting Started

1. **Replace the demo content** in `src/index.tsx` with your application logic
2. **Add Airtable SDK hooks** to interact with your data:

   ```tsx
   import { useBase, useRecords } from "@airtable/blocks/interface/ui";

   function MyApp() {
     const base = useBase();
     const table = base.tables[0];
     const records = useRecords(table);

     // Your app logic here
   }
   ```

3. **Use custom properties** for configuration:

   ```tsx
   import { useCustomProperties } from "@airtable/blocks/interface/ui";

   const customProperties = useCallback(
     (base) => [
       {
         key: "myField",
         type: "field",
         label: "Select a field",
         table: base.tables[0],
       },
     ],
     [],
   );

   const { customPropertyValueByKey } = useCustomProperties(customProperties);
   ```

### Best Practices

- **Use semantic HTML** and proper ARIA attributes for accessibility
- **Implement error boundaries** for robust error handling
- **Follow React hooks rules** and use proper dependency arrays
- **Test permissions** before attempting to create/update/delete records
- **Use the expandRecord function** to open detailed record views
- **Implement loading states** for better user experience

## 🎨 Styling Guidelines

### Theme Support

The boilerplate automatically detects and supports system dark/light mode preferences:

```tsx
// Use Tailwind's dark: prefix for dark mode styles
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Content that adapts to theme
</div>
```

### CSS Variables

Custom CSS variables are available for consistent theming:

- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- And many more...

### Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="p-4 sm:p-8 lg:p-12">Responsive padding</div>
```

## 📦 Dependencies

### Core Dependencies

- `@airtable/blocks`: Interface Extensions SDK
- `react` & `react-dom`: React 19 with latest features
- `tailwindcss`: Utility-first CSS framework
- `sonner`: Beautiful toast notifications
- `next-themes`: Theme management

### Development Dependencies

- `typescript`: Type safety and better developer experience
- `eslint`: Code linting and quality
- `@airtable/blocks-webpack-bundler`: Custom build process
- `class-variance-authority`: Component variant management
- `clsx` & `tailwind-merge`: Conditional class utilities

## 🚀 Deployment

1. **Build your extension**

   ```bash
   pnpm dlx @airtable/blocks-cli run
   ```

2. **Test thoroughly** in your Airtable base

3. **Submit for review** through the Airtable Developer Hub (if publishing publicly)

## 🔍 Troubleshooting

### Common Issues

**Build errors with CSS**: Ensure PostCSS is properly configured in `bundler.js`

**TypeScript errors**: Check your `tsconfig.json` and ensure all types are properly imported

**Theme not working**: Verify that `next-themes` is properly initialized and CSS variables are defined

**Components not styled**: Make sure Tailwind CSS is importing correctly in `globals.css`

### Getting Help

- Check the [Airtable Interface Extensions documentation](https://airtable.com/developers/extensions)
- Review [Tailwind CSS documentation](https://tailwindcss.com/docs)
- Explore [shadcn/ui components](https://ui.shadcn.com/)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Airtable](https://airtable.com) for the Interface Extensions platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Sonner](https://sonner.emilkowal.ski/) for the toast notification system

---

**Happy building! 🎉**

Start creating amazing Airtable Interface Extensions with this modern, feature-rich boilerplate.
