export const HTML_TEMPLATES = {
    INDEX: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Durations For Todoist</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="/>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-red-500">
    <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">Durations For Todoist</h1>
        <p class="text-white text-lg mb-8">Automatically set Google Calendar events duration based on Todoist labels</p>
        
        <div class="mb-8">
            <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 class="text-lg font-semibold mb-4 text-gray-800">Available Duration Labels:</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲15m</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲30m</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲1h</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲2h</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲3h</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲4h</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲5h</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲6h</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲7h</span>
                    <span class="bg-blue-100 px-2 py-1 rounded">⏲8h</span>
                </div>
            </div>
        </div>
        
        <a href="/authorize" class="inline-block bg-white text-red-500 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            ⏲️ Log In With Todoist
        </a>
    </div>
</body>
</html>`,

    SETTINGS: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Durations For Todoist - Settings</title>
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
            <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Set Google Calendar event durations with labels</h1>
            
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">✅ Setup Complete</h2>
                <p class="text-gray-600 mb-4">
                    Durations For Todoist is now active for your account. Tasks with duration labels will automatically have their durations set in Google Calendar.
                </p>
                
                <div class="bg-orange-50 border border-orange-200 rounded p-4 mb-4">
                    <h3 class="font-semibold text-orange-800 mb-2">⚙️ Prerequisites:</h3>
                    <ol class="text-orange-700 space-y-1 list-decimal list-inside">
                        <li><a href="https://get.todoist.help/hc/en-us/articles/115003128085-Use-Google-Calendar-with-Todoist" target="_blank" class="underline">Add Google Calendar integration to your Todoist account</a></li>
                        <li>You need a Todoist Premium account to use labels</li>
                    </ol>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                    <h3 class="font-semibold text-blue-800 mb-2">How it works:</h3>
                    <ul class="text-blue-700 space-y-1">
                        <li>• Create tasks with due dates and add duration labels</li>
                        <li>• Duration labels will be automatically created: ⏲15m, ⏲30m, ⏲1h, etc.</li>
                        <li>• When you add a duration label to a task, the duration is set in Google Calendar</li>
                        <li>• Task content is annotated with duration info: "Task name [60m]"</li>
                    </ul>
                </div>

                <div class="bg-green-50 border border-green-200 rounded p-4">
                    <h3 class="font-semibold text-green-800 mb-2">⏲️ Available Duration Labels:</h3>
                    <div class="grid grid-cols-5 gap-2 text-sm">
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲15m</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲30m</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲1h</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲2h</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲3h</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲4h</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲5h</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲6h</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲7h</span>
                        <span class="bg-green-100 px-2 py-1 rounded text-center">⏲8h</span>
                    </div>
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