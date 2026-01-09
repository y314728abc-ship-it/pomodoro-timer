const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const errors = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    const filePath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);
    
    await page.waitForTimeout(1000);
    
    console.log('=== Complete Interaction Test ===\n');
    
    // Test 1: Check all main elements exist
    console.log('Checking main elements...');
    const elements = ['#timer-display', '#thinking-boi', '#btn-toggle', '#work-buttons', 
                      '#break-buttons', '#settings-btn', '#theme-toggle', '#mode-work', 
                      '#mode-break', '#task-input', '#settings-modal'];
    
    let allElementsFound = true;
    for (const selector of elements) {
        const exists = await page.$(selector) !== null;
        console.log(`  ${selector}: ${exists ? '✓' : '✗'}`);
        if (!exists) allElementsFound = false;
    }
    
    // Test 2: Start timer using the visible button
    console.log('\nTesting timer start...');
    await page.click('#btn-toggle');
    await page.waitForTimeout(500);
    
    const timerValue = await page.textContent('#timer-display');
    console.log(`  Timer value: ${timerValue}`);
    const btnText = await page.textContent('#btn-toggle-text');
    console.log(`  Toggle button text: ${btnText}`);
    
    // Check work buttons appeared (toggle should be hidden)
    const toggleHidden = await page.$eval('#btn-toggle', el => el.classList.contains('hidden'));
    const workButtonsVisible = await page.$eval('#work-buttons', el => !el.classList.contains('hidden'));
    console.log(`  Toggle button hidden: ${toggleHidden}`);
    console.log(`  Work buttons visible: ${workButtonsVisible}`);
    
    // Test 3: Complete work
    console.log('\nTesting work completion...');
    await page.click('#btn-complete');
    await page.waitForTimeout(500);
    
    // Check if we entered break mode
    const breakButtonsVisible = await page.$eval('#break-buttons', el => !el.classList.contains('hidden'));
    console.log(`  Break buttons visible: ${breakButtonsVisible}`);
    
    // Test 4: End break
    console.log('\nTesting break end...');
    await page.click('#btn-end-break');
    await page.waitForTimeout(500);
    
    // Check if we're back to initial state
    const toggleVisibleAgain = await page.$eval('#btn-toggle', el => !el.classList.contains('hidden'));
    console.log(`  Toggle button visible again: ${toggleVisibleAgain}`);
    
    // Test 5: Theme switching
    console.log('\nTesting theme switching...');
    await page.click('.theme-btn.blue');
    await page.waitForTimeout(300);
    const hasBlueTheme = await page.$eval('body', el => el.classList.contains('theme-blue'));
    console.log(`  Blue theme: ${hasBlueTheme}`);
    
    await page.click('.theme-btn.purple');
    await page.waitForTimeout(300);
    const hasPurpleTheme = await page.$eval('body', el => el.classList.contains('theme-purple'));
    console.log(`  Purple theme: ${hasPurpleTheme}`);
    
    // Test 6: Dark mode
    console.log('\nTesting dark mode...');
    await page.click('#theme-toggle');
    await page.waitForTimeout(300);
    const isDarkMode = await page.$eval('body', el => el.classList.contains('dark-mode'));
    console.log(`  Dark mode: ${isDarkMode}`);
    
    // Test 7: Settings modal
    console.log('\nTesting settings modal...');
    await page.click('#settings-btn');
    await page.waitForTimeout(300);
    const settingsOpen = await page.$eval('#settings-modal', el => el.classList.contains('active'));
    console.log(`  Settings modal opened: ${settingsOpen}`);
    
    // Close settings
    await page.click('#settings-close-btn');
    await page.waitForTimeout(300);
    const settingsClosed = await page.$eval('#settings-modal', el => !el.classList.contains('active'));
    console.log(`  Settings modal closed: ${settingsClosed}`);
    
    // Test 8: Background presets
    console.log('\nTesting background presets...');
    await page.click('.bg-preset.pink');
    await page.waitForTimeout(300);
    const pinkActive = await page.$eval('.bg-preset.pink', el => el.classList.contains('active'));
    console.log(`  Pink background: ${pinkActive}`);
    
    // Test 9: Mode switching
    console.log('\nTesting mode switching...');
    await page.click('#mode-break');
    await page.waitForTimeout(300);
    const breakModeActive = await page.$eval('#mode-break', el => el.classList.contains('active'));
    console.log(`  Break mode active: ${breakModeActive}`);
    
    // Test 10: Click thinking boi
    console.log('\nTesting thinking boi click...');
    await page.click('#thinking-boi');
    await page.waitForTimeout(500);
    const speechVisible = await page.$eval('#boi-speech-bubble', el => el.classList.contains('active'));
    console.log(`  Speech bubble shown: ${speechVisible}`);
    
    console.log('\n=== Error Summary ===');
    if (errors.length > 0) {
        console.log(`❌ ERRORS FOUND (${errors.length}):`);
        errors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('✅ No JavaScript errors detected!');
    }
    
    console.log('\n=== Test Complete ===');
    
    await browser.close();
})();
