import { test, expect } from '@playwright/test';

test.describe('Home to Search to Listing Detail Flow', () => {
  test('should allow user to search from home page and view listing details', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Verify home page loads with search box
    await expect(page.locator('h1')).toContain('Find Your Perfect Sublet');
    await expect(page.locator('input[placeholder*="campus"]')).toBeVisible();
    
    // Fill in search form
    await page.fill('input[placeholder*="campus"]', 'Boston University');
    
    // Wait for and click on autocomplete suggestion
    await page.waitForSelector('[data-testid="campus-option"]', { timeout: 5000 });
    await page.click('[data-testid="campus-option"]');
    
    // Submit search
    await page.click('button[type="submit"]');
    
    // Wait for navigation to search page
    await page.waitForURL('**/search**');
    
    // Verify search page loads
    await expect(page.locator('h2')).toContain('Sublets near Boston University');
    
    // Check map is present
    await expect(page.locator('[data-testid="search-map"]')).toBeVisible();
    
    // Check listing cards are present
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible();
    
    // Click on first listing
    await page.click('[data-testid="listing-card"]');
    
    // Wait for navigation to listing detail
    await page.waitForURL('**/listing/**');
    
    // Verify listing detail page elements
    await expect(page.locator('h1')).toBeVisible(); // Listing title
    await expect(page.locator('[data-testid="listing-photos"]')).toBeVisible();
    await expect(page.locator('[data-testid="listing-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
  });

  test('should show empty state when no listings found', async ({ page }) => {
    // Navigate directly to search with a campus that has no listings
    await page.goto('/search?campus=nonexistent-campus');
    
    // Should show empty state
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('text=No listings found')).toBeVisible();
  });

  test('should apply filters and update results', async ({ page }) => {
    await page.goto('/search?campus=Boston+University');
    
    // Wait for initial results to load
    await page.waitForSelector('[data-testid="listing-card"]');
    const initialCount = await page.locator('[data-testid="listing-card"]').count();
    
    // Open filters drawer
    await page.click('[data-testid="filters-button"]');
    
    // Apply price filter
    await page.fill('input[data-testid="min-price"]', '800');
    await page.fill('input[data-testid="max-price"]', '1200');
    
    // Apply room type filter
    await page.click('input[value="private"]');
    
    // Apply filters
    await page.click('button[data-testid="apply-filters"]');
    
    // Wait for results to update
    await page.waitForTimeout(1000);
    
    // Verify URL includes filter parameters
    await expect(page).toHaveURL(/.*min=800.*max=1200.*room=private.*/);
    
    // Results should be different (potentially fewer)
    const filteredCount = await page.locator('[data-testid="listing-card"]').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});