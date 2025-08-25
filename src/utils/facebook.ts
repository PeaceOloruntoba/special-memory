// util to load the SDK once
export function loadFacebookSDK() {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID as string;
    return new Promise<void>((resolve) => {
      if ((window as any).FB) return resolve();
      (window as any).fbAsyncInit = function () {
        (window as any).FB.init({
          appId,
          cookie: true,
          xfbml: false,
          version: 'v19.0',
        });
        resolve();
      };
      const id = 'facebook-jssdk';
      if (document.getElementById(id)) return resolve();
      const js = document.createElement('script');
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(js);
    });
  }  
