/* ============================================
   ELEMENT REFERENCES
   ============================================ */
const form = document.getElementById('profileForm');
const btn = document.getElementById('generateBtn');
const btnLabel = document.getElementById('btnLabel');
const stage = document.getElementById('cardStage');
const emptyState = document.getElementById('emptyState');
const photoInput = document.getElementById('photo');
const thumb = document.getElementById('thumb');
const fileName = document.getElementById('fileName');

const root = document.documentElement;

let photoDataUrl = '';

/* ============================================
   COLOR HANDLING
   ============================================ */
const accentInput = document.getElementById('accentColor');
const cardInput = document.getElementById('cardColor');
const bgInput = document.getElementById('bgColor');
const accentValue = document.getElementById('accentValue');
const cardValue = document.getElementById('cardValue');
const bgValue = document.getElementById('bgValue');

/**
 * Lightens a hex color by a percentage (0 to 1).
 */
function shadeColor(hex, percent) {
  const n = parseInt(hex.replace('#', ''), 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  r = Math.min(255, Math.max(0, Math.round(r + (255 - r) * percent)));
  g = Math.min(255, Math.max(0, Math.round(g + (255 - g) * percent)));
  b = Math.min(255, Math.max(0, Math.round(b + (255 - b) * percent)));
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function applyAccent(hex) {
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-2', shadeColor(hex, 0.35));
}

function applyCard(hex) {
  root.style.setProperty('--card-bg', hex);
  // Choose border color based on card luminance
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  root.style.setProperty(
    '--card-border',
    brightness > 180 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'
  );
  // Keep avatar border in sync
  document.querySelectorAll('.card-avatar').forEach((a) => {
    a.style.borderColor = hex;
  });
}

function applyBg(hex) {
  root.style.setProperty('--bg', hex);
}

function syncSwatch(input, label) {
  label.textContent = input.value;
  input.parentElement.style.background = input.value;
}

function clearActivePreset(target) {
  document
    .querySelectorAll(`.color-presets[data-target="${target}"] .preset-dot`)
    .forEach((d) => d.classList.remove('active'));
}

// Live updates from native color inputs
accentInput.addEventListener('input', (e) => {
  applyAccent(e.target.value);
  syncSwatch(accentInput, accentValue);
  clearActivePreset('accent');
});

cardInput.addEventListener('input', (e) => {
  applyCard(e.target.value);
  syncSwatch(cardInput, cardValue);
  clearActivePreset('card');
});

bgInput.addEventListener('input', (e) => {
  applyBg(e.target.value);
  syncSwatch(bgInput, bgValue);
  clearActivePreset('bg');
});

// Preset swatches
document.querySelectorAll('.color-presets').forEach((group) => {
  group.addEventListener('click', (e) => {
    const dot = e.target.closest('.preset-dot');
    if (!dot) return;
    const color = dot.dataset.color;
    const target = group.dataset.target;

    if (target === 'accent') {
      accentInput.value = color;
      applyAccent(color);
      syncSwatch(accentInput, accentValue);
    } else if (target === 'card') {
      cardInput.value = color;
      applyCard(color);
      syncSwatch(cardInput, cardValue);
    } else if (target === 'bg') {
      bgInput.value = color;
      applyBg(color);
      syncSwatch(bgInput, bgValue);
    }

    group
      .querySelectorAll('.preset-dot')
      .forEach((d) => d.classList.remove('active'));
    dot.classList.add('active');
  });
});

// Initialize colors on load
applyAccent(accentInput.value);
applyCard(cardInput.value);
applyBg(bgInput.value);

/* ============================================
   PHOTO UPLOAD
   ============================================ */
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    photoDataUrl = ev.target.result;
    thumb.innerHTML = `<img src="${photoDataUrl}" alt="">`;
    fileName.textContent = file.name;
  };
  reader.readAsDataURL(file);
});

/* ============================================
   HELPERS
   ============================================ */
