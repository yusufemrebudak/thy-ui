# THY Aviation System - Frontend

A modern transportation management system built with React and TypeScript for managing locations, transportation routes, and flight planning.

## Features

- **Location Management**: Add, edit, and delete airports and transportation hubs
- **Transportation Management**: Manage flights, buses, and other transport types
- **Route Planning**: Search and plan optimal routes between locations
- **Date Filtering**: Optional date-based route searching

## Tech Stack

- React 19.2.4 + TypeScript
- React Router 7.12.0
- Tailwind CSS
- React Query (TanStack)
- React Hook Form
- OpenAPI integration

## Getting Started

### Prerequisites
- Node.js (v18+)
- Backend API running on localhost:8080

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5174`

### Build

```bash
npm run build
```

## Project Structure

```
app/
├── components/     # Reusable UI components
├── lib/api/       # API integrations
├── pages/         # Page components
└── ...
```

## API Endpoints

- **Locations**: `GET|POST|PUT|DELETE /locations`
- **Transportations**: `GET|POST|PUT|DELETE /transportations`
- **Routes**: `GET /routes?originId={id}&destinationId={id}&date={date}`

## Features

- Dark mode support
- Responsive design
- Form validation
- Real-time search
- Error handling

---

Built with React Router and Tailwind CSS.
