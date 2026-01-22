// ===== ARTISTS filter buttons =====
    const buttons = Array.from(document.querySelectorAll('.fbtn'));
    const cards = Array.from(document.querySelectorAll('.card'));

    function setPressed(active){
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === active)));
    }
    function applyFilter(filter){
      cards.forEach(c => {
        const type = c.dataset.type;
        const show = (filter === 'all') || (type === filter);
        c.style.display = show ? '' : 'none';
      });
    }
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        setPressed(filter);
        applyFilter(filter);
      });
    });

    // ===== Floating BUY TICKET: dim when overlaps content =====
    const floatTicket = document.getElementById('floatTicket');
    const overlapTargets = [
      document.getElementById('ticket'),
      document.getElementById('access'),
      document.getElementById('footer')
    ].filter(Boolean);

    let ticking = false;

    function rectsOverlap(a, b){
      return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
      );
    }

    function updateFloatDim(){
      if (!floatTicket) return;
      const ft = floatTicket.getBoundingClientRect();

      // 画面外にあるときは普通に戻す（念のため）
      if (ft.bottom < 0 || ft.top > window.innerHeight){
        floatTicket.classList.remove('dim');
        return;
      }

      // “実際に重なったら” dim
      let isOverlapping = false;
      for (const el of overlapTargets){
        const r = el.getBoundingClientRect();

        // ざっくり表示領域に入ってるターゲットだけ判定
        const visible = !(r.bottom < 0 || r.top > window.innerHeight);
        if (!visible) continue;

        if (rectsOverlap(ft, r)){
          isOverlapping = true;
          break;
        }
      }

      floatTicket.classList.toggle('dim', isOverlapping);
    }

    function onScrollOrResize(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateFloatDim();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    // 初回
    updateFloatDim();