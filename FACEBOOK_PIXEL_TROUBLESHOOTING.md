# Facebook Pixel Troubleshooting Guide

## Error Analysis
The error you're encountering is related to the Facebook Conversion API, not your client-side implementation.

**Error:** `"Unsupported post request. Object with ID '1515946322709140' does not exist, cannot be loaded due to missing permissions, or does not support this operation."`

## Root Causes & Solutions

### 1. Verify Pixel ID and Permissions

**Step 1: Check Pixel Status**
- Go to [Facebook Business Manager](https://business.facebook.com/)
- Navigate to **Events Manager** → **Data Sources**
- Verify that pixel ID `1515946322709140` exists and is active
- Ensure the pixel is properly configured for your domain

**Step 2: Check Conversion API Access**
- In Events Manager, go to your pixel settings
- Look for **Conversion API** section
- Ensure Conversion API is enabled for this pixel
- Verify you have admin access to the pixel

### 2. Alternative Testing Methods

**Method 1: Use Facebook Pixel Helper (Recommended)**
1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedmfeckfcdbbdfncoo) Chrome extension
2. Visit your website
3. Click the Pixel Helper icon to see if events are firing
4. This will show you real-time event tracking without needing Conversion API

**Method 2: Test Client-Side Events**
Open browser console and test:
```javascript
// Test if pixel is loaded
console.log(window.fbq);

// Test a simple event
fbq('track', 'PageView');

// Test a custom event
fbq('track', 'TestEvent', {test: true});
```

**Method 3: Use Facebook's Test Events Tool**
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2/list/pixel/1515946322709140)
2. Click on your pixel
3. Go to **Test Events** tab
4. Use the **Test Event** tool to send test events

### 3. Fix Conversion API Issues

**If you need Conversion API working:**

1. **Verify Pixel Ownership:**
   - Ensure you're an admin of the Facebook Business Manager account
   - Check that the pixel belongs to your business account

2. **Enable Conversion API:**
   - In Events Manager → Your Pixel → Settings
   - Find **Conversion API** section
   - Click **Set up** or **Configure**
   - Follow the setup wizard

3. **Get Access Token:**
   - You'll need a Facebook App with proper permissions
   - Generate an access token with `ads_management` permission
   - Use this token in your Conversion API calls

### 4. Updated Conversion API Test Command

If you have the correct access token, try this updated command:

```bash
curl -i -X POST \
  "https://graph.facebook.com/v18.0/1515946322709140/events" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{
      "event_name": "TestEvent",
      "event_time": 1234567890,
      "action_source": "website",
      "event_source_url": "https://yourdomain.com",
      "user_data": {
        "client_ip_address": "192.168.1.1",
        "client_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    }],
    "test_event_code": "TEST12345"
  }'
```

### 5. Client-Side Implementation Verification

Your client-side implementation is correct. To verify it's working:

1. **Check Browser Network Tab:**
   - Open Developer Tools → Network tab
   - Navigate through your site
   - Look for requests to `facebook.com/tr`
   - These indicate pixel events are firing

2. **Check Console for Errors:**
   - Look for any JavaScript errors related to `fbq`
   - Ensure no CORS or script loading issues

3. **Test Specific Events:**
   ```javascript
   // In browser console on your site
   fbq('track', 'CompleteRegistration');
   fbq('track', 'Purchase', {value: 29.99, currency: 'USD'});
   fbq('track', 'Lead');
   ```

## Next Steps

1. **Immediate:** Use Facebook Pixel Helper to verify client-side events
2. **Short-term:** Focus on client-side tracking first (it's working)
3. **Long-term:** Set up Conversion API properly if needed for server-side tracking

## Your Implementation Status

✅ **Client-side implementation is complete and correct**
✅ **All 12 standard events are implemented**
✅ **Base pixel code is properly installed**
❌ **Conversion API needs proper configuration**

The client-side tracking should be working fine. The Conversion API error doesn't affect your website's ability to track events through the browser. 