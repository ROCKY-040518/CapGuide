<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>CapGuide - Search</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    
    <script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                    "surface-container-high": "#e9e7eb",
                    "surface-container": "#efedf1",
                    "on-secondary": "#ffffff",
                    "surface-tint": "#005bc0",
                    "on-secondary-fixed-variant": "#454748",
                    "tertiary-container": "#6f7783",
                    "on-surface": "#1a1b1e",
                    "primary": "#005bbf",
                    "surface-bright": "#faf9fd",
                    "on-tertiary-fixed-variant": "#3f4752",
                    "surface-container-low": "#f4f3f7",
                    "tertiary-fixed-dim": "#bfc7d4",
                    "on-surface-variant": "#414754",
                    "surface-dim": "#dbd9dd",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-fixed-variant": "#004493",
                    "primary-fixed": "#d8e2ff",
                    "outline": "#727785",
                    "primary-fixed-dim": "#adc7ff",
                    "on-background": "#1a1b1e",
                    "inverse-on-surface": "#f1f0f4",
                    "secondary-container": "#e1e3e4",
                    "on-secondary-container": "#626566",
                    "inverse-primary": "#adc7ff",
                    "tertiary": "#565e6a",
                    "secondary": "#5c5f60",
                    "on-primary-container": "#ffffff",
                    "error-container": "#ffdad6",
                    "surface": "#faf9fd",
                    "secondary-fixed-dim": "#c5c7c8",
                    "secondary-fixed": "#e1e3e4",
                    "inverse-surface": "#2f3033",
                    "error": "#ba1a1a",
                    "background": "#faf9fd",
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed": "#dbe3f1",
                    "primary-container": "#1a73e8",
                    "outline-variant": "#c1c6d6",
                    "on-error-container": "#93000a",
                    "on-primary": "#ffffff",
                    "on-tertiary-container": "#ffffff",
                    "on-primary-fixed": "#001a41",
                    "on-secondary-fixed": "#191c1d",
                    "surface-variant": "#e3e2e6",
                    "surface-container-highest": "#e3e2e6",
                    "on-error": "#ffffff",
                    "on-tertiary-fixed": "#141c26"
              },
              "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
              },
              "spacing": {
                    "xs": "4px",
                    "sm": "12px",
                    "base": "8px",
                    "margin-mobile": "16px",
                    "lg": "24px",
                    "md": "16px",
                    "margin-desktop": "48px",
                    "gutter": "24px",
                    "xl": "32px"
              },
              "fontFamily": {
                    "label-lg": ["Inter"],
                    "headline-lg-mobile": ["Inter"],
                    "headline-md": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-lg": ["Inter"],
                    "headline-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "body-lg": ["Inter"]
              },
              "fontSize": {
                    "label-lg": ["14px", {"lineHeight": "20px", "letterSpacing": "0.1px", "fontWeight": "500"}],
                    "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "headline-md": ["22px", {"lineHeight": "28px", "fontWeight": "500"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                    "headline-sm": ["18px", {"lineHeight": "24px", "fontWeight": "500"}],
                    "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.5px", "fontWeight": "500"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
              }
            }
          }
        }
    </script>
    <link rel="stylesheet" href="/css/stitch-main.css">
    <script src="/js/stitch-action.js" defer></script>
</head>
<body class="bg-surface min-h-screen flex flex-col font-sans text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">

<header class="w-full bg-surface border-b border-outline-variant flat no shadows">
    <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto h-16">
        <div class="flex items-center gap-md">
            <a class="text-headline-sm font-headline-sm font-bold text-primary" href="#">CapGuide</a>
        </div>
        <nav class="hidden md:flex items-center gap-lg">
            <a class="text-label-md font-label-md text-primary border-b-2 border-primary pb-1 opacity-80 transition-opacity" href="#">Explore</a>
            <a class="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">About</a>
            <a class="text-label-md font-label-md text-secondary hover:text-primary transition-colors" href="#">Resources</a>
        </nav>
        <div class="flex items-center gap-sm text-secondary">
            <button aria-label="notifications" class="p-2 rounded-full hover:bg-surface-variant transition-colors">
                <span class="material-symbols-outlined" data-icon="notifications">notifications</span>
            </button>
            <button aria-label="settings" class="p-2 rounded-full hover:bg-surface-variant transition-colors">
                <span class="material-symbols-outlined" data-icon="settings">settings</span>
            </button>
            <button aria-label="User profile" class="ml-2 w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-lg overflow-hidden ring-2 ring-transparent hover:ring-primary-fixed transition-all">
                <span class="material-symbols-outlined text-[20px]" data-icon="person">person</span>
            </button>
        </div>
    </div>
</header>