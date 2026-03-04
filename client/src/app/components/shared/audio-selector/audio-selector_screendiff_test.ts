import { test, expect } from '@playwright/test';
import { TestSetupHelper } from '../../../testing/test-setup_helper';

test.describe('Audio Selector Visuals', () => {
  test.beforeEach(async ({ page }) => {
    // Setup standard mocks
    await TestSetupHelper.setupStandardMocks(page);
    await TestSetupHelper.setupRaceMocks(page);
    await TestSetupHelper.setupAssetMocks(page);
    await TestSetupHelper.disableAnimations(page);
  });

  test('should display audio selector', async ({ page }) => {
    // Navigate to Driver Editor which uses Audio Selector
    await TestSetupHelper.waitForLocalization(page, 'en', page.goto('/driver-editor?id=d1'));
    await TestSetupHelper.waitForText(page, 'DRIVER CONFIGURATION');

    // Locate an audio selector (e.g. Lap Sound)
    // We might need to target a specific one if there are multiple, or just taking the first one
    const audioSelector = page.locator('app-audio-selector').first();
    await expect(audioSelector).toBeVisible();

    // Screenshot just the audio selector component
    await expect(audioSelector).toHaveScreenshot('audio-selector.png');
  });

  test('should display item selector with play icons', async ({ page }) => {
    // Navigate to Driver Editor which uses Audio Selector
    await TestSetupHelper.waitForLocalization(page, 'en', page.goto('/driver-editor?id=d1'));
    await TestSetupHelper.waitForText(page, 'DRIVER CONFIGURATION');

    // Open the audio selector for one of the sounds
    // Driver Editor has multiple audio selectors, use .first() to target one specifically
    const audioSelector = page.locator('app-audio-selector').first();
    const trigger = audioSelector.locator('.select-wrapper');
    await trigger.click();

    // Wait for item selector to be visible
    // We target the modal-content specifically as app-item-selector might already be in the DOM
    const itemSelector = audioSelector.locator('app-item-selector');
    const modalContent = itemSelector.locator('.modal-content');
    await expect(modalContent).toBeVisible();

    // Ensure at least one sound item is visible with the play icon
    const playButton = itemSelector.locator('.play-preview').first();
    await expect(playButton).toBeVisible();

    // Take a screenshot of the entire modal to verify layout and play icon
    await expect(modalContent).toHaveScreenshot('item-selector-with-play.png');
  });
});
