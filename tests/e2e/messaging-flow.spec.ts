import { test, expect } from '@playwright/test';

test.describe('Messaging Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('auth-user', JSON.stringify({
        id: 'test-user-123',
        email: 'test@example.edu',
        name: 'Test User'
      }));
    });
  });

  test('should initiate conversation from listing detail page', async ({ page }) => {
    // Navigate to a listing detail page
    await page.goto('/listing/mock-listing-1/cozy-2br-near-campus');
    
    // Verify contact section is visible
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
    
    // Fill and submit contact form
    await page.fill('textarea[data-testid="message-input"]', 'Hi! I\'m interested in this place. When can I schedule a viewing?');
    await page.click('button[data-testid="send-message"]');
    
    // Should redirect to messages page with new thread
    await page.waitForURL('**/messages/**');
    
    // Verify the message appears in the conversation
    await expect(page.locator('text=Hi! I\'m interested in this place')).toBeVisible();
    
    // Verify thread info
    await expect(page.locator('[data-testid="thread-listing-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="thread-recipient"]')).toBeVisible();
  });

  test('should display messages page with thread list', async ({ page }) => {
    await page.goto('/messages');
    
    // Verify page loads
    await expect(page.locator('h1')).toContain('Messages');
    
    // Should show thread list
    await expect(page.locator('[data-testid="thread-list"]')).toBeVisible();
    
    // Should show message when no threads exist
    if (await page.locator('[data-testid="no-threads"]').isVisible()) {
      await expect(page.locator('text=No conversations yet')).toBeVisible();
    } else {
      // If threads exist, verify thread cards
      await expect(page.locator('[data-testid="thread-card"]').first()).toBeVisible();
    }
  });

  test('should send and receive messages in conversation', async ({ page }) => {
    // Create a mock thread first by contacting from listing
    await page.goto('/listing/mock-listing-1/cozy-2br-near-campus');
    await page.fill('textarea[data-testid="message-input"]', 'Initial message');
    await page.click('button[data-testid="send-message"]');
    
    await page.waitForURL('**/messages/**');
    
    // Send a new message in the conversation
    await page.fill('textarea[data-testid="conversation-input"]', 'Follow up message about availability');
    await page.click('button[data-testid="send-conversation-message"]');
    
    // Verify message appears in chat
    await expect(page.locator('text=Follow up message about availability')).toBeVisible();
    
    // Verify message is marked as sent by current user
    const lastMessage = page.locator('[data-testid="message-bubble"]').last();
    await expect(lastMessage).toHaveClass(/sent-by-me/);
  });

  test('should navigate between threads', async ({ page }) => {
    await page.goto('/messages');
    
    // Mock multiple threads in localStorage for testing
    await page.evaluate(() => {
      const mockThreads = [
        {
          id: 'thread-1',
          listing: { title: 'Cozy Apartment' },
          otherParticipant: { name: 'Alice Johnson' },
          lastMessage: { body: 'When can I see the place?' },
          unreadCount: 1
        },
        {
          id: 'thread-2', 
          listing: { title: 'Studio Near Campus' },
          otherParticipant: { name: 'Bob Smith' },
          lastMessage: { body: 'Still available?' },
          unreadCount: 0
        }
      ];
      (window as any).mockThreads = mockThreads;
    });
    
    await page.reload();
    
    // Should see multiple threads
    const threadCards = page.locator('[data-testid="thread-card"]');
    await expect(threadCards).toHaveCount(2);
    
    // Click first thread
    await threadCards.first().click();
    
    // Should show conversation for first thread
    await expect(page.locator('text=Cozy Apartment')).toBeVisible();
    await expect(page.locator('text=Alice Johnson')).toBeVisible();
    
    // Click second thread
    await threadCards.nth(1).click();
    
    // Should switch to second conversation
    await expect(page.locator('text=Studio Near Campus')).toBeVisible();
    await expect(page.locator('text=Bob Smith')).toBeVisible();
  });

  test('should show unread message indicators', async ({ page }) => {
    await page.goto('/messages');
    
    // Mock thread with unread messages
    await page.evaluate(() => {
      const mockThread = {
        id: 'thread-unread',
        listing: { title: 'Apartment with Unread' },
        otherParticipant: { name: 'Charlie Brown' },
        lastMessage: { body: 'New message!' },
        unreadCount: 3
      };
      (window as any).mockThreads = [mockThread];
    });
    
    await page.reload();
    
    // Should show unread count badge
    await expect(page.locator('[data-testid="unread-badge"]')).toContain('3');
    
    // Thread should have unread styling
    await expect(page.locator('[data-testid="thread-card"]')).toHaveClass(/unread/);
    
    // Click thread to mark as read
    await page.click('[data-testid="thread-card"]');
    
    // Unread badge should disappear
    await expect(page.locator('[data-testid="unread-badge"]')).not.toBeVisible();
  });

  test('should handle mobile responsive layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/messages');
    
    // On mobile, should show thread list first
    await expect(page.locator('[data-testid="thread-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversation-view"]')).not.toBeVisible();
    
    // Mock thread and click it
    await page.evaluate(() => {
      const mockThread = {
        id: 'mobile-thread',
        listing: { title: 'Mobile Test Listing' },
        otherParticipant: { name: 'Mobile User' },
        lastMessage: { body: 'Mobile test message' }
      };
      (window as any).mockThreads = [mockThread];
    });
    
    await page.reload();
    await page.click('[data-testid="thread-card"]');
    
    // Should switch to conversation view on mobile
    await expect(page.locator('[data-testid="conversation-view"]')).toBeVisible();
    await expect(page.locator('[data-testid="thread-list"]')).not.toBeVisible();
    
    // Should have back button
    await expect(page.locator('[data-testid="back-to-threads"]')).toBeVisible();
    
    // Clicking back should return to thread list
    await page.click('[data-testid="back-to-threads"]');
    await expect(page.locator('[data-testid="thread-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="conversation-view"]')).not.toBeVisible();
  });

  test('should require authentication for messaging', async ({ page }) => {
    // Clear auth state
    await page.evaluate(() => localStorage.removeItem('auth-user'));
    
    // Try to access messages page
    await page.goto('/messages');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
    
    // Try to access specific thread
    await page.goto('/messages/some-thread-id');
    await expect(page).toHaveURL(/.*login.*/);
  });
});