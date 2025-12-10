# Announcements Yelbolt Worker

This repository contains the Cloudflare Worker that manages announcements for the Yelbolt suite:

- UI Color Palette
- Ideas Brainstorming Booth

The worker queries a Notion database to retrieve and distribute published announcements.

## 🚀 Technologies

- **Cloudflare Workers** - Edge computing deployment
- **TypeScript** - Development language
- **Notion API** - Announcements database
- **Wrangler** - CLI for development and deployment

## 📋 Prerequisites

- Node.js (recent version)
- npm or yarn
- A Cloudflare account
- A Notion API key with database access

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/a-ng-d/announcements-yelbolt.git
cd announcements-yelbolt-worker

# Install dependencies
npm install
```

## ⚙️ Configuration

Create a `.dev.vars` file at the project root with your environment variables:

```env
NOTION_API_KEY=your_notion_api_key
```

For production, configure secrets via Wrangler:

```bash
wrangler secret put NOTION_API_KEY
```

## 🏃 Development

```bash
# Start development server
npm run dev

# Start on a specific port
npm run start:8888

# Format code
npm run format

# Fix formatting
npm run format:fix
```

## 📡 API Endpoints

### GET `/?action=get_version`

Retrieves the version of the announcements database.

**Query parameters:**

- `database_id` (optional) - Notion database ID (uses default ID if not specified)

**Response:**

```json
{
  "version": "1.0.0"
}
```

### GET `/?action=get_announcements`

Retrieves all published announcements, sorted by publication date (most recent first).

**Query parameters:**

- `database_id` (optional) - Notion database ID

**Response:**

```json
{
  "announcements": [...]
}
```

**Applied filters:**

- Only announcements with `Publié = true` are returned
- Sorted by `Date de publication` descending

## 🚢 Deployment

```bash
npm run deploy
```

The worker will be deployed to Cloudflare Workers via Wrangler.

## 🔧 Project Structure

```
.
├── src/
│   ├── worker.ts          # Main worker code
│   ├── package.json       # Src-specific configuration
│   └── wrangler.toml      # Src Wrangler configuration
├── package.json           # Dependencies and scripts
├── wrangler.toml          # Main Wrangler configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Documentation
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
