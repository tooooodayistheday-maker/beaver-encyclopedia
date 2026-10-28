(() => {
  const local = ['localhost','127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  let started = false;
  const read = () => {try{return localStorage.getItem('beaver-analytics') === 'yes';}catch{return false;}};
  window.beaverAnalytics = {
    start() {
      const id = window.BEAVER_CONFIG?.gaId;
      if(started || local || !read() || !/^G-[A-Z0-9]+$/.test(id || '')) return;
      started = true; window.dataLayer = window.dataLayer || [];
      window.gtag = function(){dataLayer.push(arguments);};
      gtag('js', new Date());
      gtag('config', id, {page_location:location.origin+location.pathname, page_referrer:document.referrer.split(/[?#]/)[0], allow_google_signals:false, allow_ad_personalization_signals:false});
      const script = document.createElement('script'); script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id='+id; document.head.append(script);
    },
    event(name, params={}) { if(started && read()) window.gtag('event',name,params); },
    consent(allow) {try{localStorage.setItem('beaver-analytics',allow?'yes':'no');}catch{} const id=window.BEAVER_CONFIG?.gaId;if(id)window['ga-disable-'+id]=!allow;if(allow)this.start();},
    allowed:read
  };
  window.beaverAnalytics.start();
})();
