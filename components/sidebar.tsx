"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardConfig } from "@/config/dashboard.config";
import { COMPANY, SIDEBAR_THEME } from "@/config/settings";

export function Sidebar() {
  const pathname = usePathname();
  const { navigation } = dashboardConfig;

  return (
    <div
      className="flex h-full w-64 flex-col text-white"
      style={{ backgroundColor: SIDEBAR_THEME.background }}
    >
      {/* Logo / Header */}
      <div
        className="flex h-16 items-center justify-center border-b"
        style={{ borderColor: SIDEBAR_THEME.hoverBackground }}
      >
        <h1 className="text-xl font-bold truncate px-4">
          {COMPANY.shortName || COMPANY.name}
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "shadow-sm"
                  : "hover:shadow-sm"
              )}
              style={{
                backgroundColor: isActive
                  ? SIDEBAR_THEME.activeBackground
                  : "transparent",
                color: isActive ? SIDEBAR_THEME.activeText : SIDEBAR_THEME.text,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    SIDEBAR_THEME.hoverBackground;
                  e.currentTarget.style.color = SIDEBAR_THEME.activeText;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = SIDEBAR_THEME.text;
                }
              }}
              title={item.description}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
              {item.badge && (
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: dashboardConfig.theme.primary,
                    color: "#fff",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="border-t p-4"
        style={{ borderColor: SIDEBAR_THEME.hoverBackground }}
      >
        <p
          className="text-xs text-center"
          style={{ color: SIDEBAR_THEME.text }}
        >
          {COMPANY.footer.team && (
            <>
              {COMPANY.footer.team}
              <br />
            </>
          )}
          {COMPANY.footer.company} &copy; {COMPANY.footer.year}
        </p>
        {COMPANY.footer.version && (
          <p
            className="text-xs text-center mt-1 opacity-60"
            style={{ color: SIDEBAR_THEME.text }}
          >
            v{COMPANY.footer.version}
          </p>
        )}
      </div>
    </div>
  );
}
