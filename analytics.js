(function () {
  'use strict';

  var measurementId = 'G-PR571RC95P';
  var storageKey = 'captionsgen.analytics-consent.v1';
  var preferenceLifetime = 180 * 24 * 60 * 60 * 1000;
  var production = /^(www\.)?captionsgen\.com$/.test(window.location.hostname);
  var started = false;
  var allowed = false;
  var returnFocus = null;
  var banner;

  function readPreference() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey));
      if (saved && (saved.choice === 'granted' || saved.choice === 'denied') &&
          saved.expires > Date.now() && saved.expires <= Date.now() + preferenceLifetime) {
        return saved.choice;
      }
    } catch (error) { /* A blocked storage area leaves analytics off until a choice is made. */ }
    return null;
  }

  function savePreference(choice) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        choice: choice, expires: Date.now() + preferenceLifetime
      }));
    } catch (error) { /* The visitor's choice still applies to this page. */ }
  }

  function consent(choice) {
    return {
      analytics_storage: choice,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    };
  }

  function startAnalytics() {
    allowed = true;
    if (!production || started) return;
    started = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    // Basic consent mode: do not load Google or send any analytics before opt-in.
    window.gtag('consent', 'default', consent('denied'));
    window.gtag('consent', 'update', consent('granted'));
    window.gtag('js', new Date());

    var page = new URL(window.location.href);
    var campaign = new URLSearchParams();
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content', '_gl'].forEach(function (key) {
      if (page.searchParams.has(key)) campaign.set(key, page.searchParams.get(key));
    });
    var referrer = '';
    try {
      var previousPage = new URL(document.referrer);
      referrer = previousPage.origin + previousPage.pathname;
    } catch (error) { /* There may be no referrer. */ }
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: preferenceLifetime / 1000,
      cookie_update: false,
      page_location: page.origin + page.pathname + (campaign.size ? '?' + campaign.toString() : ''),
      page_referrer: referrer
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', '; domain=' + window.location.hostname, '; domain=captionsgen.com'].forEach(function (domain) {
        document.cookie = name + '=; max-age=0; path=/' + domain + '; SameSite=Lax';
      });
    });
  }

  function stopAnalytics() {
    allowed = false;
    if (!started) return;
    window['ga-disable-' + measurementId] = true;
    window.gtag('consent', 'update', consent('denied'));
    clearAnalyticsCookies();
    // Unload enhanced measurement's listeners as well as our own events.
    window.location.reload();
  }

  function showPreferences(focus) {
    banner.hidden = false;
    var saved = readPreference();
    document.getElementById('analytics-current-choice').textContent = saved === 'granted'
      ? 'Analytics is currently allowed.' : saved === 'denied' ? 'Analytics is currently off.' : '';
    if (focus) banner.querySelector('button').focus();
  }

  function choose(choice) {
    savePreference(choice);
    banner.hidden = true;
    if (choice === 'granted') startAnalytics();
    else stopAnalytics();
    if (returnFocus) returnFocus.focus();
  }

  function init() {
    banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-labelledby', 'analytics-consent-title');
    banner.hidden = true;
    banner.innerHTML = '<div><h2 id="analytics-consent-title">Help us improve Captions Gen?</h2>' +
      '<p>With your permission, Google Analytics measures website visits and clicks on our trial and buy buttons. ' +
      'You can change your choice anytime in the footer. <a href="/privacy.html">Privacy details</a></p>' +
      '<p id="analytics-current-choice"></p></div><div class="analytics-consent-actions">' +
      '<button type="button" data-analytics-choice="denied">Decline</button>' +
      '<button type="button" data-analytics-choice="granted">Allow analytics</button></div>';
    document.body.appendChild(banner);
    var preference = readPreference();
    if (preference === 'granted') startAnalytics();
    else if (preference !== 'denied') showPreferences(false);

    document.addEventListener('click', function (event) {
      var target = event.target.closest && event.target.closest('[data-analytics-choice], [data-analytics-preferences], a[href]');
      if (!target) return;
      if (target.hasAttribute('data-analytics-preferences')) {
        event.preventDefault();
        returnFocus = target;
        showPreferences(true);
        return;
      }
      if (target.hasAttribute('data-analytics-choice')) {
        choose(target.getAttribute('data-analytics-choice'));
        return;
      }
      if (!allowed || !started) return;
      var link = new URL(target.href, window.location.href);
      if (link.hostname !== 'captionsgen.lemonsqueezy.com') return;
      var eventName;
      if (link.pathname === '/checkout/buy/f7d3d370-9a13-4885-a1e1-70fedfa0dece') eventName = 'trial_click';
      if (link.pathname === '/checkout/buy/dbc6cfa2-cee0-40c4-b73f-38efe70b2b63') eventName = 'checkout_click';
      if (!eventName) return;
      window.gtag('event', eventName, {
        send_to: measurementId,
        page_path: window.location.pathname,
        link_placement: (target.closest('[id]') || {}).id || 'guide',
        transport_type: 'beacon'
      });
    });
    window.addEventListener('storage', function (event) {
      if (event.key !== storageKey) return;
      var choice = readPreference();
      if (choice === 'granted') startAnalytics();
      else {
        stopAnalytics();
        if (!choice) showPreferences(false);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
