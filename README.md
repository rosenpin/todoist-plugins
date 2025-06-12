# Rosenpin's Todoist Plugins

A collection of productivity-enhancing integrations for Todoist, built with TypeScript and deployed on Cloudflare Workers.

## 🚀 Services

### [DefTime For Todoist](./apps/deftime/)

Automatically sets default times for tasks without due times. Perfect for throwing tasks at Todoist without worrying about scheduling.

- **Features**: Timezone-aware scheduling between 8-11 AM
- **URL**: [https://deftime-for-todoist.real-tomer-rosenfeld.workers.dev/](https://deftime-for-todoist.real-tomer-rosenfeld.workers.dev)

### [Done For Todoist](./apps/done/)

Automatically adds ~~strikethrough~~ formatting to completed tasks in Google Calendar.

- **Features**: Visual completion feedback, removes time components
- **URL**: [https://done-for-todoist.real-tomer-rosenfeld.workers.dev/](https://done-for-todoist.real-tomer-rosenfeld.workers.dev)

### [Durations For Todoist](./apps/durations/)

Sets Google Calendar event durations based on Todoist labels.

- **Features**: Label-based duration setting (15m, 30m, 1h, etc.)
- **URL**: [https://durations-for-todoist.real-tomer-rosenfeld.workers.dev/](https://done-for-todoist.real-tomer-rosenfeld.workers.dev)

## 🏗️ Architecture

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Framework**: Hono.js
- **Database**: Cloudflare D1 (SQLite)
- **API**: @doist/todoist-api-typescript v5.0.0
- **UI**: Tailwind CSS

## 📁 Project Structure

```
todoist-plugins/
├── apps/
│   ├── deftime/     # DefTime app
│   ├── done/        # Done app
│   └── durations/   # Durations app
├── shared/
│   ├── auth/        # OAuth handling
│   ├── db/          # Database operations
│   ├── todoist-client/  # Todoist API wrapper
│   └── utils/       # Common utilities
├── database/        # D1 schemas and migrations
└── .github/         # CI/CD workflows
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Wrangler CLI

### Setup

```bash
# Clone and install
git clone https://github.com/rosenpin/todoist-plugins
cd todoist-plugins
npm install

# Build all packages
npm run build

# Run individual app in development
cd apps/deftime
npm run dev
```

### Testing

```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 💝 Support

If you find these tools useful, consider [buying me a coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PES85MB98DNEG) ☕

## 🔗 Links

- [Todoist Developer Platform](https://developer.todoist.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Original Python Repositories](https://github.com/rosenpin?tab=repositories&q=todoist)

---

Made with ❤️ for the Todoist community
