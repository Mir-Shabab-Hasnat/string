import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ... existing navbar content ... */}
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            {/* ... other navbar items ... */}
          </div>
        </div>
      </div>
    </nav>
  );
} 