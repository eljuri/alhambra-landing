(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     Navegación: fondo al hacer scroll y menú móvil
     ------------------------------------------------------------------------ */

  const nav = document.getElementById('nav');
  const toggle = nav.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  const toggleIcon = toggle.querySelector('i');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.style.setProperty('--scroll', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    toggleIcon.className = open ? 'ph ph-x' : 'ph ph-list';
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) setMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  const film = document.querySelector('.hero__video');
  if (film && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    film.removeAttribute('autoplay');
    film.pause();
  }

  /* ------------------------------------------------------------------------
     Agenda de eventos
     Primero los próximos (del más cercano al más lejano) y después los que
     ya pasaron, marcados como «Finalizado». Si no queda ninguno por venir,
     el título cambia a «Eventos recientes». En escritorio se muestra un
     evento a la vez con su afiche completo y una línea de tiempo para
     saltar entre ellos; avanza solo mientras la agenda está en pantalla.
     ------------------------------------------------------------------------ */

  const agenda = document.querySelector('[data-agenda]');

  if (agenda) {
    const section = agenda.closest('section');
    const list = agenda.querySelector('.agenda__list');
    const DAY = 86400000;
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const parse = (value) => new Date(value.includes('T') ? value : `${value}T00:00`);
    const all = Array.from(list.children, (el) => ({ el, date: parse(el.dataset.date) }));
    const upcoming = all.filter((s) => s.date >= today).sort((a, b) => a.date - b.date);
    const past = all.filter((s) => s.date < today).sort((a, b) => b.date - a.date);
    const slots = [...upcoming, ...past];

    const statusOf = (date) => {
      const day = new Date(date);
      day.setHours(0, 0, 0, 0);
      const diff = Math.round((day - today) / DAY);
      if (diff < 0) return 'Finalizado';
      if (diff === 0) return 'Hoy';
      if (diff === 1) return 'Mañana';
      return `En ${diff} días`;
    };

    slots.forEach((s) => {
      list.append(s.el);
      s.status = statusOf(s.date);
      s.title = s.el.querySelector('.slot__title').textContent.trim();
      s.el.classList.toggle('is-past', s.date < today);
      s.el.classList.toggle('is-soon', s.date >= today && s.date - today < 8 * DAY);
      s.el.querySelector('[data-status]').textContent = s.status;
    });
    // El carrusel móvil sigue «enganchado» al que era el primero; vuelve al inicio
    list.scrollLeft = 0;

    // Cuenta regresiva al siguiente evento que aún no empieza
    const countdown = section.querySelector('[data-countdown]');
    const next = upcoming.find((s) => s.date > now);
    if (countdown && next) {
      countdown.hidden = false;
      countdown.querySelector('[data-countdown-name]').textContent = next.title;
      const units = {};
      countdown.querySelectorAll('[data-unit]').forEach((el) => { units[el.dataset.unit] = el; });

      const render = () => {
        const ms = Math.max(next.date - Date.now(), 0);
        const values = {
          d: Math.floor(ms / DAY),
          h: Math.floor(ms / 3600000) % 24,
          m: Math.floor(ms / 60000) % 60,
          s: Math.floor(ms / 1000) % 60,
        };
        Object.entries(values).forEach(([key, value]) => {
          const el = units[key];
          const text = String(value).padStart(2, '0');
          if (el.textContent === text) return;
          el.textContent = text;
          if (!reduceMotion.matches) {
            el.animate(
              [{ transform: 'translateY(-40%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
              { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            );
          }
        });
      };
      render();
      setInterval(render, 1000);
    }

    // Escritorio: un «cine» con el evento activo y una línea de tiempo en
    // orden cronológico. Se arma con el contenido de cada ítem; la lista
    // queda para móvil (el CSS decide cuál se ve).
    const chrono = [...all].sort((a, b) => a.date - b.date);
    const total = chrono.length;
    const pad = (n) => String(n).padStart(2, '0');

    const cinema = document.createElement('div');
    cinema.className = 'cinema';

    const panels = chrono.map((s) => {
      const panel = document.createElement('article');
      panel.className = 'cinema__panel';
      panel.classList.toggle('is-past', s.el.classList.contains('is-past'));
      panel.classList.toggle('is-soon', s.el.classList.contains('is-soon'));
      panel.setAttribute('aria-label', s.title);

      const src = s.el.querySelector('.slot__img');
      const glow = src.cloneNode();
      glow.className = 'cinema__glow';
      const media = document.createElement('div');
      media.className = 'cinema__media';
      const poster = src.cloneNode();
      poster.className = 'cinema__poster';
      poster.alt = s.title;
      media.append(poster);

      const date = document.createElement('p');
      date.className = 'cinema__date';
      const day = document.createElement('span');
      day.className = 'cinema__day';
      day.textContent = s.el.querySelector('.slot__day').textContent;
      const month = document.createElement('span');
      month.className = 'cinema__month';
      month.textContent = `${s.el.querySelector('.slot__month').textContent} ${s.date.getFullYear()}`;
      date.append(day, month);

      const link = s.el.querySelector('.slot__link').cloneNode(true);
      link.className = 'btn btn--light';
      link.querySelector('i').className = 'ph ph-arrow-right';

      const info = document.createElement('div');
      info.className = 'cinema__info';
      const parts = [date, ...Array.from(s.el.querySelector('.slot__info').children, (n) => n.cloneNode(true)), link];
      parts.forEach((node, i) => {
        node.removeAttribute('id');
        const line = document.createElement('div');
        line.className = 'cinema__line';
        const lift = document.createElement('div');
        lift.className = 'cinema__lift';
        lift.style.setProperty('--d', String(i));
        lift.append(node);
        line.append(lift);
        info.append(line);
      });

      panel.append(glow, info, media);
      cinema.append(panel);
      return panel;
    });

    const timeline = document.createElement('div');
    timeline.className = 'timeline';
    timeline.innerHTML =
      '<div class="timeline__nav">' +
      '<button type="button" class="timeline__arrow" data-step="-1" aria-label="Evento anterior"><i class="ph ph-arrow-left" aria-hidden="true"></i></button>' +
      '<p class="timeline__count" aria-hidden="true"><b></b> / <span></span></p>' +
      '<button type="button" class="timeline__arrow" data-step="1" aria-label="Evento siguiente"><i class="ph ph-arrow-right" aria-hidden="true"></i></button>' +
      '</div>' +
      '<div class="timeline__track"><span class="timeline__line"><span class="timeline__fill"></span></span><ol class="timeline__stops"></ol></div>';

    const track = timeline.querySelector('.timeline__track');
    const stopsList = timeline.querySelector('.timeline__stops');
    const countNow = timeline.querySelector('.timeline__count b');
    timeline.querySelector('.timeline__count span').textContent = pad(total);
    track.style.setProperty('--n', String(total));

    const stops = chrono.map((s, i) => {
      const li = document.createElement('li');
      const stop = document.createElement('button');
      stop.type = 'button';
      stop.className = 'timeline__stop';
      stop.classList.toggle('is-past', s.el.classList.contains('is-past'));
      const when = `${s.el.querySelector('.slot__day').textContent} ${s.el.querySelector('.slot__month').textContent}`;
      stop.setAttribute('aria-label', `${s.title}, ${when}`);
      stop.innerHTML = '<span class="timeline__dot"></span><b class="timeline__when"></b><span class="timeline__name"></span>';
      stop.querySelector('.timeline__when').textContent = when;
      stop.querySelector('.timeline__name').textContent = s.title;
      stop.addEventListener('click', () => select(i));
      li.append(stop);
      stopsList.append(li);
      return stop;
    });

    // «Hoy» va entre el último evento pasado y el primero por venir
    const passed = chrono.filter((s) => s.date < today).length;
    const todayMark = document.createElement('span');
    todayMark.className = 'timeline__today';
    todayMark.textContent = 'Hoy';
    const at = passed === 0 ? 'calc(50% / var(--n) - 32px)'
      : passed === total ? 'calc(100% - 50% / var(--n) + 32px)'
        : `${(passed / total) * 100}%`;
    todayMark.style.setProperty('--today', at);
    track.append(todayMark);

    // «Ver todos los eventos» cierra la línea de tiempo, dentro del cine
    const moreLink = section.querySelector('.events__more a');
    if (moreLink) {
      const more = document.createElement('div');
      more.className = 'timeline__more';
      const link = moreLink.cloneNode(true);
      link.classList.replace('btn--dark', 'btn--light');
      more.append(link);
      timeline.append(more);
    }

    // La línea de tiempo va dentro del cine, sobre el mismo fondo
    cinema.append(timeline);
    agenda.prepend(cinema);
    agenda.classList.add('is-enhanced');

    const AUTO = 7000;
    let current = -1;
    let elapsed = 0;

    const setFill = () => {
      const p = total > 1 ? Math.min((current + elapsed / AUTO) / (total - 1), 1) : 1;
      track.style.setProperty('--p', p.toFixed(4));
    };

    const select = (index) => {
      elapsed = 0;
      if (index !== current) {
        const prev = current;
        current = index;
        panels.forEach((panel, i) => {
          panel.classList.toggle('is-active', i === index);
          panel.classList.toggle('is-leaving', i === prev);
          panel.inert = i !== index;
        });
        stops.forEach((stop, i) => {
          if (i === index) stop.setAttribute('aria-current', 'true');
          else stop.removeAttribute('aria-current');
        });
        countNow.textContent = pad(index + 1);
      }
      setFill();
    };

    timeline.querySelectorAll('[data-step]').forEach((btn) => {
      btn.addEventListener('click', () => select((current + Number(btn.dataset.step) + total) % total));
    });
    stopsList.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const index = (current + (e.key === 'ArrowRight' ? 1 : -1) + total) % total;
      select(index);
      stops[index].focus();
    });

    // Empieza en el próximo evento; si ya pasaron todos, en el más reciente
    select(passed < total ? passed : total - 1);

    // Avance automático mientras la agenda está en pantalla y nadie interactúa
    const desktop = window.matchMedia('(min-width: 961px)');
    let inView = false;
    let paused = false;
    let last = 0;
    let raf = 0;
    let restartSlide = () => {};

    const canAuto = () => inView && !paused && desktop.matches && !reduceMotion.matches
      && total > 1 && !document.hidden;

    const loop = (t) => {
      raf = 0;
      if (!canAuto()) return;
      if (last) elapsed += t - last;
      last = t;
      if (elapsed >= AUTO) select((current + 1) % total);
      else setFill();
      raf = requestAnimationFrame(loop);
    };

    const resume = () => {
      if (raf || !canAuto()) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        resume();
        restartSlide();
      }, { threshold: 0.35 }).observe(agenda);
    }
    agenda.addEventListener('pointerenter', () => { paused = true; });
    agenda.addEventListener('pointerleave', () => { paused = agenda.contains(document.activeElement); resume(); });
    agenda.addEventListener('focusin', () => { paused = true; });
    agenda.addEventListener('focusout', (e) => {
      if (agenda.contains(e.relatedTarget)) return;
      paused = agenda.matches(':hover');
      resume();
    });
    document.addEventListener('visibilitychange', resume);
    desktop.addEventListener('change', resume);

    // El afiche y su fondo se desplazan en sentidos opuestos según el mouse
    cinema.addEventListener('pointermove', (e) => {
      const r = cinema.getBoundingClientRect();
      cinema.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      cinema.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    cinema.addEventListener('pointerleave', () => {
      cinema.style.setProperty('--mx', '0');
      cinema.style.setProperty('--my', '0');
    });

    // Móvil: puntos que siguen el carrusel
    if (slots.length > 1) {
      const dots = document.createElement('div');
      dots.className = 'agenda__dots';
      dots.setAttribute('aria-hidden', 'true');
      slots.forEach(() => dots.append(document.createElement('span')));
      list.after(dots);
      const marks = Array.from(dots.children);
      const sync = () => {
        const step = slots[1].el.offsetLeft - slots[0].el.offsetLeft || 1;
        const index = Math.min(Math.round(list.scrollLeft / step), marks.length - 1);
        marks.forEach((m, i) => m.classList.toggle('is-on', i === index));
      };
      sync();
      list.addEventListener('scroll', sync, { passive: true });
    }

    // Móvil: el carrusel también avanza solo; si alguien lo toca, el conteo vuelve a empezar
    let timer = 0;
    const canSlide = () => inView && !desktop.matches && !reduceMotion.matches
      && slots.length > 1 && !document.hidden;

    const slide = () => {
      const step = slots[1].el.offsetLeft - slots[0].el.offsetLeft || 1;
      const index = Math.round(list.scrollLeft / step);
      const atEnd = index >= slots.length - 1
        || list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
      list.scrollTo({ left: atEnd ? 0 : (index + 1) * step, behavior: 'smooth' });
    };

    restartSlide = () => {
      clearInterval(timer);
      timer = canSlide() ? setInterval(slide, AUTO) : 0;
    };

    list.addEventListener('pointerdown', restartSlide, { passive: true });
    list.addEventListener('touchstart', restartSlide, { passive: true });
    document.addEventListener('visibilitychange', restartSlide);
    desktop.addEventListener('change', restartSlide);
    restartSlide();
  }

  /* ------------------------------------------------------------------------
     Revelado al entrar en viewport
     ------------------------------------------------------------------------ */

  const revealItems = document.querySelectorAll('.reveal');

  // Escalona los elementos hermanos de una misma lista
  document.querySelectorAll('.grid').forEach((list) => {
    Array.from(list.children).forEach((item, i) => {
      item.style.setProperty('--delay', `${(i % 4) * 0.08}s`);
    });
  });

  // En «Descubre» el retraso depende de la columna, así cada fila entra de izquierda a derecha
  document.querySelectorAll('.discover__grid').forEach((list) => {
    const box = list.getBoundingClientRect();
    Array.from(list.children).forEach((item) => {
      const left = (item.getBoundingClientRect().left - box.left) / box.width;
      item.style.setProperty('--delay', `${(left * 0.36).toFixed(2)}s`);
    });
  });

  // Cuando termina el revelado se quita la clase para que el hover recupere su transición
  const settle = (el) => {
    el.classList.remove('reveal', 'is-visible');
    el.style.removeProperty('--delay');
  };

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach(settle);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        // En los encabezados escalonados la última transición es la del último hijo
        const last = el.classList.contains('reveal--stagger') ? el.lastElementChild : el;
        el.addEventListener('transitionend', (ev) => {
          if (ev.target === last && ev.propertyName === 'opacity') settle(el);
        });
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    revealItems.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     Filas de logos: se repiten hasta cubrir el ancho y se duplican una vez
     más para que el recorrido a -50% sea continuo. La velocidad es la
     misma en todas las filas aunque tengan distinta cantidad de logos.
     ------------------------------------------------------------------------ */

  const marquees = document.querySelectorAll('[data-marquee]');
  const SPEED = 40; // px por segundo

  // Los logos anchos se achican y los cuadrados crecen: misma presencia visual
  document.querySelectorAll('.marquee__track img').forEach((img) => {
    const w = Number(img.getAttribute('width'));
    const h = Number(img.getAttribute('height'));
    const ratio = w && h ? w / h : 2.5;
    img.style.setProperty('--k', Math.min(Math.max(ratio ** -0.42, 0.34), 1).toFixed(3));
  });

  const buildMarquee = (marquee) => {
    const track = marquee.querySelector('.marquee__track');
    const originals = Array.from(track.querySelectorAll('li:not([aria-hidden])'));
    track.replaceChildren(...originals);

    const addCopy = () => originals.forEach((li) => {
      const copy = li.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.append(copy);
    });

    for (let i = 0; i < 20 && track.scrollWidth < marquee.clientWidth; i++) addCopy();
    const half = track.scrollWidth;
    if (!half) return;
    Array.from(track.children).forEach((li) => {
      const copy = li.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.append(copy);
    });

    marquee.style.setProperty('--marquee-duration', `${half / SPEED}s`);
    marquee.classList.add('is-ready');
  };

  if (marquees.length) {
    // Espera a las imágenes para medir anchos reales
    window.addEventListener('load', () => {
      marquees.forEach(buildMarquee);
      let width = window.innerWidth;
      window.addEventListener('resize', () => {
        if (window.innerWidth === width) return;
        width = window.innerWidth;
        marquees.forEach(buildMarquee);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Movimiento ligado al scroll
     - Hero: --hero-p va de 0 a 1 mientras sale de pantalla (lo usa el CSS).
     - Descubre: cada foto se desplaza dentro de su marco (--py).
     - Logos: las filas aceleran con la velocidad del scroll y, al subir
       rápido, giran al revés. Al soltar vuelven solas a su ritmo.
     ------------------------------------------------------------------------ */

  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const hero = document.querySelector('.hero--film');
    const tracks = Array.from(document.querySelectorAll('.marquee__track'));
    const frames = new Set();

    const frameIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) frames.add(entry.target);
        else frames.delete(entry.target);
      });
    });
    document.querySelectorAll('.discover__frame').forEach((frame) => frameIO.observe(frame));

    let lastY = window.scrollY;
    let velocity = 0; // px por cuadro, suavizado
    let running = false;

    const setRate = (rate) => tracks.forEach((track) => {
      track.getAnimations().forEach((anim) => { anim.playbackRate = rate; });
    });

    const tick = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      velocity = velocity * 0.88 + (y - lastY) * 0.12;
      lastY = y;

      if (hero) {
        const p = Math.min(Math.max(y / hero.offsetHeight, 0), 1);
        hero.style.setProperty('--hero-p', p.toFixed(4));
      }

      frames.forEach((frame) => {
        const r = frame.getBoundingClientRect();
        // -1 cuando el marco entra por abajo, 1 cuando sale por arriba
        const t = (vh / 2 - (r.top + r.height / 2)) / ((vh + r.height) / 2);
        frame.style.setProperty('--py', `${(t * 6).toFixed(2)}%`);
      });

      if (Math.abs(velocity) > 0.05) {
        setRate(1 + Math.max(-3, Math.min(4, velocity * 0.3)));
        requestAnimationFrame(tick);
      } else {
        velocity = 0;
        setRate(1);
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
  }

  /* ------------------------------------------------------------------------
     Cinta de categorías: corre sola hacia la izquierda a velocidad fija,
     sin reaccionar al scroll. Solo se anima en pantalla.
     ------------------------------------------------------------------------ */

  const ribbon = document.querySelector('[data-ribbon]');

  if (ribbon && !reduceMotion.matches && 'IntersectionObserver' in window) {
    const base = Array.from(ribbon.children);
    let period = 0;

    const fill = () => {
      ribbon.replaceChildren(...base);
      for (let i = 0; i < 10 && ribbon.scrollWidth < window.innerWidth * 1.5; i++) {
        base.forEach((node) => ribbon.append(node.cloneNode(true)));
      }
      const count = ribbon.children.length;
      Array.from(ribbon.children).forEach((node) => ribbon.append(node.cloneNode(true)));
      period = ribbon.children[count].offsetLeft - ribbon.children[0].offsetLeft;
    };

    let x = 0;
    let spin = 0;
    let visible = false;
    let raf = 0;

    const step = () => {
      raf = 0;
      if (!visible) return;
      const speed = 0.8;
      x -= speed;
      if (period) {
        if (x <= -period) x += period;
        if (x > 0) x -= period;
      }
      spin += speed * 1.6;
      ribbon.style.setProperty('--x', `${x.toFixed(2)}px`);
      ribbon.style.setProperty('--spin', `${(spin % 360).toFixed(1)}deg`);
      raf = requestAnimationFrame(step);
    };

    document.fonts.ready.then(fill);
    fill();
    let ribbonWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === ribbonWidth) return;
      ribbonWidth = window.innerWidth;
      fill();
    });

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(step);
    }).observe(ribbon);
  }

  /* ------------------------------------------------------------------------
     Solo con mouse y movimiento activo:
     - Hero: el texto y el video siguen al mouse en sentidos opuestos.
     - Descubre: las fotos se inclinan hacia el mouse con un brillo encima.
     - [data-magnetic]: el elemento se acerca al cursor dentro de su zona.
     ------------------------------------------------------------------------ */

  const mouse = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (mouse.matches && !reduceMotion.matches) {
    const heroFilm = document.querySelector('.hero--film');
    if (heroFilm) {
      heroFilm.addEventListener('pointermove', (e) => {
        heroFilm.style.setProperty('--hx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        heroFilm.style.setProperty('--hy', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
      heroFilm.addEventListener('pointerleave', () => {
        heroFilm.style.setProperty('--hx', '0');
        heroFilm.style.setProperty('--hy', '0');
      });
    }

    document.documentElement.classList.add('has-tilt');
    document.querySelectorAll('.discover__frame').forEach((frame) => {
      frame.addEventListener('pointermove', (e) => {
        const r = frame.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        frame.classList.add('is-tilting');
        frame.style.setProperty('--ry', `${((px - 0.5) * 7).toFixed(2)}deg`);
        frame.style.setProperty('--rx', `${((0.5 - py) * 7).toFixed(2)}deg`);
        frame.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        frame.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      });
      frame.addEventListener('pointerleave', () => {
        frame.classList.remove('is-tilting');
        frame.style.setProperty('--rx', '0deg');
        frame.style.setProperty('--ry', '0deg');
      });
    });

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const zone = el.matches('a, button') ? el : el.closest('a, button') || el;
      const clamp = (v) => Math.max(-12, Math.min(12, v));
      zone.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--tx', `${clamp((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1)}px`);
        el.style.setProperty('--ty', `${clamp((e.clientY - (r.top + r.height / 2)) * 0.35).toFixed(1)}px`);
      });
      zone.addEventListener('pointerleave', () => {
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      });
    });
  }

  /* ------------------------------------------------------------------------
     Cifras: cuentan desde 0 al entrar en pantalla. El HTML ya trae el valor
     final, así que sin JS o sin movimiento se ve el número directamente.
     ------------------------------------------------------------------------ */

  const counters = document.querySelectorAll('[data-count]');

  if (counters.length && !reduceMotion.matches && 'IntersectionObserver' in window) {
    const DURATION = 1800;
    const easeOut = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

    const digit = (el) => el.querySelector('span') || el;

    const run = (el, delay) => {
      const target = Number(el.dataset.count);
      const value = digit(el);
      let start = 0;
      const step = (now) => {
        if (!start) start = now + delay;
        const t = Math.min(Math.max((now - start) / DURATION, 0), 1);
        value.textContent = String(Math.round(easeOut(t) * target));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countIO.unobserve(entry.target);
        run(entry.target, Array.from(counters).indexOf(entry.target) * 120);
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => {
      digit(el).textContent = '0';
      countIO.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Cursor «Ver»: un círculo que sigue al mouse con un leve retraso sobre
     los elementos con data-cursor. Solo con mouse y con movimiento activo.
     ------------------------------------------------------------------------ */

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (finePointer.matches && !reduceMotion.matches && document.querySelector('[data-cursor]')) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);
    document.documentElement.classList.add('has-cursor');

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let scale = 0;
    let scaleTo = 0;
    let following = false;
    let hideTimer = 0;

    const follow = () => {
      cx += (x - cx) * 0.55;
      cy += (y - cy) * 0.55;
      scale += (scaleTo - scale) * 0.35;
      if (scale < 0.01) scale = 0;
      // Escala y posición van en el mismo transform: si la escala vive aparte,
      // al salir de la foto el círculo salta a la esquina y vuelve
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${scale})`;
      if (Math.abs(x - cx) > 0.4 || Math.abs(y - cy) > 0.4 || Math.abs(scaleTo - scale) > 0.01) {
        requestAnimationFrame(follow);
      } else following = false;
    };

    const start = () => {
      if (following) return;
      following = true;
      requestAnimationFrame(follow);
    };

    const place = (show) => {
      if (show) {
        clearTimeout(hideTimer);
        if (scaleTo === 0) {
          // Aparece donde está el mouse, sin viajar desde la posición anterior
          cx = x;
          cy = y;
        }
        scaleTo = 1;
        start();
        return;
      }
      // El hueco entre fotos es estrecho: un corte inmediato hace parpadear el círculo
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        scaleTo = 0;
        start();
      }, 50);
    };

    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      const target = e.target.closest('[data-cursor]');
      if (target) cursor.textContent = target.dataset.cursor;
      place(Boolean(target));
      start();
    });

    document.addEventListener('pointerleave', () => {
      clearTimeout(hideTimer);
      scaleTo = 0;
      start();
    });
    // Al hacer scroll con la rueda el mouse no se mueve pero la foto debajo sí
    window.addEventListener('scroll', () => {
      const under = document.elementFromPoint(x, y);
      place(Boolean(under && under.closest('[data-cursor]')));
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Categorías
     Cada tarjeta lleva data-categorias con las opciones del sitio en vivo.
     Los chips pasan a ser botones y filtran la grilla. Las categorías
     secundarias (data-extra) quedan plegadas tras «Ver todas».
     El buscador se suma al chip activo: una tarjeta se ve si cumple ambos.
     ------------------------------------------------------------------------ */

  // Minúsculas y sin tildes, para que «cafeteria» encuentre «Cafetería»
  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  // Estado de filtro por grilla: { category, query }
  const filters = new Map();

  const applyFilters = (grid) => {
    const { category = null, query = '' } = filters.get(grid.id) || {};
    let visible = 0;

    Array.from(grid.children).forEach((card) => {
      const cats = (card.dataset.categorias || '').split('|');
      const logo = card.querySelector('.card__logo img');
      // data-nombre lleva el nombre real del local; mientras no exista se usa el alt del logo
      const haystack = normalize([card.dataset.nombre || '', logo ? logo.alt : '', ...cats].join(' '));
      const show = (category === null || cats.includes(category)) && (query === '' || haystack.includes(query));
      card.hidden = !show;
      if (show) visible += 1;
    });

    const empty = document.querySelector(`[data-empty-for="${grid.id}"]`);
    if (empty) {
      empty.textContent = visible === 0
        ? 'No encontramos resultados. Prueba con otra palabra o elige «Todas».'
        : '';
    }
  };

  const setFilter = (grid, patch) => {
    filters.set(grid.id, { ...filters.get(grid.id), ...patch });
    applyFilters(grid);
  };

  document.querySelectorAll('.search input[data-target]').forEach((input) => {
    const grid = document.getElementById(input.dataset.target);
    if (!grid) return;
    input.addEventListener('input', () => setFilter(grid, { query: normalize(input.value) }));
  });

  document.querySelectorAll('.chips').forEach((list) => {
    const grid = document.getElementById(list.dataset.target);
    const cards = grid ? Array.from(grid.children) : [];
    const hasData = cards.some((card) => card.dataset.categorias);

    if (hasData) {
      list.classList.add('is-interactive');

      list.querySelectorAll('span.chip').forEach((span) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = span.className;
        btn.textContent = span.textContent;
        if (span.dataset.filter) btn.dataset.filter = span.dataset.filter;
        btn.setAttribute('aria-pressed', String(Boolean(span.dataset.filter)));
        span.replaceWith(btn);
      });

      list.addEventListener('click', (e) => {
        const chip = e.target.closest('button.chip:not(.chip--more)');
        if (!chip) return;

        list.querySelectorAll('button.chip:not(.chip--more)').forEach((c) => {
          c.setAttribute('aria-pressed', String(c === chip));
        });

        const value = chip.dataset.filter === 'todas' ? null : chip.textContent.trim();
        setFilter(grid, { category: value });
      });
    }

    const extras = list.querySelectorAll('[data-extra]');
    if (!extras.length) return;

    const total = list.dataset.total || list.querySelectorAll('.chip:not(.chip--all)').length;
    const item = document.createElement('li');
    item.className = 'chips__more';
    item.innerHTML =
      '<button type="button" class="chip chip--more" aria-expanded="false">' +
      '<span></span><i class="ph ph-plus" aria-hidden="true"></i></button>';
    list.append(item);

    const more = item.querySelector('button');
    const moreLabel = more.querySelector('span');
    const moreIcon = more.querySelector('i');

    const setOpen = (open) => {
      list.classList.toggle('is-collapsed', !open);
      more.setAttribute('aria-expanded', String(open));
      moreLabel.textContent = open ? 'Ver menos' : `Ver todas (${total})`;
      moreIcon.className = open ? 'ph ph-minus' : 'ph ph-plus';
    };

    setOpen(false);
    more.addEventListener('click', () => setOpen(more.getAttribute('aria-expanded') !== 'true'));
  });

  /* ------------------------------------------------------------------------
     Formulario: validación en el navegador. No hay backend todavía, así que
     el mensaje final no afirma que los datos se enviaron.
     ------------------------------------------------------------------------ */

  const form = document.getElementById('subscribe-form');
  if (form) {
    const toast = document.getElementById('form-toast');
    let toastTimer = 0;
    const inputs = Array.from(form.querySelectorAll('input'));
    const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const isValid = (input) => {
      const value = input.value.trim();
      if (input.required && value === '') return false;
      if (input.type === 'email' && value !== '' && !emailShape.test(value)) return false;
      return input.checkValidity();
    };

    const setFieldState = (input, valid) => {
      input.closest('.field').classList.toggle('is-invalid', !valid);
      input.setAttribute('aria-invalid', String(!valid));
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;

      inputs.forEach((input) => {
        const valid = isValid(input);
        setFieldState(input, valid);
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        showToast('Faltan campos por llenar.');
        return;
      }

      showToast('Datos completos. La suscripción en línea aún no está activa.');
    });

    const showToast = (message) => {
      toast.textContent = message;
      toast.hidden = false;
      clearTimeout(toastTimer);
      requestAnimationFrame(() => {
        toast.classList.add('is-visible');
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
      });
    };

    // Revalida al salir de un campo que ya tiene contenido o que estaba marcado
    form.addEventListener('focusout', (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement)) return;
      if (input.value.trim() === '' && !input.closest('.field').classList.contains('is-invalid')) return;
      setFieldState(input, isValid(input));
    });

    form.addEventListener('input', (e) => {
      const input = e.target;
      if (input.closest('.field').classList.contains('is-invalid') && isValid(input)) {
        setFieldState(input, true);
      }
      toast.classList.remove('is-visible');
    });

    // Email que llega desde el footer de otra página (index.html?email=…#suscripcion)
    const emailParam = new URLSearchParams(location.search).get('email');
    if (emailParam) document.getElementById('f-email').value = emailParam;
  }

  // Suscripción del footer: lleva el email al formulario completo
  const footerForm = document.getElementById('footer-subscribe');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = footerForm.querySelector('input').value.trim();
      const section = document.getElementById('suscripcion');
      // El formulario completo solo vive en el index
      if (!section) {
        location.href = `index.html${email ? `?email=${encodeURIComponent(email)}` : ''}#suscripcion`;
        return;
      }
      const target = document.getElementById('f-email');
      if (target && email) target.value = email;
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('f-nombres').focus({ preventScroll: true });
    });
  }
})();
