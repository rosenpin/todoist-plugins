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
                <h2 class="text-xl font-semibold mb-4">✅ Setup Complete</h2>
                <p class="text-gray-600 mb-4">
                    DefTime is now active for your Todoist account. Tasks without specific times will automatically be scheduled between 8-11 AM in your timezone.
                </p>
                <div class="bg-blue-50 border border-blue-200 rounded p-4">
                    <h3 class="font-semibold text-blue-800 mb-2">How it works:</h3>
                    <ul class="text-blue-700 space-y-1">
                        <li>• When you create a task with only a date (no time), DefTime automatically assigns a time</li>
                        <li>• Times are scheduled between 8-11 AM in your Todoist timezone</li>
                        <li>• For today's tasks created after 8 AM, times are scheduled later in the day</li>
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