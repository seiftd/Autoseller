import { Product, SocialAccount } from '../types';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

// Scopes required for full functionality
const REQUIRED_SCOPES = [
  'public_profile',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'pages_manage_metadata',
  'pages_messaging',
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_comments',
  'instagram_manage_messages'
];

export const facebookService = {
  
  isInitialized: false,

  init: (appId: string): Promise<void> => {
    return new Promise((resolve) => {
      if (window.FB) {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        facebookService.isInitialized = true;
        resolve();
        return;
      }

      window.fbAsyncInit = function() {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        facebookService.isInitialized = true;
        resolve();
      };

      // Load SDK
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement; 
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        if (fjs && fjs.parentNode) {
            fjs.parentNode.insertBefore(js, fjs);
        } else {
            d.head.appendChild(js);
        }
      }(document, 'script', 'facebook-jssdk'));
    });
  },

  login: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!facebookService.isInitialized) {
        reject("Facebook SDK not initialized. Please configure App ID.");
        return;
      }

      window.FB.login((response: any) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }, { scope: REQUIRED_SCOPES.join(',') });
    });
  },

  // Get Pages and linked IG Accounts
  getAccounts: async (userAccessToken: string): Promise<SocialAccount[]> => {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/accounts?fields=name,access_token,id,instagram_business_account,picture&access_token=${userAccessToken}`);
      const data = await response.json();
      
      if (data.error) throw data.error;

      const accounts: SocialAccount[] = [];

      data.data.forEach((page: any) => {
        // Facebook Page
        accounts.push({
          id: page.id,
          platform: 'Facebook',
          name: page.name,
          connected: true,
          lastSync: Date.now(),
          accessToken: page.access_token,
          pageId: page.id,
          avatarUrl: page.picture?.data?.url
        });

        // Instagram Business (if linked)
        if (page.instagram_business_account) {
          accounts.push({
             id: page.instagram_business_account.id,
             platform: 'Instagram',
             name: `${page.name} (IG)`,
             connected: true,
             lastSync: Date.now(),
             accessToken: page.access_token, // IG uses Page Token
             pageId: page.id,
             instagramId: page.instagram_business_account.id
          });
        }
      });

      return accounts;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  },

  // Publish Product to Facebook Page
  publishToFacebook: async (account: SocialAccount, product: Product): Promise<string> => {
    const images = product.images || (product.imageUrl ? [product.imageUrl] : []);
    const message = `${product.name}\n\n${product.description}\n\nPrice: ${product.price} ${product.currency}\n\n${product.hashtags.join(' ')}`;

    if (images.length === 0) throw new Error("No images to publish");

    // Scenario A: Single Image
    if (images.length === 1) {
        const url = `https://graph.facebook.com/v18.0/${account.pageId}/photos`;
        const formData = new FormData();
        formData.append('url', images[0]);
        formData.append('message', message);
        formData.append('access_token', account.accessToken!);

        const res = await fetch(url, { method: 'POST', body: formData });
        const data = await res.json();
        if(data.error) throw data.error;
        return data.post_id || data.id;
    }

    // Scenario B: Multi Image (Album)
    // 1. Upload photos with published=false
    const mediaIds = await Promise.all(images.map(async (img) => {
        const url = `https://graph.facebook.com/v18.0/${account.pageId}/photos`;
        const formData = new FormData();
        formData.append('url', img);
        formData.append('published', 'false');
        formData.append('access_token', account.accessToken!);
        const res = await fetch(url, { method: 'POST', body: formData });
        const data = await res.json();
        if(data.error) throw data.error;
        return data.id;
    }));

    // 2. Publish Feed Post with attached_media
    const feedUrl = `https://graph.facebook.com/v18.0/${account.pageId}/feed`;
    const feedData = new FormData();
    feedData.append('message', message);
    feedData.append('access_token', account.accessToken!);
    mediaIds.forEach((id, index) => {
        feedData.append(`attached_media[${index}]`, JSON.stringify({ media_fbid: id }));
    });

    const feedRes = await fetch(feedUrl, { method: 'POST', body: feedData });
    const feedResult = await feedRes.json();
    if(feedResult.error) throw feedResult.error;
    return feedResult.id;
  },

  // Publish to Instagram (Carousel or Single)
  publishToInstagram: async (account: SocialAccount, product: Product): Promise<string> => {
    if (!account.instagramId) throw new Error("No Instagram Business ID found");
    
    const images = product.images || (product.imageUrl ? [product.imageUrl] : []);
    const caption = `${product.name}\n.\n${product.description}\n.\nPrice: ${product.price} ${product.currency}\n.\n${product.hashtags.join(' ')}`;
    
    // Helper to create Item Container
    const createContainer = async (imageUrl: string, isCarouselItem = false) => {
        const url = `https://graph.facebook.com/v18.0/${account.instagramId}/media`;
        const params = new URLSearchParams({
            image_url: imageUrl,
            access_token: account.accessToken!,
            ...(isCarouselItem ? { is_carousel_item: 'true' } : { caption: caption })
        });
        const res = await fetch(`${url}?${params}`, { method: 'POST' });
        const data = await res.json();
        if(data.error) throw data.error;
        return data.id;
    };

    let creationId = '';

    if (images.length === 1) {
        // Single Image
        creationId = await createContainer(images[0]);
    } else {
        // Carousel
        // 1. Create containers for each image
        const itemIds = await Promise.all(images.slice(0, 10).map(img => createContainer(img, true))); // IG max 10
        
        // 2. Create Carousel Container
        const url = `https://graph.facebook.com/v18.0/${account.instagramId}/media`;
        const params = new URLSearchParams({
            media_type: 'CAROUSEL',
            caption: caption,
            children: itemIds.join(','),
            access_token: account.accessToken!
        });
        const res = await fetch(`${url}?${params}`, { method: 'POST' });
        const data = await res.json();
        if(data.error) throw data.error;
        creationId = data.id;
    }

    // 3. Publish Container
    const publishUrl = `https://graph.facebook.com/v18.0/${account.instagramId}/media_publish`;
    const pubParams = new URLSearchParams({
        creation_id: creationId,
        access_token: account.accessToken!
    });
    const pubRes = await fetch(`${publishUrl}?${pubParams}`, { method: 'POST' });
    const pubData = await pubRes.json();
    if(pubData.error) throw pubData.error;
    
    return pubData.id;
  },

  // Reply to Comment (Facebook or IG)
  replyToComment: async (commentId: string, message: string, accessToken: string) => {
    try {
        const url = `https://graph.facebook.com/v18.0/${commentId}/replies`;
        const params = new URLSearchParams({
            message: message,
            access_token: accessToken
        });
        const res = await fetch(`${url}?${params}`, { method: 'POST' });
        return await res.json();
    } catch (e) {
        console.error("Reply Error", e);
        throw e;
    }
  }
};