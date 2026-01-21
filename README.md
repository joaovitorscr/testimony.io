<h1 align="center">
  <br />
  <img src="./public/app-preview.png" alt="Testimony.io" width="800" />
  <br />
  Testimony.io
  <br />
</h1>

<h4 align="center">
  Collect, manage, and showcase customer testimonials with ease.
</h4>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

<br />

## ✨ Features

- 📝 **Collect Testimonials** - Create shareable links to collect testimonials from your customers
- 🎨 **Customizable Widget** - Embed a beautiful, customizable widget on your website
- 👥 **Multi-Project Support** - Manage testimonials for multiple projects/products
- ✅ **Approval Workflow** - Review and approve testimonials before displaying them
- ⭐ **Rating System** - Collect star ratings alongside text testimonials
- 🔒 **Secure Authentication** - Powered by Better Auth with social login support
- 🌐 **Domain Whitelisting** - Control which domains can embed your widget
- 📊 **Dashboard** - Clean, modern dashboard to manage all your testimonials

<br />

## 🛠️ Tech Stack

<table>
  <tr>
    <td><strong>Framework</strong></td>
    <td>Next.js 16 (App Router)</td>
  </tr>
  <tr>
    <td><strong>Language</strong></td>
    <td>TypeScript</td>
  </tr>
  <tr>
    <td><strong>Styling</strong></td>
    <td>Tailwind CSS 4</td>
  </tr>
  <tr>
    <td><strong>UI Components</strong></td>
    <td>Radix UI + shadcn/ui</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>PostgreSQL</td>
  </tr>
  <tr>
    <td><strong>ORM</strong></td>
    <td>Prisma</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>Better Auth</td>
  </tr>
  <tr>
    <td><strong>API Layer</strong></td>
    <td>tRPC</td>
  </tr>
  <tr>
    <td><strong>State Management</strong></td>
    <td>TanStack Query</td>
  </tr>
  <tr>
    <td><strong>Forms</strong></td>
    <td>React Hook Form + Zod</td>
  </tr>
  <tr>
    <td><strong>Animations</strong></td>
    <td>Motion (Framer Motion) + GSAP</td>
  </tr>
  <tr>
    <td><strong>Package Manager</strong></td>
    <td>Bun</td>
  </tr>
  <tr>
    <td><strong>Linting</strong></td>
    <td>Biome</td>
  </tr>
</table>

<br />

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Bun](https://bun.sh/) (v1.3.5 or higher)
- [Docker](https://docs.docker.com/engine/install/) or [Podman](https://podman.io/getting-started/installation)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/testimony.io.git
cd testimony.io
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration (see [Environment Variables](#-environment-variables)).

4. **Start the database**

```bash
./start-database.sh
```

This script will automatically start a PostgreSQL container using Docker or Podman.

5. **Run database migrations**

```bash
bun run db:generate
```

6. **Start the development server**

```bash
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) 🎉

<br />

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/testimony"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `BETTER_AUTH_SECRET` | Secret key for authentication (required in production) | ⚠️ Production |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app | ❌ No (defaults to localhost:3000) |

<br />

## 📁 Project Structure

```
testimony.io/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets and widget files
│   └── widget/             # Embeddable widget files
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (private)/      # Authenticated routes (dashboard)
│   │   ├── (public)/       # Public routes (auth, collect links)
│   │   └── api/            # API routes (tRPC, auth)
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── widgets/        # Widget components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── server/             # Server-side code
│   │   ├── api/            # tRPC routers
│   │   └── better-auth/    # Authentication config
│   └── trpc/               # tRPC client setup
└── start-database.sh       # Database startup script
```

<br />

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run Biome linter |
| `bun run format` | Format code with Biome |
| `bun run db:generate` | Generate Prisma migrations |
| `bun run db:migrate` | Deploy migrations to database |
| `bun run db:push` | Push schema changes to database |
| `bun run db:studio` | Open Prisma Studio |

<br />

## 🔌 Widget Embed Example

Once you've configured your widget, you can embed it on any website:

```html
<iframe
  src="https://your-domain.com/widget/testimonies-widget.html?widgetId=YOUR_WIDGET_ID"
  title="Testimonial Widget"
  width="100%"
  height="600px"
  frameborder="0"
  scrolling="no"
/>
```

<br />

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ using Next.js and TypeScript
</p>