const val = (id) => document.getElementById(id).value.trim();

function initials(first, last) {
  return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?';
}

const icons = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V9h3zM6.5 7.7A1.7 1.7 0 1 1 8.2 6 1.7 1.7 0 0 1 6.5 7.7zM19 19h-3v-5.3c0-1.3-.5-2.2-1.7-2.2-.9 0-1.4.6-1.7 1.2-.1.2-.1.5-.1.8V19h-3V9h3v1.4a3 3 0 0 1 2.7-1.5c2 0 3.5 1.3 3.5 4.1z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-7.1L4.8 22H1.7l8-9.2L1 2h7l4.9 6.5zm-1.2 18h1.9L7.4 3.9H5.3z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M12 22s8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>`,
};

/* ============================================
   CARD BUILDER
   ============================================ */
function buildSocials() {
  const socials = [];
  const gh = val('github');
  const li = val('linkedin');
  const tw = val('twitter');
  const ig = val('instagram');
  const em = val('email');

  if (gh) socials.push({ url: `https://github.com/${gh}`, icon: icons.github, label: 'GitHub' });
  if (li) socials.push({ url: `https://linkedin.com/in/${li}`, icon: icons.linkedin, label: 'LinkedIn' });
  if (tw) socials.push({ url: `https://x.com/${tw}`, icon: icons.twitter, label: 'Twitter' });
  if (ig) socials.push({ url: `https://instagram.com/${ig}`, icon: icons.instagram, label: 'Instagram' });
  if (em) socials.push({ url: `mailto:${em}`, icon: icons.mail, label: 'Email' });

  if (!socials.length) return '';

  return `
    <div class="card-divider"></div>
    <div class="socials">
      ${socials
        .map(
          (s) => `
        <a class="social-btn" href="${s.url}" target="_blank" rel="noopener" title="${s.label}">
          ${s.icon}
        </a>`
        )
        .join('')}
    </div>`;
}

function buildCard(data) {
  const { firstName, lastName, title, bio, gender, location, photo, cardColor } = data;

  const avatarHTML = photo
    ? `<img src="${photo}" alt="${firstName}">`
    : `<div class="initials">${initials(firstName, lastName)}</div>`;

  const metaItems = [];
  if (location) metaItems.push(`<span>${icons.pin}${location}</span>`);
  if (gender) metaItems.push(`<span>${gender}</span>`);

  return `
    <div class="card" style="--card-bg:${cardColor}">
      <div class="card-banner"></div>
      <div class="card-avatar" style="border-color:${cardColor}">${avatarHTML}</div>
      <div class="card-body">
        <div class="card-name">${firstName} ${lastName}</div>
        <div class="card-title">${title}</div>
        ${metaItems.length ? `<div class="card-meta">${metaItems.join('')}</div>` : ''}
        ${bio ? `<p class="card-bio">${bio}</p>` : ''}
        ${buildSocials()}
        <button class="download-btn" onclick="window.print()">Download / Print Card</button>
      </div>
    </div>`;
}

/* ============================================
   SUBMIT / GENERATE
   ============================================ */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  btn.disabled = true;
  btnLabel.textContent = 'Generating…';
  btn.insertAdjacentHTML('afterbegin', `<div class="spinner" id="spinner"></div>`);

  const data = {
    firstName: val('firstName'),
    lastName: val('lastName'),
    title: val('title'),
    bio: val('bio'),
    gender: val('gender'),
    location: val('location'),
    photo: photoDataUrl,
    cardColor: cardInput.value,
  };

  setTimeout(() => {
    emptyState?.remove();
    const existingCard = stage.querySelector('.card');
    if (existingCard) existingCard.remove();

    stage.insertAdjacentHTML('beforeend', buildCard(data));

    const spinner = document.getElementById('spinner');
    if (spinner) spinner.remove();
    btn.disabled = false;
    btnLabel.textContent = 'Generate Card';
  }, 1400);
});