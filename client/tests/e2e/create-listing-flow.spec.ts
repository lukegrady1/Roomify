import { test, expect } from '@playwright/test';

test.describe('Create Listing Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
    await page.goto('/');
    
    // Mock user login - in a real app this would use proper auth
    await page.evaluate(() => {
      localStorage.setItem('auth-user', JSON.stringify({
        id: 'test-user-123',
        email: 'test@example.edu',
        name: 'Test User'
      }));
    });
  });

  test('should require authentication to access create listing page', async ({ page }) => {
    // Clear auth state
    await page.evaluate(() => localStorage.removeItem('auth-user'));
    
    // Try to access create listing page
    await page.goto('/list-your-place');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
    await expect(page.locator('text=Sign in')).toBeVisible();
  });

  test('should complete create listing flow with all steps', async ({ page }) => {
    await page.goto('/list-your-place');
    
    // Step 1: Basic Information
    await expect(page.locator('h2')).toContain('Tell us about your place');
    
    await page.fill('input[name="title"]', 'Cozy 2BR Near Campus');
    await page.fill('textarea[name="description"]', 'Beautiful apartment with great natural light, walking distance to campus.');
    await page.selectOption('select[name="roomType"]', 'private');
    await page.fill('input[name="bedrooms"]', '2');
    await page.fill('input[name="bathrooms"]', '1');
    
    await page.click('button[data-testid="next-step"]');
    
    // Step 2: Location
    await expect(page.locator('h2')).toContain('Where is your place');
    
    await page.fill('input[name="addressLine1"]', '123 Main Street');
    await page.fill('input[name="city"]', 'Boston');
    await page.selectOption('select[name="state"]', 'MA');
    await page.fill('input[name="postalCode"]', '02215');
    
    // Select campus
    await page.fill('input[name="campus"]', 'Boston University');
    await page.waitForSelector('[data-testid="campus-option"]');
    await page.click('[data-testid="campus-option"]');
    
    await page.click('button[data-testid="next-step"]');
    
    // Step 3: Photos
    await expect(page.locator('h2')).toContain('Add some photos');
    
    // Mock file upload
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([{
      name: 'test-photo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    }]);
    
    // Wait for upload indicator
    await expect(page.locator('[data-testid="photo-preview"]')).toBeVisible();
    
    await page.click('button[data-testid="next-step"]');
    
    // Step 4: Pricing and Availability
    await expect(page.locator('h2')).toContain('Set your price');
    
    await page.fill('input[name="price"]', '1200');
    
    // Set move-in date
    await page.click('input[name="moveIn"]');
    await page.click('button[aria-label="June 1, 2025"]');
    
    // Set move-out date  
    await page.click('input[name="moveOut"]');
    await page.click('button[aria-label="August 31, 2025"]');
    
    // Select amenities
    await page.click('input[value="wifi"]');
    await page.click('input[value="laundry"]');
    await page.click('input[value="parking"]');
    
    await page.click('button[data-testid="next-step"]');
    
    // Step 5: Review and Publish
    await expect(page.locator('h2')).toContain('Review your listing');
    
    // Verify details are displayed correctly
    await expect(page.locator('text=Cozy 2BR Near Campus')).toBeVisible();
    await expect(page.locator('text=$1,200/month')).toBeVisible();
    await expect(page.locator('text=2 bedrooms')).toBeVisible();
    await expect(page.locator('text=Boston University')).toBeVisible();
    
    // Publish listing
    await page.click('button[data-testid="publish-listing"]');
    
    // Should redirect to listing detail page
    await page.waitForURL('**/listing/**');
    
    // Verify the created listing
    await expect(page.locator('h1')).toContain('Cozy 2BR Near Campus');
    await expect(page.locator('[data-testid="listing-price"]')).toContain('$1,200');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/list-your-place');
    
    // Try to proceed without filling required fields
    await page.click('button[data-testid="next-step"]');
    
    // Should show validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should allow saving draft and resuming later', async ({ page }) => {
    await page.goto('/list-your-place');
    
    // Fill some fields
    await page.fill('input[name="title"]', 'Draft Listing');
    await page.fill('textarea[name="description"]', 'This is a draft');
    
    // Save as draft
    await page.click('button[data-testid="save-draft"]');
    
    // Should show confirmation
    await expect(page.locator('text=Draft saved')).toBeVisible();
    
    // Navigate away and back
    await page.goto('/');
    await page.goto('/list-your-place');
    
    // Should resume with saved data
    await expect(page.locator('input[name="title"]')).toHaveValue('Draft Listing');
    await expect(page.locator('textarea[name="description"]')).toHaveValue('This is a draft');
  });
});