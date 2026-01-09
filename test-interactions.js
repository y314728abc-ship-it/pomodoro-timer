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
    
    // Wait for page to fully load
    await page.waitForTimeout(1000);
    
    console.log('=== Testing Page Interactions ===\n');
    
    // Test 1: Click start button
    console.log('Test 1: Clicking start button...');
    await page.click('#btn-toggle');
    await page.waitForTimeout(500);
    
    const btnText = await page.textContent('#btn-toggle-text');
    console.log(`  Button text after click: "${btnText}"`);
    
    // Test 2: Check if timer is running (button should show "暂停")
    const isPausedVisible = await page.$eval('#pause-icon', el => el.style.display !== 'none');
    console.log(`  Pause icon visible: ${isPausedVisible}`);
    
    // Test 3: Check if work buttons are visible
    const workButtonsVisible = await page.$eval('#work-buttons', el => !el.classList.contains('hidden'));
    console.log(`  Work buttons visible: ${workButtonsVisible}`);
    
    // Test 4: Click pause button
    console.log('\nTest 2: Clicking pause button...');
    await page.click('#btn-toggle');
    await page.waitForTimeout(500);
    
    const btnTextAfterPause = await page.textContent('#btn-toggle-text');
    console.log(`  Button text after pause: "${btnTextAfterPause}"`);
    
    // Test 5: Click theme toggle
    console.log('\nTest 3: Testing theme toggle...');
    await page.click('#theme-toggle');
    await page.waitForTimeout(300);
    
    const isDarkMode = await page.$eval('body', el => el.classList.contains('dark-mode'));
    console.log(`  Dark mode activated: ${isDarkMode}`);
    
    // Test 6: Click settings button
    console.log('\nTest 4: Testing settings modal...');
    await page.click('#settings-btn');
    await page.waitForTimeout(300);
    
    const settingsModalVisible = await page.$eval('#settings-modal', el => el.classList.contains('active'));
    console.log(`  Settings modal visible: ${settingsModalVisible}`);
    
    // Close settings
    await page.click('#settings-close-btn');
    await page.waitForTimeout(300);
    
    // Test 7: Test theme buttons
    console.log('\nTest 5: Testing theme buttons...');
    await page.click('.theme-btn.blue');
    await page.waitForTimeout(300);
    
    const isBlueTheme = await page.$eval('body', el => el.classList.contains('theme-blue'));
    console.log(`  Blue theme activated: ${isBlueTheme}`);
    
    // Test 8: Test background presets
    console.log('\nTest 6: Testing background presets...');
    await page.click('.bg-preset.blue');
    await page.waitForTimeout(300);
    
    const bgPresetActive = await page.$eval('.bg-preset.blue', el => el.classList.contains('active'));
    console.log(`  Blue background preset active: ${bgPresetActive}`);
    
    // Test 9: Click on thinking boi
    console.log('\nTest 7: Clicking thinking boi...');
    await page.click('#thinking-boi');
    await page.waitForTimeout(500);
    
    const speechBubbleActive = await page.$eval('#boi-speech-bubble', el => el.classList.contains('active'));
    console.log(`  Speech bubble visible: ${speechBubbleActive}`);
    
    console.log('\n=== Error Summary ===');
    if (errors.length > 0) {
        console.log(`❌ ERRORS FOUND (${errors.length}):`);
        errors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('✅ No JavaScript errors detected!');
    }
    
    await browser.close();
})();
