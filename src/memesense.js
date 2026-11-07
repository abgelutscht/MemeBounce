/* MemeSense layout adapter. All module/settings actions use the reference UI. */
(() => {
  'use strict';
  let pending = false;
  const remembered = new Map();
  const cards = menu => [...menu.querySelectorAll('.module-grid > .module-card')];
  const nameOf = card => card.querySelector('.main > span')?.textContent.trim() || '';
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; refresh(); });
  }
  function refresh() {
    const menu = document.querySelector('.clickgui-menu');
    if (!menu) return;
    let toolbar = menu.querySelector('.ms-toolbar');
    if (!toolbar) {
      const brand = document.createElement('div');
      brand.className = 'ms-brand';
      brand.innerHTML = '<span>Meme</span>Sense';
      menu.querySelector('.top-panel').prepend(brand);
      toolbar = document.createElement('div');
      toolbar.className = 'ms-toolbar';
      toolbar.innerHTML = '<label class="ms-enable"><input type="checkbox" aria-label="Enable selected module"><span>Enable</span></label><div class="ms-dropdown"><button type="button" aria-label="Module" aria-expanded="false" class="ms-modules">Choose module</button><div class="ms-module-popup" hidden><input class="ms-module-search" aria-label="Search modules" placeholder="Search modules…" autocomplete="off"><div class="ms-module-options" role="group" aria-label="Modules"></div></div></div><button type="button" class="ms-bind" title="Set the selected module’s keybind">⌨ Bind</button><span class="ms-status" role="status">Settings save automatically</span>';
      menu.querySelector('.top-panel').append(toolbar);
      toolbar.addEventListener('mousedown', event => event.stopPropagation());
      const dropdown = toolbar.querySelector('.ms-dropdown');
      const picker = dropdown.querySelector('.ms-modules');
      const popup = dropdown.querySelector('.ms-module-popup');
      const search = dropdown.querySelector('.ms-module-search');
      picker.addEventListener('click', () => {
        popup.hidden = !popup.hidden;
        picker.setAttribute('aria-expanded', String(!popup.hidden));
        if (!popup.hidden) {
          search.value = '';
          for (const option of dropdown.querySelectorAll('.ms-module-option')) option.hidden = false;
          search.focus();
        }
      });
      search.addEventListener('input', () => {
        const query = search.value.toLowerCase();
        for (const option of dropdown.querySelectorAll('.ms-module-option')) {
          option.hidden = !option.textContent.toLowerCase().includes(query);
        }
      });
      dropdown.querySelector('.ms-module-options').addEventListener('click', event => {
        const option = event.target.closest('.ms-module-option');
        if (!option) return;
        const card = cards(menu).find(item => nameOf(item) === option.dataset.module);
        const category = menu.querySelector('.category-item.selected')?.textContent.trim();
        remembered.set(category, option.dataset.module);
        picker.dataset.value = option.dataset.module;
        popup.hidden = true;
        picker.setAttribute('aria-expanded', 'false');
        card?.querySelector('.settings-icon')?.click();
        picker.focus();
        schedule();
      });
      toolbar.querySelector('input').addEventListener('change', () => {
        selectedCard(menu)?.querySelector('.switch input')?.click();
        schedule();
      });
      toolbar.querySelector('.ms-bind').addEventListener('click', () => {
        selectedCard(menu)?.querySelector('.bind-btn')?.click();
      });
    }
    const all = cards(menu);
    const category = menu.querySelector('.category-item.selected')?.textContent.trim() || '';
    const select = toolbar.querySelector('.ms-modules');
    const signature = JSON.stringify(all.map(nameOf));
    if (select.dataset.signature !== signature) {
      toolbar.querySelector('.ms-module-options').replaceChildren(...all.map(card => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'ms-module-option';
        option.dataset.module = nameOf(card);
        option.textContent = nameOf(card);
        return option;
      }));
      toolbar.querySelector('.ms-module-popup').hidden = true;
      select.setAttribute('aria-expanded', 'false');
      select.dataset.signature = signature;
    }
    const activeName = menu.querySelector('.settings-panel > .module > .name')?.textContent.trim();
    const compact = name => (name || '').replace(/\s+/g, '').toLowerCase();
    const active = all.find(card => compact(nameOf(card)) === compact(activeName));
    if (!active && all.length) {
      const target = all.find(card => nameOf(card) === remembered.get(category)) || all[0];
      target.querySelector('.settings-icon')?.click();
      select.dataset.value = nameOf(target);
    } else if (active) select.dataset.value = nameOf(active);
    const label = select.dataset.value || 'Choose module';
    if (select.textContent !== label) select.textContent = label;
    const card = all.find(item => nameOf(item) === select.dataset.value);
    const toggle = toolbar.querySelector('.ms-enable input');
    toggle.disabled = !card;
    toggle.checked = !!card?.querySelector('.switch input')?.checked;
    // Keep native bind panels visible while the module browser is tucked away.
    menu.classList.toggle('ms-binding', !!menu.querySelector('.bind-panel'));
    for (const item of all) item.classList.toggle('ms-current', item === card);
  }
  function selectedCard(menu) {
    return cards(menu).find(card => nameOf(card) === menu.querySelector('.ms-modules').dataset.value);
  }
  document.addEventListener('click', event => {
    if (event.target.closest('.ms-dropdown')) return;
    closePicker();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.querySelector('.ms-module-popup:not([hidden])')) {
      event.preventDefault();
      event.stopPropagation();
      closePicker();
      document.querySelector('.ms-modules')?.focus();
    }
  }, true);
  function closePicker() {
    const popup = document.querySelector('.ms-module-popup');
    if (popup) popup.hidden = true;
    document.querySelector('.ms-modules')?.setAttribute('aria-expanded', 'false');
  }
  // Display server-confirmed writes; never report a failed request as saved.
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const url = String(args[0]);
    const write = /\/client\/(modules\/(settings|toggle))/.test(url) && /PUT|POST/.test(args[1]?.method || 'GET');
    const status = () => document.querySelector('.ms-status');
    if (write && status()) status().textContent = 'Saving…';
    try {
      const response = await originalFetch(...args);
      if (write && status()) status().textContent = response.ok ? '✓ Saved' : 'Save failed';
      return response;
    } catch (error) {
      if (write && status()) status().textContent = 'Save failed';
      throw error;
    }
  };
  new MutationObserver(schedule).observe(document.getElementById('app'), {
    subtree: true, childList: true, characterData: true,
    attributes: true, attributeFilter: ['class', 'checked']
  });
  schedule();
})();
