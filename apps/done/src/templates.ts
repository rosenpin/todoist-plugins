export const HTML_TEMPLATES = {
    INDEX: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Done For Todoist</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="/>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-red-500">
    <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Done For Todoist</h1>
        <p class="text-white text-lg mb-8">Automatically <span style="text-decoration: line-through;">strikethrough</span> Google Calendar events when they're marked completed in Todoist</p>
        
        <div class="mb-8">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkV4YW1wbGU6IFN0cmlrZXRocm91Z2ggRXZlbnQ8L3RleHQ+Cjwvc3ZnPgo=" 
                 alt="Example strikethrough event" 
                 class="mx-auto rounded-lg shadow-lg"/>
        </div>
        
        <a href="/authorize" class="inline-block bg-white text-red-500 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            ✅ Log In With Todoist
        </a>
    </div>
</body>
</html>`,

    SETTINGS: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Done For Todoist - Settings</title>
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
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Automatically <span style="text-decoration: line-through;">strikethrough</span> completed tasks</h1>
            
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">✅ Setup Complete</h2>
                <p class="text-gray-600 mb-4">
                    Done For Todoist is now active for your account. Completed tasks will be automatically modified in Google Calendar.
                </p>
                
                <div class="bg-orange-50 border border-orange-200 rounded p-4 mb-4">
                    <h3 class="font-semibold text-orange-800 mb-2">⚙️ Prerequisites:</h3>
                    <ol class="text-orange-700 space-y-1 list-decimal list-inside">
                        <li><a href="https://get.todoist.help/hc/en-us/articles/115003128085-Use-Google-Calendar-with-Todoist" target="_blank" class="underline">Add Google Calendar integration to your Todoist account</a></li>
                        <li><a href="https://todoist.com/prefs/integrations" target="_blank" class="underline">In Google Calendar integration settings, choose "leave it on Google Calendar" when tasks are completed</a></li>
                    </ol>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded p-4">
                    <h3 class="font-semibold text-blue-800 mb-2">How it works:</h3>
                    <ul class="text-blue-700 space-y-1">
                        <li>• When you complete a task in Todoist, it gets <span style="text-decoration: line-through;">strikethrough</span> formatting</li>
                        <li>• Time components are removed from due dates to clean up your calendar</li>
                        <li>• If you uncomplete a task, the strikethrough is removed</li>
                        <li>• Changes sync to your Google Calendar automatically</li>
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