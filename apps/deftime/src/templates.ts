export const HTML_TEMPLATES = {
    INDEX: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DefTime For Todoist</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="/>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-red-500">
    <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl font-bold text-white mb-8">DefTime For Todoist</h1>
        <p class="text-white text-lg mb-8">Set default time for tasks without due time</p>
        <a href="/authorize" class="inline-block bg-white text-red-500 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            🗂️ Log In With Todoist
        </a>
    </div>
</body>
</html>`,

    SETTINGS: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DefTime For Todoist - Settings</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="/>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-red-500 text-white p-4">
        <div class="container mx-auto flex justify-between items-center">
            <span class="font-semibold">Hello {{USER_NAME}}</span>
            <div class="space-x-4">
                <a href="https://github.com/rosenpin/todoist-plugins" target="_blank" class="hover:underline">📝 Code</a>
                <a href="https://github.com/rosenpin/todoist-plugins/blob/main/README.md" target="_blank" class="hover:underline">❓ Help</a>
            </div>
        </div>
    </nav>
    
    <main class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Set default time for tasks without due time</h1>
            
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">⚙️ Timezone Settings</h2>
                <div class="mb-4">
                    <label for="timezone" class="block text-sm font-medium text-gray-700 mb-2">
                        Your Timezone:
                    </label>
                    <select id="timezone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="">Select your timezone...</option>
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="America/New_York">America/New York (Eastern Time)</option>
                        <option value="America/Chicago">America/Chicago (Central Time)</option>
                        <option value="America/Denver">America/Denver (Mountain Time)</option>
                        <option value="America/Los_Angeles">America/Los Angeles (Pacific Time)</option>
                        <option value="America/Toronto">America/Toronto</option>
                        <option value="America/Vancouver">America/Vancouver</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Europe/Berlin">Europe/Berlin</option>
                        <option value="Europe/Rome">Europe/Rome</option>
                        <option value="Europe/Madrid">Europe/Madrid</option>
                        <option value="Europe/Amsterdam">Europe/Amsterdam</option>
                        <option value="Europe/Stockholm">Europe/Stockholm</option>
                        <option value="Europe/Helsinki">Europe/Helsinki</option>
                        <option value="Europe/Warsaw">Europe/Warsaw</option>
                        <option value="Europe/Prague">Europe/Prague</option>
                        <option value="Europe/Vienna">Europe/Vienna</option>
                        <option value="Europe/Zurich">Europe/Zurich</option>
                        <option value="Europe/Brussels">Europe/Brussels</option>
                        <option value="Europe/Copenhagen">Europe/Copenhagen</option>
                        <option value="Europe/Oslo">Europe/Oslo</option>
                        <option value="Europe/Dublin">Europe/Dublin</option>
                        <option value="Europe/Lisbon">Europe/Lisbon</option>
                        <option value="Europe/Athens">Europe/Athens</option>
                        <option value="Europe/Istanbul">Europe/Istanbul</option>
                        <option value="Europe/Moscow">Europe/Moscow</option>
                        <option value="Asia/Jerusalem">Asia/Jerusalem</option>
                        <option value="Asia/Dubai">Asia/Dubai</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="Asia/Bangkok">Asia/Bangkok</option>
                        <option value="Asia/Singapore">Asia/Singapore</option>
                        <option value="Asia/Hong_Kong">Asia/Hong Kong</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                        <option value="Asia/Seoul">Asia/Seoul</option>
                        <option value="Asia/Shanghai">Asia/Shanghai</option>
                        <option value="Asia/Manila">Asia/Manila</option>
                        <option value="Asia/Jakarta">Asia/Jakarta</option>
                        <option value="Australia/Sydney">Australia/Sydney</option>
                        <option value="Australia/Melbourne">Australia/Melbourne</option>
                        <option value="Australia/Perth">Australia/Perth</option>
                        <option value="Pacific/Auckland">Pacific/Auckland</option>
                    </select>
                    <p class="text-sm text-gray-500 mt-1" id="current-timezone">
                        Current: {{USER_TIMEZONE}}
                    </p>
                </div>
                <button 
                    id="save-timezone" 
                    class="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300"
                    onclick="saveTimezone()"
                >
                    Save Timezone
                </button>
                <div id="timezone-status" class="mt-2 text-sm"></div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">✅ Setup Complete</h2>
                <p class="text-gray-600 mb-4">
                    DefTime is now active for your Todoist account. Tasks without specific times will automatically be scheduled between 9-18 (6 PM) in your configured timezone.
                </p>
                <div class="bg-blue-50 border border-blue-200 rounded p-4">
                    <h3 class="font-semibold text-blue-800 mb-2">How it works:</h3>
                    <ul class="text-blue-700 space-y-1">
                        <li>• When you create a task with only a date (no time), DefTime automatically assigns a time</li>
                        <li>• Times are scheduled between 9 AM and 6 PM in your configured timezone</li>
                        <li>• For today's tasks created after the current hour, times are scheduled later in the day</li>
                        <li>• Already scheduled tasks remain unchanged</li>
                    </ul>
                </div>
            </div>

            <div class="text-center">
                <form action="/logout" method="post">
                    <button type="submit" class="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
                        🗑️ Log out and disable
                    </button>
                </form>
            </div>
        </div>
    </main>

    <footer class="bg-white border-t mt-16 py-8">
        <div class="container mx-auto px-4 text-center">
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                <input type="hidden" name="cmd" value="_s-xclick"/>
                <input type="hidden" name="hosted_button_id" value="PES85MB98DNEG"/>
                <button type="submit" class="inline-block">
                    <img src="https://www.paypalobjects.com/en_US/IL/i/btn/btn_donateCC_LG.gif" 
                         alt="Donate with PayPal button" 
                         class="border-0"/>
                </button>
            </form>
        </div>
    </footer>

    <script>
        async function saveTimezone() {
            const timezoneSelect = document.getElementById('timezone');
            const saveButton = document.getElementById('save-timezone');
            const statusDiv = document.getElementById('timezone-status');
            const currentTimezoneP = document.getElementById('current-timezone');
            
            const selectedTimezone = timezoneSelect.value;
            
            if (!selectedTimezone) {
                statusDiv.innerHTML = '<span class="text-red-600">Please select a timezone</span>';
                return;
            }
            
            saveButton.disabled = true;
            saveButton.textContent = 'Saving...';
            statusDiv.innerHTML = '<span class="text-blue-600">Updating timezone...</span>';
            
            try {
                const response = await fetch('/settings/timezone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        timezone: selectedTimezone
                    })
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    statusDiv.innerHTML = '<span class="text-green-600">Timezone updated successfully!</span>';
                    currentTimezoneP.textContent = 'Current: ' + selectedTimezone;
                    timezoneSelect.value = selectedTimezone;
                } else {
                    statusDiv.innerHTML = '<span class="text-red-600">Error: ' + (result.error || 'Failed to update timezone') + '</span>';
                }
            } catch (error) {
                statusDiv.innerHTML = '<span class="text-red-600">Error: Failed to connect to server</span>';
            }
            
            saveButton.disabled = false;
            saveButton.textContent = 'Save Timezone';
        }
        
        // Set current timezone as selected on page load
        document.addEventListener('DOMContentLoaded', function() {
            const currentTimezone = '{{USER_TIMEZONE}}';
            const timezoneSelect = document.getElementById('timezone');
            
            if (currentTimezone && currentTimezone !== 'Not set') {
                timezoneSelect.value = currentTimezone;
            }
        });
    </script>
</body>
</html>`
};

export function renderTemplate(template: string, variables: Record<string, string>): string {
    let rendered = template;

    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{{${key}}}`;
        rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
    }

    return rendered;
}