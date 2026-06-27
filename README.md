<p align="center">
  <img src="https://ui-avatars.com/api/?name=IP+Indicator&background=0D8ABC&color=fff&size=128&rounded=true" alt="IP Indicator Logo">
</p>

<h1 align="center">IP Indicator</h1>

<p align="center">
  <strong>A Sleek, Lightweight GNOME Shell Extension</strong><br>
  Monitor and display your public IP address directly in your top panel.
</p>

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Building & Packaging](#-building--packaging)
- [Copyright & License](#-copyright--license)

---

## 🚀 Overview

**IP Indicator** is a minimalist and elegant GNOME Shell extension designed to keep you aware of your current public IP address without opening a terminal or a browser. It sits quietly in your system panel and periodically updates your IP using `icanhazip.com`.

## ✨ Features

- **Real-Time IP Monitoring:** Automatically fetches and displays your public IPv4/IPv6 address.
- **Manual Refresh:** Instant update button right in the panel.
- **Professional Aesthetics:** Clean UI with native GNOME look-and-feel.
- **Customizable Themes:** Modify background and text colors or choose from predefined "Professional Color Presets" (Glassmorphism, Sleek Dark, Emerald, etc.).
- **Zero Heavy Dependencies:** Written entirely in GJS and utilizes native `Soup3` for ultra-fast, secure network requests (no `curl` or external processes needed).

## ⚙️ Requirements

- **GNOME Shell:** `45`, `46`, `47`, `48`

## 📦 Installation

### Official GNOME Extensions Store (Recommended)
You can install this extension directly from the GNOME Extensions website:
[IP Indicator on GNOME Extensions](https://extensions.gnome.org/extension/72114/ip-indicator/)

### Manual Installation
1. Clone this repository or download the ZIP file:
   ```bash
   git clone https://github.com/vjects/ip-indicator.git
   ```
2. Move the directory to your local extensions folder:
   ```bash
   mv ip-indicator ~/.local/share/gnome-shell/extensions/ip-indicator@vos
   ```
3. Restart GNOME Shell (Press `Alt+F2`, type `r`, and hit `Enter` on X11, or log out and log back in on Wayland).
4. Enable the extension using the **GNOME Extensions** app or via terminal:
   ```bash
   gnome-extensions enable ip-indicator@vos
   ```

## 🛠 Configuration

Right-click the indicator in your panel or use the **GNOME Extensions** app to open the Settings. 

- **Appearance:** Adjust background color, text color, and icon color using HEX/RGBA or pick from built-in themes.
- **Behavior:** Set the update interval (minimum 30 seconds to respect API rate limits).

## 🔨 Building & Packaging

To package the extension for distribution:
```bash
cd ip-indicator
zip -r ip-indicator@vos.zip . -x "*.git*"
```

---

<p align="center">
  <strong>&copy; 2026 VJECTS Ecosystem. All rights reserved.</strong><br>
  <em>Crafted with precision by <a href="https://vjects.com">VJECTS.com</a></em><br>
  Built with a Warrior Mindset.
</p>
