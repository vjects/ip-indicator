import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Soup from 'gi://Soup?version=3.0';

export default class IPIndicatorExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        
        this._indicator = new PanelMenu.Button(0.0, 'IP Indicator', false);
        
        // Main container box (the pill)
        this._box = new St.BoxLayout({
            style_class: 'panel-status-menu-box',
        });
        
        // Globe/Network icon on the left
        this._icon = new St.Icon({
            icon_name: 'network-wired-symbolic',
            style_class: 'system-status-icon',
            y_align: Clutter.ActorAlign.CENTER,
        });
        
        // Text label
        this._label = new St.Label({
            text: 'Loading...',
            y_align: Clutter.ActorAlign.CENTER,
            style: 'font-weight: bold; margin-left: 6px; margin-right: 6px;'
        });
        
        // Refresh button on the right
        this._refreshButton = new St.Button({
            child: new St.Icon({
                icon_name: 'view-refresh-symbolic',
                style_class: 'system-status-icon',
            }),
            y_align: Clutter.ActorAlign.CENTER,
            style: 'margin-left: 2px;'
        });
        
        this._refreshButton.connectObject('clicked', () => this._updateIP(), this);
        
        this._box.add_child(this._icon);
        this._box.add_child(this._label);
        this._box.add_child(this._refreshButton);
        
        this._indicator.add_child(this._box);
        
        Main.panel.addToStatusArea('ip-indicator', this._indicator);
        
        // Apply settings
        this._applyStyles();
        
        // Watch for settings changes
        this._settings.connectObject(
            'changed::background-color', () => this._applyStyles(),
            'changed::text-color', () => this._applyStyles(),
            'changed::update-interval', () => this._resetTimer(),
            this
        );
        
        this._updateIP();
        this._resetTimer();
    }

    disable() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }
        if (this._settings) {
            this._settings.disconnectObject(this);
            this._settings = null;
        }
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        this._box = null;
        this._icon = null;
        this._label = null;
        if (this._refreshButton) {
            this._refreshButton.disconnectObject(this);
            this._refreshButton = null;
        }
        if (this._session) {
            this._session.abort();
            this._session = null;
        }
    }

    _applyStyles() {
        if (!this._box) return;
        
        let bgColor = this._settings.get_string('background-color');
        let textColor = this._settings.get_string('text-color');
        
        // Set CSS styles on the pill box
        this._box.set_style(`
            background-color: ${bgColor};
            color: ${textColor};
            border-radius: 14px;
            padding: 2px 10px;
            margin: 4px 6px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2);
            transition: background-color 0.25s ease, color 0.25s ease;
        `);
        
        // Apply color matching to icons
        if (this._icon) {
            this._icon.set_style(`color: ${textColor};`);
        }
        if (this._refreshButton && this._refreshButton.child) {
            this._refreshButton.child.set_style(`color: ${textColor};`);
        }
    }

    _resetTimer() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }
        
        let intervalSec = this._settings.get_int('update-interval');
        if (intervalSec < 30) intervalSec = 30; // safety threshold
        
        this._timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, intervalSec * 1000, () => {
            this._updateIP();
            return GLib.SOURCE_CONTINUE;
        });
    }

    async _updateIP() {
        if (!this._label)
            return;
        
        this._label.set_text('Updating...');
        
        try {
            if (!this._session) {
                this._session = new Soup.Session();
            }
            let message = Soup.Message.new('GET', 'https://icanhazip.com');
            let bytes = await this._session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null);
            
            if (!this._label)
                return;

            if (message.get_status() === Soup.Status.OK) {
                let decoder = new TextDecoder('utf-8');
                let stdout = decoder.decode(bytes.toArray());
                let ip = stdout.trim();
                this._label.set_text(ip ? ip : 'Error');
            } else {
                this._label.set_text('Offline');
            }
        } catch (e) {
            logError(e, 'IP Indicator Error');
            if (this._label)
                this._label.set_text('Error');
        }
    }
}

