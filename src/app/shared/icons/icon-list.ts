export interface IconEntry {
  name: string;
  label: string;
  category: string;
}

export const ICON_LIST: IconEntry[] = [
  // 🎵 Media & Audio
  { name: "play", label: "Play", category: "Media" },
  { name: "pause", label: "Pause", category: "Media" },
  { name: "square-stop", label: "Stop", category: "Media" },
  { name: "music", label: "Music", category: "Media" },
  { name: "volume", label: "Volume", category: "Media" },

  // 🧭 Navigation
  { name: "home", label: "Home", category: "Navigation" },
  { name: "search", label: "Search", category: "Navigation" },
  { name: "compass", label: "Compass", category: "Navigation" },
  { name: "map-pin", label: "Map Pin", category: "Navigation" },
  { name: "link", label: "Link", category: "Navigation" },
  { name: "external-link", label: "External Link", category: "Navigation" },

  // 💻 Apps & Devices
  { name: "monitor", label: "Monitor", category: "Devices" },
  { name: "smartphone", label: "Smartphone", category: "Devices" },
  { name: "camera", label: "Camera", category: "Devices" },
  { name: "terminal", label: "Terminal", category: "Devices" },
  { name: "server", label: "Server", category: "Devices" },
  { name: "database", label: "Database", category: "Devices" },
  { name: "watch", label: "Watch", category: "Devices" },
  { name: "wifi", label: "WiFi", category: "Devices" },
  { name: "bluetooth", label: "Bluetooth", category: "Devices" },
  { name: "app-window", label: "App Window", category: "Devices" },

  // 💬 Communication
  { name: "mail", label: "Mail", category: "Communication" },
  { name: "bell", label: "Bell", category: "Communication" },

  // ⚡ Actions
  { name: "plus", label: "Plus", category: "Actions" },
  { name: "minus", label: "Minus", category: "Actions" },
  { name: "x", label: "Close", category: "Actions" },
  { name: "check", label: "Check", category: "Actions" },
  { name: "edit", label: "Edit", category: "Actions" },
  { name: "pencil", label: "Pencil", category: "Actions" },
  { name: "trash", label: "Trash", category: "Actions" },
  { name: "copy", label: "Copy", category: "Actions" },
  { name: "save", label: "Save", category: "Actions" },
  { name: "undo", label: "Undo", category: "Actions" },
  { name: "redo", label: "Redo", category: "Actions" },
  { name: "cog", label: "Settings", category: "Actions" },
  { name: "refresh-cw", label: "Refresh", category: "Actions" },
  { name: "download", label: "Download", category: "Actions" },
  { name: "upload", label: "Upload", category: "Actions" },
  { name: "filter", label: "Filter", category: "Actions" },

  // 📁 Files & Folders
  { name: "folder", label: "Folder", category: "Files" },
  { name: "file", label: "File", category: "Files" },
  { name: "image", label: "Image", category: "Files" },
  { name: "cloud", label: "Cloud", category: "Files" },

  // 👤 Common UI
  { name: "user", label: "User", category: "UI" },
  { name: "star", label: "Star", category: "UI" },
  { name: "heart", label: "Heart", category: "UI" },
  { name: "clock", label: "Clock", category: "UI" },
  { name: "calendar", label: "Calendar", category: "UI" },
  { name: "flag", label: "Flag", category: "UI" },
  { name: "gift", label: "Gift", category: "UI" },
  { name: "lock", label: "Lock", category: "UI" },
  { name: "shield", label: "Shield", category: "UI" },
  { name: "globe", label: "Globe", category: "UI" },
  { name: "sun", label: "Sun", category: "UI" },
  { name: "moon", label: "Moon", category: "UI" },

  // 📊 Status
  { name: "alert-circle", label: "Alert", category: "Status" },
  { name: "alert-triangle", label: "Warning", category: "Status" },
  { name: "info", label: "Info", category: "Status" },
  { name: "help-circle", label: "Help", category: "Status" },
  { name: "percent", label: "Percent", category: "Status" },

  // 💰 Money
  { name: "dollar-sign", label: "Dollar", category: "Finance" },
  { name: "euro", label: "Euro", category: "Finance" },
  { name: "pound-sterling", label: "Pound", category: "Finance" },
];
