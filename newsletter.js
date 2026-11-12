(function () {
  'use strict';

  function init() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;
    var email = form.querySelector('[name="email"]');
    var button = form.querySelector('[type="submit"]');
    var status = document.getElementById('newsletter-status');
    if (!email || !button || !status) return;
    var buttonText = button.textContent;
    var pending = false;
    var subscribed = false;
    button.disabled = false;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (pending || subscribed || !form.reportValidity()) return;
      pending = true;
      button.disabled = true;
      button.textContent = 'Subscribing…';
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Adding you to email updates…';
      status.setAttribute('data-state', 'pending');
      try {
        var response = await fetch('https://api.captionsgen.com/api/subscribe', {
          method: 'POST',
          credentials: 'omit',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: email.value.trim(),
            source: 'website',
            v: '1.1.13',
            consent: 'website-2026-11'
          })
        });
        if (response.status === 429) {
          status.textContent = 'Please wait a minute, then try subscribing again.';
          status.setAttribute('data-state', 'error');
          return;
        }
        var result = await response.json();
        if (!response.ok || !result.ok) throw new Error('Subscription unavailable');
        subscribed = true;
        email.value = '';
        email.disabled = true;
        button.textContent = 'Subscribed';
        status.textContent = 'You’re subscribed to email updates. You can unsubscribe anytime.';
        status.setAttribute('data-state', 'success');
      } catch (error) {
        status.textContent = 'We couldn’t save your signup. Check your connection and try again, or email business@captionsgen.com.';
        status.setAttribute('data-state', 'error');
      } finally {
        pending = false;
        form.removeAttribute('aria-busy');
        button.disabled = subscribed;
        if (!subscribed) button.textContent = buttonText;
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
