import { test, expect } from '@playwright/test';
import { TestSetupHelper } from '../../testing/test-setup_helper';

test.describe('Raceday Visuals for Empty Lanes', () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console logs from the browser
    page.on('console', msg => console.log(`BROWSER [${msg.type()}]: ${msg.text()}`));
    page.on('pageerror', err => console.error(`BROWSER ERROR: ${err.message}`));

    // Setup standard mocks
    await TestSetupHelper.setupStandardMocks(page);
    await TestSetupHelper.setupRaceMocks(page);
    await TestSetupHelper.setupAssetMocks(page);
    await TestSetupHelper.disableAnimations(page);
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.waitForLoadState('networkidle');

    // Setup settings with many columns to verify they all hide for empty lanes
    await TestSetupHelper.setupSettings(page, {
      racedayColumns: ['driver.name', 'driver.nickname', 'seed', 'rankHeat', 'rankOverall', 'lapCount', 'participant.fuelLevel'],
      columnLayouts: {
        'driver.name': { 'CenterCenter': 'driver.name' },
        'driver.nickname': { 'CenterCenter': 'driver.nickname' },
        'seed': { 'CenterCenter': 'seed' },
        'rankHeat': { 'CenterCenter': 'rankHeat' },
        'rankOverall': { 'CenterCenter': 'rankOverall' },
        'lapCount': { 'CenterCenter': 'lapCount' },
        'participant.fuelLevel': { 'CenterCenter': 'participant.fuelLevel' }
      },
      columnAnchors: {
        'driver.name': 'Center',
        'driver.nickname': 'Center',
        'seed': 'Center',
        'rankHeat': 'Center',
        'rankOverall': 'Center',
        'lapCount': 'Center',
        'participant.fuelLevel': 'Center'
      },
      columnWidths: {
        'driver.name': 200,
        'driver.nickname': 200,
        'seed': 80,
        'rankHeat': 80,
        'rankOverall': 80,
        'lapCount': 80,
        'participant.fuelLevel': 80
      },
      columnVisibility: {}
    });
  });

  test('should hide specific column values for empty lanes', async ({ page }) => {
    await TestSetupHelper.waitForLocalization(page, 'en', page.goto('/default-raceday'));

    // Wait for the scalable content to be visible
    await expect(page.locator('.scalable-content')).toBeVisible();

    // Inject race data with one real driver and one empty driver
    await page.evaluate(() => {
      const raceData = {
        race: {
          race: {
            model: { entityId: 'r1' },
            name: 'Empty Lane Test GP',
            track: {
              model: { entityId: 't1' },
              name: 'Test Track',
              lanes: [
                { objectId: 'l1', length: 10, backgroundColor: '#550000', foregroundColor: '#ffffff' },
                { objectId: 'l2', length: 10, backgroundColor: '#005500', foregroundColor: '#ffffff' }
              ]
            }
          },
          drivers: [
            {
              objectId: 'rp1',
              seed: 5,
              rank: 10,
              driver: {
                model: { entityId: 'd1' },
                name: 'Real Driver',
                nickname: 'Speedy'
              }
            },
            {
              objectId: 'rp_empty',
              seed: 0, // Should be ignored/hidden
              driver: {
                model: { entityId: '' }, // Empty entityId indicates empty driver
                name: 'Empty',
                nickname: 'Empty'
              }
            }
          ],
          currentHeat: {
            objectId: 'h1',
            heatNumber: 1,
            heatDrivers: [
              {
                objectId: 'hd1',
                laneIndex: 0,
                driver: {
                  objectId: 'rp1',
                  seed: 5,
                  driver: { model: { entityId: 'd1' }, name: 'Real Driver', nickname: 'Speedy' }
                }
              },
              {
                objectId: 'hd2',
                laneIndex: 1,
                driver: {
                  objectId: 'rp_empty',
                  seed: 0,
                  driver: { model: { entityId: '' }, name: 'Empty', nickname: 'Empty' }
                }
              }
            ]
          }
        }
      };
      // @ts-ignore
      window.mockRaceData(raceData);
    });

    // Wait for the component to process the update
    await page.waitForTimeout(1000);

    // Verify "Real Driver" shows seed (5)
    await expect(page.locator('text=(5)')).toBeVisible({ timeout: 10000 });

    // Verify "Empty Lane" text is present (localized)
    // Note: English localized RD_EMPTY_LANE is "Empty Lane"
    await expect(page.locator('text=Empty Lane').first()).toBeVisible({ timeout: 10000 });

    // Take screenshot to verify seed and other columns are empty for the empty lane
    await expect(page).toHaveScreenshot('raceday-empty-lanes.png', { maxDiffPixelRatio: 0.1 });
  });
});
